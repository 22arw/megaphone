const models = require('../../db/models');

module.exports = async (orgId) => {
  const subscription = await models.Subscription.destroy({
    where: {
      orgId: orgId
    }
  });

  return subscription;
};
