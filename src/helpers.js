/* eslint-disable no-plusplus */
import os from 'os';
import { promises as fs } from 'fs';
// eslint-disable-next-line no-unused-vars
import crypto, { HexBase64Latin1Encoding, BinaryLike } from 'crypto';
import { stringify } from 'querystring';
import config from './config/app';

/**
 * @param {*} value
 * @param {STRING} err
 *
 * @returns {String}
 */
export function existsOrError(value, err) {
  if (!value) throw new Error(err);
  if (Array.isArray(value) && value.length === 0) throw new Error(err);
  if (typeof value === 'string' && !value.trim()) throw new Error(err);
}

/**
 * @param {*} value
 * @param {STRING} err
 *
 * @returns {String}
 */
export function notExistsOrError(value, err) {
  try {
    existsOrError(value, err);
  } catch (e) {
    return;
  }

  throw err;
}

/**
 * @param {*} valueA
 * @param {*} valueB
 * @param {STRING} err
 *
 * @returns {String}
 */
export function equalsOrError(valueA, valueB, err) {
  if (valueA !== valueB) throw new Error(err);
}

/**
 * @param {*} a
 *
 * @returns {String}
 */
export function uuid(a) {
  return a
    ? // eslint-disable-next-line no-bitwise
      (a ^ ((Math.random() * 16) >> (a / 4))).toString(16)
    : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuid);
}

/**
 * @param {*} data
 * @param {String} extension
 *
 * @returns {Promise<string>}
 */
export async function createTmpFile(data, extension) {
  if (!data || !extension) {
    throw new Error('createTmpFile: arguments invalids.');
  }

  extension = extension.replace('.', '');
  const filePath = `${os.tmpdir()}/${uuid()}-${Date.now()}.${extension}`;
  await fs.writeFile(`${filePath}`, data);

  return filePath;
}

/**
 * @param {BinaryLike} value
 * @param {String} algorithm
 * @param {HexBase64Latin1Encoding} encoding
 *
 * @returns {String}
 */
export function createHash(value, algorithm = 'sha256', encoding = 'hex') {
  return crypto
    .createHmac(algorithm, config.key)
    .update(value)
    .digest(encoding);
}

/**
 * @param {String} value
 *
 * @returns {String}
 */
export function createHashMd5(value) {
  return crypto
    .createHash('md5')
    .update(value)
    .digest('hex');
}

/**
 * @param {Number} value
 *
 * @returns {Promise<string>}
 */
export function createRandomBytes(length) {
  return new Promise((resolve, reject) => {
    crypto.randomBytes((length || 16) / 2, (err, hash) => {
      if (err) return reject(err);

      return resolve(hash.toString('hex'));
    });
  });
}

/**
 * @param {Number} min
 * @param {Number} max
 *
 * @returns {Number}
 */
export function createRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * @param {Number} min
 * @param {Number} max
 *
 * @returns {Number}
 */
export function createRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function isValidaDate(date) {
  return date instanceof Date && !Number.isNaN(date.getTime());
}

/**
 * @param {Date|String|Number} date
 * @param {Boolean} check
 *
 * @returns {Date}
 */
export function createDateInstance(date, check = false) {
  date = date || Date.now();

  if (date instanceof Date) {
    date = date.getTime();
  } else if (Number.isNaN(Number(date)) && date.trim()) {
    const dateSplit = date.toString().split(' ');
    const dateTime = typeof dateSplit[1] !== 'undefined' ? dateSplit[1] : '';

    if (dateSplit[0].match(/^\d{2}\/\d{2}\/\d{4}$/gi)) {
      const dateReverse = dateSplit[0]
        .split('/')
        .reverse()
        .join('/');

      date = `${dateReverse} ${dateTime}`;
    } else if (dateSplit[0].match(/^\d{4}\/\d{2}\/\d{2}$/gi)) {
      date = `${dateSplit[0]} ${dateTime}`;
    }
  } else if (!Number.isNaN(Number(date))) {
    date = Number(date);
  }

  const newDate = new Date(date);

  if (check && !isValidaDate(newDate)) {
    throw new Error(`A data ${date} informada não é válida.`);
  }

  return newDate;
}

