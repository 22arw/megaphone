const models = require('../../db/models');

const isSubscriptionCodeUnique = async subscriptionCode => {
  const subCode = await models.Organization.findAll({
    where: {
      subscriptionCode: subscriptionCode.toUpperCase()
    }
  }).catch(err => console.error(err));

  return !Array.isArray(subCode) || !subCode.length;
};

module.exports = isSubscriptionCodeUnique;
