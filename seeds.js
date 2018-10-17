// NPM Packages
const bcrypt = require('bcrypt');

// Initializations
require('dotenv').config();
const saltRounds = Number(process.env.SALT_ROUNDS);

if (process.env.NODE_ENV === 'production') {
  // process.exit(1)
  throw new Error('Do not run seeds in production environment!');
}

// Reference Models
const models = require('./app/models');

models.sequelize
  .sync({ force: true })
  .then(() => {
    seed();
  })
  .catch(err => {
    console.error(err);
  });

async function seed() {
  await addUsers();
  // await addBase();
}

function addUsers() {
  bcrypt.hash('asdf', saltRounds).then(hash => {
    models.User.create({
      email: 'email@email.com',
      password: hash
    }).catch(err => {
      console.error(err);
    });
    models.User.create({
      email: 'admin@email.com',
      password: hash,
      isAdmin: true
    }).catch(err => {
      console.error(err);
    });
  });
}

// function addBase() {
//   models.User.addBase({
//     basePhoneNumber: 'base phone number',
//     baseName: 'base name',
//     baseCode: 'base code',
//     bandwidthUserId: 'bandwidth user id',
//     bandwidthApiToken: 'bandwidth api token',
//     bandwidthApiSecret: 'bandwidth api secret'
//   }).catch(err => console.error(err));
// }
