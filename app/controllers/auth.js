const dbInterface = require('./dbInterfaces');
const utils = require('../utils');
const TOKEN = utils.tokenService;
const bcrypt = require('bcrypt');

module.exports = {
  login: async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

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
  },
  resetPassword: async (req, res) => {
    res.sendStatus(501);
  },
  test: async (req, res) => {
    res.send(`hello from test.`);
  }
};
