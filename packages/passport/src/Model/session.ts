export default class Session {
  public key: string;
  public secret: string;

  constructor(key: string, secret: string) {
    this.key = key;
    this.secret = secret;
  }
}
