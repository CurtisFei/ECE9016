import { toSafeInteger, get, isInteger } from 'lodash';
import { ParametersException } from 'lin-mizar';

const crypto = require('crypto');
const key = '0132456789abcdef'
const iv = 'fedcba9876543210'

function getSafeParamId(ctx) {
  const id = toSafeInteger(get(ctx.params, 'id'));
  if (!isInteger(id)) {
    throw new ParametersException({
      code: 10030
    });
  }
  return id;
}

function isOptional(val) {
  // undefined , null , ""  , "    ", 皆通过
  if (val === undefined) {
    return true;
  }
  if (val === null) {
    return true;
  }
  if (typeof val === 'string') {
    return val === '' || val.trim() === '';
  }
  return false;
}

function cipher(str) {
  try {
    const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    return cipher.update(str, 'utf8', 'hex') + cipher.final('hex');
  } catch (err) {
    console.log('cipher failed');
    return err.message || err;
  }
}

function decipher(str) {
  try {
    const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    return decipher.update(str, 'hex', 'utf8') + decipher.final('utf8');
  } catch (err) {
    console.log('decipher failed');
    return err.message || err;
  }
}

export { getSafeParamId, isOptional, cipher, decipher };
