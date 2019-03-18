export default interface RequestResetPassword {
    captcha: string;
    captcha_id: string;
    phone_code: string;
    phone_number: string;
    email: string;
}
