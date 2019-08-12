// Loader environment
import 'dotenv/config';

// Global
import http from 'http';
import Youch from 'youch';
import helmet from 'helmet';
import express from 'express';
import socketIo from 'socket.io';
import { resolve } from 'path';
import * as Sentry from '@sentry/node';
import 'express-async-errors';

// Config
import config from './config';

// Libs
import View from './lib/View';
import Database from './lib/Database';

// Middleware custom
import AppMiddleware from './middlewares/AppMiddleware';
import SessionMiddleware from './middlewares/SessionMiddleware';
import HeaderMiddleware from './middlewares/HeaderMiddleware';
import MethodOverrideMiddleware from './middlewares/MethodOverrideMiddleware';
import RouterMiddleware from './middlewares/RouterMiddleware';
import SocketMiddleware from './middlewares/SocketMiddleware';

// Routes
import routes from './routes';

class App {
  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.socketIo = socketIo(this.server);
  }

  init() {
    this.initSentry();
    this.initMiddleware();
    this.initDatabase();
    this.initStatic();
    this.initView();
    this.initRoutes();
    this.initException();
    this.run();
  }

  initSentry() {
    Sentry.init(config.sentry);
  }

  initMiddleware() {
    this.app.use(Sentry.Handlers.requestHandler());
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(AppMiddleware);
    this.app.use(SessionMiddleware);
    this.app.use(HeaderMiddleware);
    this.app.use(MethodOverrideMiddleware);
    this.app.use(SocketMiddleware(this.socketIo));
  }

  initDatabase() {
    Database.connectSequelize();
    // Database.connectMongoose();
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
      new View(this.app).init();
    }
  }

  initRoutes() {
    this.app.use(routes);
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
