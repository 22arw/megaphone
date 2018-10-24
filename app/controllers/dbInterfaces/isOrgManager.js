const models = require('../../db/models');

const isOrgManager = async (userId, orgId) => {
  if (isNaN(orgId)) {
    return false;
  }

  const orgManager = await models.OrganizationManager.findAll({
    where: {
      userId: userId,
      orgId: orgId
    }
  }).catch(err => console.error(err));

  // console.log(` - - - - - -
  // orgManager: ${JSON.stringify(orgManager)}
  // - - - - - -`);

  return Array.isArray(orgManager) && orgManager.length === 1;
};

module.exports = isOrgManager;
