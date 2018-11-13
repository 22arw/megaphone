const dbInterface = require('./dbInterfaces');
const utils = require('../utils');
const TOKEN = utils.tokenService;
const bcrypt = require('bcrypt');
const _ = require('lodash');

module.exports = {
  login: async (req, res) => {
    const email = _.toString(req.body.email).trim();
    const password = _.toString(req.body.password).trim();

    try {
      if (_.isEmpty(password) || !utils.isValidEmail(email)) {
        throw new Error('Invalid data on request.');
      }

      const doesUserExist = await dbInterface.doesUserExist(email);
      if (!doesUserExist) {
        throw new Error('User does not exist.');
      }

      const user = await dbInterface.getUserByEmail(email);
      if (!(await bcrypt.compare(password, user.password))) {
        throw new Error('Incorrect password at login.');
      }

      const highestRole = await dbInterface.getHighestRole(user.id);

      res.json({
        token: TOKEN.generate(user.id),
        needsPasswordChange:
          _.toString(user.createdAt) === _.toString(user.updatedAt),
        role: highestRole
      });
    } catch (error) {
      console.error(error);
      res.sendStatus(401);
    }
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

      const users = await dbInterface.getUsersById(userId);

      if (users.length !== 1) {
        throw new Error('There was an error accessing the user');
      }

      const user = users[0];

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
