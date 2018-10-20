'use strict';
module.exports = (sequelize, DataTypes) => {
  const Subscription = sequelize.define('Subscription', {
    orgId: DataTypes.INTEGER,
    phoneNumber: DataTypes.STRING
  }, {});
  Subscription.associate = function(models) {
    // associations can be defined here
  };
  return Subscription;
};