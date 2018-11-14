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
  );

  return user[0];
};
