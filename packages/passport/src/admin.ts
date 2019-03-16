import http from './http';
import { generateSignRequest, passwordSalt } from './sign.js';

export default class Admin {
  private host: string;
  constructor(props: { host: string }) {
    this.host = props.host;
  }

  public async login(login: { username: string, password: string }) {
    const url = '/admin/login';
    const method = 'post';

    const body = {
      password: passwordSalt(login.password),
      username: login.username,
    };

    return await this.postRequest(generateSignRequest({ method, url, body }));
  }

  public async postRequest(signData: { uri: any, body: any, sign?: any }) {
    const uri = `${this.host}${signData.uri}`;
    return await http.post(uri, signData.body);
  }
}
