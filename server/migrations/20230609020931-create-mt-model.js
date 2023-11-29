'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MT_Models', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      MODELCODE: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      BRANDCODE: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      
      MODELNAMETH: {
        type: Sequelize.STRING
      },
      MODELNAME: {
        type: Sequelize.STRING
      },
      
      activeflag: {
        defaultValue: 'Y',
        type: Sequelize.STRING
      },
      sortno: {
        
        type: Sequelize.INTEGER
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('MT_Models',{ schema: 'static_data'});
  }
};