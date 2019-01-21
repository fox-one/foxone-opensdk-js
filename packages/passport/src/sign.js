import uuidV4 from 'uuid/v4';
import CryptoJS from 'crypto-js';

export function generateSignRequest(method, url, body = null) {
  let ts = getTimestamp();
  let nonce = uuidV4();
  let uri = url;
  let newBody = body;

  if (method === 'get' || method === 'delete') {   
    if (uri.indexOf('?') > 0) {
      uri = `${uri}_ts=${ts}&_nonce=${nonce}`
    } else {
      uri =`${uri}?_ts=${ts}&_nonce=${nonce}`
    }
  } else {
    newBody = {
      _ts: ts,
      _nonce: nonce,
      ...body
    }
  }

  let message = `${method.toUpperCase()}${uri}`
  if (newBody) {
    message += JSON.stringify(newBody)
  }

  let digiest = CryptoJS.SHA256(message);
  let sign = CryptoJS.enc.Base64.stringify(digiest);
  return { uri, newBody, sign }
}

function getTimestamp(date = new Date()) {
  return Math.round(date.getTime() / 1000)
}
