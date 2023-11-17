'use strict';
const excelToJson = require('convert-excel-to-json');
const result = excelToJson({
	sourceFile: './rawdata/ECSBnkBrn.xlsx'
});
// console.log(result);
const arr = []
result.INST.forEach(ele => { 
    arr.push({  bankCode:ele.A,
            bankName: ele.B})

  
});
arr.shift()


/** @type {import('sequelize-cli').Migration} */
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
    await queryInterface.bulkInsert({ tableName: "bank_brands", schema: 'static_data' },arr,{});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete({ tableName: "bank_brands", schema: 'static_data' }, null, {});
  }
};
