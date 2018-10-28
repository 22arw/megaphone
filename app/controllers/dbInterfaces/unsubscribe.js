const models = require('../../db/models');

module.exports = async (orgId, phoneNumber) => {
  const subscription = await models.Subscription.destroy({
    where: {
      orgId: orgId,
      phoneNumber: phoneNumber
    }
  }).catch(err => console.error(err));

  return subscription === 1;
};
