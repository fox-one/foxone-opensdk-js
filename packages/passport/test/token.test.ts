import { decodeToken, generateToken } from '../dist/index';

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
