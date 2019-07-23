import * as forge from 'node-forge';
import { v4 as uuid } from 'uuid';

export async function encryptPIN(pin: string, pem: string) {
  const pubkicKey = forge.pki.publicKeyFromPem(pem) as forge.pki.rsa.PublicKey;
  const ts = getTimestamp();
  const nonce = uuid();
  const payload = {
    n: nonce,
    p: pin,
    t: ts,
  };

  const data = forge.util.createBuffer(JSON.stringify(payload));
  const cipher = pubkicKey.encrypt(data.bytes(), 'RSA-OAEP');


  return forge.util.encode64(cipher);
}

export async function decryptPIN(pin: string, pem: string) {
  const cipher: forge.Bytes = forge.util.decode64(pin);
  const privateKey = forge.pki.privateKeyFromPem(pem) as forge.pki.rsa.PrivateKey;

  return privateKey.decrypt(forge.util.createBuffer(cipher).bytes(), 'RSA-OAEP');
}

export async function verifyPEM(pin: string, pem: string, privatePem: string) {
  const pubkicKey = forge.pki.publicKeyFromPem(pem) as forge.pki.rsa.PublicKey;
  const ts = getTimestamp();
  const nonce = uuid();
  const payload = {
    n: nonce,
    p: pin,
    t: ts,
  };

  const data = forge.util.createBuffer(JSON.stringify(payload));
  const cipher = pubkicKey.encrypt(data.bytes(), 'RSA-OAEP');
  console.log(cipher);

  const privateKey = forge.pki.privateKeyFromPem(privatePem) as forge.pki.rsa.PrivateKey;
 
  const label = privateKey.decrypt(cipher, 'RSA-OAEP');
  console.log(label);

  return label
}

function getTimestamp(date = new Date()) {
  return Math.round(date.getTime() / 1000);
}
