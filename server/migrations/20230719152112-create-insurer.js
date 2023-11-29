'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Insurers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      insurerCode: {
        unique: true,
        allowNull: false,
        type: Sequelize.STRING
      },
      // code คปภ ของ บริษัทประกัน
      KPPCode: {
        unique: true,
        allowNull: false,
        type: Sequelize.STRING
      },
      invoiceCode: {
        allowNull: false,
        type: Sequelize.STRING
      },
      // รูปแบบการหักภาษี
      deductTaxType: {
        allowNull: false,
        type: Sequelize.CHAR
      },
      // อัตราภาษี
      deductTaxRate: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      premCreditT: {
        type: Sequelize.INTEGER
      },
      commovCreditT: {
        type: Sequelize.INTEGER
      },
      
      entityID: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      contactPersonID: {
        type: Sequelize.INTEGER
      },
      stamentType: {
        defaultValue:"Gross",
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
    await queryInterface.dropTable('Insurers',{ schema: 'static_data'});
  }
};