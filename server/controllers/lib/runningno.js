const TURUN = require("../../models").TURUN;

const process = require('process');
require('dotenv').config();
const { throws } = require("assert");

// const Package = require("../models").Package;
// const User = require("../models").User;
const { Op, QueryTypes, Sequelize } = require("sequelize");
//handle index request
// const showAll = (req,res) =>{
//     Location.findAll({
//     }).then((locations)=>{
//         res.json(locations);
//     })
// }

// Replace 'your_database', 'your_username', 'your_password', and 'your_host' with your database credentials
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        },
    },
});
// getRunNo ลอกมาจาก iia
// brCode = ยังไม่ใช้
//RunType = บอกว่าเป็น runno ของค่าอะไร ,
// Paramclass, subclass -> ในกรณีที่เลข runno แบ่งย่อยตาม class/subclass ประกัน 
// outletcode -> ยังไม่ใช้
const getRunNo = async (runtype,paramclass,subclass,usercode,effdate,t) => {

    //public static long GetRunNo(string BrCode, string RunType, string ParamClass, string SubClass, string OutletCode, string UpdateUserCode, DateTime EffectiveDate)
 
    let RunNo = 0;
    let RunType = runtype
    let ParamClass = paramclass
    let SubClass = subclass
    let UpdateUserCode = usercode
    let EffectiveDate = effdate

    try {

        await sequelize.authenticate();
        await sequelize.query('set lock_timeout = 5000');
        await sequelize.query('SET TRANSACTION ISOLATION LEVEL REPEATABLE READ');
        // const transaction = await sequelize.transaction();

        //table TURUNT
          const basisResult = await sequelize.query(`SELECT "PeriodBasis" FROM static_data."TURUNT" WHERE "RunType" = '${RunType}'`, { transaction: t,type: sequelize.QueryTypes.SELECT });
    if (basisResult.length === 0) {
      throw new Error(`RunType: ${RunType} not found in TURUNT !`);
    }
    const basis = basisResult[0].PeriodBasis.trim();

    let condition = `"RunType" = '${RunType}'`
    // {
    //     RunType,
    //   };
      if (ParamClass === '' || ParamClass === null) {
        //condition.Class = null;
      } else {
        //condition.Class = ParamClass;
        condition = condition + ` and "Class" = '${ParamClass}'`;
      }
      if (SubClass === '' || SubClass === null) {
        //condition.SubClass = null;
      } else {
        //condition.SubClass = SubClass;
        condition = condition + ` and "SubClass" = '${SubClass}'`;
      }
      
      if (basis !== '') {
        if (basis === 'D') {
          //condition.EffectiveDate = EffectiveDate;
          condition = condition + ` and "EffectiveDate" = '${EffectiveDate}'`
        } else {
          condition.EffectiveDate = ` and EXTRACT(YEAR FROM "EffectiveDate") = '${EffectiveDate.split('-')[0]}'` 
          if (basis === 'M') {
            condition.EffectiveDate = ` and EXTRACT(YEAR FROM "EffectiveDate") = '${EffectiveDate.split('-')[0]}'  AND EXTRACT(MONTH FROM "EffectiveDate") = '${EffectiveDate.split('-')[1]}'  `
          }
        }
      }

      const turunResult = await sequelize.query(`SELECT * FROM static_data."TURUN" WHERE ${condition} limit 1`, { transaction: t,type: sequelize.QueryTypes.SELECT });
      //TURUN.findOne({ where: condition, transaction });
    let RunID = 0;

    if (!turunResult[0]) {
      RunID = 0;
    } else {
      RunID = turunResult[0].RunID;
      try {
        await sequelize.query(`UPDATE static_data."TURUN" SET xlock = 'A' WHERE  "RunID" = ${RunID}`, { transaction: t, type: sequelize.QueryTypes.update});
        //await TURUN.update({ xlock: 'A' }, { where: {  RunID: RunID.toString() }, transaction });
      } catch (error) {
        RunNo = -999;
        throw new Error('TURUN: Record is Locked!!');
      }
    }

    const updatedTurunResult = await sequelize.query(`SELECT * FROM static_data."TURUN" WHERE ${condition} limit 1`, { transaction: t, type: sequelize.QueryTypes.SELECT });
    //const updatedTurunResult = await TURUN.findOne({ where: {  RunID: RunID.toString() }, transaction });
    console.log(updatedTurunResult);
    if (updatedTurunResult[0]) {
       RunNo = updatedTurunResult[0].LastNo + 1;
      // await TURUN.update({LastNo: RunNo, UpdateDate: sequelize.fn('current'), UpdateUserCode,}, {
      //   where: {  RunID: RunID.toString() },
      //   transaction,
      // });
      await sequelize.query(`UPDATE static_data."TURUN" SET "LastNo" = ${RunNo} WHERE  "RunID" = ${RunID}`, { transaction: t, type: sequelize.QueryTypes.update,});

    } else {
      const maxRunIDResult = await sequelize.query(`SELECT MAX("RunID") FROM static_data."TURUN" `, { transaction: t, type: sequelize.QueryTypes.SELECT, });
      if (maxRunIDResult[0]['max'] === null) {
        RunID = 1;
      } else {
        RunID = maxRunIDResult[0]['max'] + 1;
      }
      RunNo = 1;

      let effDateRunNo = '';
      let pClass = '';
      let pSubClass = '';

      // let UpdateDate = new Date()

      //     if (basis === 'Y') {
      //   effDateRunNo = UpdateDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/-/g, '/');
      // } else if (basis === 'M') {
      //   effDateRunNo = UpdateDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/-/g, '/');
      // } else {
      //   effDateRunNo = UpdateDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/-/g, '/');
      // }
      pClass = ParamClass === '' ? null : ParamClass;
      pSubClass = SubClass === '' ? null : SubClass;

      
      // await TURUN.create({RunID, RunType, Class: pClass, SubClass: pSubClass, EffectiveDate, LastNo: RunNo, UpdateDate: sequelize.fn('current'), UpdateUserCode,
      // }, { transaction });

      await sequelize.query(`insert into static_data."TURUN" ("RunID", "RunType", "Class", "SubClass", "EffectiveDate", "LastNo",  "UpdateUserCode") 
      values (${RunID}, '${RunType}', ${pClass}, ${pSubClass}, '${EffectiveDate}', ${RunNo}, '${UpdateUserCode}')`, { transaction: t, type: sequelize.QueryTypes.update,});
    }
    // await t.commit();
} catch (error) {
    throw error;
}


    return RunNo;



}

const testRunno =  async (req,res) =>{

  //deaw ma tum tor
    const result = await getRunNo(req.body,{})
   await res.json({result: result})
}

const  getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const day = String(today.getDate()).padStart(2, '0');
  let result = `${year}-${month}-${day}`
  return result.toString();
}

const  getCurrentYYMM = () => {
  const today = new Date();
  const year = String(today.getFullYear()).slice(-2);
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  let result = `${year}${month}`
  return result.toString();
}

const  getCurrentYY = () => {
  const today = new Date();
  const year = String(today.getFullYear()).slice(-2);
  let result = `${year}`
  return result.toString();
}

module.exports = {
getRunNo,
testRunno,
getCurrentDate,
getCurrentYY,
getCurrentYYMM

};