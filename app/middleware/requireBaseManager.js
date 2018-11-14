const dbInterface = require('../controllers/dbInterfaces');
const _ = require('lodash');

module.exports = async (req, res, next) => {
  process.stdout.write('This route requires a base manager... ');
  const isAdmin = await dbInterface
    .isAdmin(req.userId)
    .catch(err => console.error(err));

  if (isAdmin) {
    console.log('This user is an admin.');
    return next();
  }

  const baseId = _.toNumber(req.body.baseId);
  if (isNaN(baseId)) {
    return res.sendStatus(401);
  }

  const isBaseManager = await dbInterface
    .isBaseManager(req.userId, baseId)
    .catch(err => console.error(err));

  if (isBaseManager) {
    console.log('This user is a base manager.');
    next();
  } else {
    console.log('BLOCKED!');
    res.sendStatus(401);
  }
};
