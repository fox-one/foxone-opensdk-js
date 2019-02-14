#  F1Passport SDK

F1Passport SDK 是Fox.One Cloud API 的接口的封装。

* 滑块
* 用户登陆
* 用户注册
* 获取用户信息
* 商户登陆

Fox.One Cloud API 以及 GateWay API 的接口都需要签名和生成动态的Token，PassportSDK 同时提供了访问网关的签名API

* 生成Token
* 解析Token
* 生成Sign


## 安装

```bash
yarn add f1-passport
```

## 使用

Passport 不会存储 Session 和用户信息，由使用F1-Passport的接入放自行存储
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
import { Passport } from 'f1-passport';

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
import { Admin } from 'f1-passport';

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
import { generateSignRequest, generateSignAndJWT } from 'f1-passport';

const signData = generateSignRequest({ method: 'get', url: pathAndQuery, body: options.body });
return { uri, body, sign }

```
### Token
生成请求的Token
```javascript
import { generateToken, decodeToken } from 'f1-passport';

const token = await generateToken({ key: session.key, secret: session.secret, requestSign: signData.sign });

```
### Password Salt
密码加盐
```javascript
import { passwordSalt } from 'f1-passport';
const salePassword = passwordSalt(password);
```
## **Fox Cloud API 和 Gateway API 的调用说明**

当业务方为 User，Maker 时必须在 Http Header里添加请求头
'fox-merchant-id':'xxxxxxx'

所有的业务方在有用户session时，发送的请求都需要默认的加上 
"Authorization": `Bearer ${token}` }

**token 为上述 Token 章节生成的动态token，每次都不一样，需要每次创建新的Token**


### Host 
Admin https://dev-gateway.fox.one/
admin login https://dev-gateway.fox.one/admin/login

Maker https://dev-cloud.fox.one/
maker login https://dev-cloud.fox.one/api/account/login



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