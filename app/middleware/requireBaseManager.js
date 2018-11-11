const dbInterface = require('../controllers/dbInterfaces');
const _ = require('lodash');

module.exports = async (req, res, next) => {
  const isAdmin = await dbInterface
    .isAdmin(req.userId)
    .catch(err => console.error(err));

  if (isAdmin) {
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
    next();
  } else {
    res.sendStatus(401);
  }
};
