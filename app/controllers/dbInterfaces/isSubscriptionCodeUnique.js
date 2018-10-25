const models = require('../../db/models');

const isSubscriptionCodeUnique = async subscriptionCode => {
  const subCode = await models.Organization.findAll({
    where: {
      subscriptionCode: subscriptionCode
    }
  });
  return !Array.isArray(subCode) || !subCode.length;
};

module.exports = isSubscriptionCodeUnique;
