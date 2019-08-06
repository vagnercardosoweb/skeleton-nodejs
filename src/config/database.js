module.exports = {
  dialect: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  timezone: process.env.DB_TIMEZONE || 'America/Sao_Paulo',
  encoding: process.emit.DB_ENCODING || 'utf8',

  migrationStorageTableName: 'migrations',

  define: {
    engine: 'InnoDB',
    timestamps: true,
    underscored: true,
    underscoredAll: true,
    charset: 'utf8',
    dialectOptions: {
      collate: 'utf8_general_ci',
    },
  },

  pool: {
    min: 0,
    max: 10,
  },
};
