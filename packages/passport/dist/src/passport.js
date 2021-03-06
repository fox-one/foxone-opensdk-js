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
var device_1 = require("./device");
var http_1 = require("./http");
var sign_1 = require("./sign");
var tfaError_1 = require("./tfaError");
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
                        signData = sign_1.generateSignRequest({ method: method, url: url });
                        uri = "" + this.host + signData.uri;
                        return [4 /*yield*/, http_1.default.post(uri)];
                    case 1:
                        res = _a.sent();
                        data = {
                            captchaId: res.captcha_id,
                            captchaURL: this.host + "/api/captcha/" + res.captcha_id + ".png",
                        };
                        return [2 /*return*/, data];
                }
            });
        });
    };
    Passport.prototype.requestRegister = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var url, method, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = '/api/account/request_register';
                        method = 'post';
                        body = {
                            captcha: request.captchaCode,
                            captcha_id: request.captchaId,
                            email: request.email,
                            phone_code: request.regionCode,
                            phone_number: request.mobile,
                        };
                        return [4 /*yield*/, this.postRequest(sign_1.generateSignRequest({ method: method, url: url, body: body }))];
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
                            code: register.code,
                            name: register.name,
                            password: sign_1.passwordSalt(register.password),
                            token: register.token,
                        };
                        return [4 /*yield*/, this.postRequest(sign_1.generateSignRequest({ method: method, url: url, body: body }))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Passport.prototype.requestLoginSMS = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var url, method, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = '/api/account/request_login_phone';
                        method = 'post';
                        body = {
                            captcha: request.captchaCode,
                            captcha_id: request.captchaId,
                            phone_code: request.regionCode,
                            phone_number: request.mobile,
                        };
                        return [4 /*yield*/, this.postRequest(sign_1.generateSignRequest({ method: method, url: url, body: body }))];
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
                        url = '/api/account/login_phone';
                        method = 'post';
                        body = {
                            code: login.mobileCode,
                            token: login.token,
                        };
                        return [4 /*yield*/, this.postRequest(sign_1.generateSignRequest({ method: method, url: url, body: body }))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Passport.prototype.login = function (login) {
        return __awaiter(this, void 0, void 0, function () {
            var url, method, body, saltPassword;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = '/api/account/login';
                        method = 'post';
                        saltPassword = sign_1.passwordSalt(login.password);
                        if (login.email) {
                            body = {
                                email: login.email,
                                password: saltPassword,
                            };
                        }
                        else {
                            body = {
                                password: saltPassword,
                                phone_code: login.regionCode,
                                phone_number: login.mobile,
                            };
                        }
                        return [4 /*yield*/, this.postRequest(sign_1.generateSignRequest({ method: method, url: url, body: body }))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Passport.prototype.loginWithTFA = function (login) {
        return __awaiter(this, void 0, void 0, function () {
            var url, method, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = '/api/account/login_tfa';
                        method = 'post';
                        body = {
                            code: login.code,
                            tfa_token: login.tfaToken,
                        };
                        return [4 /*yield*/, this.postRequest(sign_1.generateSignRequest({ method: method, url: url, body: body }))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Passport.prototype.getUserDetail = function (secretInfo) {
        return __awaiter(this, void 0, void 0, function () {
            var url, method, key, secret, signData, uri, headers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = '/api/account/detail';
                        method = 'get';
                        key = secretInfo.key, secret = secretInfo.secret;
                        return [4 /*yield*/, sign_1.generateSignAndJWT({ method: method, url: url, key: key, secret: secret })];
                    case 1:
                        signData = _a.sent();
                        uri = "" + this.host + signData.uri;
                        headers = signData.headers;
                        return [4 /*yield*/, http_1.default.get(uri, __assign({ headers: headers }, this.defaulutHeader()))];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Passport.prototype.postRequest = function (signData) {
        return __awaiter(this, void 0, void 0, function () {
            var uri, device, deviceInfo, headers, error_1, data, code, tfa_token, msg, tfaError;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        uri = "" + this.host + signData.uri;
                        device = device_1.default.getInstance();
                        return [4 /*yield*/, device.getDeviceinfo()];
                    case 1:
                        deviceInfo = _a.sent();
                        headers = __assign({ 'device-info': deviceInfo }, this.defaulutHeader());
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, http_1.default.post(uri, signData.body, { headers: headers })];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        error_1 = _a.sent();
                        data = error_1.response.data;
                        code = data.code;
                        if (code === 1110) {
                            tfa_token = data.data.tfa_token, msg = data.msg;
                            tfaError = new tfaError_1.default(code, msg, tfa_token);
                            throw tfaError;
                        }
                        else {
                            throw error_1;
                        }
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Passport.prototype.defaulutHeader = function () {
        if (this.merchantId) {
            return {
                'fox-merchant-id': this.merchantId,
            };
        }
        else {
            return {};
        }
    };
    return Passport;
}());
exports.default = Passport;
//# sourceMappingURL=passport.js.map