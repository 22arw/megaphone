const dbInterface = require('./dbInterfaces');
const utils = require('../utils');

const createBase = async (
  basePhoneNumber,
  baseName,
  baseCode,
  bandwidthUserId,
  bandwidthApiToken,
  bandwidthApiSecret
) => {
  if (!utils.isValidPhoneNumber(basePhoneNumber)) {
    return new Error(
      'Not a valid phone number. Please make sure it is in the format: "+12345678909"'
    );
  }

  const isBasePhoneNumberUnique = await dbInterface
    .isBasePhoneNumberUnique(basePhoneNumber)
    .catch(err => console.error(err));

  if (!isBasePhoneNumberUnique) return new Error('Phone number not unique.');

  const isBaseCodeUnique = await dbInterface
    .isBaseCodeUnique(baseCode)
    .catch(err => console.error(err));

  if (!isBaseCodeUnique) return new Error('Base code is not unique.');

  const base = await dbInterface
    .createBase(
      basePhoneNumber,
      baseName,
      baseCode,
      bandwidthUserId,
      bandwidthApiToken,
      bandwidthApiSecret
    )
    .catch(err => console.error(err));

  if (baseCode !== base.baseCode) return new Error('Operation failed.');
  return base;
};

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
  createBase: createBase,
  createBaseManager: createBaseManager,
  deleteBaseManager: deleteBaseManager
};
