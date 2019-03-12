import Session from './Model/session';
import KYCProfile from './Model/kycProfile';
export default class Account {
    static getInstance(): Account;
    private static instance;
    private host;
    private merchantId;
    constructor();
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
    getSession(): Promise<Session>;
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
    sendRequest(request: {
        method: string;
        url: string;
        body?: any;
    }): Promise<any>;
    private defaulutHeader;
    private saveSession;
    private postRequest;
}
