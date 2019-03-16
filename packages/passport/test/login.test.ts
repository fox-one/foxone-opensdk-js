import { Account } from '../dist/index';

const account = Account.getInstance();
account.config({
  host: 'https://dev-gateway.fox.one',
  merchantId: '5c8a9491dca25af694004d5e1711b217',
});

test('loginPassword', async () => {
  try {
    const user = await account.login({ mobile: '13388888880', password: 'test123' });
    expect(user).toHaveProperty('user');
    expect(user).toHaveProperty('session');
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.debug(error);
  }
});

test('loginEmail', async () => {
  try {
    const user = await account.login({ email: 'test@fox.one', password: 'test123' });
    expect(user).toHaveProperty('user');
    expect(user).toHaveProperty('session');
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.debug(error);
  }
});

// test('loginMobile', async () => {
//   try {

//     const user = await account.requestLoginSMS({ mobile: '13388888880', captchaId: '0000000', captchaCode: '0000000' });
//     console.log(user);
//     // expect(user).toHaveProperty('user');
//     // expect(user).toHaveProperty('session');
//   } catch (error) {
//     // tslint:disable-next-line:no-console
//     console.debug(error);
//   }
// });

test('userdetail', async () => {
  const user = await account.getUserDetail();
  expect(user).toHaveProperty('user');
});

test('getKYCProfile', async () => {
  const profile = await account.getKYCProfile();
});

test('requestEnableTFA', async () => {
  const tfaSetting = await account.requestEnableTFA();
  const { qrcode, secret } = tfaSetting;
  expect(qrcode.length).toBeGreaterThan(0);
  expect(secret.length).toBeGreaterThan(0);
});

test('logout', async () => {
  expect(account.isLogin()).toEqual(true);
  await account.logout();
  account.removeSession();
  expect(account.isLogin()).toEqual(false);
});
