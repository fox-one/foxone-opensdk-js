import http from './http';
import { generateSignRequest } from './sign.js';
import { generateToken } from './token';

export default class Admin {
  host: string;
  constructor(props: { host: string }) {
    this.host = props.host;
  }

  async login(login: { username: string, password: string }) {
    const url = '/admin/login';
    const method = 'post';
    const body = {
      username: login.username,
      password: login.password
    }
    return await this.postRequest(generateSignRequest({ method, url, body }));
  }

  async postRequest(signData: { uri: any, body: any, sign?: any }) {
    const uri = `${this.host}${signData.uri}`
    return await http.post(uri, signData.body)
  }
}