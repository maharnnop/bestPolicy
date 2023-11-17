'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class bank_brand extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  bank_brand.init({
    bankName: DataTypes.STRING,
    bankCode: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'bank_brand',
    schema: 'static_data'
  });
  return bank_brand;
};