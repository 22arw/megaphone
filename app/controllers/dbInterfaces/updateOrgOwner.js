const models = require('../../db/models');

module.exports = async (userId, orgId) => {
  const org = await models.Organization.update(
    {
      orgOwner: userId
    },
    {
      where: {
        id: orgId
      }
    }
  ).catch(err => console.error(err));

  return org[0];
};
