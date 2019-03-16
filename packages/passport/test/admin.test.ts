import { Admin } from '../dist/index';

test('loginAccount', async () => {
  const admin = new Admin({
    host: 'https://dev-gateway.fox.one',
  });

  try {
    const session = await admin.login({ username: 'passporttest', password: 'test123' });
    expect(session).toHaveProperty('admin');
    expect(session).toHaveProperty('session');

  } catch (e) {
    // tslint:disable-next-line:no-console
    console.debug(e);
  }
});
