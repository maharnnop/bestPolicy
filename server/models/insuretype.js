'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class InsureType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  InsureType.init({
    // insureID:  DataTypes.INTEGER,      
    // Motor, PA, FR
   
    class:  DataTypes.STRING,
    subClass: DataTypes.STRING,
    planCode: DataTypes.STRING,
    insureName:  DataTypes.STRING,
    invoiceCode: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'InsureType',
    schema: 'static_data'
  });
  return InsureType;
};