/**
 * @param {String} string
 *
 * @returns {String}
 */
export function convertToTitleCase(string) {
  if (!string) {
    return '';
  }

  string = string.toString();

  return string.replace(/\w\S*/g, function replace(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

/**
 * @param {String} string
 *
 * @returns {String}
 */
export function convertToCamelCaseString(string) {
  return String(string)
    .toLowerCase()
    .replace(/^([A-Z])|[\s-_](\w)/g, (match, p1, p2) => {
      if (p2) return p2.toUpperCase();
      return p1.toLowerCase();
    });
}

/**
 * @param {*} obj
 *
 * @returns {Object|Boolean}
 */
export function convertToCamelCaseObject(obj) {
  if (typeof obj !== 'object') {
    return obj;
  }

  const newObj = {};

  Object.keys(obj).map(key => {
    newObj[convertToCamelCaseString(key)] = obj[key];

    return newObj;
  });

  return newObj;
}

/**
 * @param {String|Number} cpf
 *
 * @returns {Boolean}
 */
export function validateCpf(cpf) {
  cpf = String(cpf).replace(/[^\d]/gi, '');

  if (cpf.length !== 11) {
    return false;
  }

  for (let i = 0; i <= 9; i++) {
    if (cpf === String(i).repeat(11)) {
      return false;
    }
  }

  const calculate = mod => {
    let sum = 0;

    for (let i = 0; i <= mod - 2; i++) {
      sum += Number(cpf.charAt(i)) * (mod - i);
    }

    return String(sum % 11 < 2 ? 0 : 11 - (sum % 11));
  };

  if (calculate(10) !== cpf.charAt(9) || calculate(11) !== cpf.charAt(10)) {
    return false;
  }

  return true;
}

/**
 * @param {String|Number} cnpj
 *
 * @returns {Boolean}
 */
export function validateCnpj(cnpj) {
  cnpj = String(cnpj).replace(/\.|-|\/|\s/gi, '');

  if (cnpj.length !== 14) {
    return false;
  }

  for (let i = 0; i <= 14; i++) {
    if (cnpj === String(i).repeat(14)) {
      return false;
    }
  }

  const calculate = length => {
    let sum = 0;
    let position = length - 7;

    for (let i = length; i >= 1; i--) {
      sum += Number(cnpj.charAt(length - i)) * position--;

      if (position < 2) {
        position = 9;
      }
    }

    return String(sum % 11 < 2 ? 0 : 11 - (sum % 11));
  };

  if (calculate(12) !== cnpj.charAt(12) || calculate(13) !== cnpj.charAt(13)) {
    return false;
  }

  return true;
}

/**
 * @param {String|Number} value
 *
 * @returns {String}
 */
export function onlyNumber(value) {
  return String(value).replace(/[^\d]/gi, '');
}

/**
 * @param {String} value
 *
 * @returns {String}
 */
export function removeAccents(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f|\u00b4|\u0060|\u005e|\u007e]/g, '');
}

/**
 * @param {String} value
 *
 * @returns {Number}
 */
export function normalizeMoney(value) {
  return Number(String(value).replace(/[^0-9-]/g, '')) / 100;
}

/**
 * @param {Number} value
 *
 * @returns {String}
 */
export function formatMoney(value) {
  const formatter = global.Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formatter.format(value);
}

/**
 * @param {String} email
 * @param {Object} params
 *
 * @returns {String}
 */
export function getImageGravatar(email, params) {
  const md5 = createHashMd5(email);
  const query = params ? `?${stringify(params)}` : '';
  return `https://www.gravatar.com/avatar/${md5}${query}`;
}
