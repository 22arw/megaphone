const dbInterface = require('./dbInterfaces');

const getAdminData = async req => {
  return await dbInterface.getAdminData();
};

const adminController = {
  getAdminData: getAdminData
};

module.exports = adminController;
