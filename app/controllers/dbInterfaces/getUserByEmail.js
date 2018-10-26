const models = require('../../db/models');

module.exports = async email => {
  const user = await models.User.findAll({
    where: {
      email: email
    }
  }).catch(err => console.error(err));

  return user[0].dataValues;
};
