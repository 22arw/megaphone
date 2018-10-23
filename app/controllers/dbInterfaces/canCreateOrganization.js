const models = require('../../db/models');
const isAdminInterface = require('./isAdmin');

const canCreateOrganization = async (userId, baseId) => {
  const orgManager = await models.BaseManager.findAll({
    where: {
      userId: userId,
      baseId: baseId
    }
  }).catch(err => {
    console.error(err);
  });

  const isAdmin = await isAdminInterface(userId).catch(err => {
    console.error(err);
  });

  return (Array.isArray(orgManager) && orgManager.length === 1) || isAdmin;
};

module.exports = canCreateOrganization;
