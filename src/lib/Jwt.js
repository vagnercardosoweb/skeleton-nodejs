import jwt from 'jsonwebtoken';
import { app } from '../config';

class Jwt {
  constructor() {
    this.jwt = jwt;
    this.key = app.key || 'VCWebNetworks';
  }

  instance() {
    return this.jwt;
  }

  encode(payload, options) {
    return new Promise((resolve, reject) => {
      try {
        resolve(this.jwt.sign(payload, this.key, options));
      } catch (err) {
        reject(err);
      }
    });
  }

  decode(token, options) {
    return new Promise((resolve, reject) => {
      try {
        resolve(this.jwt.verify(token, this.key, options));
      } catch (err) {
        reject(err);
      }
    });
  }
}

export default new Jwt();
