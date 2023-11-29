'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MT_Brand extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MT_Brand.init({
    BRANDCODE: DataTypes.INTEGER,
    BRANDNAME: DataTypes.STRING,
    BRANDNAMETH: DataTypes.STRING,
    sortno: DataTypes.INTEGER,
    activeflag: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'MT_Brand',
    schema: 'static_data'
  });
  return MT_Brand;
};