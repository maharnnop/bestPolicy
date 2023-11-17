'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Transaction.init({
    polid:  DataTypes.INTEGER,
    billadvisorno:  DataTypes.STRING,
    netflag:  DataTypes.STRING,
    // prem comm ov1 ov2 ov3 disc
    transType:  DataTypes.STRING,
    txtype2:  DataTypes.INTEGER,
    // 1  , -1
    subType:  DataTypes.INTEGER,
    totalamt: DataTypes.FLOAT,
    paidamt:  DataTypes.FLOAT,
    remainamt:  DataTypes.FLOAT,
    status:  DataTypes.STRING,
    mainaccountcode: DataTypes.STRING,
    agentCode: DataTypes.STRING,
    agentCode2: DataTypes.STRING,
    insurerCode: DataTypes.STRING,
    policyNo:  DataTypes.STRING,
    endoseNo:  DataTypes.STRING,
    recieptno:  DataTypes.STRING,
    seqNo:  DataTypes.INTEGER,
    grossprem: DataTypes.FLOAT,
    duty:  DataTypes.FLOAT,
    tax:  DataTypes.FLOAT,
    totalprem:  DataTypes.FLOAT,
    commamt: DataTypes.FLOAT,
    commtaxamt:  DataTypes.FLOAT,
    ovamt:  DataTypes.FLOAT,
    ovtaxamt: DataTypes.FLOAT,
    rprefdate:   DataTypes.DATEONLY,
    dfrpreferno: DataTypes.STRING,
    "premin-rprefdate":  DataTypes.DATEONLY,
    "premin-rprefdate-dfrpreferno": DataTypes.STRING,
    "premout-rprefdate":   DataTypes.DATEONLY,
    "premout-rprefdate-dfrpreferno": DataTypes.STRING,
    dueDate: DataTypes.DATEONLY,
    groupStamentID: DataTypes.INTEGER, 
    
    
    
  }, {
    sequelize,
    modelName: 'Transaction',
    schema: 'static_data'
  });
  return Transaction;
};