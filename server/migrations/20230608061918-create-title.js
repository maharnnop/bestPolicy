'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Titles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      TITLEID: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      TITLETHAIBEGIN: {
        allowNull: false,
        type: Sequelize.STRING
      },
      TITLETHAIEND: {
        type: Sequelize.STRING
      },
      TITLETYPE: {
        type: Sequelize.STRING
      },
      DHIPTITLE: {
        type: Sequelize.INTEGER
      },
      seqno: {
        type: Sequelize.INTEGER
      },
      GENDER: {
        type: Sequelize.STRING
      },
      createdAt: {
        defaultValue: new Date(),
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        defaultValue: new Date(),
        allowNull: false,
        type: Sequelize.DATE
      }
    },{ schema: 'static_data'});
  },
   down(queryInterface, Sequelize) {
    return queryInterface.dropTable('Titles');
  }
};