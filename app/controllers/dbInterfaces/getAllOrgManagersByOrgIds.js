// requires a list of all the orgIds to look up in an array

const models = require('../../db/models');

module.exports = async orgIds => {
  const orgManagers = await models.OrganizationManager.findAll({
    where: {
      orgId: orgIds
    }
  });

  return orgManagers.map(orgManager => {
    return orgManager.dataValues;
  });
};
