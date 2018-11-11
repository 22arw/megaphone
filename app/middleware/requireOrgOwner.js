const dbInterface = require('../controllers/dbInterfaces');
const _ = require('lodash');

module.exports = async (req, res, next) => {
  // Check if admin
  const isAdmin = await dbInterface
    .isAdmin(req.userId)
    .catch(err => console.error(err));

  if (isAdmin) {
    return next();
  }

  // Check if base manager
  const orgId = _.toNumber(req.body.orgId);
  if (isNaN(orgId)) {
    return res.sendStatus(401);
  }

  const doesOrgExist = await dbInterface
    .doesOrgExist(orgId)
    .catch(err => console.error(err));
  if (!doesOrgExist) {
    return res.sendStatus(401);
  }

  const org = await dbInterface
    .getOrgById(orgId)
    .catch(err => console.error(err));
  const baseId = org.baseId;

  const isBaseManager = await dbInterface
    .isBaseManager(req.userId, baseId)
    .catch(err => console.error(err));

  if (isBaseManager) {
    return next();
  }

  // Check if org owner
  const isOrgOwner = await dbInterface
    .isOrgOwner(req.userId, orgId)
    .catch(err => console.error(err));
  if (!isOrgOwner) {
    return res.sendStatus(401);
  }

  next();
};
