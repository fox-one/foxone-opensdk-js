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
        "fox-merchant-id": string;
    } | {
        "fox-merchant-id"?: undefined;
    };
}
