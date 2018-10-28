const models = require('../../db/models');

module.exports = async baseCode => {
  const base = await models.Base.findAll({
    where: {
      baseCode: baseCode
    }
  }).catch(err => console.error(err));

  return base[0].dataValues;
};
