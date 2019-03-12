import { generateSignAndJWT, generateSignRequest, passwordSalt } from '../dist/index';

const SECRET = 'e2ca739487c919e50100dc7b944a2704';
const KEY = '324a763307b54e41c6689f594816974dVE8';

test('generateSignRequest', async () => {
  const signData = generateSignRequest({ method: 'get', url: '/api/test' });
  const { uri, sign } = signData;

  expect(uri.length).toBeGreaterThan(0);
  expect(sign.length).toBeGreaterThan(0);
});

test('generateSignAndJWT', async () => {
  const signJWT = await generateSignAndJWT({ method: 'get', url: '/api/test', key: KEY, secret: SECRET });
  const { uri, headers } = signJWT;

  expect(uri.length).toBeGreaterThan(0);
  expect(headers).toHaveProperty('Authorization');
});

test('salt password', () => {
  const password = '123456a';
  const saltPassword = passwordSalt(password);
  expect(saltPassword).toEqual('48cee7c93df60862b8b98875124d3df3');
});
