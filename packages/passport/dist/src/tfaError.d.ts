export default class TFAError extends Error {
    code: number;
    message: string;
    token: string;
    constructor(code: number, message: string, token: string);
}
