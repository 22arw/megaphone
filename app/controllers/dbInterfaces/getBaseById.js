const models = require('../../db/models');

module.exports = async baseId => {
  const base = await models.Base.findAll({
    where: {
      id: baseId
    }
  }).catch(err => console.error(err));

  return base[0].dataValues;
};
