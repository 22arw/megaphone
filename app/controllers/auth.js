const bcrypt = require('bcrypt');
// const saltRounds = Number(process.env.SALT_ROUNDS);

const { User } = require('../db/models');

const registerUser = async (email, password, passwordConfirmation) => {
  if (password !== passwordConfirmation) {
    return "passwords don't match.";
  }

  // const hash = await bcrypt.hash(password, saltRounds);

  const user = {
    email: email,
    password: password
  };

  const response = await User.create(user).catch(err => {
    console.error(`There was an error: ${err}`);
    return 'There was an error';
  });

  return response.id;
};

const loginUser = async (email, password) => {
  const user = await User.findOne({
    where: { email: email }
  }).catch(err => {
    console.error(err);
  });

  if (user === null) {
    return 'no user exits';
  }
  const match = await bcrypt.compare(password, user.password);

  return match ? user.id : false;
};

const authController = {
  registerUser: registerUser,
  loginUser: loginUser
};

module.exports = authController;
