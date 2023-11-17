'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class bank_branch extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  bank_branch.init({
    bankCode: DataTypes.STRING,
    branchCode: DataTypes.STRING,
    branchName: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'bank_branch',
    schema: 'static_data'
  });
  return bank_branch;
};