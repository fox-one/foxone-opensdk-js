export default interface User {
  avatar: string;
  created_at: number;
  email: string;
  id: number;
  is_password_set: boolean;
  is_tfa_enable: boolean;
  lang: string;
  member_id: string;
  merchant_id: string;
  name: string;
  phone_code: string;
  phone_number: string;
  push_id: string;
}
