'use strict';
const rawdata  = require('../rawdata/tmbr_202311240936.json')
/** @type {import('sequelize-cli').Migration} */
const data = rawdata.value.map(function(item) {
  return {
    "BRANDCODE": item.brandcode,
    "BRANDNAMETH": item.brandnameth.trim(),
    "BRANDNAME": item.brandname.trim(),
    "activeflag": item.activeflag.trim()
  };
});
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
    await   queryInterface.bulkInsert({ tableName: "MT_Brands", schema: 'static_data' },data,{});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete({ tableName: "MT_Brands", schema: 'static_data' },null,{});
  }
};
