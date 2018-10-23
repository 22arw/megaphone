const dbInterface = require('./dbInterfaces');

const addOrgManager = async (userId, orgId, newOrgManagerEmail) => {
  const addOrgManagerResponse = await dbInterface
    .addOrgManager(userId, orgId, newOrgManagerEmail)
    .catch(err => console.error(err));

  return addOrgManagerResponse;
};

const createOrg = async (userId, baseId, orgName, subscriptionCode) => {
  const createOrgResponse = await dbInterface
    .createOrganization(userId, baseId, orgName, subscriptionCode)
    .catch(err => console.error(err));

  return createOrgResponse;
};

const orgController = {
  addOrgManager: addOrgManager,
  createOrg: createOrg
};

module.exports = orgController;
