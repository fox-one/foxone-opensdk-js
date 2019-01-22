import { v4 as uuid } from 'uuid';
import * as CryptoJS from 'crypto-js';

export function generateSignRequest({ method, url, body = null }) {
  let ts = getTimestamp();
  let nonce = uuid();
  let uri = url;

  if (uri.indexOf('?') > 0) {
    uri = `${uri}_ts=${ts}&_nonce=${nonce}`
  } else {
    uri = `${uri}?_ts=${ts}&_nonce=${nonce}`
  }

  let message = `${method.toUpperCase()}${uri}`
  if (body) {
    message += JSON.stringify(body)
  }

  let digiest = CryptoJS.SHA256(message);
  let sign = CryptoJS.enc.Base64.stringify(digiest);
  return { uri, body, sign }
}

function getTimestamp(date = new Date()) {
  return Math.round(date.getTime() / 1000)
}
