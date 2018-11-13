const models = require('../../db/models');

module.exports = async (userId, isAdmin) => {
  const user = await models.User.update(
    {
      isAdmin: isAdmin
    },
    {
      where: {
        id: userId
      }
    }
  ).catch(err => console.error(err));

  return user[0].dataValues;
};
