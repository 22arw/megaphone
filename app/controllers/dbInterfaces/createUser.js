const models = require('../../db/models');

module.exports = async (email, password) => {
  const user = await models.User.create({
    email: email,
    password: password
  }).catch(err => console.error(err));

  return user.dataValues;
};
