const models = require('../../db/models');

module.exports = async orgId => {
  const org = await models.OrganizationManager.destroy({
    where: {
      orgId: orgId
    }
  }).catch(err => console.error(err));

  return org;
};
