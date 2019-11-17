// eslint-disable-next-line no-unused-vars
import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken';
import configApp from '../config/app';

class Jwt {
  instance() {
    return jwt;
  }

  /**
   * @param {*} payload
   * @param {SignOptions} options
   *
   * @returns {Promise<string>}
   */
  encode(payload, options) {
    return new Promise((resolve, reject) => {
      try {
        resolve(
          jwt.sign(payload, configApp.key, {
            expiresIn: configApp.jwtExpiresIn,
            ...options,
          })
        );
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * @param {String} token
   * @param {VerifyOptions} options
   *
   * @returns {Promise<string | object>}
   */
  decode(token, options) {
    return new Promise((resolve, reject) => {
      try {
        resolve(jwt.verify(token, configApp.key, options));
      } catch (err) {
        reject(err);
      }
    });
  }
}

export default new Jwt();
