'use strict';
module.exports = (sequelize, DataTypes) => {
  const Subscription = sequelize.define(
    'Subscription',
    {
      orgId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      phoneNumber: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      }
    },
    {}
  );
  Subscription.associate = function(models) {
    // associations can be defined here
  };
  return Subscription;
};
