'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert(
      'Users',
      [
        {
          email: 'kevin@email.com',
          password: 'asdf',
          isAdmin: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          email: 'coach@email.com',
          password: 'asdf',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          email: 'aaron@email.com',
          password: 'asdf',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */

    return queryInterface.bulkDelete('User', null, {});
  }
};
