const models = require('../../db/models');

module.exports = async (userId, orgId) => {
  const orgManager = await models.OrganizationManager.create({
    userId: userId,
    orgId: orgId
  }).catch(err => console.error(err));

  return orgManager.dataValues;
};
