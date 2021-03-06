const models = require('../../db/models');

const isBaseManager = async (userId, baseId) => {
  if (isNaN(baseId) || isNaN(userId)) {
    return false;
  }

  const baseManager = await models.BaseManager.findAll({
    where: {
      userId: userId,
      baseId: baseId
    }
  }).catch(err => console.error(err));

  return Array.isArray(baseManager) && baseManager.length === 1;
};

module.exports = isBaseManager;
