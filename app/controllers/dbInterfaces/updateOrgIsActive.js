const models = require('../../db/models');

module.exports = async (orgId, isActive) => {
  const org = await models.Organization.update(
    {
      isActive: isActive
    },
    {
      where: {
        id: orgId
      }
    }
  ).catch(err => console.error(err));

  return org[0];
};
