'use strict';
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
          notEmpty: true
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    {
      hooks: {
        afterValidate: async user => {
          if (user.password) {
            user.password = await bcrypt.hash(
              user.password,
              Number(process.env.SALT_ROUNDS)
            );
          }
        }
      }
    }
  );
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
