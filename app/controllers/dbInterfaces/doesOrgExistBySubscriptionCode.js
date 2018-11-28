const models = require('../../db/models');

module.exports = async subscriptionCode => {
  console.log('subscriptionCode:', subscriptionCode);
  const org = await models.Organization.findAll({
    where: {
      subscriptionCode: subscriptionCode
    }
  });

  console.log('org:', org)

  return Array.isArray(org) && org.length === 1;
};
