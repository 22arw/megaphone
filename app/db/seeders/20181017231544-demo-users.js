'use strict';

/**
 * The password is pre-hashed here because bulkInsert() does not trigger the afterValidate hook on the model. There is a beforeBulkCreate hook, but the documentation around how to implement it is poor and I can't figure it out. If we did, then we may be able to do the hashing there instead of prehashing the password as we are here. Also, seed files are run against the migration file not the model file, so that is why we're being so specific.
 *
 * A good prehashing calculator is here: https://www.dailycred.com/article/bcrypt-calculator
 */

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Users',
      [
        {
          email: 'admin@mail.com',
          password:
            '$2a$10$/a7/3838gg7Ogrt.rq8cS.qCCs2D14M23xN0JcMHl3fVF5P.5iOTm', // password: asdf
          isAdmin: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          email: 'kevin@mail.com',
          password:
            '$2a$10$/a7/3838gg7Ogrt.rq8cS.qCCs2D14M23xN0JcMHl3fVF5P.5iOTm', // password: asdf
          isAdmin: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          email: 'coach@mail.com',
          password:
            '$2a$10$/a7/3838gg7Ogrt.rq8cS.qCCs2D14M23xN0JcMHl3fVF5P.5iOTm', // password: asdf
          isAdmin: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          email: 'aaron@mail.com',
          password:
            '$2a$10$/a7/3838gg7Ogrt.rq8cS.qCCs2D14M23xN0JcMHl3fVF5P.5iOTm', // password: asdf
          isAdmin: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          email: 'user@mail.com',
          password:
            '$2a$10$/a7/3838gg7Ogrt.rq8cS.qCCs2D14M23xN0JcMHl3fVF5P.5iOTm', // password: asdf
          isAdmin: false,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {
      where: {
        email: ['kevin@mail.com', 'coach@mail.com', 'aaron@mail.com']
      }
    });
  }
};
