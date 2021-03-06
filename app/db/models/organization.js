'use strict';
module.exports = (sequelize, DataTypes) => {
  const Organization = sequelize.define(
    'Organization',
    {
      orgName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      orgOwner: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      baseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      subscriptionCode: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    {}
  );
  Organization.associate = function(models) {
    // associations can be defined here
  };
  return Organization;
};
