import crypto from 'crypto';
import config from '../config/app';

class Helper {
  /**
   * Create HASH
   *
   * @param {String} string
   * @param {String} algorithm
   * @param {String} encoding hex | base64
   *
   * @returns {String|Boolean}
   */
  hash(value, algorithm = 'sha256', encoding = 'hex') {
    if (typeof value === 'string' && value.length > 0) {
      return crypto
        .createHmac(algorithm, config.key)
        .update(String(value))
        .digest(encoding);
    }

    return false;
  }

  /**
   * Create MD5
   *
   * @param {String} value
   *
   * @returns {String|Boolean}
   */
  md5(value) {
    if (typeof value === 'string' && value.length > 0) {
      return crypto
        .createHash('md5')
        .update(value)
        .digest('hex');
    }

    return false;
  }
}

export default new Helper();
