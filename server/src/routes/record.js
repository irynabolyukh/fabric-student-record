import express from 'express';
import { getCA, getConnectedWallet, sendTransaction } from '../utils';
import { X509WalletMixin } from 'fabric-network';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const test = async (req, res) => {
  // const { certificate, privateKey } = req.body;
  const certificate = fs.readFileSync(path.resolve(__dirname, '../gateway/cert.pem'), 'utf8');
  const privateKey = fs.readFileSync(path.resolve(__dirname, '../gateway/privateKey.pem'), 'utf8');
  console.log(certificate)
  console.log(privateKey)
  // const certificate = "-----BEGIN CERTIFICATE-----MIICKTCCAc+gAwIBAgIQTn6S2qGdc2v5QZDPCNk15TAKBggqhkjOPQQDAjBzMQswCQYDVQQGEwJVUzETMBEGA1UECBMKQ2FsaWZvcm5pYTEWMBQGA1UEBxMNU2FuIEZyYW5jaXNjbzEZMBcGA1UEChMQb3JnMS5leGFtcGxlLmNvbTEcMBoGA1UEAxMTY2Eub3JnMS5leGFtcGxlLmNvbTAeFw0yMTA0MDkyMDA5MDBaFw0zMTA0MDcyMDA5MDBaMGsxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpDYWxpZm9ybmlhMRYwFAYDVQQHEw1TYW4gRnJhbmNpc2NvMQ4wDAYDVQQLEwVhZG1pbjEfMB0GA1UEAwwWQWRtaW5Ab3JnMS5leGFtcGxlLmNvbTBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABNnvug5vljzY4Lv++56mFILT/hIv5COA0fXGs/1Le7ZWhe0+LlOYCkyx74LosjJew55NU9t5pXqVWageufPXX2WjTTBLMA4GA1UdDwEB/wQEAwIHgDAMBgNVHRMBAf8EAjAAMCsGA1UdIwQkMCKAIMKW3AF+//QqKgHzNVIsNq4foUA5U7mjJ1WurlyRJcIpMAoGCCqGSM49BAMCA0gAMEUCIQD1Q+W54OgV2zwviCLx410c1Zt50oo7q+YdQb4FWEiDDgIgadx2hPJufDDeMoSbqFO8UrGey5q/veDBMJpDhc1NJOw=-----END CERTIFICATE-----";
  // const privateKey = "-----BEGIN PRIVATE KEY-----MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQg5HdKWVWU/uzNgK0PBJ41XmeqmIIxOZ6LWBxaUiTbIJShRANCAATZ77oOb5Y82OC7/vuephSC0/4SL+QjgNH1xrP9S3u2VoXtPi5TmApMse+C6LIyXsOeTVPbeaV6lVmoHrnz119l-----END PRIVATE KEY-----";
  try {
  //   const ca = getCA();
  //   const adminData = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'password' });
  //   const mixin = X509WalletMixin.createIdentity(
  //     'Org1MSP',
  //     adminData.certificate,
  //     adminData.key.toBytes()
  //   );
    const mixin = X509WalletMixin.createIdentity(
      'Org1MSP',
      certificate,
      privateKey
    );
    const gateway = await getConnectedWallet('Org1MSP', mixin);
    const result = await sendTransaction(gateway, {
      name: 'test',
      props: ["20"],
    })
    console.log(result)
    gateway.disconnect();
  }
  catch (e) {
    res.status(400).json({ message: e.message });
  }
};
router.get('/test', test);

export default router;
