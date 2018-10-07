const { User } = require('../models');

const registerUser = (user, next) => {
  console.log('Hit the register user controller');
  console.log(user);
  next();
};

module.exports = registerUser;
