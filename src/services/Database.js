import mongoose from 'mongoose';
import Sequelize from 'sequelize';

import config from '../config/database';
import * as models from '../models';

class Database {
  connectSequelize() {
    this.sequelize = new Sequelize(config);
    this._loadModelsSequelize();
  }

  connectMongoose() {
    const { MONGO_URL, MONGO_ENABLE } = process.env;

    if (MONGO_URL && String(MONGO_ENABLE) === 'true') {
      this.mongo = mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        useFindAndModify: true,
      });
    }
  }

  _loadModelsSequelize() {
    Object.values(models)
      .map(model => model.init(this.sequelize))
      .map(model => model.associate && model.associate(this.sequelize.models));
  }
}

export default new Database();
