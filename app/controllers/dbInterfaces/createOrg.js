const models = require('../../db/models');

const createOrganization = async (
  userId,
  baseId,
  orgName,
  subscriptionCode
) => {
  const org = await models.Organization.create({
    orgName: orgName,
    orgOwner: userId,
    baseId: baseId,
    subscriptionCode: subscriptionCode.toUpperCase()
  }).catch(err => console.error(err));

  return org.dataValues;
};

module.exports = createOrganization;
