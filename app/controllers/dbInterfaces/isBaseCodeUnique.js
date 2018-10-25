const models = require('../../db/models');

const isBaseCodeUnique = async baseCode => {
  const base = await models.Base.findAll({
    where: {
      baseCode: baseCode
    }
  }).catch(err => console.error(err));

  return !Array.isArray(base) || !base.length;
};

module.exports = isBaseCodeUnique;
