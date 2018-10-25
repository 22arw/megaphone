const models = require('../../db/models');
const utils = require('../../utils');

const isUserEmailUnique = async email => {
  if (!utils.isValidEmail(email)) {
    return false;
  }
  const user = await models.User.findAll({
    where: {
      email: email
    }
  }).catch(err => console.error(err));

  return !Array.isArray(user) || !user.length;
};

module.exports = isUserEmailUnique;
