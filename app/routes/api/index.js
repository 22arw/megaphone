const express = require('express');
const router = express.Router();

const adminRouter = require('./admin');
const userRouter = require('./user');

const requireUserMiddleware = require('../../middleware/requireUser');

router
  .get('/', (req, res, next) => {
    // TODO: Eventually serve an api reference page at the root
    res.redirect(
      'https://github.com/22arw/megaphone/blob/master/app/routes/api/api.md'
    );
  })
  .use(requireUserMiddleware)
  .use('/user', userRouter)
  .use('/admin', adminRouter);

module.exports = router;
