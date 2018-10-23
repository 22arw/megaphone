const models = require('../../db/models');
const isAdminInterface = require('./isAdmin');
const isOrgOwnerInterface = require('./isOrgOwner');

const addOrgManager = async (userId, orgId, newOrgManagerEmail) => {
  const isAdmin = await isAdminInterface(userId);
  const isOrgOwner = await isOrgOwnerInterface(userId, orgId);

  if (!(isAdmin || isOrgOwner)) {
    return {
      error: 'You cannot add managers to this organization.'
    };
  }

  const org = await models.Organization.findAll({
    where: {
      id: orgId
    }
  });
  const orgExists = Array.isArray(org) && org.length === 1;

  if (!orgExists) {
    return {
      error: 'That organization does not exist.'
    };
  }

  const user = await models.User.findAll({
    where: {
      email: newOrgManagerEmail
    }
  });
  const userExists = Array.isArray(user) && user.length === 1;

  if (!userExists) {
    return {
      error: 'That user does not exist.'
    };
  }

  // is the user already an org manager?
  const orgManager = await models.OrganizationManager.findAll({
    where: {
      userId: user[0].dataValues.id,
      orgId: orgId
    }
  });
  const isOrgManager = Array.isArray(orgManager) && orgManager.length === 1;

  // console.log(` - - - - -
  // orgManager: ${orgManager}
  // - - - - -`);

  if (isOrgManager) {
    return {
      error: 'That user is already an org manager.'
    };
  }

  const addOrgManagerResponse = await models.OrganizationManager.create({
    userId: user[0].dataValues.id,
    orgId: orgId
  }).catch(err => console.error(err));

  console.log(addOrgManagerResponse);

  return true;
};

module.exports = addOrgManager;
