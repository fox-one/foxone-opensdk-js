export default class TFAError extends Error {
  public code: number;
  public message: string;
  public token: string;
  constructor(code: number, message: string, token: string) {
    super(message);
    this.code = code;
    this.message = message;
    this.token = token;
  }
}
