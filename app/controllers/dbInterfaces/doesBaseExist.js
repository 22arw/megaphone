const models = require('../../db/models');

const doesBaseExist = async baseId => {
  if (isNaN(baseId)) {
    return false;
  }

  const base = await models.Base.findAll({
    where: {
      id: baseId,
      isActive: true
    }
  }).catch(err => console.error(err));

  return Array.isArray(base) && base.length === 1 && base[0].isActive;
};

module.exports = doesBaseExist;
