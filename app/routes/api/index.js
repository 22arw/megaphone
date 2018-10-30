const express = require('express');
const router = express.Router();

const adminRouter = require('./admin');
const baseRouter = require('./base');
const bandwidthRouter = require('./bandwidth');
const messageRouter = require('./message');
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
  .use('/bandwidth', bandwidthRouter)
  .use(requireUserMiddleware) // Require the user to be authenticated to access these routes.
  .use('/base', baseRouter)
  .use('/message', messageRouter)
  .use('/organization', orgRouter)
  .use('/user', userRouter)
  .use(requireAdminMiddleware) // Require the user to be an admin to access these routes
  .use('/admin', adminRouter);

module.exports = router;
