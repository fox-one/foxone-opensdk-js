import * as localforage from 'localforage';
import Session from './model/session';
import User from './model/user';

const SESSION_KEY = 'account-session';
const USER_KEY = 'account-user';
const PASSPORT_KEY = 'foxone-passport'

export default class SessionManager {
  constructor() {
    localforage.config({
      driver: localforage.LOCALSTORAGE,
      name: PASSPORT_KEY,
    });
  }

  public async getSession(): Promise<Session | null> {
    return await localforage.getItem(SESSION_KEY);
  }

  public getSyncSession(): Session | null {
    let value = localStorage.getItem(`${PASSPORT_KEY}/${SESSION_KEY}`);
    if (value) {
      return JSON.parse(value)
    } else {
      return null;
    }
  }

  public getSyncUser(): User | null {
    let value = localStorage.getItem(`${PASSPORT_KEY}/${USER_KEY}`);
    if (value) {
      return JSON.parse(value)
    } else {
      return null;
    }
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
