import Sequelize from 'sequelize';
import mongoose from 'mongoose';

import SequelizeConfig from '../config/database';

import User from '../models/User';

const env = process.env.NODE_ENV || 'development';
const models = [User];

class Database {
  constructor() {
    this.initSequelize();
    this.initMongoose();
  }

  initSequelize() {
    this.sequelize = new Sequelize(SequelizeConfig[env]);
    this.initSequelizeModels();
  }

  initSequelizeModels() {
    models
      .map(model => model.init(this.sequelize))
      .map(model => model.associate && model.associate(this.sequelize.models));
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
