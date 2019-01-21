import { sign, decode } from './jwt';

export async function generateToken(key, secret, requestSign) {
  const header = {
    alg: "HS256",
    typ: "JWT"
  }

  let payload = {
    key: key,
    sign: requestSign
  }
  
  return await sign(header, payload, secret);
}

export function decodeToken(token) {
  return decode(token);
}