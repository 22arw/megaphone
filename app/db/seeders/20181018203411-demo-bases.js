'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Bases',
      [
        {
          basePhoneNumber: '+12345678909',
          baseName: 'Test AFB 1',
          baseCode: 'test-12345',
          bandwidthUserId: process.env.BANDWIDTH_USER_ID || 'bandwidth user id',
          bandwidthApiToken:
            process.env.BANDWIDTH_API_TOKEN || 'bandwidth api token',
          bandwidthApiSecret:
            process.env.BANDWIDTH_API_SECRET || 'bandwidth api secret',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          basePhoneNumber: '+12345678908',
          baseName: 'Test AFB 2',
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
    return queryInterface.bulkDelete('Bases', null, {
      where: {
        baseCode: ['test-12345', 'test-23456']
      }
    });
  }
};
