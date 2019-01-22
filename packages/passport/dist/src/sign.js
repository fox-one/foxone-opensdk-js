"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var v4_1 = require("uuid/v4");
var crypto_js_1 = require("crypto-js");
function generateSignRequest(_a) {
    var method = _a.method, url = _a.url, _b = _a.body, body = _b === void 0 ? null : _b;
    var ts = getTimestamp();
    var nonce = v4_1.default();
    var uri = url;
    if (uri.indexOf('?') > 0) {
        uri = uri + "_ts=" + ts + "&_nonce=" + nonce;
    }
    else {
        uri = uri + "?_ts=" + ts + "&_nonce=" + nonce;
    }
    var message = "" + method.toUpperCase() + uri;
    if (body) {
        message += JSON.stringify(body);
    }
    var digiest = crypto_js_1.default.SHA256(message);
    var sign = crypto_js_1.default.enc.Base64.stringify(digiest);
    return { uri: uri, body: body, sign: sign };
}
exports.generateSignRequest = generateSignRequest;
function getTimestamp(date) {
    if (date === void 0) { date = new Date(); }
    return Math.round(date.getTime() / 1000);
}
//# sourceMappingURL=sign.js.map