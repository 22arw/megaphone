const models = require('../../db/models');

const doesOrgExist = async orgId => {
  if (isNaN(orgId)) {
    return false;
  }

  const org = await models.Organization.findAll({
    where: {
      id: orgId
    }
  }).catch(err => console.error(err));

  return Array.isArray(org) && org.length === 1;
};

module.exports = doesOrgExist;
