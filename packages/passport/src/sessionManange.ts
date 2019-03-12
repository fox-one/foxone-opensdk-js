import * as localforage from 'localforage';
import Session from './Model/session';
import User from './Model/user';

const SESSION_KEY = 'account-session';
const USER_KEY = 'account-user';

export default class SessionManager {
  constructor() {
    localforage.config({
      driver: localforage.LOCALSTORAGE,
      name: 'foxone-Account',
    });
  }

  public async getSession(): Promise<Session | null> {
    return await localforage.getItem(SESSION_KEY);
  }

  public async getUser(): Promise<User | null> {
    const user: User = await localforage.getItem(USER_KEY);
    return user;
  }

  public async deleteSession() {
     return Promise.all([localforage.removeItem(SESSION_KEY), localforage.removeItem(USER_KEY)]);
  }

  public async saveAuthSession(authSession: any) {
    const { session, user } = authSession;
    return await localforage.setItem(SESSION_KEY, session) && await localforage.setItem(USER_KEY, user);
  }

}
