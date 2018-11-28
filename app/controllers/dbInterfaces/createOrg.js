const models = require('../../db/models');

module.exports = async (
  userId,
  baseId,
  orgName,
  subscriptionCode
) => {
  const org = await models.Organization.create({
    orgName: orgName,
    orgOwner: userId,
    baseId: baseId,
    subscriptionCode: subscriptionCode.toLowerCase()
  }).catch(err => console.error(err));

  return org.dataValues;
};
