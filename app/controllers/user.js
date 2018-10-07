const { User } = require('../models');

const createUser = user => {
  console.log('Called the create user function');
};

const getAllUsers = () => {
  User.findAll().then(user => {
    return user;
  });
};

const userController = {
  createUser: createUser,
  getAllUsers: getAllUsers
};

module.exports = userController;
