'use strict';
module.exports = (sequelize, DataTypes) => {
  const OrganizationManager = sequelize.define('OrganizationManager', {
    userId: DataTypes.INTEGER,
    orgId: DataTypes.INTEGER
  }, {});
  OrganizationManager.associate = function(models) {
    // associations can be defined here
  };
  return OrganizationManager;
};