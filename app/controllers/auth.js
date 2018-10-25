const bcrypt = require('bcrypt');

const { User } = require('../db/models');
const utils = require('../utils');

const registerUser = async (email, password, passwordConfirmation) => {
  if (!utils.isValidEmail(email)) {
    return { error: 'That is not a valid email address' };
  }

  if (password !== passwordConfirmation) {
    return { error: "passwords don't match." };
  }

  const user = {
    email: email,
    password: password
  };

  const response = await User.create(user).catch(err => {
    console.error(`There was an error: ${err}`);
    return { error: 'There was an error creating the user.' };
  });

  return response.id;
};

const loginUser = async (email, password) => {
  if (!utils.isValidEmail(email)) {
    return { error: 'That is not a valid email address' };
  }

  const user = await User.findOne({
    where: { email: email }
  }).catch(err => {
    console.error(err);
  });

  if (user === null) {
    return { error: 'That user does not exist. Please create an account.' };
  }
  const match = await bcrypt.compare(password, user.password);

  return match ? user.id : false;
};

const authController = {
  registerUser: registerUser,
  loginUser: loginUser
};

module.exports = authController;
