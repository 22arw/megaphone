const express = require('express');
const router = express.Router();

const authRouter = require('./auth');
const userRouter = require('./user');

router
  .get('/', (req, res, next) => {
    // TODO: Eventually serve an api reference page at the root
    res.send('This is the base api route.');
  })
  .use('/auth', authRouter)
  .use('/user', userRouter);

module.exports = router;
