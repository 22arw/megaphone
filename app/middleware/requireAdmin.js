const dbInterface = require('../controllers/dbInterfaces');

module.exports = (req, res, next) => {
  process.stdout.write('This route requires an admin... ');
  dbInterface
    .isAdmin(req.userId)
    .then(isAdmin => {
      if (!isAdmin) return res.sendStatus(401);
      console.log('This user is an admin.');
      next();
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    });
};
