import Session from './Model/session';
import User from './Model/user';
export default class SessionManager {
    constructor();
    getSession(): Promise<Session | null>;
    getUser(): Promise<User | null>;
    deleteSession(): Promise<[void, void]>;
    saveAuthSession(authSession: any): Promise<any>;
}
