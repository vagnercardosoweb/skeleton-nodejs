// Loader environment
import 'dotenv/config';

// Global
import express from 'express';
import http from 'http';
import io from 'socket.io';
import * as Sentry from '@sentry/node';
import Youch from 'youch';
import helmet from 'helmet';
import { resolve } from 'path';

// Config
import * as config from './config';

// Libs
import View from './lib/View';

// Middleware custom
import AppMiddleware from './middlewares/AppMiddleware';
import SessionMiddleware from './middlewares/SessionMiddleware';
import HeaderMiddleware from './middlewares/HeaderMiddleware';
import MethodOverrideMiddleware from './middlewares/MethodOverrideMiddleware';
import RouterMiddleware from './middlewares/RouterMiddleware';

// Routes
import webRoutes from './routes/web';
import apiRoutes from './routes/api';

// Connection database
import './database';

class App {
  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
  }

  init() {
    this.initSentry();
    this.initSocketIo();
    this.initMiddleware();
    this.initStatic();
    this.initView();
    this.initRoutes();
    this.initException();
    this.run();
  }

  initSentry() {
    Sentry.init(config.sentry);
  }

  initSocketIo() {
    this.io = io(this.server);

    this.app.use((req, res, next) => {
      req.io = this.io;
      next();
    });
  }

  initMiddleware() {
    this.app.use(helmet());
    this.app.use(Sentry.Handlers.requestHandler());
    this.app.use(AppMiddleware);
    this.app.use(SessionMiddleware);
    this.app.use(HeaderMiddleware);
    this.app.use(MethodOverrideMiddleware);
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  initStatic() {
    this.app.use(express.static(resolve(__dirname, '..', 'public')));
    this.app.use(
      '/uploads',
      express.static(resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  initView() {
    if (config.view.enable) {
      const view = new View(this.app);

      view.init();
    }
  }

  initRoutes() {
    this.app.use(webRoutes);
    this.app.use('/api', apiRoutes);
    this.app.use(RouterMiddleware);
  }

  initException() {
    if (process.env.NODE_ENV === 'production') {
      this.app.use(Sentry.Handlers.errorHandler());
    }

    this.app.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV !== 'production') {
        const youch = new Youch(err, req);

        if (req.xhr || req.path.match(/^\/api\//i)) {
          return res.send(await youch.toJSON());
        }

        return res.send(await youch.toHTML());
      }

      return res.status(err.status || 500).json({
        error: true,
        message: 'Internal Server Error.',
        sentry: res.sentry,
      });
    });
  }

  run() {
    this.server.listen(process.env.PORT || 3333);
  }
}

export default new App();
