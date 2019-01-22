"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_1 = require("uuid");
var CryptoJS = require("crypto-js");
function generateSignRequest(_a) {
    var method = _a.method, url = _a.url, _b = _a.body, body = _b === void 0 ? null : _b;
    var ts = getTimestamp();
    var nonce = uuid_1.v4();
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
    var digiest = CryptoJS.SHA256(message);
    var sign = CryptoJS.enc.Base64.stringify(digiest);
    return { uri: uri, body: body, sign: sign };
}
exports.generateSignRequest = generateSignRequest;
function getTimestamp(date) {
    if (date === void 0) { date = new Date(); }
    return Math.round(date.getTime() / 1000);
}
//# sourceMappingURL=sign.js.map