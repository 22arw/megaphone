const Sequelize = require('sequelize');
const DATABASE_URL = require('../../config/db');
let sequelize = '';

if (!process.env.DEV) {
  // We are in production
  console.log('Running the production version of the database connection!');
  sequelize = new Sequelize(DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: true //false
  });
} else {
  // We are in development
  console.log('Running the development version of the database connection!');
  sequelize = new Sequelize(DATABASE_URL);
}

const models = {
  User: sequelize.import('./user'),
  Base: sequelize.import('./base'),
  Organization: sequelize.import('./organization')
  // Subscription: sequelize.import('./subscription'),
  // Message: sequelize.import('./message')
};

Object.keys(models).forEach(key => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;