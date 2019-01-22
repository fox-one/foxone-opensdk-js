import { sign, decode } from './jwt';

export async function generateToken(keyAndSign: {key: string, secret: string, requestSign: string}): Promise<string> {
  const header = {
    alg: "HS256",
    typ: "JWT"
  }

  const payload = {
    key: keyAndSign.key,
    sign: keyAndSign.requestSign
  }

  return await sign(header, payload, keyAndSign.secret);
}

export function decodeToken(token: string) {
  return decode(token);
}