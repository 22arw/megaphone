const models = require('../../db/models');

module.exports = async (userId) => {
  const orgsManaged = await models.OrganizationManager.findAll({
    where: {
      userId: userId
    }
  });

  return orgsManaged.map(row => {
    return row.dataValues.orgId;
  });
}