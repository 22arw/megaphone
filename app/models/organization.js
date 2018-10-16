const organization = (sequelize, DataTypes) => {
  const Organization = sequelize.define('organization', {
    organizationName: {
      type: DataTypes.STRING
    },
    subscriptionCode: {
      type: DataTypes.STRING
    }
  });

  Organization.association = models => {
    // 1:m messages
    // Organization.hasMany(models.Message);

    // m:1 Bases
    // Organization.belongsTo(models.Base);

    // n:m Users
    Organization.belongsToMany(models.User, {
      through: 'OrganizationManager'
    });
  };

  return Organization;
};

module.exports = organization;
