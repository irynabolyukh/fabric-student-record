import express from 'express';
import { X509WalletMixin } from 'fabric-network';
import { getCA, getConnectedWallet, sendTransaction } from '../utils';

const router = express.Router();
const createStudentRecord = async (req, res) => {
  const { certificate, privateKey } = req.body;
  try {
    const ca = getCA();
    const mixin = X509WalletMixin.createIdentity(
      'Org1',
      certificate,
      privateKey
    );
    const gateway = await getConnectedWallet('client', mixin);
    const result = await sendTransaction(gateway, {
      name: 'createStudentRecord',
      props: [],
    });
    gateway.disconnect();
    res.status(201).json(result);
  }
  catch (e) {
    res.status(400).json({ message: e.message });
  }
};
router.post('/student', createStudentRecord);

export default router;
