'use strict';

const models = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const demoUsers = await getDemoUsers();
    const demoBases = await getDemoBases();

    return queryInterface.bulkInsert(
      'BaseManagers',
      [
        {
          baseId: demoBases[0],
          userId: demoUsers[1],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          baseId: demoBases[1],
          userId: demoUsers[1],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    const demoBases = await getDemoBases();
    return queryInterface.bulkDelete('BaseManagers', null, {
      where: {
        baseId: demoBases
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
        'aaron@mail.mil',
        'user@mail.mil'
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
      baseName: ['Test AFB 1', 'Test AFB 2']
    }
  });

  demoBases = demoBases.map(base => {
    return Number(base.dataValues.id);
  });

  return demoBases;
}
