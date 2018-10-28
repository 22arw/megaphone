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

const deleteBaseManager = async (userId, baseId) => {
  const doesBaseExist = await dbInterface
    .doesBaseExist(baseId)
    .catch(err => console.error(err));

  if (!doesBaseExist) return new Error('No base exists with that code.');

  const isBaseManager = await dbInterface
    .isBaseManager(userId, baseId)
    .catch(err => console.error(err));

  if (!isBaseManager)
    return new Error('This user cannot perform this operation.');

  const deleteBaseManager = await dbInterface
    .deleteBaseManager(userId, baseId)
    .catch(err => console.error(err));

  return deleteBaseManager
    ? 'Base manager removed.'
    : new Error('Deleting the Base Manager failed.');
};

module.exports = {
  createBaseManager: createBaseManager,
  deleteBaseManager: deleteBaseManager
};
