const models = require('../../db/models');

module.exports = async (orgId, orgName, subscriptionCode) => {
  const org = await models.Organization.update(
    {
      orgName: orgName,
      subscriptionCode: subscriptionCode
    },
    {
      where: {
        id: orgId
      }
    }
  ).catch(err => console.error(err));

  return org[0]; //This is dangerous
};
