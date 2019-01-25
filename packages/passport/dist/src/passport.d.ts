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
        name: string | null;
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
    } | {
        "fox-cloud-merchant-id"?: undefined;
    };
}
