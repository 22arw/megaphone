const models = require('../../db/models');

const isOrgOwner = async (userId, orgId) => {
  if (isNaN(orgId) || isNaN(userId)) {
    return false;
  }

  const org = await models.Organization.findAll({
    where: {
      id: orgId
    }
  }).catch(err => console.error(err));

  // console.log(` - - - - - -
  // org: ${JSON.stringify(org)}
  // - - - - - -`);

  if (!Array.isArray(org) || !org.length) {
    return false;
  }
  return org[0].dataValues.orgOwner === userId;
};

module.exports = isOrgOwner;
