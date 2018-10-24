// const models = require('../db/models');
const dbInterface = require('../controllers/dbInterfaces');

async function requireAdminMiddleware(req, res, next) {
  const isAdmin = await dbInterface
    .isAdmin(req.session.userId)
    .catch(err => console.error(err));

  if (!isAdmin) {
    res.sendStatus(403);
  }
  // const userData = await models.User.findAll({
  //   where: {
  //     id: req.session.userId
  //   }
  // })
  //   .then(response => {
  //     return response[0].dataValues;
  //   })
  //   .catch(err => {
  //     console.error(err);
  //   });

  // if (!userData.isAdmin) {
  //   res.sendStatus(403);
  // }

  next();
}

module.exports = requireAdminMiddleware;
