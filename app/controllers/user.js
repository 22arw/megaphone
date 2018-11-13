const dbInterface = require('./dbInterfaces');
const _ = require('lodash');
const utils = require('../utils');

module.exports = {
  isAdmin: (req, res) => {
    process.stdout.write('Attempting isAdmin... ');
    try {
      dbInterface.isAdmin(req.userId).then(isAdmin => {
        console.log(`is this user an admin? ${isAdmin}`);
        res.json({
          token: req.token,
          success: true,
          isAdmin: isAdmin
        });
      });
    } catch (error) {
      console.error(error);
      res.json({
        token: req.token,
        success: false,
        error: error.message
      });
    }
  },
  isEmailUnique: async (req, res) => {
    process.stdout.write('Attempting isEmailUnique... ');
    const email = _.toString(req.body.email).trim();

    try {
      if (!utils.isValidEmail(email)) {
        throw new Error('That is not a valid email address.');
      }

      dbInterface.isUserEmailUnique(email).then(bool => {
        console.log(`is that email unique? ${bool}`);
        res.json({
          token: req.token,
          success: true,
          isEmailUnique: bool
        });
      });
    } catch (error) {
      console.error(error);
      res.json({
        token: req.token,
        success: false,
        error: error.message
      });
    }
  },
  getAllUsersEver: async (req, res) => {
    process.stdout.write('Attempting to get ALL USERS EVERRR... ');
    const users = await dbInterface.getAllUsersEver();
    console.log('Get all users successful.');
    res.json({
      token: req.token,
      success: true,
      users: users
    });
  },
  getUserData: (req, res) => {
    process.stdout.write('Attempting to get user data... ');
    try {
      dbInterface.getAllUserData(req.userId).then(user => {
        console.log('User data request successful.');
        res.json({
          token: req.token,
          success: true,
          user: user
        });
      });
    } catch (error) {
      console.error(error);
      res.json({
        token: req.token,
        success: false,
        error: error.message
      });
    }
  },
  updateIsAdmin: async (req, res) => {
    process.stdout.write('Attempting to update isAdmin... ');
    const userId = _.toNumber(req.body.userId);
    const isAdmin = _.toString(req.body.isAdmin);

    try {
      if (isNaN(userId) || _.isEmpty(isAdmin)) {
        throw new Error('Invalid data on request.');
      }

      let bool = false;
      if (isAdmin === 'true') {
        bool = true;
      } else if (isAdmin !== 'false') {
        throw new Error('Invalid data on request.');
      }

      const doesUserExist = await dbInterface.doesUserExistById(userId);
      if (!doesUserExist) {
        throw new Error('User does not exist.');
      }

      dbInterface.updateIsAdmin(userId, bool).then(() => {
        console.log('isAdmin update complete.');
        res.json({
          token: req.token,
          success: true
        });
      });
    } catch (error) {
      console.error(error);
      res.json({
        token: req.token,
        success: false,
        error: error.message
      });
    }
  },
  updateUserEmail: async (req, res) => {
    process.stdout.write('Attempting to update user email... ');
    const userId = _.toNumber(req.body.userId);
    const email = _.toString(req.body.email).trim();

    try {
      if (isNaN(userId) || !utils.isValidEmail(email)) {
        throw new Error('Invalid data on request.');
      }

      const doesUserExist = await dbInterface.doesUserExistById(userId);
      if (!doesUserExist) {
        throw new Error('User does not exist.');
      }

      const user = await dbInterface.getUsersById(userId);
      if (user[0].email === email) {
        throw new Error('Please change the email when calling this route.');
      }

      const isEmailUnique = await dbInterface.isUserEmailUnique(email);
      if (!isEmailUnique) {
        throw new Error('That email address is not unique.');
      }

      dbInterface.updateUserEmail(userId, email).then(() => {
        console.log('User email updated successfully.');
        res.json({
          token: req.token,
          success: true
        });
      });
    } catch (error) {
      console.error(error);
      res.json({
        token: req.token,
        success: false,
        error: error.message
      });
    }
  }
};
