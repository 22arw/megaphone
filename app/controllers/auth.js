const dbInterface = require('./dbInterfaces');
const utils = require('../utils');
const TOKEN = utils.tokenService;
const bcrypt = require('bcrypt');
const _ = require('lodash');

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
        return res.json({
          token: TOKEN.generate(user.id),
          needsPasswordChange:
            _.toString(user.createdAt) === _.toString(user.updatedAt)
        });
      }
    });
  },
  resetPassword: async (req, res) => {
    const userId = req.userId;
    const oldPassword = _.toString(req.body.oldPassword).trim();
    const password = _.toString(req.body.password).trim();
    const confirmPassword = _.toString(req.body.confirmPassword).trim();

    try {
      if (
        _.isEmpty(oldPassword) ||
        _.isEmpty(password) ||
        _.isEmpty(confirmPassword)
      ) {
        throw new Error('Missing data on request.');
      }

      if (password !== confirmPassword) {
        throw new Error("Passwords don't match.");
      }

      if (oldPassword === password) {
        throw new Error('New password must be different from old password.');
      }

      const user = await dbInterface
        .getUserById(userId)
        .catch(err => console.error(err));

      if (!(await bcrypt.compare(oldPassword, user.password))) {
        throw new Error('Incorrect password.');
      }

      dbInterface
        .updateUser(user.id, user.email, password, true)
        .then(rows => {
          if (rows !== 1) {
            throw new Error(`Password update failed, returned: ${rows}`);
          }
          return res.json({
            token: req.token,
            success: true
          });
        })
        .catch(err => {
          console.error(err);
          throw new Error('Password update failed.');
        });
    } catch (error) {
      return res.json({
        token: req.token,
        success: false,
        error: error.message
      });
    }
  }
};
