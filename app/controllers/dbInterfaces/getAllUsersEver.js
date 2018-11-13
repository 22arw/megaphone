const models = require('../../db/models');

module.exports = () => {
  const users = models.User.findAll();

  return users.map(user => {
    return {
      userId: user.dataValues.id,
      email: user.dataValues.email,
      isAdmin: user.dataValues.isAdmin,
      isActive: user.dataValues.isActive
    };
  });
};
