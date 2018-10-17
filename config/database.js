const sequelizeLogColorizer = require('sequelize-log-syntax-colors');

module.exports = {
  development: {
    url: process.env.DEVELOPMENT_DATABASE_URL,
    dialect: 'postgres',
    protocol: 'postgres',
    logging: text => {
      console.log(sequelizeLogColorizer(text));
    }
  },
  test: {
    // TEST isn't currently configured and will fail if you attempt to use it like this.
    username: 'root',
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'mysql'
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    protocol: 'postgres'
  }
};
