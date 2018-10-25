const models = require('../../db/models');

const getAdminData = async () => {
  const users = await models.User.findAll().catch(err => {
    console.error(err);
  });
  const organizationManagers = await models.OrganizationManager.findAll().catch(
    err => {
      console.error(err);
    }
  );
  const organizations = await models.Organization.findAll().catch(err => {
    console.error(err);
  });
  const baseManagers = await models.BaseManager.findAll().catch(err => {
    console.error(err);
  });
  const bases = await models.Base.findAll().catch(err => {
    console.error(err);
  });
  const subscriptions = await models.Subscription.findAll().catch(err => {
    console.error(err);
  });
  const messages = await models.Message.findAll().catch(err => {
    console.error(err);
  });

  return {
    users: users.map(user => {
      return {
        userId: user.id,
        email: user.email,
        isAdmin: user.isAdmin
      };
    }),
    organizationManagers: organizationManagers,
    organizations: organizations,
    baseManagers: baseManagers,
    bases: bases,
    subscriptions: subscriptions,
    messages: messages
  };
};

module.exports = getAdminData;
