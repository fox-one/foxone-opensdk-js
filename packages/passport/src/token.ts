import { sign, decode } from './jwt';

export async function generateToken(keyAndSign: {key: string, secret: string, requestSign: string}) {
  const {key, secret, requestSign} = keyAndSign;

  if (!key) {
    throw new Error('missing key');
  }

  if (!secret) {
    throw new Error('missing secret');
  }

  if (!requestSign) {
    throw new Error('missing requestSign');
  }

  const header = {
    alg: "HS256",
    typ: "JWT"
  }

  const payload = {
    key,
    sign: keyAndSign.requestSign
  }

  return await sign(header, payload, keyAndSign.secret);
}

export function decodeToken(token: string) {
  return decode(token);
}