const dbInterface = require('./dbInterfaces');

const getUserData = async userId => {
  return await dbInterface
    .getAllUserData(userId)
    .catch(err => console.error(err));
};

const isAdmin = async userId => {
  return {
    isAdmin: await dbInterface.isAdmin(userId).catch(err => console.error(err))
  };
};

const userController = {
  getUserData: getUserData,
  isAdmin: isAdmin
};

module.exports = userController;
