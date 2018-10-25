const models = require('../../db/models');

const isSubscribed = async (phoneNumber, orgId) => {
  if (isNaN(orgId)) {
    return false;
  }

  const subscription = await models.Subscription.findAll({
    where: {
      phoneNumber: phoneNumber,
      orgId: orgId
    }
  }).catch(err => console.error(err));

  return Array.isArray(subscription) && subscription.length === 1;
};

module.exports = isSubscribed;
