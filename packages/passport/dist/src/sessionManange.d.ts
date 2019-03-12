import Session from './model/session';
import User from './model/user';
export default class SessionManager {
    constructor();
    getSession(): Promise<Session | null>;
    getUser(): Promise<User | null>;
    deleteSession(): Promise<[void, void]>;
    saveAuthSession(authSession: any): Promise<any>;
}
