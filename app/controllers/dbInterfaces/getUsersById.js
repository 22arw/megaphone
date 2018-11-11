const models = require('../../db/models');

module.exports = async userId => {
  const users = await models.User.findAll({
    where: {
      id: userId
    }
  }).catch(err => console.error(err));

  return users.map(user => {
    return user.dataValues;
  });
};
