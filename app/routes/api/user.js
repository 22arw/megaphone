const express = require('express');
const router = express.Router();
const registerUser = require('../../controllers/registerUser');

router.get('/', (req, res, next) => {
  const user = req.body;
  registerUser(user, next);
  res.send('This is sent from the user route.');
});

module.exports = router;
