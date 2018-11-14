const models = require('../../db/models');

module.exports = async (userId, isActive) => {
  const user = await models.User.update(
    {
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
