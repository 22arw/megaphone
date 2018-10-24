const models = require('../../db/models');

const isBaseManager = async (userId, baseId) => {
  if (isNaN(baseId)) {
    return false;
  }

  const baseManager = await models.BaseManager.findAll({
    where: {
      userId: userId,
      orgId: orgId
    }
  }).catch(err => console.error(err));

  // console.log(` - - - - - -
  // baseManager: ${JSON.stringify(baseManager)}
  // - - - - - -`);

  return Array.isArray(baseManager) && baseManager.length === 1;
};

module.exports = isBaseManager;
