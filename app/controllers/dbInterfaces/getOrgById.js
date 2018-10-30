const models = require('../../db/models');

module.exports = async orgId => {
  const org = await models.Organization.findAll({
    where: {
      id: orgId
    }
  }).catch(err => console.error(err));

  return org[0].dataValues;
};
