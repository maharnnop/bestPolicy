const Policy = require("../models").Policy;
const Transaction = require("../models").Transaction;
const CommOVIn = require("../models").CommOVIn; //imported fruits array
const CommOVOut = require("../models").CommOVOut;
const process = require('process');
require('dotenv').config();
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

const findTransaction = async (req,res) => {
  // let transac1 = null
  // let transac2 = null
  let transac = []
  if (req.body.payType === 'amity') {
    if (req.body.repType === 'insuerName') {
      transac.push(['Prem', 'O'])
      // transac1 = ['Prem','I']
    } else if (req.body.repType === 'agentCode') {
      transac.push(['Com', 'O'])
      transac.push(['OV', 'O'])
      // transac1 = ['Com/OV','O']
    }
  } else if (req.body.payType === 'insuerName' && req.body.repType === 'amity') {
    transac.push(['Com', 'I'])
    transac.push(['OV', 'I'])
    // transac1 = ['Com/OV','I']
  } else if (req.body.payType === 'agentCode') {
    transac.push(['Prem', 'I'])
    // transac1 = ['Prem','I']
    if (req.body.repType === 'insuerName') {
      transac.push(['Prem', 'O'])
      // transac2 = ['Prem','O']
    } else if (req.body.repType === 'amity') {
      transac.push(['Com', 'O'])
      transac.push(['OV', 'O'])
      // transac2 = ['Com/OV','O']
    }
  }
  const records = []
    for (let i = 0; i < transac.length; i++) {
    
    const data = await sequelize.query(
          'select (select ent."t_ogName" from static_data."Insurers" ins join static_data."Entities" ent on ent.id = ins."entityID" where ins."insurerCode" = tran."insurerCode" ) as "insurerName",* from static_data."Transactions" tran  where '+
          'CASE WHEN :filter = \'policyNo\'  THEN tran."policyNo" = :value '+
          'WHEN :filter = \'agentCode\' then tran."agentCode" = :value '+
          'else tran."insurerCode" = (select "insurerCode" from static_data."Insurers" ins join static_data."Entities" ent on ent.id = ins."entityID" where ent."t_ogName" = :value ) '+
          'END and tran."payNo" is null and tran."transType" = :transType and "transStatus" = :status ',
          {
            replacements: {
              filter:req.body.filterName,
              value:req.body.value,
              transType: transac[i][0],
              status: transac[i][1]
            },
            type: QueryTypes.SELECT
          }
        );
        records.push(...data)

    }
    await res.json(records)
  
}




