import os from 'os';
import { promises as fs } from 'fs';
import crypto from 'crypto';
import config from './config/app';

export function existsOrError(value, err) {
  if (!value) throw new Error(err);
  if (Array.isArray(value) && value.length === 0) throw new Error(err);
  if (typeof value === 'string' && !value.trim()) throw new Error(err);
}

export function notExistsOrError(value, err) {
  try {
    existsOrError(value, err);
  } catch (err) {
    return;
  }

  throw err;
}

export function equalsOrError(valueA, valueB, err) {
  if (valueA !== valueB) throw new Error(err);
}

export function uuid(a) {
  return a
    ? (a ^ ((Math.random() * 16) >> (a / 4))).toString(16)
    : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuid);
}

export async function createTmpFile(data, extension) {
  if (!data || !extension) {
    throw new Error('createTmpFile: arguments invalids.');
  }

  extension = extension.replace('.', '');
  const filePath = `${os.tmpdir()}/${uuid()}-${Date.now()}.${extension}`;
  await fs.writeFile(`${filePath}`, data);

  return filePath;
}

export function createHash(value, algorithm = 'sha256', encoding = 'hex') {
  if (typeof value === 'string' && value.length > 0) {
    return crypto
      .createHmac(algorithm, config.key)
      .update(String(value))
      .digest(encoding);
  }

  return false;
}

export function createHashMd5(value) {
  if (typeof value === 'string' && value.length > 0) {
    return crypto
      .createHash('md5')
      .update(String(value))
      .digest('hex');
  }

  return false;
}

export function createRandomBytes(length) {
  return new Promise((resolve, reject) => {
    crypto.randomBytes((length || 16) / 2, (err, hash) => {
      if (err) return reject(err);

      return resolve(hash.toString('hex'));
    });
  });
}

export function createRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min)) + min;
}

export function createRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function createDateInstance(date) {
  date = date || Date.now();

  if (date instanceof Date) {
    date = date.getTime();
    // eslint-disable-next-line no-restricted-globals
  } else if (isNaN(Number(date)) && date.trim()) {
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
    // eslint-disable-next-line no-restricted-globals
  } else if (!isNaN(Number(date))) {
    date = Number(date);
  }

  return new Date(date);
}

export function convertToCamelCaseString(string) {
  return String(string)
    .toLowerCase()
    .replace(/^([A-Z])|[\s-_](\w)/g, (match, p1, p2) => {
      if (p2) return p2.toUpperCase();
      return p1.toLowerCase();
    });
}

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
