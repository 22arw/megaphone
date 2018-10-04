const Sequelize = require('sequelize');
const DATABASE_URL = require('../../config/db');
let sequelize = '';

if (!process.env.DEV) {
  // We are in production
  sequelize = new Sequelize(DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    port: match[4],
    host: match[3],
    logging: true //false
  });
} else {
  // We are in development
  sequelize = new Sequelize(DATABASE_URL);
}

const models = {
  User: sequelize.import('./user')
};

Object.keys(models).forEach(key => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