const newPayment = async (req, res) => {

  
  for (let i = 0; i < req.body.length; i++) {
    await sequelize.query(
      'insert into static_data."Entities" ("personType","titleID","t_ogName","t_firstName","t_lastName","idCardType","idCardNo","taxNo") ' +
      'values (:personType, (select "TITLEID" from static_data."Titles" where "TITLEABTHAIBEGIN" = :title), :t_ogName, :t_firstName, :t_lastName,:idCardType,:idCardNo,:taxNo) ' +
      'ON CONFLICT ((case when :personType = \'P\' then "idCardNo" else "taxNo" end)) DO NOTHING RETURNING "id" ',
      {
        replacements: {
          personType: req.body[i].personType,
          title: req.body[i].title,
          t_ogName: req.body[i].t_ogName,
          t_firstName: req.body[i].t_firstName,
          t_lastName: req.body[i].t_lastName,
          idCardType: req.body[i].idCardType,
          idCardNo: req.body[i].idCardNo,
          taxNo: req.body[i].taxNo
        },
        type: QueryTypes.INSERT
      }
    ).then(async (entity) => {

      console.log(entity);
      if (entity[1] === 1) {   // entity[1] === 1 when create new entity


        const insuree = await Insuree.create({ entityID: entity[0][0].id, insureeCode: 'A' + entity[0][0].id }, { returning: ['insureeCode'] })
        console.log({ true: insuree });
        await sequelize.query(
          'insert into static_data."Policies" ("policyNo","insureeCode","insurerCode","agentCode","insureID","actDate", "expDate" ,prem, duty, stamp, total) ' +
          // 'values (:policyNo, (select "insureeCode" from static_data."Insurees" where "entityID" = :entityInsuree), '+
          'values (:policyNo, :insureeCode, ' +
          '(select "insurerCode" from static_data."Insurers" where "entityID" = (select id from static_data."Entities" where "t_ogName" = :insurername)), ' +
          ':agentCode, (select "id" from static_data."InsureTypes" where "insureName" = :insureName), ' +
          ':actDate, :expDate, :prem, :duty, :stamp, :total) ',
          {
            replacements: {
              policyNo: req.body[i].policyNo,
              // entityInsuree:
              insureeCode: insuree['dataValues'].insureeCode,
              insurername: req.body[i].insurerName,
              agentCode: req.body[i].agentCode,
              insureName: req.body[i].insureName,
              actDate: req.body[i].actDate,
              expDate: req.body[i].expDate,
              prem: req.body[i].prem,
              duty: req.body[i].duty,
              stamp: req.body[i].stamp,
              total: req.body[i].total
            },
            type: QueryTypes.INSERT
          }
        )

        //create location
        await sequelize.query(
          //       'WITH data_to_insert AS ( SELECT ' +
          //       ':entityID AS entityID, ' +
          //       ':t_location_1 AS t_location_1,' +
          // ':t_location_2 AS t_location_2, ' +
          // ':t_location_3 AS t_location_3, ' +
          // ':t_location_4 AS t_location_4, ' +
          // ':t_location_5 AS t_location_5, ' +
          // ':province AS province, ' +
          // ':district AS district, ' +
          // ':tambon AS tambon, ' +
          // ':zipcode AS zipcode, ' +
          // ':tel_1 AS tel_1, ' +
          // ':locationType AS locationType ) ' +
          // 'INSERT INTO static_data."Locations" ("entityID", "t_location_1", "t_location_2", "t_location_3", "t_location_4", "t_location_5", "provinceID", "districtID", "subDistrictID", "zipcode", "telNum_1","locationType") ' +
          // 'SELECT ' +
          // 'data.entityID, ' +
          // 'data.t_location_1, ' +
          // 'data.t_location_2, ' +
          // 'data.t_location_3, ' +
          // 'data.t_location_4, ' +
          // 'data.t_location_5, ' +
          // '(select "provinceid" from static_data.provinces where t_provincename = data.province), ' +
          // '(select "amphurid" from static_data."Amphurs" where t_amphurname = data.district), ' +
          // '(select "tambonid" from static_data."Tambons" where t_tambonname = data.tambon), ' +
          // 'data.zipcode, ' +
          // 'data.tel_1, ' +
          // 'data.locationType ' +
          // 'FROM data_to_insert data WHERE NOT EXISTS ( SELECT 1 FROM static_data."Locations" WHERE "entityID" = data.entityID )',

          'INSERT INTO static_data."Locations" ("entityID", "t_location_1", "t_location_2", "t_location_3", "t_location_4", "t_location_5", "provinceID", "districtID", "subDistrictID", "zipcode", "telNum_1","locationType") ' +
          'values(:entityID, :t_location_1, :t_location_2,  :t_location_3, :t_location_4, :t_location_5, ' +
          '(select "provinceid" from static_data.provinces where t_provincename = :province), ' +
          '(select "amphurid" from static_data."Amphurs" where t_amphurname = :district), ' +
          '(select "tambonid" from static_data."Tambons" where t_tambonname = :tambon), ' +
          ':zipcode, :tel_1, :locationType) ',
          {
            replacements: {
              entityID: entity[0][0].id,
              t_location_1: req.body[i].t_location_1,
              t_location_2: req.body[i].t_location_2,
              t_location_3: req.body[i].t_location_3,
              t_location_4: req.body[i].t_location_4,
              t_location_5: req.body[i].t_location_5,
              province: req.body[i].province,
              district: req.body[i].distric,
              tambon: req.body[i].subdistric,
              zipcode: req.body[i].zipcode,
              tel_1: req.body[i].telNum_1,
              locationType: 'A'
            },
            type: QueryTypes.INSERT
          }
        )
      } else {
        //select insuree
        const insuree = await sequelize.query(
          'select * FROM static_data."Insurees" ins JOIN static_data."Entities" ent ON ins."entityID" = ent."id" WHERE (CASE WHEN ent."personType" = \'P\' THEN "idCardNo" ELSE "taxNo" END) = :idNo ',
          { replacements: { idNo: req.body[i].personType === "P" ? req.body[i].idCardNo : req.body[i].taxNo }, type: QueryTypes.SELECT })
        console.log({ false: insuree });
        await sequelize.query(
          'insert into static_data."Policies" ("policyNo","insureeCode","insurerCode","agentCode","insureID","actDate", "expDate" ,prem, duty, stamp, total) ' +
          // 'values (:policyNo, (select "insureeCode" from static_data."Insurees" where "entityID" = :entityInsuree), '+
          'values (:policyNo, :insureeCode, ' +
          '(select "insurerCode" from static_data."Insurers" where "entityID" = (select id from static_data."Entities" where "t_ogName" = :insurername)), ' +
          ':agentCode, (select "id" from static_data."InsureTypes" where "insureName" = :insureName), ' +
          ':actDate, :expDate, :prem, :duty, :stamp, :total) ',
          {
            replacements: {
              policyNo: req.body[i].policyNo,
              // entityInsuree:
              insureeCode: insuree[0].insureeCode,
              insurername: req.body[i].insurerName,
              agentCode: req.body[i].agentCode,
              insureName: req.body[i].insureName,
              actDate: req.body[i].actDate,
              expDate: req.body[i].expDate,
              prem: req.body[i].prem,
              duty: req.body[i].duty,
              stamp: req.body[i].stamp,
              total: req.body[i].total
            },
            type: QueryTypes.INSERT
          }
        )

      }


    })


    // edit transection
    sequelize.query(
      'select * FROM static_data."CommOVOuts" comout ' +
      'JOIN static_data."CommOVIns" comin ' +
      'ON comin."insurerCode" = comout."insurerCode" and comin."insureID" = comout."insureID" ' +
      'where comout."AgentGroupCode" = ( ' +
      'SELECT "agentGroupCode" FROM static_data."Agents" ' +
      'where "agentCode" = :agentcode) ' +
      'and comout."insureID" = (select "id" from static_data."InsureTypes" where "insureName" = :insureName) ',
      {
        replacements: { agentcode: req.body[i].agentCode, insureName: req.body[i].insureName },
        type: QueryTypes.SELECT
      }
    ).then((records) => {
      // let record =  JSON.stringify(records[0],null,2)
      // res.json(records[0].id)
      const setupcom = [["rateComOut", "amountComOut", 'Com', 'O'],
      ["rateComIn", "amountComIn", 'Com', 'I'],
      ["rateOVOut_1", "amountOVOut_1", 'OV', 'O'],
      ["rateOVOut_2", "amountOVOut_2", 'OV', 'O'],
      ["rateOVOut_3", "amountOVOut_3", 'OV', 'O'],
      ["rateOVOut_4", "amountOVOut_4", 'OV', 'O'],
      ["rateOVOut_5", "amountOVOut_5", 'OV', 'O'],
      ["rateOVIn_1", "amountOVIn_1", 'OV', 'I'],
      ["rateOVIn_2", "amountOVIn_2", 'OV', 'I'],
      ["rateOVIn_3", "amountOVIn_3", 'OV', 'I'],
      ["rateOVIn_4", "amountOVIn_4", 'OV', 'I'],
      ["rateOVIn_5", "amountOVIn_5", 'OV', 'I']]

      for (let j = 0; j < setupcom.length; j++) {
        if (records[0][setupcom[j][0]] != null || records[0][setupcom[j][1]] != null) {

          sequelize.query(
            'INSERT INTO static_data."Transactions" ' +
            '("transType", "transStatus", "subType", "insurerCode", "agentGroupCode", "agentCode", "policyNo", "rate","amount", "duty","stamp", "total","dueDate" ) ' +
            'VALUES (:type, :status, 1, ' +
            '(select "insurerCode" from static_data."Insurers" where "entityID" = (select id from static_data."Entities" where "t_ogName" = :insurername)), ' +
            ':agentGroupCode ,:agentCode, :policyNo, :rate ,:amount ,:duty ,:stamp,:total,:duedate) ',
            {
              replacements: {
                type: setupcom[j][2],
                status: setupcom[j][3],
                insurername: req.body[i].insurerName,
                agentGroupCode: records[0]["AgentGroupCode"],
                agentCode: req.body[i].agentCode,
                policyNo: req.body[i].policyNo,
                rate: records[0][setupcom[j][0]],
                amount: records[0][setupcom[j][1]],
                duty: null,
                stamp: null,
                total: null,
                duedate: '2022-05-01'
              },
              type: QueryTypes.INSERT
            }
          );

        }

      }
    })





  }
//create payment
const record = await sequelize.query(
  'insert into static_data."Entities" ("personType","titleID","t_ogName","t_firstName","t_lastName","idCardType","idCardNo","taxNo") ' +
  'values (:personType, (select "TITLEID" from static_data."Titles" where "TITLEABTHAIBEGIN" = :title), :t_ogName, :t_firstName, :t_lastName,:idCardType,:idCardNo,:taxNo) ' +
  'ON CONFLICT ((case when :personType = \'P\' then "idCardNo" else "taxNo" end)) DO NOTHING RETURNING "id" ',
  {
    replacements: {
      personType: req.body[i].personType,
      title: req.body[i].title,
      t_ogName: req.body[i].t_ogName,
      t_firstName: req.body[i].t_firstName,
      t_lastName: req.body[i].t_lastName,
      idCardType: req.body[i].idCardType,
      idCardNo: req.body[i].idCardNo,
      taxNo: req.body[i].taxNo
    },
    type: QueryTypes.INSERT
  }
)



  await res.json({ status: 'success' })
};

module.exports = {


  findTransaction,
  // removeCar,
  // editCar,
};