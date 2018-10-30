const models = require('../../db/models');

module.exports = async orgId => {
  const subscriptions = await models.Subscription.findAll({
    where: {
      orgId: orgId
    }
  }).catch(err => console.error(err));

  return subscriptions.map(subscriber => {
    return subscriber.dataValues.phoneNumber;
  });
};
