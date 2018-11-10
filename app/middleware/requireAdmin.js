const dbInterface = require('../controllers/dbInterfaces');

module.exports = (req, res, next) => {
  dbInterface
    .isAdmin(req.userId)
    .then(isAdmin => {
      if (!isAdmin) return res.sendStatus(401);
      next();
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    });
};
