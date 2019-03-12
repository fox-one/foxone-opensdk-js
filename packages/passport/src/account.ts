
import DeviceManager from './device';
import http from './http';
import ChangePassword from './Model/changePassword';
import KYCProfile from './Model/kycProfile';
import RequestResetPassword from './Model/requestResetPassword';
import ResetPassword from './Model/resetPassword';

import Session from './Model/session';
import User from './Model/user';
import SessionManager from './sessionManange';
import { generateSignAndJWT, generateSignRequest, passwordSalt } from './sign';
import TFAError from './tfaError';

export default class Account {
  public static getInstance(): Account {
    Account.instance = Account.instance || new Account();
    return Account.instance;
  }
  private static instance: Account;

  private host: string = '';
  private merchantId: string = '';
  private sessionManager: SessionManager = new SessionManager();

  // constructor() {

  // }

  public config(config: { host: string, merchantId: string }) {
    this.host = config.host;
    this.merchantId = config.merchantId;
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

    const session = await this.postRequest(generateSignRequest({ method, url, body }));

    await this.sessionManager.saveAuthSession(session);

    return session;
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

    const session = await this.postRequest(generateSignRequest({ method, url, body }));
    await this.sessionManager.saveAuthSession(session);
    return session;
  }

  public async mobileLogin(login: { token: string, mobileCode: string }) {
    const url = '/api/account/login_phone';
    const method = 'post';
    const body = {
      code: login.mobileCode,
      token: login.token,
    };

    const session = await this.postRequest(generateSignRequest({ method, url, body }));

    await this.sessionManager.saveAuthSession(session);
    return session;
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

    const session = await this.postRequest(generateSignRequest({ method, url, body }));
    await this.sessionManager.saveAuthSession(session);

    return session;
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

  public async getUserDetail() {
    const url = '/api/account/detail';
    const method = 'get';

    return await this.sendRequest({ url, method });
  }

  public async getKYCProfile() {
    const url = '/api/account/kyc/profile';
    const method = 'get';

    return await this.sendRequest({ url, method });
  }

  public async updateKYCProfile(profile: KYCProfile) {
    const url = '/api/account/kyc/profile';
    const method = 'put';

    return await this.sendRequest({ url, method, body: profile });
  }

  public async createKYCProfile(profile: KYCProfile) {
    const url = '/api/account/kyc/profile';
    const method = 'post';

    return await this.sendRequest({ url, method, body: profile });
  }

  public async requestEnableTFA() {
    const url = '/api/account/tfa/request';
    const method = 'post';

    return await this.sendRequest({ url, method });
  }

  public async turnOnTFA(valiadte: { code: string }) {
    const url = '/api/account/tfa/on';
    const method = 'post';
    return await this.sendRequest({ url, method, body: valiadte });
  }

  public async turnOffTFA(valiadte: { code: string }) {
    const url = '/api/account/tfa/off';
    const method = 'post';

    return await this.sendRequest({ url, method, body: valiadte });
  }

  public async severLogout() {
    const url = '/api/account/logout';
    const method = 'post';

    return await this.sendRequest({ url, method });
  }

  public async requestResetPassword(requestResetPassword: RequestResetPassword) {
    const url = '/api/account/request_reset_password';
    const method = 'post';

    return await this.sendRequest({ url, method, body: requestResetPassword });
  }

  public async resetPassword(resetPassword: ResetPassword) {
    const url = '/api/account/reset_password';
    const method = 'post';

    return await this.sendRequest({ url, method, body: resetPassword });
  }

  public async changePassword(changePassword: ChangePassword) {
    const password = passwordSalt(changePassword.password);
    const newPassword = passwordSalt(changePassword.new_password);

    const url = '/api/account/modify_password';
    const method = 'post';

    return await this.sendRequest({ url, method, body: { password, new_password: newPassword } });
  }

  public async sendRequest(request: { method: string, url: string, body?: any }) {
    const session = await this.sessionManager.getSession();
    if (!session) {
      throw Error('401');
    }

    const { key, secret } = session;
    const { method, url, body } = request;

    const signData = await generateSignAndJWT({ method, url, key, secret, body });

    const uri = `${this.host}${signData.uri}`;
    const defautHeader = this.defaulutHeader();
    const headers = { ...signData.headers, ...defautHeader };

    return await http.request({ url: uri, headers, method, data: body });
  }

  public async isLogin() {
    try {
      const session = await this.sessionManager.getSession();
      const user = await this.sessionManager.getUser();
      if (session && user) {
        return true;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  }

  public async logout() {
    await this.severLogout();
    await this.sessionManager.deleteSession();
  }

  public async getSession(): Promise<Session | null> {
    return await this.sessionManager.getSession();
  }

  public async getUser(): Promise<User | null> {
    return await this.sessionManager.getUser();
  }

  private defaulutHeader() {
    return { 'fox-merchant-id': this.merchantId };
  }

  private async postRequest(signData: { uri: string, body: any }) {
    const uri = `${this.host}${signData.uri}`;
    const device = DeviceManager.getInstance();
    const deviceInfo = await device.getDeviceinfo();
    const headers = { 'device-info': deviceInfo, ...this.defaulutHeader() };

    try {
      return await http.post(uri, signData.body, { headers });

    } catch (error) {
      const data = error.response.data;
      const { code, data: { tfa_token }, msg } = data;

      if (code === 1110) {
        const tfaError = new TFAError(code, msg, tfa_token);
        return tfaError;
      } else {
        throw error;
      }
    }
  }
}
