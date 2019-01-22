import http from './http';
import { generateSignRequest } from './sign.js';
import { generateToken } from './token';

export default class Passport {
  constructor(props) {
    super.constructor(props)
    this.ApiHost = props.ApiHost;
    this.merchantId = props.merchantId
  }

  async getCaptcha() {
    const url = '/api/captcha';
    const signData = generateSignRequest('post', url)
    let uri = `${this.ApiHost}${signData.uri}`
    let res = await http.post(uri)
    let data = {
      captchaId: res.captcha_id,
      captchaURL: `${this.ApiHost}/api/captcha/${res.captcha_id}.png`
    }
    return data
  }

  async requestRegisterSMS(regionCode, mobile, captchaId, captchaCode) {
    const url = '/api/account/request_register_phone';
    const data = {
      phone_code: regionCode,
      phone_number: mobile,
      captcha_id: captchaId,
      capture: captchaCode
    }

    return await this.postRequest(generateSignRequest('post', url, data));
  }

  async register(name, mobileCode, password, token) {
    const url = '/api/account/register_phone';
    const data = {
      name: name,
      code: mobileCode,
      password: password,
      token: token
    }
    return await this.postRequest(generateSignRequest('post', url, data));
  }

  async requestLoginSMS(regionCode, mobile, captchaId, captchaCode) {
    const url = '/api/account/request_login_phone';
    const data = {
      phone_code: regionCode,
      phone_number: mobile,
      captcha_id: captchaId,
      capture: captchaCode
    }

    generateSignRequest('post', url, data)

    return await this.postRequest(generateSignRequest('post', url, data));
  }

  async mobileLogin(token, mobileCode) {
    const url = 'api/account/login_phone';
    const data = {
      token,
      code: mobileCode,
    }

    return await this.postRequest(generateSignRequest('post', url, data));
  }

  async login(regionCode, mobile, password) {
    const url = '/api/account/login';
    const data = {
      phone_code: regionCode,
      phone_number: mobile,
      password
    }

    return await this.postRequest(generateSignRequest('post', url, data));
  }

  async getUserDetail(key, secret) {
    const url = '/api/account/detail';
    const signData = generateSignRequest('get', url);
    const token = await generateToken(key, secret, signData.sign)
    const uri = `${this.ApiHost}${signData.uri}`

    return await http.get(uri, { headers: { "Authorization": `Bearer ${token}`, ...this.defaulutHeader() } })
  }

  async postRequest(signData) {
    const uri = `${this.ApiHost}${signData.uri}`
    const headers = { headers: this.defaulutHeader() }
    return await http.post(uri, signData.newBody, headers)
  }

  defaulutHeader() {
    return {
      "fox-cloud-merchant-id": this.merchantId
    }
  }
}
