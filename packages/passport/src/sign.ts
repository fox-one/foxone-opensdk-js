import * as CryptoJS from 'crypto-js';
import { v4 as uuid } from 'uuid';
import { generateToken, generateTokenWithPIN } from './token';

export function generateSignRequest(request: { method: string, url: string, body?: any }) {
  const ts = getTimestamp();
  const nonce = uuid();
  let { url: uri } = request;
  const { body } = request;

  if (uri.indexOf('?') > 0) {
    uri = `${uri}&_ts=${ts}&_nonce=${nonce}`;
  } else {
    uri = `${uri}?_ts=${ts}&_nonce=${nonce}`;
  }

  let message = `${request.method.toUpperCase()}${uri}`;
  if (body) {
    message += JSON.stringify(body);
  }

  const digiest = CryptoJS.SHA256(message);
  const sign = CryptoJS.enc.Base64.stringify(digiest);
  return { uri, body, sign };
}

export async function generateSignAndJWT(request: { method: string, url: string, body?: any, key: string, secret: string }) {
  const { method, url, body, key, secret } = request;
  const signData = generateSignRequest({ method, url, body });
  const { sign, uri } = signData;

  const keyAndSign = {
    key,
    requestSign: sign,
    secret,
  };

  const token = await generateToken(keyAndSign);
  return { uri, body, headers: { Authorization: `Bearer ${token}` } };
}

export function passwordSalt(password: string) {
  const digest = CryptoJS.MD5(`fox.${password}`).toString();
  return digest;
}

function getTimestamp(date = new Date()) {
  return Math.round(date.getTime() / 1000);
}

export async function generatePINRequest(request: { method: string, url: string, body?: any, key: string, secret: string, pin: string }) {
  const { method, url, body, key, secret, pin } = request;
  const signData = generateSignRequest({ method, url, body });
  const { sign, uri } = signData;

  const keyAndSign = {
    key,
    pin,
    requestSign: sign,
    secret,
  };

  const token = await generateTokenWithPIN(keyAndSign);
  return { uri, body, headers: { Authorization: `Bearer ${token}` } };
}
