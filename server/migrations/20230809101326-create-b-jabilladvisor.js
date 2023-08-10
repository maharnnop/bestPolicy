'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('b_jabilladvisors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      insurerno: {
        type: Sequelize.STRING
      },
      advisorno: {
        type: Sequelize.STRING
      },
      billadvisorno: {
        type: Sequelize.STRING
      },
      billdate: {
        type: Sequelize.DATEONLY
      },
      createusercode: {
        type: Sequelize.STRING
      },
      amt: {
        type: Sequelize.FLOAT
      },
      cashierreceiptno: {
        type: Sequelize.STRING
      },
      active: {
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('b_jabilladvisors',{ schema: 'static_data'});
  }
};