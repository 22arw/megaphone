const models = require('../../db/models');

module.exports = async baseId => {
  console.log(`getBaseById: ${baseId}`);
  const base = await models.Base.findAll({
    where: {
      id: baseId
    }
  });

  return base[0].dataValues;
};
