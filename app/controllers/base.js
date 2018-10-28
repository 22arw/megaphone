const dbInterface = require('./dbInterfaces');

const createBaseManager = async (userId, baseCode) => {
  const doesBaseExist = await dbInterface
    .doesBaseExistByBaseCode(baseCode)
    .catch(err => console.error(err));

  if (!doesBaseExist) return new Error('No base exists with that code.');

  const base = await dbInterface
    .getBaseByBaseCode(baseCode)
    .catch(err => console.err(err));

  const isBaseManager = await dbInterface
    .isBaseManager(userId, base.id)
    .catch(err => console.error(err));

  if (isBaseManager) return new Error('This user is already a Base Manager');

  const baseManager = await dbInterface
    .createBaseManager(userId, base.id)
    .catch(err => console.error(err));

  if (baseManager.userId !== userId) {
    return new Error('Base Manager update failed.');
  }

  return baseManager;
};

module.exports = {
  createBaseManager: createBaseManager
};
