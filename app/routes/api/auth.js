const express = require('express');
const router = express.Router();
const dbInterface = require('../../controllers/dbInterfaces');
const utils = require('../../utils');
const TOKEN = utils.tokenService;
const bcrypt = require('bcrypt');

router.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  console.log(JSON.stringify(req.body));
  if (!(email && password)) {
    console.log('\nMissing data on login request.');
    return res.sendStatus(401);
  }

  const doesUserExist = await dbInterface
    .doesUserExist(email)
    .catch(err => console.error(err));

  if (!doesUserExist) return res.sendStatus(401);

  dbInterface.getUserByEmail(email).then(async user => {
    if (!(await bcrypt.compare(password, user.password))) {
      console.log('\nIncorrect password at login.');
      return res.sendStatus(401);
    } else {
      const token = TOKEN.generate(user.id);
      res.json({
        token: token
      });
    }
  });
});

router.post('/test', (req, res) => {
  console.log('successfully logged in.');
  console.log(`userId: ${req.userId}`);
  res.end();
});

module.exports = router;
