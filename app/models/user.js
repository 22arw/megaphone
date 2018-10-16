const user = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true,
        notNull: true,
        notEmpty: true
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notNull: true,
        notEmpty: true
      }
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  User.associate = models => {
    // 1:m messages
    // User.hasMany(models.Message);

    // n:m Organizations
    User.belongsToMany(models.Organization, {
      through: 'OrganizationManager'
    });

    // n:m Bases
    User.belongsToMany(models.Base, {
      through: 'BaseManager'
    });
  };

  return User;
};

module.exports = user;
