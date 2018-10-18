'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('bases', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      basePhoneNumber: {
        type: Sequelize.STRING
      },
      baseName: {
        type: Sequelize.STRING
      },
      baseCode: {
        type: Sequelize.STRING
      },
      bandwidthUserId: {
        type: Sequelize.STRING
      },
      bandwidthApiToken: {
        type: Sequelize.STRING
      },
      bandwidthApiSecret: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('bases');
  }
};