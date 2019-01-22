import http from './http';
import { generateSignRequest } from './sign.js';
import { generateToken } from './token';

export default class Passport {
  constructor(props) {
    super.constructor(props)
    this.API_Host = props.API_Host;
    this.merchant_id = props.merchant_id
  }

  async getCaptcha() {
    const url = '/api/captcha';
    const signData = generateSignRequest('post', url)
    let uri = `${this.API_Host}${signData.uri}`
    let res = await http.post(uri)
    let data = {
      captchaId: res.captcha_id,
      captchaURL: `${this.API_Host}/api/captcha/${res.captcha_id}.png`
    }
    return data
  }

  async requestRegisterSMS(regionCode, mobile, captureId, captureCode) {
    const url = '/api/account/request_register_phone';
    const data = {
      phone_code: regionCode,
      phone_number: mobile,
      captcha_id: captureId,
      capture: captureCode
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

  async requestLoginSMS(regionCode, mobile, captureId, captureCode) {
    const url = '/api/account/request_login_phone';
    const data = {
      phone_code: regionCode,
      phone_number: mobile,
      captcha_id: captureId,
      capture: captureCode
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
    const uri = `${this.API_Host}${signData.uri}`

    return await http.get(uri, { headers: { "Authorization": `Bearer ${token}`, ...this.defaulutHeader() }})
  }

  async postRequest(signData) {
    const uri = `${this.API_Host}${signData.uri}`
    const headers = { headers: this.defaulutHeader() }
    return await http.post(uri, signData.newBody, headers)
  }

  defaulutHeader() {
    return {
      "fox-cloud-merchant-id": this.merchant_id
    }
  }
}
