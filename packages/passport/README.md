#  @foxone/passport

@foxone/passport SDK 是Fox.One API 的接口的封装。

* 滑块
* 用户登陆
* 用户注册
* 获取用户信息
* 商户登陆

Fox.One API 的接口都需要签名和生成动态的Token， PassportSDK 同时提供了访问API 的签名函数

* 生成Token
* 解析Token
* 生成Sign


## 安装

```bash
yarn add @foxone/passport
```

## 使用

Passport 不会存储 Session 和用户信息，由使用 @foxone/passport 的接入方自行存储
Passport 登陆后获取到的数据结构大致如下，**session为后续接入方发送请求时签名的必要字段**

```json
{
    "user":
     {
    //...
    },
    "session": {
        "key": "xxxx",
        "secret":"xxx"
    }
}
```

### Passport 
用户登陆模块
```javascript
import { Passport } from '@foxone/passport';

// 实例化 Passport
const passport = new Passport({
  host: constants.passportHost,
  merchantId: constants.merchantId,
});
// 获取滑块
passport.getCaptcha()

// 获取注册验证码 邮箱 手机二选一
passport.requestRegister({regionCode,
        mobile,
        captchaId,
        captchaCode,
        email})
return {token:''}

// 注册 name可不传
passport.register({
        name,
        code,
        password,
        token,
    })
return {user:{},session:{}}
// 获取手机登录验证码
passport.requestLoginSMS({
        regionCode,
        mobile,
        captchaId,
        captchaCode
    })
return {token:''}

// 手机登陆
passport.mobileLogin({
        token,
        mobileCode,
})
return {user:{},session:{}}

// 账户密码登陆
// mobile 或者邮箱为选填字段
passport.login({ password: rawPassword, mobile, email })
return {user:{},session:{}}

// 获取用户信息
passport.getUserDetail({secret, key})
return {user:{}}

```

### Admin
商户模块
```javascript
import { Admin } from '@foxone/passport';

const admin = new Admin({
  host: constants.adminHost,
});
// 商户登陆
admin.login({ password: rawPassword, username})
return {admin:{},session:{}}
```

### Sign
签名函数
```javascript
import { generateSignRequest, generateSignAndJWT } from '@foxone/passport';

const signData = generateSignRequest({ method: 'get', url: pathAndQuery, body: options.body });
return { uri, body, sign }

```
### Token
生成请求的Token
```javascript
import { generateToken, decodeToken } from '@foxone/passport';

const token = await generateToken({ key: session.key, secret: session.secret, requestSign: signData.sign });

```
### Password Salt
密码加盐
```javascript
import { passwordSalt } from '@foxone/passport';
const salePassword = passwordSalt(password);
```
## **Fox Cloud API 和 Gateway API 的调用说明**

当业务方为 User，Maker 时必须在 Http Header里添加请求头
'fox-merchant-id':'xxxxxxx'

所有的业务方在有用户session时，发送的请求都需要默认的加上 
"Authorization": `Bearer ${token}` }

**token 为上述 Token 章节生成的动态token，每次都不一样，需要每次创建新的Token**


### Host 
Dev https://dev-gateway.fox.one/
Product https://openapi.fox.one/


### Example 

一个具体实际的例子，传入的url为完整的url，函数正则截取 host 对host 之后的path进行签名和请求

```javascript
const regexSt = new RegExp('^https://[a-zA-Z0-9.-]*/');

async function signAndRequest(session, url, options) {
  let host = url.match(regexSt)[0];
  host = host.substring(0, host.length - 1);

  const pathAndQuery = url.replace(regexSt, '/');
  const signData = generateSignRequest({ method: options.method, url: pathAndQuery, body: options.body });
  const token = await generateToken({ key: session.key, secret: session.secret, requestSign: signData.sign });
  const finalUrl = `${host}${signData.uri}`;
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };
  const newOptions = {
    ...options,
    method: options.method,
    body: JSON.stringify(signData.body),
    headers,
  };
  return window.fetch(finalUrl, newOptions);
}
```

