const models = require('../../db/models');

module.exports = async baseIds => {
  const baseManagers = await models.BaseManager.findAll({
    where: {
      baseId: baseIds
    }
  }).catch(err => console.error(err));

  return baseManagers.map(baseManager => {
    return baseManager.dataValues;
  });
};
