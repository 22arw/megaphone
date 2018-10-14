const base = (sequelize, DataTypes) => {
  const Base = sequelize.define('base', {
    phoneNumber: {
      type: DataTypes.STRING,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      unique: true
    },
    baseCode: {
      type: DataTypes.STRING,
      unique: true
    },
    bandwidthUserId: {
      type: DataTypes.STRING
    },
    bandwidthApiToken: {
      type: DataTypes.STRING
    },
    bandwidthApiSecret: {
      type: DataTypes.STRING
    }
  });

  return Base;
};

module.exports = base;
