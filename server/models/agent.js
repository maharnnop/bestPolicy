'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Agent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Agent.init({
    agentCode:  DataTypes.STRING,
    agentGroupCode:DataTypes.STRING,
    // พนงประจำ พนงขาย พนงอิสระ
    EMPType: DataTypes.CHAR,
    // ใบอนุญาติ
    licentNo: DataTypes.STRING,
    licentExp: DataTypes.DATEONLY,
      // ใบอนุญาติชีวิต
    licentLifeNo: DataTypes.STRING,
    licentLifeExp:  DataTypes.DATEONLY,
    premCreditT:  DataTypes.INTEGER,
    commovCreditT:  DataTypes.INTEGER,
    // A = active I = inactive
    status: DataTypes.CHAR,
    // note:  DataTypes.STRING,
    entityID: DataTypes.INTEGER,
    stamentType: DataTypes.STRING,
    vatflag: DataTypes.STRING,
    taxno: DataTypes.STRING,
    contactPersonID : DataTypes.INTEGER,
    deductTaxRate: DataTypes.INTEGER,
    deductTaxType: DataTypes.STRING,
    commovCreditUnit: DataTypes.STRING,
    premCreditUnit: DataTypes.STRING,
    lastversion : DataTypes.STRING,
    version : DataTypes.INTEGER,
    
  }, {
    sequelize,
    modelName: 'Agent',
    schema: 'static_data'
  });
  return Agent;
};