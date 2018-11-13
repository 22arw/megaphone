const dbInterface = require('../controllers/dbInterfaces');

module.exports = async (req, res, next) => {
  const isAdmin = await dbInterface.isAdmin(req.userId).catch(err => {
    console.error(err);
    res.sendStatus(500);
  });

  if (isAdmin) {
    console.log(`requireSelfOrAdmin: This user is an admin.`);
    return next();
  }

  // If no userId is supplied, use the self.
  const userId = req.body.userId || req.userId;

  if (userId != req.userId) {
    console.log(`requireSelfOrAdmin: This user (${req.userId}), is attempting to update this user: (${userId}). BLOCKED!`);
    return res.sendStatus(401);
  }

  req.body.userId = userId; // Set userId in case none was provided.
  console.log('This user is accessing this route for themselves.');
  next();
};
