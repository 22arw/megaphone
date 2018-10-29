const models = require('../../db/models');

module.exports = async phoneNumber => {
  const subscriptions = await models.Subscription.findAll({
    where: {
      phoneNumber: phoneNumber
    }
  }).catch(err => console.error(err));

  return subscriptions.map(sub => {
    return sub.dataValues;
  });
};
