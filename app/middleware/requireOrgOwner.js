const dbInterface = require('../controllers/dbInterfaces');
const _ = require('lodash');

module.exports = async (req, res, next) => {
  process.stdout.write('This route requires a role of Org Owner... ');
  // Check if admin
  const isAdmin = await dbInterface
    .isAdmin(req.userId)
    .catch(err => console.error(err));

  if (isAdmin) {
    console.log('This user is an admin.');
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

  const isBaseManager = await dbInterface
    .isBaseManager(req.userId, org[0].baseId)
    .catch(err => console.error(err));

  if (isBaseManager) {
    console.log('This user is a base manager.');
    return next();
  }

  // Check if org owner
  const isOrgOwner = await dbInterface
    .isOrgOwner(req.userId, orgId)
    .catch(err => console.error(err));
  if (!isOrgOwner) {
    return res.sendStatus(401);
  }

  console.log('This user is the org owner.');
  next();
};
