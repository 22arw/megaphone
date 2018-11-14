const models = require('../../db/models');

module.exports = async userId => {
  const org = await models.OrganizationManager.destroy({
    where: {
      userId: userId
    }
  });

  return org;
};
