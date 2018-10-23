const dbInterface = require('./dbInterfaces');

const createOrg = async (userId, baseId, orgName, subscriptionCode) => {
  const createOrgResponse = await dbInterface
    .createOrganization(userId, baseId, orgName, subscriptionCode)
    .catch(err => {
      console.error(err);
    });

  return createOrgResponse;
};

const orgController = {
  createOrg: createOrg
};

module.exports = orgController;