### Playground
以下为已集成了 passportsdk 的模版
[FoxOne Admin 模版](https://github.com/fox-one/f1-admin-playground)
[FoxONE Maker 模板工程](https://github.com/fox-one/f1-maker-playground)


### 对于 PIN 自己托管的情况

Passport 提供了实用 PKCS1 格式封装的 RSA密钥对PIN进行加密。


对于加密提供了方法 
```function encryptPIN(pin: string, pem: string): Promise<string>;```


如果需要对加密和解密进行测试 提供了方法
对加密的文本进行解密
``` function decryptPIN(pin: string, pem: string): Promise<string>; ```

验证公钥加密私钥解密
``` function verifyPEM(pin: string, pem: string, privatePem: string): Promise<string>;```


Example:
以下例子来自单元测试 sign.test.ts
```
import { decryptPIN, encryptPIN } from "@foxone/passport";
  const pem = `
  -----BEGIN RSA PUBLIC KEY-----
  MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAysHUv9wZvKMsqkJoYCKliX1D2HaN2NSTx/2FlqGR6BqSurdzWOPpeyJHztBbpTMldA4sTLLMY8xKrL0b98LxWn/EQgmuW8/YHdpNLoex7OdEXdQsu+J5iO7DEwfWmxuWrnCN+/7LDX/ssoRiOtaESZwYhnwkQ7sZM2ThQFxkSpX/ykBEMHvrFvEG2oJ43jim02q0CpRDlPpolRPJ4++FQPPDmpFFwrFurhHtl0h3Ct74g8NpHVxklAHm7s/WA2sDcC4YHfRKwXAefSNh29+seh06aRZAqjxz0l98Sy2JrmFGEfy7zdzq+5Ot1Ee712hbtHJbKmHv7uaBoiQo69F6awIDAQAB-----END RSA PUBLIC KEY-----
  `;

  const pripem = `
  -----BEGIN RSA PRIVATE KEY-----
  MIIEogIBAAKCAQEAysHUv9wZvKMsqkJoYCKliX1D2HaN2NSTx/2FlqGR6BqSurdzWOPpeyJHztBbpTMldA4sTLLMY8xKrL0b98LxWn/EQgmuW8/YHdpNLoex7OdEXdQsu+J5iO7DEwfWmxuWrnCN+/7LDX/ssoRiOtaESZwYhnwkQ7sZM2ThQFxkSpX/ykBEMHvrFvEG2oJ43jim02q0CpRDlPpolRPJ4++FQPPDmpFFwrFurhHtl0h3Ct74g8NpHVxklAHm7s/WA2sDcC4YHfRKwXAefSNh29+seh06aRZAqjxz0l98Sy2JrmFGEfy7zdzq+5Ot1Ee712hbtHJbKmHv7uaBoiQo69F6awIDAQABAoIBAEoaLTcxqfZXbKuNObho8TceoP0r1wu4JYqiDYDP7BN4Isg6491I7rwh+zyKyfPGjZms1GPztN+EeoZHV0Fl7e+1YnUANMk5XTML5clrrot2unXQZckFLIXvPTxnUPe/TYLTgBDpPizg5BEacQwv+oksk4oTNO3MI5m09N4g5kabhJDmWa/aSi5iAVmVLlCAe0eMCqwtrFB8CKWgW2X/pVLTvwU0QTnXUsjxSr9KwFAMAymowzn/3f9yXxSFjOAGzE5BQzf7MbjG/k3Tj2WUi09+iONKjG1pU9FGj8Aai2G/2SE+4kAPR8aUv+pwQfUPOKn1CygVeQKzTNIOOF3wawECgYEA9901/6nt7Do7Mzm2R6z40F7VEGoWvZuDXXFYI9UdWxYAKZpOOxJ038kXakOM2T/HhAj35roGG7K2sY/leqSKb6lb01xp9KGq8Jndtgddfle4yR87LxNp/OREJA3TzyROWLz/HU+6xdZXDJZBj9JXeqGtlTg6yKJH/e8KB9vQB5kCgYEA0WmWuUIb01VP6InQCnvSb+92JlxW9KMEMveEOxwKpcfXMcLVss9wlLS15inyr3Z7Si4OPGp8gVH8DBWA1GKZpdl8v5zKXGiyonbVLVtkaklG8H/blbGb5lB/M+ohWBP1Oe6kULHuwj1i3cm8gXehEFg5ASVHHtUfoZGjKq4YRKMCgYBh3Enclifks5z5/Zg1NlrKUhbHM0ulMsgr1XtaMmMzujz4L/8hHYldbZS8FM2AXMkWHUBbLSkKOIYfFtQgluQ9b91cVslSl53Y/rbljoTgRBwl9Bm23XBkM2+f2IG+7/Oq33vOA9OXFqgpxQ0/jmmRdlIFbzzuR/wqiv0n2yaISQKBgARqe5kwgbG1LNg0f8SY09k0bYNlkxfZkC8a9RjiAH96dVlBSIxav38DSIqv+8QjdXoc+oPfovx/JBeFJJBV+/N5YJ4Rylqkgo/WfaxVLwrmvK45pAHGGwmCTQxlNYrL8PHlzGU/O0+xR7JxnJ4GTckwcxNJG/TUfbREg/JUdYKNAoGAeCxO4kf7y9i+0ll1wPyfIFctJrwicXoH43L4CsDr4Ed0RI6V7qeY3k2zZY/OLgVkjF4fQeEVXrVvMA/dRlmjhciKS8ahUZTrPStegv73y573JN46D1fvF7rrt7Uu4QvQd5iGP5w/DIERB4sfANycTqJiyaQhNpla38Nd4AuSC4E=-----END RSA PRIVATE KEY-----
`

  const encrtypPIN =  await encryptPIN('123456', pem);
  console.log(encrtypPIN);
  const message = await decryptPIN(encrtypPIN, pripem);
  console.log(message);
```


#### 提供方法 generateTokenWithPIN
对于需要自己携带 PIN 的请求，如不在请求时的 body 里传入值，那么需要在 JWT 里放入 PIN，生成带 PIN 的 JWT 的例子如下
```
  const encrtypPIN =  await encryptPIN('123456', pem);

  const token = await generateTokenWithPIN({ key: KEY, secret: SECRET, requestSign: SIGN, pin: encrtypPIN });
 ```
