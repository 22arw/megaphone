const models = require('../../db/models');

module.exports = async userId => {
  const org = await models.Organization.update(
    {
      orgOwner: null
    },
    {
      where: {
        orgOwner: userId
      }
    }
  );

  return org;
};
