const organization = (sequelize, DataTypes) => {
  const Organization = sequelize.define('organization', {
    organizationName: {
      type: DataTypes.STRING,
      validate: {
        notNull: true,
        notEmpty: true
      }
    },
    owner: {
      type: DataTypes.INTEGER,
      validate: {
        notNull: true,
        notEmpty: true
      }
    },
    subscriptionCode: {
      type: DataTypes.STRING,
      validate: {
        notNull: true,
        notEmpty: true
      }
    }
  });

  Organization.association = models => {
    // m:1 Bases
    Organization.belongsTo(models.Base);

    // n:m Users
    Organization.belongsToMany(models.User, {
      through: 'OrganizationManager'
    });
  };

  return Organization;
};

module.exports = organization;
