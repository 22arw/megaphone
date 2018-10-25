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

  const orgManager = await models.OrganizationManager.create({
    userId: userId,
    orgId: org.dataValues.id
  }).catch(err => console.error(err));

  if (!org.dataValues.id || !orgManager.dataValues.userId) {
    console.error(`Attempted to create organization, received this:
    ${org}
    Attempted to create organization manager, received this:
    ${orgManager}`);
    return {
      error: 'There was an error creating the organization'
    };
  }

  return true;
};

module.exports = createOrganization;
