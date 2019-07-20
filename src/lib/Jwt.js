import jwt from 'jsonwebtoken';
import config from '../config/app';

class Jwt {
  instance() {
    return jwt;
  }

  encode(payload, options) {
    return new Promise((resolve, reject) => {
      try {
        resolve(jwt.sign(payload, config.key, options));
      } catch (err) {
        reject(err);
      }
    });
  }

  decode(token, options) {
    return new Promise((resolve, reject) => {
      try {
        resolve(jwt.verify(token, config.key, options));
      } catch (err) {
        reject(err);
      }
    });
  }
}

export default new Jwt();
