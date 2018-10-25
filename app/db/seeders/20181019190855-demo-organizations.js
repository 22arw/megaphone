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
          subscriptionCode: 'TESTORG1',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          orgName: 'Test Organization 2',
          orgOwner: demoUsers[2],
          baseId: demoBases[1],
          subscriptionCode: 'TESTORG2',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          orgName: 'Test Organization 3',
          orgOwner: demoUsers[1],
          baseId: demoBases[1],
          subscriptionCode: 'TESTORG3',
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
        subscriptionCode: ['TESTORG1', 'TESTORG2', 'TESTORG3']
      }
    });
  }
};

async function getDemoUsers() {
  let demoUsers = await models.User.findAll({
    where: {
      email: [
        'admin@mail.mil',
        'kevin@mail.mil',
        'coach@mail.mil',
        'aaron@mail.mil'
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
