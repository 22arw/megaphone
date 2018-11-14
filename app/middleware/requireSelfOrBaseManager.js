const dbInterface = require('../controllers/dbInterfaces');
const _ = require('lodash');

module.exports = async (req, res, next) => {
  process.stdout.write('requireSelfOrBaseManager... ');

  // check if they're updating themselves...
  const userId = req.body.userId || req.userId;
  if (req.userId == userId) {
    console.log('this user is updating themselves. ✅');
    req.body.userId = userId; // Set userId in case none was provided.
    return next();
  }

  if (isNaN(_.toNumber(req.body.userId))) {
    console.log('No user was supplied to update. ⛔️')
  }

  const doesUserExist = await dbInterface.doesUserExistById(req.body.userId).catch(err => console.error(err));
  if (!doesUserExist) {
    console.log('The user supplied does not exist. ⛔️');
    return res.sendStatus(401);
  }

  const isAdmin = await dbInterface.isAdmin(req.userId).catch(err => {
    console.error(err);
    return res.sendStatus(500);
  });

  if (isAdmin) {
    console.log(`this user is an admin. ✅`);
    return next();
  }

  // in order to tell if this person is a base manager that can edit a user, the user must have some part in the base that this person is managing...

  const basesManagedIds = await dbInterface.getBasesManagedByUserId(req.userId);
  if (_.isEmpty(basesManagedIds)) {
    console.log('The user is not a base manager. ⛔️');
    return res.sendStatus(401);
  }

  const bases = await dbInterface.getBasesByUserId(req.body.userId);
  if (_.isEmpty(bases)) {
    console.log('The user is not a part of any bases. ⛔️');
    return res.sendStatus(401);
  }

  const baseIds = bases.map(base => {
    return base.id;
  });

  if(!_.isEmpty(_.intersection(basesManagedIds, baseIds))) {
    console.log('The user is a base manager for the user supplied. ✅');
    return next();
  }

  console.log(`the user (${req.userId}), is attempting to update this user: (${userId}). BLOCKED! ⛔️`);
  res.sendStatus(401);
};
