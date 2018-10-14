const organization = (sequelize, DataTypes) => {
  const Organization = sequelize.define('organization', {
    organizationName: {
      type: DataTypes.STRING
    },
    subscriptionCode: {
      type: DataTypes.STRING
    }
  });
  return Organization;
};

module.exports = organization;
