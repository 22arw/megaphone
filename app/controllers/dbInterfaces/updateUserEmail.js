const models = require('../../db/models');

module.exports = async (userId, email) => {
  const user = await models.User.update(
    {
      email: email
    },
    {
      where: {
        id: userId
      }
    }
  ).catch(err => console.error(err));

  return user[0];
};
