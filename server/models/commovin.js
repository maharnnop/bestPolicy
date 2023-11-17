'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CommOVIn extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CommOVIn.init({
    // coInID: DataTypes.INTEGER,
    insurerCode: DataTypes.STRING,
    insureID: DataTypes.INTEGER,
    // for MT
    voluntaryCode: DataTypes.STRING, // 110, 220, 330
    brandID:  DataTypes.INTEGER,
    modelID:  DataTypes.INTEGER,
    //for FR
    riskGruop:DataTypes.STRING, // hight, medium, low
    //for PA
    planCode: DataTypes.STRING,
    rateComIn: DataTypes.FLOAT,
    // amountComIn:  DataTypes.FLOAT,
    rateOVIn_1: DataTypes.FLOAT,
    // amountOVIn_1: DataTypes.FLOAT,
    // rateOVIn_2: DataTypes.FLOAT,
    // amountOVIn_2:DataTypes.FLOAT,
    // rateOVIn_3:  DataTypes.FLOAT,
    // amountOVIn_3: DataTypes.FLOAT,
    // rateOVIn_4:  DataTypes.FLOAT,
    // amountOVIn_4:  DataTypes.FLOAT,
    // rateOVIn_5:  DataTypes.FLOAT,
    // amountOVIn_5:  DataTypes.FLOAT,
    lastversion: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'CommOVIn',
    schema: 'static_data'
  });
  return CommOVIn;
};