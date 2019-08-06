import mongoose from 'mongoose';
import Sequelize from 'sequelize';

import config from '../config/database';
import models from '../models';

class Database {
  connectSequelize() {
    try {
      this.sequelize = new Sequelize(config);
      this._afterConnectSequelize();
      this._loadModelsSequelize();
    } catch (err) {
      throw err;
    }
  }

  connectMongoose() {
    try {
      if (process.env.MONGO_URL) {
        this.mongo = mongoose.connect(process.env.MONGO_URL, {
          useNewUrlParser: true,
          useFindAndModify: true,
        });
      }
    } catch (err) {
      throw err;
    }
  }

  _loadModelsSequelize() {
    models
      .map(model => model.init(this.sequelize))
      .map(model => model.associate && model.associate(this.sequelize.models));
  }

  _afterConnectSequelize() {
    this.sequelize.afterConnect(async connection => {
      const { dialect, encoding, timezone } = config;

      if (dialect === 'mysql') {
        connection.query(`SET NAMES \`${encoding}\``);
        connection.query(`SET time_zone = \`${timezone}\``);
      } else if (dialect === 'pgsql') {
        connection.query(
          `SET client_encoding TO \`${encoding.toUpperCase()}\``
        );
        connection.query(`SET timezone TO \`${timezone}\``);
      }
    });
  }
}

export default new Database();
