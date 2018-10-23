const models = require('../../db/models');
const isAdminInterface = require('./isAdmin');

const canCreateOrganization = async (userId, baseId) => {
  if (isNaN(baseId)) {
    return false;
  }
  const baseManager = await models.BaseManager.findAll({
    where: {
      userId: userId,
      baseId: baseId
    }
  }).catch(err => {
    console.error(err);
  });

  const isBaseManager = Array.isArray(baseManager) && baseManager.length === 1;

  const base = await models.Base.findAll({
    where: {
      id: baseId
    }
  });

  const baseExists = Array.isArray(base) && base.length === 1;

  const isAdmin = await isAdminInterface(userId).catch(err => {
    console.error(err);
  });

  // console.log(` - - - - - - - - -
  // baseManager: ${baseManager}
  // isBaseManager: ${isBaseManager}
  // base: ${base}
  // baseExists: ${baseExists}
  // isAdmin: ${isAdmin}
  // - - - - - - - - -`);

  return baseExists && (isBaseManager || isAdmin);
};

module.exports = canCreateOrganization;
