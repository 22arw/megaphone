const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user');

router
  .get('/', async (req, res, next) => {
    dbResponse = await userController.getAllUsers();
    console.log('got a response from the db');
    console.log(dbResponse);
    res.send(dbResponse);
  })
  .post('/', (req, res, next) => {
    // This is where we create a user
    res.send('Create user');
  });

module.exports = router;
