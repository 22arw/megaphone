const models = require('../../db/models');

module.exports = async (userId, email, password, isActive) => {
  const user = await models.User.update(
    {
      email: email,
      password: password,
      isActive: isActive
    },
    {
      where: {
        id: userId
      }
    }
  ).catch(err => console.error(err));

  return user[0];
};
