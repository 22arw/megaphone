const models = require('../../db/models');
const isOrgManager = require('./isOrgManager');

const addOrgManager = async (userId, orgId, newOrgManagerEmail) => {
  const user = await models.User.findAll({
    where: {
      email: newOrgManagerEmail
    }
  }).catch(err => console.error(err));

  const isOrgManagerResponse = await isOrgManager(
    user[0].dataValues.id,
    orgId
  ).catch(err => console.error(err));

  if (isOrgManagerResponse) {
    return 'That user is already an org manager.';
  }

  const addOrgManagerResponse = await models.OrganizationManager.create({
    userId: user[0].dataValues.id,
    orgId: orgId
  }).catch(err => console.error(err));

  return true;
};

module.exports = addOrgManager;
