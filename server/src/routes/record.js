import express from 'express';
import { getConnectedWallet, sendTransaction } from '../utils';
import { X509WalletMixin } from 'fabric-network';

const router = express.Router();
const createStudentRecord = async (req, res) => {
  const { certificate, privateKey, studentEmail, studentFullName } = req.body;
  try {
    const mixin = X509WalletMixin.createIdentity(
      'Org1MSP',
      certificate,
      privateKey
    );
    const gateway = await getConnectedWallet('Org1MSP', mixin);
    const result = await sendTransaction(gateway, {
      name: 'createStudentRecord',
      props: [studentEmail, studentFullName],
    })
    res.status(200).json({ data: result });
    gateway.disconnect();
  }
  catch (e) {
    res.status(400).json({ message: e.message });
  }
};
router.post('/', createStudentRecord);

export default router;
