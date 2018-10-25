const dbInterface = require('./dbInterfaces');

const getAdminData = async req => {
  return await dbInterface.getAdminData().catch(err => console.error(err));
};

const adminController = {
  getAdminData: getAdminData
};

module.exports = adminController;
