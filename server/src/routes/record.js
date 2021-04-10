import express from 'express';
import { X509WalletMixin } from 'fabric-network';
import {getCA, getConnectedWallet, registerUser, sendTransaction} from '../utils';

const router = express.Router();
const createStudentRecord = async (req, res) => {
    const {certificate, privateKey, studentEmail, studentFullName} = req.body;
    try {
      const mixin = X509WalletMixin.createIdentity(
          'Org1MSP',
          certificate,
          privateKey
      );
      const gateway = await getConnectedWallet('Org1MSP', mixin);
      const result = await sendTransaction(gateway,{
          name: 'createStudentRecord',
          props: [studentEmail, studentFullName]
      });
      gateway.disconnect();
      res.status(201).json({data:result});
    }
    catch (e) {
        res.status(400).json({ message: e.message });
    }
};

const getStudentData = async (req, res) => {
    const {certificate, privateKey, studentEmail} = req.body;
    try {
        const mixin = X509WalletMixin.createIdentity(
            'Org1MSP',
            certificate,
            privateKey
        );
        const gateway = await getConnectedWallet('Org1MSP', mixin);
        const result = await sendTransaction(gateway,{
            name: 'getStudentData',
            props: [studentEmail]
        });
        gateway.disconnect();
        res.status(201).json({data:result});
    }
    catch (e) {
        res.status(400).json({ message: e.message });
    }
};

router.post('/', createStudentRecord);
router.get('/', getStudentData);

export default router;
