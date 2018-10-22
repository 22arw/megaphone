const dbInterface = require('./dbInterfaces');

const getAdminData = async req => {
  const userId = req.session.userId;
  return await dbInterface.getAdminData(userId);
};

const adminController = {
  getAdminData: getAdminData
};

module.exports = adminController;
