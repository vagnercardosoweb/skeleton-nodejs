import 'dotenv/config';
import io from 'socket.io';
import http from 'http';
import helmet from 'helmet';
import express from 'express';
import * as Sentry from '@sentry/node';
import 'express-async-errors';

// Configs
import configView from './config/view';
import configSentry from './config/sentry';

// Services
import View from './services/View';
import Database from './services/Database';

// Middlewares
import AppMiddleware from './middlewares/AppMiddleware';
import SessionMiddleware from './middlewares/SessionMiddleware';
import HeaderMiddleware from './middlewares/HeaderMiddleware';
import MethodOverrideMiddleware from './middlewares/MethodOverrideMiddleware';
import RouterMiddleware from './middlewares/RouterMiddleware';
import SocketMiddleware from './middlewares/SocketMiddleware';
// import TokenMiddleware from './middlewares/TokenMiddleware';
import ErrorMiddleware from './middlewares/ErrorMiddleware';
import MorganMiddleware from './middlewares/MorganMiddleware';

// Routes
import routes from './routes';

class App {
  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = io(this.server);

    this.sentry();
    this.middlewares();
    this.services();
    this.routes();
    this.exception();
  }

  sentry() {
    Sentry.init(configSentry);
  }

  services() {
    if (configView.enable) {
      new View(this.app).init();
    }

    Database.connectSequelize();
    Database.connectMongoose();
  }

  middlewares() {
    if (process.env.NODE_ENV === 'production' && configSentry.dsn) {
      this.app.use(Sentry.Handlers.requestHandler({ serverName: true }));
    }

    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(MorganMiddleware);
    this.app.use(SessionMiddleware);
    this.app.use(AppMiddleware(this.app));
    this.app.use(HeaderMiddleware);
    this.app.use(MethodOverrideMiddleware);
    this.app.use(SocketMiddleware(this.io));
  }

  routes() {
    this.app.use(routes);
    this.app.use(RouterMiddleware);
  }

  exception() {
    this.app.use(ErrorMiddleware(this.app));
  }
}

export default new App().server;
