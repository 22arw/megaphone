const subscription = (sequelize, DataTypes) => {
  const Subscription = sequelize.define('subscription', {
    phoneNumber: {
      type: DataTypes.STRING
    }
  });
  return Subscription;
};

module.exports = subscription;
