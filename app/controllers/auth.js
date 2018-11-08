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
    return 'The user already exists.';
  }

  return await dbInterface
    .createUser(email, password)
    .catch(err => console.error(err));
};

module.exports = {
  registerUser: registerUser
};
