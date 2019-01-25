import { generateSignRequest, generateSignAndJWT, generateToken } from '../dist/index';

test('sign', async () => {
  let signData = generateSignRequest({ method: 'get', url: '/api/test' });
  console.log(signData);
  // expect
  let token = await generateToken({ key: "-charlie", secret: "75fdb37fa6d6baf4ec5d16c9f566b202", requestSign: "vSR85LYVs9u1rgYyyd3ftxGU5q3v7lDkS8LixgI9qEQ=" });
  // let signJWT = generateSignAndJWT({method: 'get',url: '/api/test',key:'72afa5be9d89b91e289e3c6a1840ccba-bc95b6e29f6848008e8ee84b68ff6a68',secret:'035d6ed618b0f72933e8ead7f08b9974'})
  console.log(token);
  expect(token)
});