const express = require('express');
const router = express.Router();

const userRouter = require('./user');

router
  .get('/', (req, res, next) => {
    res.send('This is the base api route.');
    // TODO: Eventually serve an api reference page at the root
  })
  .use('/user', userRouter);

module.exports = router;
