'use strict';
module.exports = (sequelize, DataTypes) => {
  const BaseManager = sequelize.define(
    'BaseManager',
    {
      baseId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
      }
    },
    {}
  );
  BaseManager.associate = function(models) {
    // associations can be defined here
  };
  return BaseManager;
};
