const models = require('../../db/models');
const utils = require('../../utils');

module.exports = async email => {
  if (!utils.isValidEmail(email)) {
    return false;
  }
  const user = await models.User.findAll({
    where: {
      email: email,
      isActive: true
    }
  }).catch(err => console.error(err));

  return Array.isArray(user) && user.length === 1 && user[0].isActive;
};
