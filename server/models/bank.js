'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bank extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Bank.init({
    bankBrand: DataTypes.STRING,
    bankBranch: DataTypes.STRING,
    bankNo: DataTypes.STRING,
    type: DataTypes.STRING,
    code: DataTypes.STRING,
    lastversion: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Bank',
    schema: 'static_data',
    tableName: 'Bank'
  });
  return Bank;
};