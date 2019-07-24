module.exports = {
  development: {
    dialect: 'mysql',
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    migrationStorageTableName: 'migrations',
    define: {
      engine: 'InnoDB',
      timestamps: true,
      underscored: true,
      underscoredAll: true,
    },
  },
  production: {
    dialect: 'mysql',
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    migrationStorageTableName: 'migrations',
    define: {
      engine: 'InnoDB',
      timestamps: true,
      underscored: true,
      underscoredAll: true,
    },
  },
};
