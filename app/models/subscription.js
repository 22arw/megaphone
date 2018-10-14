const subscription = (sequelize, DataTypes) => {
  const Subscription = sequelize.define('subscription', {
    phoneNumber: {
      type: DataTypes.STRING
    }
  });

  Subscription.association = models => {
    // m:1 Organization
    Subscription.belongsTo(models.Organization);
  };

  return Subscription;
};

module.exports = subscription;
