const models = require('../../db/models');

const getAllDataAssociatedWithUser = async userId => {
  // Collect data from User table
  const userData = await models.User.findAll({
    where: {
      id: userId
    }
  }).catch(err => console.error(err));

  // Collect data from BaseManager table
  const baseManagerData = await models.BaseManager.findAll({
    where: {
      userId: userId
    }
  }).catch(err => console.error(err));

  // Collect data from OrganizationManager table
  const organizationManagerData = await models.OrganizationManager.findAll({
    where: {
      userId: userId
    }
  }).catch(err => console.error(err));

  // Collect data from Organization table that the user manages
  const organizationsManagedIds = organizationManagerData.map(org => {
    return Number(org.orgId);
  });

  const organizationData = await models.Organization.findAll({
    where: {
      id: organizationsManagedIds
    }
  }).catch(err => console.error(err));

  // Collect data from what Bases these organizations are a part of AND
  // Collect data from Base table that the user manages or has organizations that they are a part of
  const organizationsBaseIds = organizationData.map(org => {
    return Number(org.baseId);
  });
  const baseIds = baseManagerData.map(base => {
    return Number(base.baseId);
  });

  const baseData = await models.Base.findAll({
    where: {
      id: [...new Set(baseIds.concat(organizationsBaseIds))]
    }
  }).catch(err => console.error(err));

  // Collect the number of subscribers for each organization the user manages
  const organizationSubscribers = await models.Subscription.findAll({
    where: {
      orgId: organizationsManagedIds
    }
  }).catch(err => console.error(err));

  let orgSubers = organizationSubscribers;
  let subscribersPerOrganization = [];
  for (let i = 0; i < orgSubers.length; i++) {
    let accum = 0;
    let currentOrgId = orgSubers[i].orgId;
    for (let j = 0; j < orgSubers.length; j++) {
      accum = currentOrgId === orgSubers[j].orgId ? ++accum : accum;
    }
    orgSubers = orgSubers.filter(e => e.orgId !== currentOrgId);
    subscribersPerOrganization.push({
      orgId: currentOrgId,
      subscribers: accum
    });
  }

  // TODO:
  // Collect all of the messages for each organization that the user manages. This is really a low priority. They didn't ask for this functionality and it's going to require requerying all the tables again.
  // Collect a list of users that manage the organizations that the user is the owner of.

  // Format the data so it's much easier to read on the front end.
  const formattedUserData = {
    email: userData[0].email,
    isAdmin: userData[0].isAdmin,
    bases: baseData.map(base => {
      const isBaseManager = baseManagerData.reduce(
        (bool, row, i, baseManagerData) => {
          return row.baseId === base.id;
        },
        false
      );
      return {
        baseId: base.id,
        baseName: base.baseName,
        basePhoneNumber: base.basePhoneNumber,
        isBaseManager: isBaseManager,
        orgs: (() => {
          let orgArr = [];

          for (let i = 0; i < organizationData.length; i++) {
            if (base.id === organizationData[i].baseId) {
              const org = organizationData[i];

              let numberOfSubscribers = 0;
              for (let j = 0; j < subscribersPerOrganization.length; j++) {
                if (subscribersPerOrganization[j].orgId === org.id) {
                  numberOfSubscribers =
                    subscribersPerOrganization[j].subscribers;
                }
              }

              orgArr.push({
                orgId: org.id,
                orgName: org.orgName,
                subscriptionCode: org.subscriptionCode,
                numberOfSubscribers: numberOfSubscribers,
                isOrgOwner: userData[0].id === org.orgOwner
              });
            }
          }

          return orgArr;
        })()
      };
    })
  };

  return formattedUserData;
};

module.exports = getAllDataAssociatedWithUser;
