'use strict';

/** @type {import('sequelize-cli').Migration} */
const rawdata  = require('../rawdata/tmmd_202311240949.json')
const data = rawdata.value.map(function(item) {
if (item.modelname !== null) {
  item.modelname = item.modelname.trim()
}
if (item.modelnameth !== null) {
  item.modelnameth = item.modelnameth.trim()
}

  return {
    "MODELCODE": item.modelcode,
    "BRANDCODE": item.brandcode,
    "MODELNAME": item.modelname,
    "MODELNAMETH": item.modelnameth,
    "activeflag": item.activeflag
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
    await   queryInterface.bulkInsert({ tableName: "MT_Models", schema: 'static_data' },data,{});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete({ tableName: "MT_Models", schema: 'static_data' }, null, {});
  }
};
