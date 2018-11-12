const models = require('../../db/models');

module.exports = async orgId => {
  const orgs = await models.Organization.findAll({
    where: {
      id: orgId
    }
  }).catch(err => console.error(err));

  return orgs.map(org => {
    return org.dataValues;
  });
};
