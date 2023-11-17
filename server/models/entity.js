'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Entity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Entity.init({
    personType: DataTypes.CHAR,
    titleID:  DataTypes.INTEGER,
    t_ogName: DataTypes.STRING,
    t_suffixName: DataTypes.STRING,
    e_ogName:  DataTypes.STRING,
    t_firstName: DataTypes.STRING,
    t_lastName: DataTypes.STRING,
    e_firstName: DataTypes.STRING,
    e_lastName: DataTypes.STRING,
    email:  DataTypes.STRING,
    // IDCARD type บัตรปชช หนังสือเดินทาง
    idCardType: DataTypes.STRING,
    idCardNo: DataTypes.STRING,
    idCardActDate: DataTypes.DATEONLY,
    idCardExpDate: DataTypes.DATEONLY,
    dateOfBirth: DataTypes.DATEONLY,
    gender: DataTypes.STRING,
    // ประเภทการประกอบธุรกิจ
    ogType: DataTypes.STRING,
    // เลขทะเบียนการค้า
    taxNo:  DataTypes.STRING,
    taxActDate: DataTypes.DATEONLY,
    taxExpDate: DataTypes.DATEONLY,
    // จดทะเบียน VAT ไหม
    vatRegis:  DataTypes.BOOLEAN,
    // เลขที่ ภพ 20
    pk20: DataTypes.STRING,
    //ชื่อสาขา กรณี เป็น สาขาย่อย ,
    branch : DataTypes.STRING,
    lastversion : DataTypes.STRING,
    version : DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Entity',
    schema: 'static_data'
  });
  return Entity;
};