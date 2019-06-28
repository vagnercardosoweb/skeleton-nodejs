module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'users',
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        password_hash: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        created_at: {
          type: Sequelize.DATE,
          default: Sequelize.NOW,
        },
        updated_at: {
          type: Sequelize.DATE,
        },
      },
      {
        engine: 'InnoDB',
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  },

  down: queryInterface => {
    return queryInterface.dropTable('users');
  },
};
