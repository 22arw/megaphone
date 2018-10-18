'use strict';
module.exports = (sequelize, DataTypes) => {
  const base = sequelize.define('base', {
    basePhoneNumber: DataTypes.STRING,
    baseName: DataTypes.STRING,
    baseCode: DataTypes.STRING,
    bandwidthUserId: DataTypes.STRING,
    bandwidthApiToken: DataTypes.STRING,
    bandwidthApiSecret: DataTypes.STRING
  }, {});
  base.associate = function(models) {
    // associations can be defined here
  };
  return base;
};