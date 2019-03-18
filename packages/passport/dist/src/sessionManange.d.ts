import Session from './interface/session';
import User from './interface/user';
export default class SessionManager {
    constructor();
    getSession(): Promise<Session | null>;
    getSyncSession(): Session | null;
    getSyncUser(): User | null;
    getUser(): Promise<User | null>;
    deleteSession(): void;
    saveAuthSession(authSession: any): Promise<any>;
}
