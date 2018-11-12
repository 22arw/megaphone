const models = require('../../db/models');

module.exports = async (userId) => {
  const orgsOwned = await models.Organization.findAll({
    where: {
      orgOwner: userId
    }
  });

  return orgsOwned.map(row => {
    return row.dataValues;
  });
}