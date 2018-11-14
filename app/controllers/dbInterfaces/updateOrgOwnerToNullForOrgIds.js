const models = require('../../db/models');

module.exports = async orgIds => {
  const org = await models.Organization.update(
    {
      orgOwner: null,
      subscriptionCode: null
    },
    {
      where: {
        id: orgIds
      }
    }
  );

  return org;
};
