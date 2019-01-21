import jose from 'node-jose';
import b64u from 'base64url';

// The oirignal varsion at https://github.com/jsonwebtoken/jsonwebtoken.github.io/blob/master/src/editor/jwt.js

// node-jose does not support keys shorter than block size. This is a
// limitation from their implementation and could be resolved in the future.
// See: https://github.com/cisco/node-jose/blob/master/lib/jwk/octkey.js#L141
function paddedKey(key, alg, base64Secret) {
  const blockSizeBytes = alg.indexOf('256') !== -1 ? 512 / 8 : 1024 / 8;

  let buf = base64Secret ? Buffer.from(key, 'base64') : Buffer.from(key);

  if(buf.length < blockSizeBytes) {
    const oldBuf = buf;
    buf = Buffer.alloc(blockSizeBytes);
    buf.set(oldBuf);
  }

  return b64u.encode(buf);
}

function getJoseKey(header, key, base64Secret) {
    return jose.JWK.asKey({
      kty: 'oct',
      use: 'sig',
      alg: header.alg,
      k: paddedKey(key, header.alg, base64Secret)
    });
}

export function sign(header,
                     payload,
                     secretOrPrivateKeyString,
                     base64Secret = false) {
  if(!header.alg) {
    return Promise.reject(new Error('Missing "alg" claim in header'));
  }

  return getJoseKey(header, secretOrPrivateKeyString, base64Secret).then(
    key => {
      if(!(typeof payload === 'string' || payload instanceof String)) {
        payload = JSON.stringify(payload);
      }

      return jose.JWS.createSign({
        fields: header,
        format: 'compact'
      }, {
        key: key,
        reference: false
      }).update(payload, 'utf8').final();
    }
  );
}

export function verify(jwt, secretOrPublicKeyString, base64Secret = false) {
  if(!isToken(jwt)) {
    return Promise.resolve(false);
  }

  const decoded = decode(jwt);

  if(!decoded.header.alg) {
    return Promise.resolve(false);
  }

  return getJoseKey(decoded.header, secretOrPublicKeyString, base64Secret).then(
    key => {
      return jose.JWS.createVerify(key)
                     .verify(jwt)
                     .then(() => true, () => false);
    }, e => {
      console.log.warn('Could not verify token, ' +
               'probably due to bad data in it or the keys: ', e);
      return false;
    }
  );
}

export function decode(jwt) {
  const result = {
    header: {},
    payload: {},
    errors: false
  };

  if(!jwt) {
    result.errors = true;
    return result;
  }

  const split = jwt.split('.');

  try {
    result.header = JSON.parse(b64u.decode(split[0]));
  } catch(e) {
    result.header = {};
    result.errors = true;
  }

  try {
    result.payload = JSON.parse(b64u.decode(split[1]));
  } catch(e) {
    result.payload = {};
    result.errors = true;
  }

  return result;
}

export function isValidBase64String(s, urlOnly) {
  try {
    const validChars = urlOnly ?
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=' :
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_+/=';

    let hasPadding = false;
    for(let i = 0; i < s.length; ++i) {
      hasPadding |= s.charAt(i) === '=';
      if(validChars.indexOf(s.charAt(i)) === -1) {
        return false;
      }
    }

    if(hasPadding) {
      for(let i = s.indexOf('='); i < s.length; ++i) {
        if(s.charAt(i) !== '=') {
          return false;
        }
      }

      return s.length % 4 === 0;
    }

    return true;
  } catch (e) {
    return false;
  }
}

export function isToken(jwt, checkTypClaim = false) {
  const decoded = decode(jwt);

  if(decoded.errors) {
    return false;
  }

  if(checkTypClaim && decoded.header.typ !== 'JWT') {
    return false;
  }

  const split = jwt.split('.');
  let valid = true;
  split.forEach(s => valid = valid && isValidBase64String(s, true));

  return valid;
}
