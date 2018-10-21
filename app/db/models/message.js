'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define(
    'Message',
    {
      orgId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      }
    },
    {}
  );
  Message.associate = function(models) {
    // associations can be defined here
  };
  return Message;
};
