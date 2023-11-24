'use strict';

/** @type {import('sequelize-cli').Migration} */
const rawdata  = require('../rawdata/moc_tmnvc.json')
const data = rawdata.value
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await   queryInterface.bulkInsert({ tableName: "tmnvc", schema: 'static_data' },data,{});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete({ tableName: "tmnvc", schema: 'static_data' }, null, {});
  }
};
