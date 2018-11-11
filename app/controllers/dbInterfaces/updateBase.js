const models = require('../../db/models');

module.exports = async (
  baseId,
  basePhoneNumber,
  baseName,
  bandwidthUserId,
  bandwidthApiToken,
  bandwidthApiSecret
) => {
  const base = await models.Base.update(
    {
      baseName: baseName,
      basePhoneNumber: basePhoneNumber,
      bandwidthUserId: bandwidthUserId,
      bandwidthApiToken: bandwidthApiToken,
      bandwidthApiSecret: bandwidthApiSecret
    },
    {
      where: {
        id: baseId
      }
    }
  );

  return base[0];
};
