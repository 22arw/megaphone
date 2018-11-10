const models = require('../../db/models');

module.exports = async baseId => {
  const baseManagers = await models.BaseManager.findAll({
    where: {
      baseId: baseId
    }
  }).catch(err => console.error(err));

  const baseManagerIds = baseManagers.map(baseManager => {
    return baseManager.dataValues.userId;
  });

  const users = await models.User.findAll({
    where: {
      id: baseManagerIds
    }
  }).catch(err => console.error(err));

  return users.map(user => {
    return {
      userId: user.dataValues.id,
      email: user.dataValues.email,
      isAdmin: user.dataValues.isAdmin
    };
  });
};
