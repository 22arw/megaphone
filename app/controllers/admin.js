const dbInterface = require('./dbInterfaces');

const utils = require('../utils');

const createBaseManager = async (baseId, newBaseManagerEmail) => {
  if (!utils.isValidEmail(newBaseManagerEmail)) {
    return new Error('Not a valid email address');
  }

  const doesUserExist = await dbInterface
    .doesUserExist(newBaseManagerEmail)
    .catch(err => console.error(err));

  if (!doesUserExist) return new Error('User does not exist');

  const doesBaseExist = await dbInterface
    .doesBaseExist(baseId)
    .catch(err => console.error(err));

  if (!doesBaseExist) return new Error('No base exists with that code.');

  const user = await dbInterface
    .getUserByEmail(newBaseManagerEmail)
    .catch(err => console.error(err));

  const isBaseManager = await dbInterface
    .isBaseManager(user.id, baseId)
    .catch(err => console.error(err));

  if (isBaseManager) return new Error('This user is already a Base Manager');

  const baseManager = await dbInterface
    .createBaseManager(user.id, baseId)
    .catch(err => console.error(err));

  if (baseManager.userId !== user.id) {
    return new Error('Base Manager update failed.');
  }

  return baseManager;
};

const getAdminData = async () => {
  return await dbInterface.getAdminData().catch(err => console.error(err));
};

const adminController = {
  createBaseManager: createBaseManager,
  getAdminData: getAdminData
};

module.exports = adminController;
