"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_jose_1 = require("node-jose");
var base64url_1 = require("base64url");
// The oirignal varsion at https://github.com/jsonwebtoken/jsonwebtoken.github.io/blob/master/src/editor/jwt.js
// node-jose does not support keys shorter than block size. This is a
// limitation from their implementation and could be resolved in the future.
// See: https://github.com/cisco/node-jose/blob/master/lib/jwk/octkey.js#L141
function paddedKey(key, alg, base64Secret) {
    var blockSizeBytes = alg.indexOf('256') !== -1 ? 512 / 8 : 1024 / 8;
    var buf = base64Secret ? Buffer.from(key, 'base64') : Buffer.from(key);
    if (buf.length < blockSizeBytes) {
        var oldBuf = buf;
        buf = Buffer.alloc(blockSizeBytes);
        buf.set(oldBuf);
    }
    return base64url_1.default.encode(buf);
}
function getJoseKey(header, key, base64Secret) {
    return node_jose_1.default.JWK.asKey({
        kty: 'oct',
        use: 'sig',
        alg: header.alg,
        k: paddedKey(key, header.alg, base64Secret)
    });
}
function sign(header, payload, secretOrPrivateKeyString, base64Secret) {
    if (base64Secret === void 0) { base64Secret = false; }
    if (!header.alg) {
        return Promise.reject(new Error('Missing "alg" claim in header'));
    }
    return getJoseKey(header, secretOrPrivateKeyString, base64Secret).then(function (key) {
        if (!(typeof payload === 'string' || payload instanceof String)) {
            payload = JSON.stringify(payload);
        }
        return node_jose_1.default.JWS.createSign({
            fields: header,
            format: 'compact'
        }, {
            key: key,
            reference: false
        }).update(payload, 'utf8').final();
    });
}
exports.sign = sign;
function verify(jwt, secretOrPublicKeyString, base64Secret) {
    if (base64Secret === void 0) { base64Secret = false; }
    if (!isToken(jwt)) {
        return Promise.resolve(false);
    }
    var decoded = decode(jwt);
    if (!decoded.header.alg) {
        return Promise.resolve(false);
    }
    return getJoseKey(decoded.header, secretOrPublicKeyString, base64Secret).then(function (key) {
        return node_jose_1.default.JWS.createVerify(key)
            .verify(jwt)
            .then(function () { return true; }, function () { return false; });
    }, function (e) {
        console.log.warn('Could not verify token, ' +
            'probably due to bad data in it or the keys: ', e);
        return false;
    });
}
exports.verify = verify;
function decode(jwt) {
    var result = {
        header: {},
        payload: {},
        errors: false
    };
    if (!jwt) {
        result.errors = true;
        return result;
    }
    var split = jwt.split('.');
    try {
        result.header = JSON.parse(base64url_1.default.decode(split[0]));
    }
    catch (e) {
        result.header = {};
        result.errors = true;
    }
    try {
        result.payload = JSON.parse(base64url_1.default.decode(split[1]));
    }
    catch (e) {
        result.payload = {};
        result.errors = true;
    }
    return result;
}
exports.decode = decode;
function isValidBase64String(s, urlOnly) {
    try {
        var validChars = urlOnly ?
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=' :
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_+/=';
        var hasPadding = false;
        for (var i = 0; i < s.length; ++i) {
            hasPadding |= s.charAt(i) === '=';
            if (validChars.indexOf(s.charAt(i)) === -1) {
                return false;
            }
        }
        if (hasPadding) {
            for (var i = s.indexOf('='); i < s.length; ++i) {
                if (s.charAt(i) !== '=') {
                    return false;
                }
            }
            return s.length % 4 === 0;
        }
        return true;
    }
    catch (e) {
        return false;
    }
}
exports.isValidBase64String = isValidBase64String;
function isToken(jwt, checkTypClaim) {
    if (checkTypClaim === void 0) { checkTypClaim = false; }
    var decoded = decode(jwt);
    if (decoded.errors) {
        return false;
    }
    if (checkTypClaim && decoded.header.typ !== 'JWT') {
        return false;
    }
    var split = jwt.split('.');
    var valid = true;
    split.forEach(function (s) { return valid = valid && isValidBase64String(s, true); });
    return valid;
}
exports.isToken = isToken;
//# sourceMappingURL=jwt.js.map