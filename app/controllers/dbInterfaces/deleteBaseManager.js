const models = require('../../db/models');

module.exports = async (userId, baseId) => {
  const baseManager = await models.BaseManager.destroy({
    where: {
      userId: userId,
      baseId: baseId
    }
  }).catch(err => console.error(err));

  return baseManager === 1;
};
