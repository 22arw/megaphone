const dbInterface = require('./dbInterfaces');

const addOrgManager = async (userId, orgId, newOrgManagerEmail) => {
  const isAdmin = await dbInterface
    .isAdmin(userId)
    .catch(err => console.error(err));

  const isOrgOwner = await dbInterface
    .isOrgOwner(userId, orgId)
    .catch(err => console.error(err));

  if (!(isAdmin || isOrgOwner)) {
    return 'You cannot add managers to this organization.';
  }

  const doesOrgExist = await dbInterface
    .doesOrgExist(orgId)
    .catch(err => console.error(err));

  if (!doesOrgExist) {
    return 'That organization does not exist.';
  }

  const doesUserExist = await dbInterface
    .doesUserExist(newOrgManagerEmail)
    .catch(err => console.error(err));

  if (!doesUserExist) {
    return 'That user does not exist.';
  }

  const addOrgManagerResponse = await dbInterface
    .addOrgManager(orgId, newOrgManagerEmail)
    .catch(err => console.error(err));

  return addOrgManagerResponse;
};

const createOrg = async (userId, baseId, orgName, subscriptionCode) => {
  const isBaseManager = await dbInterface
    .isBaseManager(userId, baseId)
    .catch(err => console.error(err));
  const isAdmin = await dbInterface
    .isAdmin(userId)
    .catch(err => console.error(err));
  const doesBaseExist = dbInterface
    .doesBaseExist(baseId)
    .catch(err => console.error(err));

  if (!(doesBaseExist && (isBaseManager || isAdmin))) {
    return {
      error: 'You do not have permission to create this org under this base.'
    };
  }
  const isSubscriptionCodeUnique = await dbInterface
    .isSubscriptionCodeUnique(subscriptionCode)
    .catch(err => console.error(err));

  if (!isSubscriptionCodeUnique) {
    return {
      error:
        'That subscription code is already in use, please chose another one.'
    };
  }

  return await dbInterface
    .createOrganization(userId, baseId, orgName, subscriptionCode)
    .catch(err => console.error(err));
};

const isSubscriptionCodeUnique = async subscriptionCode => {
  return await dbInterface
    .isSubscriptionCodeUnique(subscriptionCode)
    .catch(err => console.error(err));
};

const orgController = {
  addOrgManager: addOrgManager,
  createOrg: createOrg,
  isSubscriptionCodeUnique: isSubscriptionCodeUnique
};

module.exports = orgController;
