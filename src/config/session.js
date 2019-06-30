import app from './app';

/**
 * Generate hash
 *
 * @param {String} encoding
 */
export function generateHashByAppKey(encoding) {
  const binary = Buffer.from(app.key || 'vcw.sid').toString('hex');
  const name = Buffer.from(binary).toString(encoding || 'base64');

  return name;
}

// Secure cookie in production
const secure = process.env.NOD_ENV === 'production';

// Options for
// https://www.npmjs.com/package/express-session

export default {
  name: generateHashByAppKey('hex'),
  secret: generateHashByAppKey(),
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // expires in 1 day
  },
};
