'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Bases',
      [
        {
          basePhoneNumber: process.env.BASE_PHONE_NUMBER || '+12345678909',
          baseName: 'Test AFB 1',
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
          bandwidthUserId: process.env.BANDWIDTH_USER_ID || 'bandwidth user id',
          bandwidthApiToken:
            process.env.BANDWIDTH_API_TOKEN || 'bandwidth api token',
          bandwidthApiSecret:
            process.env.BANDWIDTH_API_SECRET || 'bandwidth api secret',
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
        baseName: ['Test AFB 1', 'Test AFB 2']
      }
    });
  }
};
