import { Gateway, InMemoryWallet } from 'fabric-network';
import FabricCAService from 'fabric-ca-client';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export const getCA = () =>{
  try {
    return new FabricCAService(`http://192.168.88.88:7054`)
  }catch (e){
    console.error(e)
    throw new Error(e.message)
  }
}
export const getConnectedWallet = async (label, mixin) => {
  const wallet = new InMemoryWallet();
  await wallet.import(label, mixin);
  const gateway = new Gateway();
  const connectionProfile = yaml.safeLoad(
    fs.readFileSync(path.resolve(__dirname, '../gateway/networkConnection.yaml'), 'utf8'),
  );
  const connectionOptions = {
    identity: label,
    wallet,
    discovery: { enabled: false, asLocalhost: true },
  };
  await gateway.connect(connectionProfile, connectionOptions);
  return gateway;
}
export const registerUser = async (ca, adminWallet, userData) => {
  try {
    await ca.register({
      enrollmentID: userData.login,
      enrollmentSecret: userData.password,
      role: 'peer',
      affiliation: `org1.${userData.affiliation}`,
      maxEnrollments: -1,
    }, adminWallet);
  }
  catch (e) {
    console.error(e.message)
    throw new Error(e.message);
  }
}
