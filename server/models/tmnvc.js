'use strict';
const {
  Model
} = require('sequelize');


module.exports = (sequelize, DataTypes) => {

  class tmnvc extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  tmnvc.init({
    newvoluntarycode: DataTypes.STRING,
    t_description: DataTypes.STRING,
    active: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'tmnvc',
    schema: 'static_data',
    tableName: 'tmnvc'
  });
  return tmnvc;
};