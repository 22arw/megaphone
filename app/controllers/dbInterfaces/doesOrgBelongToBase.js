const models = require('../../db/models');

module.exports = async (orgId, baseId) => {
  const org = await models.Organization.findAll({
    where: {
      id: orgId,
      baseId: baseId
    }
  }).catch(err => console.error(err));

  return Array.isArray(org) && org.length === 1;
};
