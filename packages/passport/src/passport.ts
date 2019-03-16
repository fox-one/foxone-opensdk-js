import DeviceManager from './device';
import http from './http';
import { generateSignAndJWT, generateSignRequest, passwordSalt } from './sign';
import TFAError from './tfaError';

export default class Passport {
  private host: string;
  private merchantId: string;
  constructor(props: { host: string, merchantId: string }) {
    this.host = props.host;
    this.merchantId = props.merchantId;
  }

  public async getCaptcha() {
    const url = '/api/captcha';
    const method = 'post';
    const signData = generateSignRequest({ method, url });
    const uri = `${this.host}${signData.uri}`;
    const res = await http.post(uri);
    const data = {
      captchaId: res.captcha_id,
      captchaURL: `${this.host}/api/captcha/${res.captcha_id}.png`,
    };
    return data;
  }

  public async requestRegister(request: { regionCode: string, mobile: string, captchaId: string, captchaCode: string, email: string }) {
    const url = '/api/account/request_register';
    const method = 'post';
    const body = {
      captcha: request.captchaCode,
      captcha_id: request.captchaId,
      email: request.email,
      phone_code: request.regionCode,
      phone_number: request.mobile,
    };

    return await this.postRequest(generateSignRequest({ method, url, body }));
  }

  public async register(register: { name?: string, code: string, password: string, token: string }) {
    const url = '/api/account/register';
    const method = 'post';
    const body = {
      code: register.code,
      name: register.name,
      password: passwordSalt(register.password),
      token: register.token,
    };

    return await this.postRequest(generateSignRequest({ method, url, body }));
  }

  public async requestLoginSMS(request: { regionCode: string, mobile: string, captchaId: string, captchaCode: string }) {
    const url = '/api/account/request_login_phone';
    const method = 'post';
    const body = {
      captcha: request.captchaCode,
      captcha_id: request.captchaId,
      phone_code: request.regionCode,
      phone_number: request.mobile,
    };

    return await this.postRequest(generateSignRequest({ method, url, body }));
  }

  public async mobileLogin(login: { token: string, mobileCode: string }) {
    const url = '/api/account/login_phone';
    const method = 'post';
    const body = {
      code: login.mobileCode,
      token: login.token,
    };

    return await this.postRequest(generateSignRequest({ method, url, body }));
  }

  public async login(login: { regionCode?: string, mobile?: string, email?: string, password: string }) {
    const url = '/api/account/login';
    const method = 'post';
    let body: {};
    const saltPassword = passwordSalt(login.password);
    if (login.email) {
      body = {
        email: login.email,
        password: saltPassword,
      };
    } else {
      body = {
        password: saltPassword,
        phone_code: login.regionCode,
        phone_number: login.mobile,
      };
    }

    return await this.postRequest(generateSignRequest({ method, url, body }));
  }

  public async loginWithTFA(login: { tfaToken: string, code: string }) {
    const url = '/api/account/login_tfa';
    const method = 'post';
    const body = {
      code: login.code,
      tfa_token: login.tfaToken,
    };

    return await this.postRequest(generateSignRequest({ method, url, body }));
  }

  public async getUserDetail(secretInfo: { key: string, secret: string }) {
    const url = '/api/account/detail';
    const method = 'get';
    const { key, secret } = secretInfo;

    const signData = await generateSignAndJWT({ method, url, key, secret });

    const uri = `${this.host}${signData.uri}`;
    const { headers } = signData;

    return await http.get(uri, { headers, ...this.defaulutHeader() });
  }

  public async postRequest(signData: { uri: any, body: any, sign?: any }) {
    const uri = `${this.host}${signData.uri}`;
    const device = DeviceManager.getInstance();
    const deviceInfo = await device.getDeviceinfo();
    const headers = { 'device-info': deviceInfo, ...this.defaulutHeader() };

    try {
      return await http.post(uri, signData.body, { headers });
    } catch (error) {
      const data = error.response.data;
      const { code } = data;
      if (code === 1110) {
        const { data: { tfa_token }, msg } = data;
        const tfaError = new TFAError(code, msg, tfa_token);
        throw tfaError;
      } else {
        throw error;
      }
    }
  }

  private defaulutHeader() {
    if (this.merchantId) {
      return {
        'fox-merchant-id': this.merchantId,
      };
    } else {
      return {};
    }
  }
}
