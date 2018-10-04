const Sequelize = require('sequelize');
const DATABASE_URL = require('../../config/db');

const sequelize = new Sequelize(DATABASE_URL);

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
