const dbInterface = require('./dbInterfaces');
const _ = require('lodash');

module.exports = {
  isAdmin: (req, res) => {
    try {
      dbInterface.isAdmin(req.userId).then(isAdmin => {
        res.json({
          token: req.token,
          success: true,
          isAdmin: isAdmin
        });
      });
    } catch (error) {
      console.error(error);
      res.json({
        token: req.token,
        success: false,
        error: error.message
      });
    }
  },
  getUserData: (req, res) => {
    try {
      dbInterface.getAllUserData(req.userId).then(user => {
        res.json({
          token: req.token,
          success: true,
          user: user
        });
      });
    } catch (error) {
      console.error(error);
      res.json({
        token: req.token,
        success: false,
        error: error.message
      });
    }
  },
  updateIsAdmin: async (req, res) => {
    const userId = _.toNumber(req.body.userId);
    const isAdmin = _.toString(req.body.isAdmin);

    console.log(isAdmin);

    try {
      if (isNaN(userId) || _.isEmpty(isAdmin)) {
        throw new Error('Invalid data on request.');
      }

      let bool = false;
      if (isAdmin === 'true') {
        bool = true;
      } else if (isAdmin !== 'false') {
        throw new Error('Invalid data on request.');
      }

      const doesUserExist = await dbInterface.doesUserExistById(userId);
      if (!doesUserExist) {
        throw new Error('User does not exist.');
      }

      dbInterface.updateIsAdmin(userId, bool).then(() => {
        res.json({
          token: req.token,
          success: true
        });
      });
    } catch (error) {
      console.error(error);
      res.json({
        token: req.token,
        success: false,
        error: error.message
      });
    }
  }
};
