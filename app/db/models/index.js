'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const config = require(__dirname + '/../../../config/database.js');
const db = {};

let sequelize;

switch (process.env.NODE_ENV) {
  case 'production':
    sequelize = new Sequelize(config.production.url, config.production);
    break;
  case 'development':
    sequelize = new Sequelize(config.development.url, config.development);
    break;
  case 'test':
    sequelize = new Sequelize(config.test.url, config.test);
    break;
  default:
    throw new Error(
      `Database configuration error. Please be sure config/database.js is set up properly for ${
        process.env.NODE_ENV
      }.`
    );
}

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    );
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
