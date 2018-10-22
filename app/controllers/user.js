const dbInterface = require('./dbInterfaces');

const getUserData = async req => {
  const userId = req.session.userId;
  return await dbInterface.getAllUserData(userId);
};

const userController = {
  getUserData: getUserData
};

module.exports = userController;
