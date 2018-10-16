const base = (sequelize, DataTypes) => {
  const Base = sequelize.define('base', {
    basePhoneNumber: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        notNull: true,
        notEmpty: true
      }
    },
    baseName: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        notNull: true,
        notEmpty: true
      }
    },
    baseCode: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        notNull: true,
        notEmpty: true
      }
    },
    bandwidthUserId: {
      type: DataTypes.STRING,
      validate: {
        notNull: true,
        notEmpty: true
      }
    },
    bandwidthApiToken: {
      type: DataTypes.STRING,
      validate: {
        notNull: true,
        notEmpty: true
      }
    },
    bandwidthApiSecret: {
      type: DataTypes.STRING,
      validate: {
        notNull: true,
        notEmpty: true
      }
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
