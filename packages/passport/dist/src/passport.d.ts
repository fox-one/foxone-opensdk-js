export default class Passport {
    host: string;
    merchantId: string;
    constructor(props: {
        host: string;
        merchantId: string;
    });
    getCaptcha(): Promise<{
        captchaId: any;
        captchaURL: string;
    }>;
    requestRegisterSMS(registerSMS: {
        regionCode: string;
        mobile: string;
        captchaId: string;
        captchaCode: string;
    }): Promise<any>;
    requestRegisterMail(registerMail: {
        email: string;
    }): Promise<any>;
    registerMobile(register: {
        name: string;
        mobileCode: string;
        password: string;
        token: string;
    }): Promise<any>;
    register(register: {
        name: string | null;
        code: string;
        password: string;
        token: string;
    }): Promise<any>;
    requestLoginSMS(loginSMS: {
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
        regionCode: string | null;
        mobile: string | null;
        email: string | null;
        password: string;
    }): Promise<any>;
    getUserDetail(secret: {
        key: string;
        secret: string;
    }): Promise<any>;
    postRequest(signData: {
        uri: any;
        body: any;
        sign?: any;
    }): Promise<any>;
    defaulutHeader(): {
        "fox-cloud-merchant-id": string;
    };
}
