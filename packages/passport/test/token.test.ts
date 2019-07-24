import { decodeToken, generateToken, generateTokenWithPIN, encryptPIN } from '../dist/index';

const SECRET = 'e2ca739487c919e50100dc7b944a2704';
const KEY = '324a763307b54e41c6689f594816974dVE8';
const SIGN = '42DM2mNyGdRSGISiisqUIZEd529nxwdERHBjdrdMy+M=';
// tslint:disable-next-line:max-line-length
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiIzMjRhNzYzMzA3YjU0ZTQxYzY2ODlmNTk0ODE2OTc0ZFZFOCIsInNpZ24iOiI0MkRNMm1OeUdkUlNHSVNpaXNxVUlaRWQ1MjlueHdkRVJIQmpkcmRNeStNPSJ9.MlDcHanR1JOU8zWfH70LvfYHAxIacXai4uUd41Npdag'

test('generateToken', async () => {
  const token = await generateToken({ key: KEY, secret: SECRET, requestSign: SIGN });
  expect(token).toEqual(TOKEN);
});

test('decodeToken', async () => {

  const jwt = await decodeToken(TOKEN);
  const { payload } = jwt;
  const { key, sign } = payload;

  expect(sign).toEqual(SIGN);
  expect(key).toEqual(KEY);
});

test('generateTokenWithPin', async () => {
  const pem = `
  -----BEGIN RSA PUBLIC KEY-----
  MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAysHUv9wZvKMsqkJoYCKliX1D2HaN2NSTx/2FlqGR6BqSurdzWOPpeyJHztBbpTMldA4sTLLMY8xKrL0b98LxWn/EQgmuW8/YHdpNLoex7OdEXdQsu+J5iO7DEwfWmxuWrnCN+/7LDX/ssoRiOtaESZwYhnwkQ7sZM2ThQFxkSpX/ykBEMHvrFvEG2oJ43jim02q0CpRDlPpolRPJ4++FQPPDmpFFwrFurhHtl0h3Ct74g8NpHVxklAHm7s/WA2sDcC4YHfRKwXAefSNh29+seh06aRZAqjxz0l98Sy2JrmFGEfy7zdzq+5Ot1Ee712hbtHJbKmHv7uaBoiQo69F6awIDAQAB-----END RSA PUBLIC KEY-----
  `;

  const encrtypPIN =  await encryptPIN('123456', pem);

  const token = await generateTokenWithPIN({ key: KEY, secret: SECRET, requestSign: SIGN, pin: encrtypPIN });
  // expect(token).toEqual(TOKEN);
});
