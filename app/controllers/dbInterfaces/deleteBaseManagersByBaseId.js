const models = require('../../db/models');

module.exports = async baseId => {
  const baseManager = await models.BaseManager.destroy({
    where: {
      baseId: baseId
    }
  });

  return baseManager;
};
