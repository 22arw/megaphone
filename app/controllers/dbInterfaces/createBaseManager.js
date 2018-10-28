const models = require('../../db/models');

module.exports = async (userId, baseId) => {
  const baseManager = await models.BaseManager.create({
    userId: userId,
    baseId: baseId
  }).catch(err => console.error(err));

  return baseManager.dataValues;
};
