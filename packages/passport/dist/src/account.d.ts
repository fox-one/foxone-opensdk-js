import ChangePassword from './interface/changePassword';
import KYCProfile from './interface/kycProfile';
import RequestResetPassword from './interface/requestResetPassword';
import ResetPassword from './interface/resetPassword';
import Session from './interface/session';
import User from './interface/user';
export declare const TFARequireCode = 1110;
export declare class Account {
    static getInstance(): Account;
    private static instance;
    private host;
    private merchantId;
    private sessionManager;
    config(config: {
        host: string;
        merchantId: string;
    }): void;
    getCaptcha(): Promise<{
        captchaId: any;
        captchaURL: string;
    }>;
    requestRegister(request: {
        regionCode: string;
        mobile: string;
        captchaId: string;
        captchaCode: string;
        email: string;
    }): Promise<any>;
    register(register: {
        name?: string;
        code: string;
        password: string;
        token: string;
    }): Promise<any>;
    requestLoginSMS(request: {
        regionCode: string;
        mobile: string;
        captchaId: string;
        captchaCode: string;
    }): Promise<any>;
    mobileLogin(login: {
        token: string;
        mobileCode: string;
    }): Promise<any>;
    login(login: {
        regionCode?: string;
        mobile?: string;
        email?: string;
        password: string;
    }): Promise<any>;
    loginWithTFA(login: {
        tfaToken: string;
        code: string;
    }): Promise<any>;
    getUserDetail(): Promise<any>;
    getKYCProfile(): Promise<any>;
    updateKYCProfile(profile: KYCProfile): Promise<any>;
    createKYCProfile(profile: KYCProfile): Promise<any>;
    requestEnableTFA(): Promise<any>;
    turnOnTFA(valiadte: {
        code: string;
    }): Promise<any>;
    turnOffTFA(valiadte: {
        code: string;
    }): Promise<any>;
    logout(): Promise<any>;
    changePassword(changePassword: ChangePassword): Promise<any>;
    requestResetPassword(requestResetPassword: RequestResetPassword): Promise<any>;
    resetPassword(resetPassword: ResetPassword): Promise<any>;
    sendRequest(request: {
        method: string;
        url: string;
        body?: any;
    }): Promise<any>;
    isLogin(): boolean;
    removeSession(): void;
    getSession(): Promise<Session | null>;
    getSyncSession(): Session | null;
    getSyncUser(): User | null;
    getUser(): Promise<User | null>;
    private defaulutHeader;
    private postRequest;
}
