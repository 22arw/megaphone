const express = require('express');
const router = express.Router();

const adminRouter = require('./admin');
const orgRouter = require('./organization');
const userRouter = require('./user');

const requireAdminMiddleware = require('../../middleware/requireAdmin');
const requireUserMiddleware = require('../../middleware/requireUser');

router
  .get('/', (req, res) => {
    res.redirect(
      'https://github.com/22arw/megaphone/blob/master/app/routes/api/api.md'
    );
  })
  .use(requireUserMiddleware) // Require the user to be authenticated to access these routes.
  .use('/organization', orgRouter)
  .use('/user', userRouter)
  .use(requireAdminMiddleware) // Require the user to be an admin to access these routes
  .use('/admin', adminRouter);

module.exports = router;
