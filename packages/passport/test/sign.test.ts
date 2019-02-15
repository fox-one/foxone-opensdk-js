import { generateSignRequest, generateSignAndJWT, generateToken, passwordSalt, Passport } from '../dist/index';

test('sign', async () => {
  let signData = generateSignRequest({ method: 'get', url: '/api/test' });
  console.log(signData);
  // expect
  let token = await generateToken({ key: "-charlie", secret: "75fdb37fa6d6baf4ec5d16c9f566b202", requestSign: "vSR85LYVs9u1rgYyyd3ftxGU5q3v7lDkS8LixgI9qEQ=" });
  // let signJWT = generateSignAndJWT({method: 'get',url: '/api/test',key:'72afa5be9d89b91e289e3c6a1840ccba-bc95b6e29f6848008e8ee84b68ff6a68',secret:'035d6ed618b0f72933e8ead7f08b9974'})
  console.log(token);
  expect(token)
});

test('salt password', () => {
  let password = '123456a';
  let saltPassword = passwordSalt(password);
  console.log(saltPassword);
  expect(saltPassword).toEqual('48cee7c93df60862b8b98875124d3df3');
});

test('login', async () => {
  const passport = new Passport({
    host: 'https://dev-gateway.fox.one',
    merchantId: '5c8a9491dca25af694004d5e1711b217',
  });
  
  let loginValue = {
    password: '111111',
  }

  let session = await passport.login(loginValue);
  console.log(session);

});