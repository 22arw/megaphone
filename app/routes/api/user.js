const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user');

router
  .get('/', async (req, res, next) => {
    res.send('Well, hello there. ;)');
  })
  .post('/', (req, res, next) => {
    // This is where we create a user
    res.send('Create user');
  });

module.exports = router;
