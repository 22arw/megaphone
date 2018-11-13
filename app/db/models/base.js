'use strict';

/**
 * psql allows multiple null values in unique rows. 
 * reference: https://www.postgresql.org/docs/8.2/ddl-constraints.html#AEN2058
 */

module.exports = (sequelize, DataTypes) => {
  const Base = sequelize.define(
    'Base',
    {
      basePhoneNumber: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true
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
        allowNull: true
      },
      bandwidthApiToken: {
        type: DataTypes.STRING,
        allowNull: true
      },
      bandwidthApiSecret: {
        type: DataTypes.STRING,
        allowNull: true
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
