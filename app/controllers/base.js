const dbInterface = require('./dbInterfaces');
const utils = require('../utils');

const createBase = async (
  basePhoneNumber,
  baseName,
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

  const base = await dbInterface
    .createBase(
      basePhoneNumber,
      baseName,
      bandwidthUserId,
      bandwidthApiToken,
      bandwidthApiSecret
    )
    .catch(err => console.error(err));

  if (basePhoneNumber !== base.basePhoneNumber)
    return new Error('Operation failed.');
  return base;
};

const getAllBases = async () => {
  const bases = dbInterface.getAllBases().catch(err => console.error(err));
  return bases.length !== 0 ? bases : new Error('There are no bases');
};

module.exports = {
  createBase: createBase,
  getAllBases: getAllBases
};
