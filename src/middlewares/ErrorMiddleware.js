// eslint-disable-next-line no-unused-vars
import { Application } from 'express';
import Youch from 'youch';
import * as Sentry from '@sentry/node';

import configSentry from '../config/sentry';

/**
 * @param {Application} app
 */
export default app => {
  if (process.env.NODE_ENV === 'production' && configSentry.dsn) {
    app.use(Sentry.Handlers.errorHandler());
  }

  return async (err, req, res, next) => {
    res.statusCode = err.status || 500;

    if (process.env.NODE_ENV !== 'production') {
      const youch = new Youch(err, req);

      if (req.xhr || req.path.match(/^\/api\//i)) {
        return res.send(await youch.toJSON());
      }

      return res.send(await youch.toHTML());
    }

    return res.error({
      sentry: res.sentry,
      message: 'Internal Server Error.',
    });
  };
};
