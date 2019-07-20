import Sequelize from 'sequelize';
import mongoose from 'mongoose';

import models from '../models';
import config from '../config';

const env = process.env.NODE_ENV || 'development';

class Database {
  initSequelize() {
    try {
      this.sequelize = new Sequelize(config.database[env]);

      models
        .map(model => model.init(this.sequelize))
        .map(
          model => model.associate && model.associate(this.sequelize.models)
        );
    } catch (err) {
      throw err;
    }
  }

  initMongoose() {
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
}

export default new Database();
