const models = require('../../db/models');

module.exports = async () => {
  const bases = await models.Base.findAll().catch(err => console.error(err));
  return bases;
};
