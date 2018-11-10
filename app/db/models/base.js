'use strict';
module.exports = (sequelize, DataTypes) => {
  const Base = sequelize.define(
    'Base',
    {
      basePhoneNumber: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      baseName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      bandwidthUserId: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      bandwidthApiToken: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      bandwidthApiSecret: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    {}
  );
  Base.associate = function(models) {
    // associations can be defined here
  };
  return Base;
};
