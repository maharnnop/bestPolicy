'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MT_Specs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MT_Specs.init({
    SPECCODE: DataTypes.INTEGER,
    MODELCODE: DataTypes.INTEGER,
    SPECNAMETH: DataTypes.STRING,
    SPECNAME: DataTypes.STRING,
    activeflag: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'MT_Specs',
  });
  return MT_Specs;
};