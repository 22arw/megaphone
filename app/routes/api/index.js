const express = require('express');
const router = express.Router();

const adminRouter = require('./admin');
const userRouter = require('./user');

const requireAdminMiddleware = require('../../middleware/requireAdmin');
const requireUserMiddleware = require('../../middleware/requireUser');

router
  .get('/', (req, res) => {
    res.redirect(
      'https://github.com/22arw/megaphone/blob/master/app/routes/api/api.md'
    );
  })
  .use(requireUserMiddleware)
  .use('/user', userRouter)
  .use(requireAdminMiddleware)
  .use('/admin', adminRouter);

module.exports = router;
