'use strict';

const models = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const demoUsers = await getDemoUsers();
    const demoOrganizations = await getDemoOrganizations();
    return queryInterface.bulkInsert(
      'Messages',
      [
        {
          orgId: demoOrganizations[0],
          userId: demoUsers[1],
          message: 'Hello World',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          orgId: demoOrganizations[1],
          userId: demoUsers[2],
          message: 'What! Who sent me!?',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    const demoOrganizations = await getDemoOrganizations();
    return queryInterface.bulkDelete('Messages', null, {
      where: {
        orgId: demoOrganizations
      }
    });
  }
};

async function getDemoUsers() {
  let demoUsers = await models.User.findAll({
    where: {
      email: [
        'admin@mail.com',
        'kevin@mail.com',
        'coach@mail.com',
        'aaron@mail.com',
        'user@mail.com'
      ]
    }
  });

  demoUsers = demoUsers.map(user => {
    return Number(user.dataValues.id);
  });

  return demoUsers;
}

async function getDemoOrganizations() {
  let demoOrganizations = await models.Organization.findAll({
    where: {
      subscriptionCode: ['testorg1', 'testorg2', 'testorg3']
    }
  });

  demoOrganizations = demoOrganizations.map(org => {
    return Number(org.dataValues.id);
  });

  return demoOrganizations;
}
