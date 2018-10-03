const Sequelize = require('sequelize');

const sequelize = new Sequelize('megaphone', 'kevinfalting', '', {
  dialect: 'postgres'
});

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
