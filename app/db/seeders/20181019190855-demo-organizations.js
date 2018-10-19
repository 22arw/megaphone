'use strict';

const models = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const demoUsers = await getDemoUsers();
    const demoBases = await getDemoBases();

    return queryInterface.bulkInsert(
      'Organizations',
      [
        {
          orgName: 'Test Organization 1',
          orgOwner: demoUsers[1],
          baseId: demoBases[0],
          subscriptionCode: 'testorg1',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          orgName: 'Test Organization 2',
          orgOwner: demoUsers[2],
          baseId: demoBases[1],
          subscriptionCode: 'testorg2',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Organizations', null, {
      where: {
        subscriptionCode: ['testorg1', 'testorg2']
      }
    });
  }
};

// Need to perform a query for my demo user base id's.

async function getDemoUsers() {
  let demoUsers = await models.User.findAll({
    where: {
      email: [
        'admin@email.com',
        'kevin@email.com',
        'coach@email.com',
        'aaron@email.com'
      ]
    }
  });

  demoUsers = demoUsers.map(user => {
    return Number(user.dataValues.id);
  });

  return demoUsers;
}

async function getDemoBases() {
  let demoBases = await models.Base.findAll({
    where: {
      baseCode: ['test-12345', 'test-23456']
    }
  });

  demoBases = demoBases.map(base => {
    return Number(base.dataValues.id);
  });

  return demoBases;
}
