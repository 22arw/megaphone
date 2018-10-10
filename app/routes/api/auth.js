const express = require('express');
const router = express.Router();

router
  .get('/', async (req, res, next) => {
    // This is the login route
    res.send('You just called the get route for /api/auth');
  })
  .post('/', (req, res, next) => {
    // This is the register router
    res.send('Create user');
  });

module.exports = router;
