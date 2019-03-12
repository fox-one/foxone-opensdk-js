import ChangePassword from './Model/changePassword';
import KYCProfile from './Model/kycProfile';
import RequestResetPassword from './Model/requestResetPassword';
import ResetPassword from './Model/resetPassword';
import Session from './Model/session';
import User from './Model/user';
export default class Account {
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
    severLogout(): Promise<any>;
    requestResetPassword(requestResetPassword: RequestResetPassword): Promise<any>;
    resetPassword(resetPassword: ResetPassword): Promise<any>;
    changePassword(changePassword: ChangePassword): Promise<any>;
    sendRequest(request: {
        method: string;
        url: string;
        body?: any;
    }): Promise<any>;
    isLogin(): Promise<boolean>;
    logout(): Promise<void>;
    getSession(): Promise<Session | null>;
    getUser(): Promise<User | null>;
    private defaulutHeader;
    private postRequest;
}
