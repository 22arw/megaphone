'use strict';

const models = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const demoOrganizations = await getDemoOrganizations();

    return queryInterface.bulkInsert(
      'Subscriptions',
      [
        {
          orgId: demoOrganizations[0],
          phoneNumber: '+12345678909',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          orgId: demoOrganizations[1],
          phoneNumber: '+12345678909',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          orgId: demoOrganizations[0],
          phoneNumber: '+12345678908',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          orgId: demoOrganizations[1],
          phoneNumber: '+12345678908',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          orgId: demoOrganizations[0],
          phoneNumber: '+12345678907',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    const demoOrganizations = await getDemoOrganizations();

    return queryInterface.bulkDelete('Subscriptions', null, {
      where: {
        orgId: demoOrganizations
      }
    });
  }
};

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
