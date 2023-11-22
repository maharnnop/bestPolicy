'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Insurer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Insurer.init({
    insurerCode: DataTypes.STRING,
    // code คปภ ของ บริษัทประกัน
    KPPCode:  DataTypes.STRING,
    // รูปแบบการหักภาษี
    deductTaxType:  DataTypes.CHAR,
    // อัตราภาษี
    deductTaxRate:  DataTypes.FLOAT,
    premCreditT:  DataTypes.INTEGER,
    commovCreditT:  DataTypes.INTEGER,
    entityID:  DataTypes.INTEGER,
    stamentType: DataTypes.STRING,
    contactPersonID : DataTypes.INTEGER,
    commovCreditUnit: DataTypes.STRING,
    premCreditUnit: DataTypes.STRING,
    lastversion : DataTypes.STRING,
    invoiceCode : DataTypes.STRING,
    version : DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Insurer',
    schema: 'static_data'
  });
  return Insurer;
};