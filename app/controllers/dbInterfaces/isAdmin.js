const models = require('../../db/models');

const isAdmin = async userId => {
  const user = await models.User.findAll({
    where: {
      id: userId
    }
  }).catch(err => {
    console.error(err);
  });

  return user[0].dataValues.isAdmin === true;
};

module.exports = isAdmin;
