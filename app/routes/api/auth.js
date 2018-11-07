const express = require('express');
const router = express.Router();
const dbInterface = require('../../controllers/dbInterfaces');
const utils = require('../../utils');
const TOKEN = utils.tokenService;
const bcrypt = require('bcrypt');

router.post('/login', (req, res) => {
  const email = req.body.data.email;
  const password = req.body.data.password;
  if (!(email && password)) {
    console.log('\nMissing data on login request.');
    return res.sendStatus(401);
  }

  dbInterface.getUserByEmail(email).then(user => {
    if (!bcrypt.compare(password, user.password)) {
      console.log('\nIncorrect password at login.');
      return res.sendStatus(401);
    }

    const token = TOKEN.generate(user.id);
    res.json({
      token: token
    });
  });
});

router.post('/test', (req, res) => {
  console.log('successfully logged in.');
  console.log(`userId: ${req.userId}`);
  res.end();
});

module.exports = router;
