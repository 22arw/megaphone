const models = require('../../db/models');
const _ = require('lodash');

module.exports = async userId => {
  const user = await models.User.findAll({
    where: {
      id: userId,
      isActive: true
    }
  }).catch(err => console.error(err));

  return !_.isEmpty(user);
};
