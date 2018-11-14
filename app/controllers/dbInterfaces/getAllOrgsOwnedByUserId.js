const models = require('../../db/models');

module.exports = async userId => {
  const orgs = await models.Organization.findAll({
    where: {
      orgOwner: userId
    }
  });

  return orgs.map(org => {
    return org.dataValues;
  });
};
