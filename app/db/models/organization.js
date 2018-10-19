'use strict';
module.exports = (sequelize, DataTypes) => {
  const Organization = sequelize.define('Organization', {
    orgName: DataTypes.STRING,
    orgOwner: DataTypes.INTEGER,
    baseId: DataTypes.INTEGER,
    subscriptionCode: DataTypes.STRING
  }, {});
  Organization.associate = function(models) {
    // associations can be defined here
  };
  return Organization;
};