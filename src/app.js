// Loader environment
import 'dotenv/config';

// Global
import express from 'express';
import http from 'http';
import io from 'socket.io';
import Twig from 'twig';
import * as Sentry from '@sentry/node';
import { resolve } from 'path';
import helmet from 'helmet';

// Configs
import configView from './config/view';
import configSentry from './config/sentry';

// Middleware
import corsMiddleware from './middlewares/cors';
import methodOverrideMiddleware from './middlewares/methodOverride';
import envMiddleware from './middlewares/env';
import errorRouter from './middlewares/errorRouter';

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

    if (configView.enable) {
      this.initTwig();
    }

    this.initMiddleware();
    this.initStatic();
    this.initRoutes();
    this.listen();
  }

  initSentry() {
    if (configSentry.dsn) {
      Sentry.init(configSentry);
      this.app.use(Sentry.Handlers.requestHandler());
      this.app.use(Sentry.Handlers.errorHandler());
    }
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
    this.app.use(envMiddleware);
    this.app.use(corsMiddleware);
    this.app.use(methodOverrideMiddleware);
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
  }

  initStatic() {
    this.app.use(express.static(resolve(__dirname, '..', 'public')));
    this.app.use(
      '/uploads',
      express.static(resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  initRoutes() {
    this.app.use(webRoutes);
    this.app.use('/api', apiRoutes);
    this.app.use(errorRouter);
  }

  initTwig() {
    const { path, engine, functions, filters } = configView;

    this.app.set('views', path);
    this.app.set('view engine', engine);

    // Custom functions and filters
    [functions, filters].map(item => {
      Object.keys(item).map(key => {
        if (functions.hasOwnProperty(key)) {
          Twig.extendFunction(key, item[key]);
        }

        if (filters.hasOwnProperty(key)) {
          Twig.extendFilter(key, item[key]);
        }
      });
    });
  }

  listen() {
    this.server.listen(process.env.PORT || 3333);
  }
}

module.exports = new App();
