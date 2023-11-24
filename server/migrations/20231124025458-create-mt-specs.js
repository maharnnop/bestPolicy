'use strict';
const { NOW } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MT_Specs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      SPECCODE: {
        type: Sequelize.INTEGER
      },
      MODELCODE: {
        type: Sequelize.INTEGER
      },
      SPECNAMETH: {
        type: Sequelize.STRING
      },
      SPECNAME: {
        type: Sequelize.STRING
      },
      activeflag: {
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
    await queryInterface.dropTable('MT_Specs',{ schema: 'static_data'});
  }
};