const models = require('../../db/models');

module.exports = async (orgId, userId) => {
  const org = await models.OrganizationManager.destroy({
    where: {
      orgId: orgId,
      userId: userId
    }
  });

  return org;
};
