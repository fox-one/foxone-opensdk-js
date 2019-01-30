import http from './http';
import { generateSignRequest, passwordSalt } from './sign';
import { generateToken } from './token';


export default class Passport {
  host: string;
  merchantId: string;
  constructor(props: { host: string, merchantId: string }) {
    this.host = props.host;
    this.merchantId = props.merchantId
  }

  async getCaptcha() {
    const url = '/api/captcha';
    const method = 'post';
    const signData = generateSignRequest({ method, url })
    let uri = `${this.host}${signData.uri}`
    let res = await http.post(uri)
    let data = {
      captchaId: res.captcha_id,
      captchaURL: `${this.host}/api/captcha/${res.captcha_id}.png`
    }
    return data;
  }

  async requestRegister(request: { regionCode: string, mobile: string, captchaId: string, captchaCode: string, email: string }) {
    const url = '/api/account/request_register';
    const method = 'post';
    const body = {
      phone_code: request.regionCode,
      phone_number: request.mobile,
      captcha_id: request.captchaId,
      captcha: request.captchaCode,
      email: request.email
    }

    return await this.postRequest(generateSignRequest({ method, url, body }));
  }

  async register(register: { name?: string, code: string, password: string, token: string }) {
    const url = '/api/account/register';
    const method = 'post';
    const body = {
      name: register.name,
      code: register.code,
      password: passwordSalt(register.password),
      token: register.token
    }
    return await this.postRequest(generateSignRequest({ method, url, body }));
  }

  async requestLoginSMS(request: { regionCode: string, mobile: string, captchaId: string, captchaCode: string }) {
    const url = '/api/account/request_login_phone';
    const method = 'post';
    const body = {
      phone_code: request.regionCode,
      phone_number: request.mobile,
      captcha_id: request.captchaId,
      captcha: request.captchaCode
    }

    return await this.postRequest(generateSignRequest({ method, url, body }));
  }

  async mobileLogin(login: { token: string, mobileCode: string }) {
    const url = '/api/account/login_phone';
    const method = 'post';
    const body = {
      token: login.token,
      code: login.mobileCode
    }

    return await this.postRequest(generateSignRequest({ method, url, body }));
  }

  async login(login: { regionCode?: string , mobile?: string, email?: string, password: string }) {
    const url = '/api/account/login';
    const method = 'post';
    let body: {};
    let saltPassword = passwordSalt(login.password);
    if (login.email) {
      body = {
        email: login.email,
        password: saltPassword
      }
    } else {
      body = {
        phone_number: login.mobile,
        phone_code: login.regionCode,
        password: saltPassword
      }
    }

    return await this.postRequest(generateSignRequest({ method, url, body }));
  }

  async getUserDetail(secret: { key: string, secret: string }) {
    const url = '/api/account/detail';
    const method = 'get';
    const signData = generateSignRequest({ method, url });
    const keyAndSign = {
      key: secret.key,
      secret: secret.secret,
      requestSign: signData.sign
    }

    const token = await generateToken(keyAndSign);
    const uri = `${this.host}${signData.uri}`

    return await http.get(uri, { headers: { "Authorization": `Bearer ${token}`, ...this.defaulutHeader() } })
  }

  async postRequest(signData: { uri: any, body: any, sign?: any }) {
    const uri = `${this.host}${signData.uri}`
    const headers = { headers: this.defaulutHeader() }
    return await http.post(uri, signData.body, headers)
  }

  defaulutHeader() {
    if (this.merchantId) {
      return {
        "fox-cloud-merchant-id": this.merchantId
      }
    } else {
      return {}
    }
  }
}
