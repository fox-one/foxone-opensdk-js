import { v4 as uuid } from 'uuid';
import * as CryptoJS from 'crypto-js';
import { generateToken } from './token';

export function generateSignRequest(request: { method: string, url: string, body?: any }) {
  let ts = getTimestamp();
  let nonce = uuid();
  let uri = request.url;
  let body = request.body;

  if (uri.indexOf('?') > 0) {
    uri = `${uri}_ts=${ts}&_nonce=${nonce}`
  } else {
    uri = `${uri}?_ts=${ts}&_nonce=${nonce}`
  }

  let message = `${request.method.toUpperCase()}${uri}`
  if (body) {
    message += JSON.stringify(body)
  }

  let digiest = CryptoJS.SHA256(message);
  let sign = CryptoJS.enc.Base64.stringify(digiest);
  return { uri, body, sign }
}

export async function generateSignAndJWT(request: { method: string, url: string, body?: any, key: string, secret: string }) {
  let { method, url, body, key, secret } = request;

  const signData = generateSignRequest({ method, url, body });
  const { sign, uri } = signData;

  const keyAndSign = {
    key,
    secret,
    requestSign: sign
  }

  let token = await generateToken(keyAndSign);
  return { uri, body, headers: { "Authorization": `Bearer ${token}` } }
}

function getTimestamp(date = new Date()) {
  return Math.round(date.getTime() / 1000)
}
