const dbInterface = require('./dbInterfaces');
const utils = require('../utils');
const TOKEN = utils.tokenService;
const bcrypt = require('bcrypt');
const _ = require('lodash');

module.exports = {
  login: async (req, res) => {
    process.stdout.write('Attempting to login... ');
    const email = _.toString(req.body.email)
      .toLowerCase()
      .trim();
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

      if (!user.isActive) {
        throw new Error('User is not active.');
      }

      if (!(await bcrypt.compare(password, user.password))) {
        throw new Error('Incorrect password at login.');
      }

      const highestRole = await dbInterface.getHighestRole(user.id);

      const passwordDuration = 365 * 24 * 60 * 60 * 1000; // 1 year => days * hours * minutes * seconds * milliseconds
      const now = new Date().getTime(); // time in milliseconds
      const updatedAt = new Date(user.updatedAt).getTime(); // time in milliseconds of last update

      console.log(`
      passwordDuration: ${passwordDuration}
      now: ${now}
      updatedAt: ${updatedAt}
      `);

      const passRequiresUpdate =
        _.toString(user.createdAt) === _.toString(user.updatedAt) ||
        now - updatedAt >= passwordDuration;

      console.log('success!');
      res.json({
        token: TOKEN.generate(user.id),
        needsPasswordChange: passRequiresUpdate,
        role: highestRole
      });
    } catch (error) {
      console.log('failure.');
      console.error(error);
      res.sendStatus(401);
    }
  },
  resetPassword: async (req, res) => {
    process.stdout.write('Attempting to reset password... ');
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
          console.log('Successfully reset password.');
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
      console.error(error);
      return res.json({
        token: req.token,
        success: false,
        error: error.message
      });
    }
  },
  forcePasswordReset: async (req, res) => {
    process.stdout.write('Attempting to force a password reset... ');
    const userId = _.toNumber(req.body.userId);

    try {
      if (isNaN(userId)) {
        throw new Error('Invalid data on request.');
      }

      const doesUserExist = await dbInterface.doesUserExistById(userId);
      if (!doesUserExist) {
        throw new Error('That user does not exist.');
      }
      const user = await dbInterface.getUsersById(userId);
      const pass = utils.generateRandomPassword();

      if (!user[0].isActive) {
        await dbInterface.updateUserIsActive(userId, true);
      }

      await dbInterface.updateUser(userId, user[0].email, pass);

      utils.sendEmail(
        user[0].email,
        'Your password has been reset. Megaphone.',
        `You're password has been reset by an administrator, please log in using: ${pass}`,
        process.env.CLIENT_URL
      );

      console.log('success!');
      res.json({
        token: req.token,
        success: true
      });
    } catch (error) {
      console.error(error);
      return res.json({
        token: req.token,
        success: false,
        error: error.message
      });
    }
  }
};
