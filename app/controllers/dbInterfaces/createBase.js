const models = require('../../db/models');

module.exports = async (
  basePhoneNumber,
  baseName,
  bandwidthUserId,
  bandwidthApiToken,
  bandwidthApiSecret
) => {
  const base = await models.Base.create({
    basePhoneNumber: basePhoneNumber,
    baseName: baseName,
    bandwidthUserId: bandwidthUserId,
    bandwidthApiToken: bandwidthApiToken,
    bandwidthApiSecret: bandwidthApiSecret
  }).catch(err => console.error(err));

  return base.dataValues;
};
