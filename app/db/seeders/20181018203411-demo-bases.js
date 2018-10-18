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
      'Bases',
      [
        {
          basePhoneNumber: '+12345678909',
          baseName: 'McConnell AFB',
          baseCode: 'test-12345',
          bandwidthUserId: 'bandwidth user id',
          bandwidthApiToken: 'bandwidth api token',
          bandwidthApiSecret: 'bandwidth api secret',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          basePhoneNumber: '+12345678908',
          baseName: 'Sheppard AFB',
          baseCode: 'test-23456',
          bandwidthUserId: 'bandwidth user id',
          bandwidthApiToken: 'bandwidth api token',
          bandwidthApiSecret: 'bandwidth api secret',
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

    return queryInterface.bulkDelete('Bases', null, {
      where: {
        baseCode: ['test-12345', 'test-23456']
      }
    });
  }
};
