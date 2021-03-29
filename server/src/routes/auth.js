import express from 'express';
import FabricCAService from 'fabric-ca-client';
import { Gateway, InMemoryWallet, X509WalletMixin } from 'fabric-network';
import yaml from 'js-yaml';
import path from 'path';
import * as fs from 'fs';


const router = express.Router();
const studentRegistration = async (req, res) => {
  const { login, password } = req.body;
  const ca = new FabricCAService(`http://0.0.0.0:7054`);
  const adminData = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'password' });
  const identity = {
    label: 'client',
    certificate: adminData.certificate,
    privateKey: adminData.key.toBytes(),
    mspId: 'NAUKMA',
  };
  const wallet = new InMemoryWallet();
  const mixin = X509WalletMixin.createIdentity(identity.mspId,
    identity.certificate,
    identity.privateKey);
  await wallet.import(identity.label, mixin);
  const gateway = new Gateway();
  const connectionProfile = yaml.safeLoad(
    fs.readFileSync(path.resolve(__dirname, '../gateway/networkConnection.yaml'), 'utf8'),
  );
  const connectionOptions = {
    identity: identity.label,
    wallet,
    discovery: { enabled: false, asLocalhost: true },
  };
  await gateway.connect(connectionProfile, connectionOptions);
  const admin = await gateway.getCurrentIdentity();
  const secret = await ca.register({
    enrollmentID: login,
    enrollmentSecret: password,
    role: 'peer',
    affiliation: 'naukma.student',
    maxEnrollments: -1,
  }, admin);
  const userData = await ca.enroll({
    enrollmentID: login,
    enrollmentSecret: secret,
  });
  gateway.disconnect();
  res.status(201).json({
    login,
    certificate: userData.certificate,
    privateKey: userData.key.toBytes(),
  });
};
router.post('/student', studentRegistration);

export default router;
