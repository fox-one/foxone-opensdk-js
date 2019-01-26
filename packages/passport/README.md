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
    user:
     {
    ...
    },
    session: {
        key: 'xxxx',
        secret:'xxx'
    }
}
```

### Passport 
用户登陆模块
```javascript
import { Passport } from 'f1-passport';
const passport = new Passport({
  host: constants.passportHost,
  merchantId: constants.merchantId,
});
// 获取滑块
passport.getCaptcha()

// 获取注册验证码
passport.requestRegister(params)

// 注册
passport.register(params)

// 获取手机登录验证码
passport.requestLoginSMS(params)

// 手机登陆
passport.mobileLogin(params)

// 账户密码登陆
passport.login({ password: rawPassword, mobile, email })
// 获取用户信息
passport.getUserDetail(session)

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
```

### Sign
签名函数
```javascript
import { generateSignRequest, generateSignAndJWT, generateToken } from 'f1-passport';

const signData = generateSignRequest({ method: 'get', url: pathAndQuery, body: options.body });


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
```

