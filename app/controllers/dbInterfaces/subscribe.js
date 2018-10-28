const models = require('../../db/models');

module.exports = async (orgId, phoneNumber) => {
  const subscription = await models.Subscription.create({
    orgId: orgId,
    phoneNumber: phoneNumber
  }).catch(err => console.error(err));

  return subscription.dataValues;
};
