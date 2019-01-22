"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("./http");
var sign_js_1 = require("./sign.js");
var token_1 = require("./token");
var Passport = /** @class */ (function () {
    function Passport(props) {
        this.host = props.host;
        this.merchantId = props.merchantId;
    }
    Passport.prototype.getCaptcha = function () {
        return __awaiter(this, void 0, void 0, function () {
            var url, method, signData, uri, res, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = '/api/captcha';
                        method = 'post';
                        signData = sign_js_1.generateSignRequest({ method: method, url: url });
                        uri = "" + this.host + signData.uri;
                        return [4 /*yield*/, http_1.default.post(uri)];
                    case 1:
                        res = _a.sent();
                        data = {
                            captchaId: res.captcha_id,
                            captchaURL: this.host + "/api/captcha/" + res.captcha_id + ".png"
                        };
                        return [2 /*return*/, data];
                }
            });
        });
    };
    Passport.prototype.requestRegisterSMS = function (registerSMS) {
        return __awaiter(this, void 0, void 0, function () {
            var url, method, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = '/api/account/request_register_phone';
                        method = 'post';
                        body = {
                            phone_code: registerSMS.regionCode,
                            phone_number: registerSMS.mobile,
                            captcha_id: registerSMS.captchaId,
                            capture: registerSMS.captchaCode
                        };
                        return [4 /*yield*/, this.postRequest(sign_js_1.generateSignRequest({ method: method, url: url, body: body }))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Passport.prototype.requestRegisterMail = function (registerMail) {
        return __awaiter(this, void 0, void 0, function () {
            var url, method, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = '/api/account/request_register_email';
                        method = 'post';
                        body = {
                            email: registerMail.email
                        };
                        return [4 /*yield*/, this.postRequest(sign_js_1.generateSignRequest({ method: method, url: url, body: body }))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Passport.prototype.registerMobile = function (register) {
        return __awaiter(this, void 0, void 0, function () {
            var url, method, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = '/api/account/register_phone';
                        method = 'post';
                        body = {
                            name: register.name,
                            code: register.mobileCode,
                            password: register.password,
                            token: register.token
                        };
                        return [4 /*yield*/, this.postRequest(sign_js_1.generateSignRequest({ method: method, url: url, body: body }))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Passport.prototype.register = function (register) {
        return __awaiter(this, void 0, void 0, function () {
            var url, method, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = '/api/account/register';
                        method = 'post';
                        body = {
                            name: register.name,
                            code: register.code,
                            password: register.password,
                            token: register.token
                        };
                        return [4 /*yield*/, this.postRequest(sign_js_1.generateSignRequest({ method: method, url: url, body: body }))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Passport.prototype.requestLoginSMS = function (loginSMS) {
        return __awaiter(this, void 0, void 0, function () {
            var url, method, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = '/api/account/request_login_phone';
                        method = 'post';
                        body = {
                            phone_code: loginSMS.regionCode,
                            phone_number: loginSMS.mobile,
                            captcha_id: loginSMS.captchaId,
                            capture: loginSMS.captchaCode
                        };
                        return [4 /*yield*/, this.postRequest(sign_js_1.generateSignRequest({ method: method, url: url, body: body }))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Passport.prototype.mobileLogin = function (login) {
        return __awaiter(this, void 0, void 0, function () {
            var url, method, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = 'api/account/login_phone';
                        method = 'post';
                        body = {
                            token: login.token,
                            code: login.mobileCode
                        };
                        return [4 /*yield*/, this.postRequest(sign_js_1.generateSignRequest({ method: method, url: url, body: body }))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Passport.prototype.login = function (login) {
        return __awaiter(this, void 0, void 0, function () {
            var url, method, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = '/api/account/login';
                        method = 'post';
                        if (login.email) {
                            body = {
                                email: login.email,
                                password: login.password
                            };
                        }
                        else {
                            body = {
                                phone_number: login.mobile,
                                phone_code: login.regionCode,
                                password: login.password
                            };
                        }
                        return [4 /*yield*/, this.postRequest(sign_js_1.generateSignRequest({ method: method, url: url, body: body }))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Passport.prototype.getUserDetail = function (secret) {
        return __awaiter(this, void 0, void 0, function () {
            var url, method, signData, keyAndSign, token, uri;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = '/api/account/detail';
                        method = 'get';
                        signData = sign_js_1.generateSignRequest({ method: method, url: url });
                        keyAndSign = {
                            key: secret.key,
                            secret: secret.secret,
                            requestSign: signData.sign
                        };
                        return [4 /*yield*/, token_1.generateToken(keyAndSign)];
                    case 1:
                        token = _a.sent();
                        uri = "" + this.host + signData.uri;
                        return [4 /*yield*/, http_1.default.get(uri, { headers: __assign({ "Authorization": "Bearer " + token }, this.defaulutHeader()) })];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Passport.prototype.postRequest = function (signData) {
        return __awaiter(this, void 0, void 0, function () {
            var uri, headers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        uri = "" + this.host + signData.uri;
                        headers = { headers: this.defaulutHeader() };
                        return [4 /*yield*/, http_1.default.post(uri, signData.body, headers)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Passport.prototype.defaulutHeader = function () {
        return {
            "fox-cloud-merchant-id": this.merchantId
        };
    };
    return Passport;
}());
exports.default = Passport;
//# sourceMappingURL=passport.js.map