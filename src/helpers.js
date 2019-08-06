import os from 'os';
import { promises as fs } from 'fs';
import crypto from 'crypto';
import config from './config/app';

export function existsOrError(value, err) {
  if (!value) throw err;
  if (Array.isArray(value) && value.length === 0) throw err;
  if (typeof value === 'string' && !value.trim()) throw err;
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
  if (valueA !== valueB) throw err;
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
