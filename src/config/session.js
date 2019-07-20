import Helper from '../lib/Helper';

// Options for
// https://www.npmjs.com/package/express-session

export default {
  name: `sess_${Helper.hash('name')}`,
  secret: `secret_${Helper.hash('secret')}`,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NOD_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // expires in 1 day
  },
};
