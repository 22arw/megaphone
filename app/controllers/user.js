const dbInterface = require('./dbInterfaces');

const getData = async req => {
  const userId = req.session.userId;

  const result = await dbInterface.getAllUserData(userId);

  // Make any manipulations here to format the json before sending response.
  const formattedResult = result;

  return formattedResult;
};

const userController = {
  getData: getData
};

module.exports = userController;
