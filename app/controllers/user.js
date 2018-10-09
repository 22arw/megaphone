const { User } = require('../models');

const createUser = user => {
  console.log('Called the create user function');
};

const getAllUsers = async () => {
  return await User.findAll();
};

const userController = {
  createUser: createUser,
  getAllUsers: getAllUsers
};

module.exports = userController;
