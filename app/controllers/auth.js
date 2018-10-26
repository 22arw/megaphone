const bcrypt = require('bcrypt');

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
    return 'The username or password you entered could not be authenticated.';
  }

  return await dbInterface
    .createUser(email, password)
    .catch(err => console.error(err));
};

const loginUser = async (email, password) => {
  if (!utils.isValidEmail(email)) {
    return 'That is not a valid email address';
  }

  const doesUserExist = await dbInterface
    .doesUserExist(email)
    .catch(err => console.error(err));

  if (!doesUserExist) {
    return 'The username or password you entered could not be authenticated.';
  }

  const user = await dbInterface
    .getUserByEmail(email)
    .catch(err => console.error(err));

  return (await bcrypt.compare(password, user.password))
    ? user
    : 'The username or password you entered could not be authenticated.';
};

const authController = {
  registerUser: registerUser,
  loginUser: loginUser
};

module.exports = authController;
