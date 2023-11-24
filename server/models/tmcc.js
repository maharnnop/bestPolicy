'use strict';
const {
  Model
} = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  
  class tmcc extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  tmcc.init({
    newvoluntarycode: DataTypes.STRING,
    t_description: DataTypes.STRING,
    compulsorycode: DataTypes.STRING,
    active: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'tmcc',
    schema: 'static_data',
    tableName: 'tmcc'
  });
  return tmcc;
};