import Sequelize from 'sequelize';
import mongoose from 'mongoose';

import { database } from '../config';

import User from '../models/User';

const models = [User];

class Database {
  constructor() {
    this.initSequelize();
    this.initMongoose();
  }

  initSequelize() {
    const env = process.env.NODE_ENV || 'development';

    this.sequelize = new Sequelize(database[env]);

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
