// eslint-disable-next-line no-unused-vars
import express, { Application } from 'express';
import { ValidationError } from 'yup';

import configApp from '../config/app';

/**
 * @param {Application} app
 */
export default app => {
  app.set('trust proxy', true);
  app.use(express.static(configApp.path.public));
  app.use('/uploads', express.static(configApp.path.uploads));

  const dev = process.env.NODE_ENV === 'development';

  return (req, res, next) => {
    res.error = (err, status) => {
      // eslint-disable-next-line no-console
      if (dev) console.log('ERROR: ', err);

      if (err.sqlMessage !== undefined && !dev) {
        err.message = 'Problema interno! Favor contate os desenvolvedores.';
      }

      const name = err.name || null;
      let message = err.message || err;
      let validators = null;

      if (err instanceof ValidationError && err.inner) {
        message = err.errors[Math.floor(Math.random() * err.errors.length)];
        validators = err.inner;
      }

      status = status || err.status || 400;
      res
        .status(status)
        .json({ error: true, name, status, message, validators });

      return res;
    };

    res.success = (data, status) => {
      status = status || res.statusCode || 200;
      res.status(status).json({ error: false, status, ...data });

      return res;
    };

    next();
  };
};
