const models = require('../../db/models');

const isBaseNameUnique = async baseName => {
  const base = await models.Base.findAll({
    where: {
      baseName: baseName
    }
  }).catch(err => console.error(err));

  return !Array.isArray(base) || !base.length;
};

module.exports = isBaseNameUnique;
