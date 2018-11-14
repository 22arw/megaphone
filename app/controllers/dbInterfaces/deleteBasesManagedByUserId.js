const models = require('../../db/models');

module.exports = async userId => {
  const org = await models.BaseManager.destroy({
    where: {
      userId: userId
    }
  });

  return org;
};
