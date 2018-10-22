const dbInterface = require('./dbInterfaces');

const getUserData = async req => {
  const userId = req.session.userId;
  return await dbInterface.getAllUserData(userId);
};

const getAdminData = async req => {
  const userId = req.session.userId;
  return await dbInterface.getAdminData(userId);
};

const adminController = {
  getUserData: getUserData,
  getAdminData: getAdminData
};

module.exports = adminController;
