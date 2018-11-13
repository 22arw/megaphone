const models = require('../../db/models');
const _ = require('lodash');

module.exports = async userId => {
  const user = await models.User.findAll({
    where: {
      id: userId
    }
  });

  if (user[0].dataValues.isAdmin) {
    return 5;
  }

  const baseManager = await models.BaseManager.findAll({
    where: {
      userId: user[0].dataValues.id
    }
  });

  if (!_.isEmpty(baseManager)) {
    return 4;
  }

  const orgOwner = await models.Organization.findAll({
    where: {
      orgOwner: user[0].dataValues.id
    }
  });

  if (!_.isEmpty(orgOwner)) {
    return 3;
  }

  const orgManager = await models.OrganizationManager.findAll({
    where: {
      userId: user[0].dataValues.id
    }
  });

  if (!_.isEmpty(orgManager)) {
    return 2;
  }

  return 1;
};
