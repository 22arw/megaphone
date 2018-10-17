const { User } = require('../db/models');

const getData = async req => {
  const userId = req.session.userId;
  const result = await User.findAll({
    where: {
      id: userId
    },
    include: [{ all: true, nested: true }]
  }).catch(err => {
    console.log(err);
  });

  // Make any manipulations here to format the json before sending response.
  const formattedResult = result;

  return formattedResult;
};

const userController = {
  getData: getData
};

module.exports = userController;
