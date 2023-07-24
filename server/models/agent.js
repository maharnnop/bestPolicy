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
    // A = active I = inactive
    status: DataTypes.CHAR,
    note:  DataTypes.STRING,
    entityID: DataTypes.INTEGER,
    
  }, {
    sequelize,
    modelName: 'Agent',
    schema: 'static_data'
  });
  return Agent;
};