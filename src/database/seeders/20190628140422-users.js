const bcrypt = require('bcryptjs');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const users = [];

    for (let i = 1; i <= 10; i++) {
      users.push({
        name: `Name ${i}`,
        email: `email${i}@gmail.com`,
        password_hash: bcrypt.hashSync(`password${i}`, 12),
        created_at: Sequelize.fn('NOW'),
      });
    }

    return Promise.all([
      queryInterface.bulkDelete('users', null, {}),
      queryInterface.bulkInsert('users', users, {}),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  },
};
