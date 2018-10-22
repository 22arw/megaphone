const models = require('../db/models');

async function requireAdminMiddleware(req, res, next) {
  const userData = await models.User.findAll({
    where: {
      id: req.session.userId
    }
  })
    .then(response => {
      return response[0].dataValues;
    })
    .catch(err => {
      console.error(err);
    });

  if (!userData.isAdmin) {
    res.sendStatus(403);
  }

  next();
}

module.exports = requireAdminMiddleware;
