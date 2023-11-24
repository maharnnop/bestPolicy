'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Title extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Title.init({
    TITLEID: DataTypes.INTEGER,
    TITLETHAIBEGIN: DataTypes.STRING,
    TITLETHAIEND: DataTypes.STRING,
    TITLETYPE: DataTypes.STRING,
    seqno:DataTypes.INTEGER,
    DHIPTITLE: DataTypes.INTEGER,
    GENDER: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Title',
    schema: 'static_data'
  });
  return Title;
};