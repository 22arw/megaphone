const dbInterface = require('./dbInterfaces');

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
    const isAdmin = req.body.isAdmin;

    try {
      if (isNaN(userId) || typeof isAdmin != typeof true) {
        throw new Error('Invalid data on request.');
      }
      res.sendStatus(501);
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
