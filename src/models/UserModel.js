import Sequelize, { Model } from 'sequelize';
import Password from '../services/Password';

export default class UserModel extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
      },
      { sequelize, tableName: 'users' }
    );

    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await Password.hash(user.password);
      }
    });

    return this;
  }

  // static associate(models) {}

  // static findByEmail(email) {...}

  checkPassword(password) {
    return Password.verify(password, this.password_hash);
  }
}
