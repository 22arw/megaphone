const models = require('../../db/models');
const canCreateOrgInterface = require('./canCreateOrganization');
const subscriptionCodeIsUniqueInterface = require('./subscriptionCodeIsUnique');

const createOrganization = async (
  userId,
  baseId,
  orgName,
  subscriptionCode
) => {
  const canCreateOrg = await canCreateOrgInterface(userId, baseId).catch(
    err => {
      console.error(err);
    }
  );
  if (!canCreateOrg) {
    return {
      error: 'You do not have permission to create this org under this base.'
    };
  }

  const subscriptionCodeIsUnique = await subscriptionCodeIsUniqueInterface(
    subscriptionCode
  ).catch(err => {
    console.error(err);
  });
  if (!subscriptionCodeIsUnique) {
    return {
      error:
        'That subscription code is already in use, please chose another one.'
    };
  }

  const org = await models.Organization.create({
    orgName: orgName,
    orgOwner: userId,
    baseId: baseId,
    subscriptionCode: subscriptionCode
  }).catch(err => {
    console.error(err);
  });

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
