'use strict';

/** @type {import('sequelize-cli').Migration} */
const rawdata  = require('../rawdata/tmsp_202311240951.json')

const data = rawdata.value.map(function(item) {
  return {
    "SPECCODE": item.speccode,
    "MODELCODE": item.modelcode,
    "SPECNAMETH": item.specnameth,
    "SPECNAME": item.specname,
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
    await   queryInterface.bulkInsert({ tableName: "MT_Specs", schema: 'static_data' },data,{});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete({ tableName: "MT_Specs", schema: 'static_data' }, null, {});

  }
};
