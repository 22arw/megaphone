const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user');

router
  .get('/', (req, res, next) => {
    res.send(`Called the get route for ${req.url}`);
  })
  .post('/', (req, res, next) => {
    res.send(`Called the post route for ${req.url}`);
  });

module.exports = router;
