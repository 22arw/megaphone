const models = require('../../db/models');

module.exports = async userId => {
  const user = await models.User.findAll({
    where: {
      id: userId
    }
  }).catch(err => console.error(err));

  return Array.isArray(user) && user.length === 1;
};
