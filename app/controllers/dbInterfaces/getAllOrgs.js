const models = require('../../db/models');

module.exports = async () => {
  const orgs = await models.Organization.findAll();

  return orgs.map(row => {
    return row.dataValues;
  });
}