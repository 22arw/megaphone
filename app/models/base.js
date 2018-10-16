const base = (sequelize, DataTypes) => {
  const Base = sequelize.define('base', {
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
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    baseCode: {
      type: DataTypes.STRING,
      unique: true,
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
