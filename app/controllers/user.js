const { User } = require('../models');

const getData = async req => {
  const userId = req.session.userId;
  return await User.findAll({
    where: {
      id: userId
      // include: [{ all: true }]
    }
  });
};

const userController = {
  getData: getData
};

module.exports = userController;
