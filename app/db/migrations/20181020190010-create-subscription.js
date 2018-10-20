'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Subscriptions', {
      orgId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      phoneNumber: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
        validate: {
          notEmpty: true
        }
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
    return queryInterface.dropTable('Subscriptions');
  }
};
