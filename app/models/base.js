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

  Base.association = models => {
    // 1:m Organizations
    Base.hasMany(models.Organization);

    // n:m Users
    Base.belongsToMany(models.User, {
      through: 'BaseManager'
    });
  };

  return Base;
};

module.exports = base;
