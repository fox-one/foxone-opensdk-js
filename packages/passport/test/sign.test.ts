import { encryptPIN, generateSignAndJWT, generateSignRequest, passwordSalt, decryptPIN, verifyPEM, generateToken } from '../dist/index';

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

test ('pin', async () => {
  const pem = `
  -----BEGIN RSA PUBLIC KEY-----
  MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAysHUv9wZvKMsqkJoYCKliX1D2HaN2NSTx/2FlqGR6BqSurdzWOPpeyJHztBbpTMldA4sTLLMY8xKrL0b98LxWn/EQgmuW8/YHdpNLoex7OdEXdQsu+J5iO7DEwfWmxuWrnCN+/7LDX/ssoRiOtaESZwYhnwkQ7sZM2ThQFxkSpX/ykBEMHvrFvEG2oJ43jim02q0CpRDlPpolRPJ4++FQPPDmpFFwrFurhHtl0h3Ct74g8NpHVxklAHm7s/WA2sDcC4YHfRKwXAefSNh29+seh06aRZAqjxz0l98Sy2JrmFGEfy7zdzq+5Ot1Ee712hbtHJbKmHv7uaBoiQo69F6awIDAQAB-----END RSA PUBLIC KEY-----
  `;

  const pripem = `
  -----BEGIN RSA PRIVATE KEY-----
  MIIEogIBAAKCAQEAysHUv9wZvKMsqkJoYCKliX1D2HaN2NSTx/2FlqGR6BqSurdzWOPpeyJHztBbpTMldA4sTLLMY8xKrL0b98LxWn/EQgmuW8/YHdpNLoex7OdEXdQsu+J5iO7DEwfWmxuWrnCN+/7LDX/ssoRiOtaESZwYhnwkQ7sZM2ThQFxkSpX/ykBEMHvrFvEG2oJ43jim02q0CpRDlPpolRPJ4++FQPPDmpFFwrFurhHtl0h3Ct74g8NpHVxklAHm7s/WA2sDcC4YHfRKwXAefSNh29+seh06aRZAqjxz0l98Sy2JrmFGEfy7zdzq+5Ot1Ee712hbtHJbKmHv7uaBoiQo69F6awIDAQABAoIBAEoaLTcxqfZXbKuNObho8TceoP0r1wu4JYqiDYDP7BN4Isg6491I7rwh+zyKyfPGjZms1GPztN+EeoZHV0Fl7e+1YnUANMk5XTML5clrrot2unXQZckFLIXvPTxnUPe/TYLTgBDpPizg5BEacQwv+oksk4oTNO3MI5m09N4g5kabhJDmWa/aSi5iAVmVLlCAe0eMCqwtrFB8CKWgW2X/pVLTvwU0QTnXUsjxSr9KwFAMAymowzn/3f9yXxSFjOAGzE5BQzf7MbjG/k3Tj2WUi09+iONKjG1pU9FGj8Aai2G/2SE+4kAPR8aUv+pwQfUPOKn1CygVeQKzTNIOOF3wawECgYEA9901/6nt7Do7Mzm2R6z40F7VEGoWvZuDXXFYI9UdWxYAKZpOOxJ038kXakOM2T/HhAj35roGG7K2sY/leqSKb6lb01xp9KGq8Jndtgddfle4yR87LxNp/OREJA3TzyROWLz/HU+6xdZXDJZBj9JXeqGtlTg6yKJH/e8KB9vQB5kCgYEA0WmWuUIb01VP6InQCnvSb+92JlxW9KMEMveEOxwKpcfXMcLVss9wlLS15inyr3Z7Si4OPGp8gVH8DBWA1GKZpdl8v5zKXGiyonbVLVtkaklG8H/blbGb5lB/M+ohWBP1Oe6kULHuwj1i3cm8gXehEFg5ASVHHtUfoZGjKq4YRKMCgYBh3Enclifks5z5/Zg1NlrKUhbHM0ulMsgr1XtaMmMzujz4L/8hHYldbZS8FM2AXMkWHUBbLSkKOIYfFtQgluQ9b91cVslSl53Y/rbljoTgRBwl9Bm23XBkM2+f2IG+7/Oq33vOA9OXFqgpxQ0/jmmRdlIFbzzuR/wqiv0n2yaISQKBgARqe5kwgbG1LNg0f8SY09k0bYNlkxfZkC8a9RjiAH96dVlBSIxav38DSIqv+8QjdXoc+oPfovx/JBeFJJBV+/N5YJ4Rylqkgo/WfaxVLwrmvK45pAHGGwmCTQxlNYrL8PHlzGU/O0+xR7JxnJ4GTckwcxNJG/TUfbREg/JUdYKNAoGAeCxO4kf7y9i+0ll1wPyfIFctJrwicXoH43L4CsDr4Ed0RI6V7qeY3k2zZY/OLgVkjF4fQeEVXrVvMA/dRlmjhciKS8ahUZTrPStegv73y573JN46D1fvF7rrt7Uu4QvQd5iGP5w/DIERB4sfANycTqJiyaQhNpla38Nd4AuSC4E=-----END RSA PRIVATE KEY-----
`

  const encrtypPIN =  await encryptPIN('123456', pem);
  console.log(encrtypPIN);
  const message = await decryptPIN(encrtypPIN, pripem);
  console.log(message);
  
});