const express = require('express');
const router = express.Router();

const adminRouter = require('./admin');
const authRouter = require('./auth');
const baseRouter = require('./base');
const bandwidthRouter = require('./bandwidth');
const messageRouter = require('./message');
const orgRouter = require('./organization');
const userRouter = require('./user');

const middleware = require('../../middleware');

router
  .get('/', (req, res) => {
    res.redirect(
      'https://github.com/22arw/megaphone/blob/master/app/routes/api/api.md'
    );
  })
  .use('/bandwidth', bandwidthRouter)
  .use(middleware.auth)
  .use('/auth', authRouter)
  .use('/base', baseRouter)
  .use('/message', messageRouter)
  .use('/organization', orgRouter)
  .use('/user', userRouter)
  .use('/admin', adminRouter);

module.exports = router;
