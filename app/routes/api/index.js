const express = require('express');
const router = express.Router();

const registerRouter = require('./register');

router
  .get('/', (req, res, next) => {
    res.send('This is the base api route.');
    // TODO: Eventually serve an api reference page at the root
  })
  .use('/register', registerRouter);

module.exports = router;
