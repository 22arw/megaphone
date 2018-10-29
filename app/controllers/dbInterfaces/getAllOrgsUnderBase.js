const models = require('../../db/models');

module.exports = async baseId => {
  const orgs = await models.Organization.findAll({
    where: {
      baseId: baseId
    }
  }).catch(err => console.error(err));

  return orgs.map(org => {
    return org.dataValues;
  });
};
