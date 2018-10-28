const dbInterface = require('../controllers/dbInterfaces');

async function requireAdminMiddleware(req, res, next) {
  const isAdmin = await dbInterface
    .isAdmin(req.session.userId)
    .catch(err => console.error(err));

  if (!isAdmin) {
    res.sendStatus(403);
  }

  next();
}

module.exports = requireAdminMiddleware;
