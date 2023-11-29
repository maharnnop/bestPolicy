'use strict';
const { NOW } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tmcc', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      newvoluntarycode: {
        type: Sequelize.STRING
      },
      t_description: {
        type: Sequelize.STRING
      },
      compulsorycode: {
        type: Sequelize.STRING
      },
      active: {
        defaultValue:'Y',
        type: Sequelize.STRING
      },
      createdAt: {
        defaultValue: NOW,
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        defaultValue: NOW,
        allowNull: false,
        type: Sequelize.DATE
      }
    },{ schema: 'static_data'});
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tmcc',{ schema: 'static_data'});
  }
};