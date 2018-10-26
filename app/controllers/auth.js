const bcrypt = require('bcrypt');

const { User } = require('../db/models');

const dbInterface = require('./dbInterfaces');
const utils = require('../utils');

const registerUser = async (email, password, passwordConfirmation) => {
  if (!utils.isValidEmail(email)) {
    return 'That is not a valid email address';
  }

  if (password !== passwordConfirmation) {
    return "Passwords don't match.";
  }

  const doesUserExist = await dbInterface
    .doesUserExist(email)
    .catch(err => console.error(err));
  if (doesUserExist) {
    return 'That user already exists';
  }

  return await dbInterface
    .createUser(email, password)
    .catch(err => console.error(err));
};

const loginUser = async (email, password) => {
  if (!utils.isValidEmail(email)) {
    return 'That is not a valid email address';
  }

  // const user = await User.findOne({
  //   where: { email: email }
  // }).catch(err => console.error(err));

  const doesUserExist = await dbInterface
    .doesUserExist(email)
    .catch(err => console.error(err));

  if (!doesUserExist) {
    return 'That user does not exist. Please create an account.';
  }

  const user = await dbInterface
    .getUserByEmail(email)
    .catch(err => console.error(err));

  // const match = await bcrypt.compare(password, user.password);

  return (await bcrypt.compare(password, user.password))
    ? user
    : 'The username or password you entered could not be authenticated.';
};

const authController = {
  registerUser: registerUser,
  loginUser: loginUser
};

module.exports = authController;
