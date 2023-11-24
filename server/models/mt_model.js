'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MT_Model extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MT_Model.init({
    MODELCODE: DataTypes.INTEGER,
    BRANDCODE:  DataTypes.INTEGER,
    MODELNAMETH: DataTypes.STRING,
    MODELNAME: DataTypes.STRING,
    activeflag:DataTypes.STRING,
    sortno:  DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'MT_Model',
    schema: 'static_data'
  });
  return MT_Model;
};