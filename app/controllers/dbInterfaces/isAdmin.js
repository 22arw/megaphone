const models = require('../../db/models');

const isAdmin = async userId => {
  if (isNaN(userId)) {
    return false;
  }

  const user = await models.User.findAll({
    where: {
      id: userId,
      isActive: true
    }
  }).catch(err => console.error(err));

  // console.log(` - - - - - -
  // isAdmin
  // user: ${JSON.stringify(user)}
  // return: ${user[0].dataValues.isAdmin === true}
  // - - - - - -`);

  return user[0].dataValues.isAdmin === true;
};

module.exports = isAdmin;
