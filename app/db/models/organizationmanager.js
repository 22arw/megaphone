'use strict';
module.exports = (sequelize, DataTypes) => {
  const OrganizationManager = sequelize.define(
    'OrganizationManager',
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      orgId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      }
    },
    {}
  );
  OrganizationManager.associate = function(models) {
    // associations can be defined here
  };
  return OrganizationManager;
};
