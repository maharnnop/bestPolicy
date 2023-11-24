'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MT_Brands', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      BRANDCODE: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      BRANDNAME: {
        allowNull: false,
        type: Sequelize.STRING
      },
      BRANDNAMETH: {
        type: Sequelize.STRING
      },
      SHORTNAME: {
        type: Sequelize.STRING
      },
      DHIPBRANDCODE: {
        type: Sequelize.STRING
      },
      sortno: {
        type: Sequelize.INTEGER
      },
      activeflag: {
        defaultValue: 'Y',
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
    await queryInterface.dropTable('MT_Brands',{ schema: 'static_data'});
  }
};