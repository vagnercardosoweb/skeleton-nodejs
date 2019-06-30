import crypto from 'crypto';
import app from './app';

/**
 * Create hash secret and name
 *
 * @param {String} encoding
 */
function createHash(encoding) {
  return crypto.createHmac('sha256', app.key).digest(encoding || 'hex');
}

// Secure cookie in production
const secure = process.env.NOD_ENV === 'production';

// Options for
// https://www.npmjs.com/package/express-session

export default {
  name: `sess_${createHash()}`,
  secret: `secret_${createHash()}`,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // expires in 1 day
  },
};
