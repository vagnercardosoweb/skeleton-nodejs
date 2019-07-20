import Sequelize, { Model } from 'sequelize';
import Password from '../lib/Password';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
      },
      { sequelize, modelName: 'users' }
    );

    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await Password.hash(user.password);
      }
    });

    return this;
  }

  // static associate(models) {}

  checkPassword(password) {
    return Password.verify(password, this.password_hash);
  }
}

export default User;
