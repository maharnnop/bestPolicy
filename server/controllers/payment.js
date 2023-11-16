const Policy = require("../models").Policy;
const Transaction = require("../models").Transaction;
const CommOVIn = require("../models").CommOVIn; //imported fruits array
const CommOVOut = require("../models").CommOVOut;
const b_jabilladvisor = require('../models').b_jabilladvisor;
const b_jabilladvisordetail = require('../models').b_jabilladvisordetail;
const process = require('process');
const {getRunNo,getCurrentDate} = require("./lib/runningno");
const {decode} = require('jsonwebtoken');
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
      transac.push(['PREM-OUT', 'O'])
      // transac1 = ['Prem','I']
    } else if (req.body.repType === 'agentCode') {
      transac.push(['COMM-OUT', 'O'])
      transac.push(['OV-OUT', 'O'])
      // transac1 = ['Com/OV','O']
    }
  } else if (req.body.payType === 'insuerName' && req.body.repType === 'amity') {
    transac.push(['COMM-IN', 'I'])
    transac.push(['OV-IN', 'I'])
    // transac1 = ['Com/OV','I']
  } else if (req.body.payType === 'agentCode') {
    transac.push(['PREM-IN', 'I'])
    // transac1 = ['Prem','I']
    if (req.body.repType === 'insuerName') {
      transac.push(['PREM-OUT', 'O'])
      // transac2 = ['Prem','O']
    } else if (req.body.repType === 'amity') {
      transac.push(['COMM-OUT', 'O'])
      transac.push(['OV-OUT', 'O'])
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
          'END and tran."payNo" is null and tran."transType" = :transType  ',
          {
            replacements: {
              filter:req.body.filterName,
              value:req.body.value,
              transType: transac[i][0],
              //status: transac[i][1]
            },
            type: QueryTypes.SELECT
          }
        );
        records.push(...data)

    }
    await res.json(records)
  
}

const findPolicyByPreminDue = async (req,res) => {

    const records = await sequelize.query(
      `select t."agentCode", t."insurerCode",  t."withheld" ,
      t."dueDate", t."policyNo", t."endorseNo", j."invoiceNo", t."seqNo" ,
      (select "id" from static_data."Insurees" where "insureeCode" = p."insureeCode" ) as customerid, 
      p."insureeCode",
      (select "t_firstName"||' '||"t_lastName"  as insureeName from static_data."Entities" where id =
      (select "entityID" from static_data."Insurees" where "insureeCode" = p."insureeCode" ) ) as insureeName , 
     
      j.polid, (select "licenseNo" from static_data."Motors" where id = p."itemList") , (select  "chassisNo" from static_data."Motors" where id = p."itemList"), j.netgrossprem, j.duty, j.tax, j.totalprem, j.commout_rate,
      j.commout_amt, j.ovout_rate, j.ovout_amt, t.netflag, t.remainamt
      from static_data."Transactions" t 
      join static_data.b_jupgrs j on t.polid = j.polid and t."seqNo" = j."seqNo" 
      join static_data."Policies" p on p.id = j.polid
     
      where "transType" = 'PREM-IN' 
      and txtype2 = '1' and rprefdate isnull and t."agentCode" = :agentCode and t."insurerCode" = :insurerCode and t.billadvisorno isnull 
      and "dueDate"<=:dueDate  and (case when :policyNoAll then true else t."policyNo" between :policyNoStart and :policyNoStart end)
      and j.installmenttype ='A'`,
          {
            replacements: {
              agentCode:req.body.agentCode,
              insurerCode:req.body.insurerCode,
              dueDate: req.body.dueDate,
              policyNoStart: req.body.policyNoStart,
              policyNoEnd: req.body.policyNoEnd,
              policyNoAll:req.body.policyNoAll,
            },
            type: QueryTypes.SELECT
          }
        );
        if (records.length === 0) {
          await res.status(201).json({msg:"not found policy"})
        }else{

          await res.json(records)
        }
  
}

const findPolicyByBillno = async (req,res) => {
    console.log(req.body.billadvisorno)
  const records = await sequelize.query(
    'select * from   static_data."Transactions"  tran join static_data."Policies" pol   on tran."policyNo" = pol."policyNo" where tran.billadvisorno = :billadvisorno  and "transType" = \'PREM-IN\'',
        {
          replacements: {
            billadvisorno: req.body.billadvisorno
          },
          type: QueryTypes.SELECT
        }
      );
      const old_keyid = await sequelize.query('select id from static_data.b_jabilladvisors where billadvisorno = :billadvisorno',{
        replacements: {
          billadvisorno: req.body.billadvisorno
        },
        type: QueryTypes.SELECT
      })

      if (records.length === 0) {
        await res.status(201).json({msg:"not found policy in bill"})
      }else{

        await res.json({data:records, old_keyid: old_keyid[0].id})
      }

}
const createbilladvisor = async (req,res) =>{
  const jwt = req.headers.authorization.split(' ')[1];
  const usercode = decode(jwt).USERNAME;
  const t = await sequelize.transaction();
  try{

  
      //insert to master jabilladvisor
      const billdate = new Date().toISOString().split('T')[0]
      const currentdate = getCurrentDate()
      req.body.bill.billadvisorno = 'BILL' + await getRunNo('bill',null,null,'kw',currentdate,t);
      const billadvisors = await sequelize.query(
        'INSERT INTO static_data.b_jabilladvisors (insurerno, advisorno, billadvisorno, billdate, createusercode, amt, cashierreceiptno, active ) ' +
        'VALUES ((select id from static_data."Insurers" where "insurerCode" = :insurerCode limit 1), '+
        '(select id from static_data."Agents" where "agentCode" = :agentCode limit 1), '+
        ':billadvisorno, :billdate, :createusercode, :amt, :cashierreceiptno, \'Y\') RETURNING "id"',
            {
              replacements: {
                insurerCode:req.body.bill.insurerCode,
                agentCode:req.body.bill.agentCode,
                 billadvisorno: req.body.bill.billadvisorno,
               
                billdate: billdate,
                createusercode: usercode,
                amt:req.body.bill.amt,
                cashierreceiptno:null,
              },
              transaction: t ,
              type: QueryTypes.INSERT
            }
          );
      for (let i = 0; i < req.body.detail.length; i++) {
          //insert to deteil of jabilladvisor
          sequelize.query(
            'insert into static_data.b_jabilladvisordetails (keyidm, polid, customerid, motorid, grossprem, duty, tax, totalprem, "comm-out%", "comm-out-amt", '+
            ' "ov-out%", "ov-out-amt", netflag, billpremium,updateusercode, seqno) '+
            'values (:keyidm, (select id from static_data."Policies" where "policyNo" = :policyNo limit 1), (select id from static_data."Insurees" where "insureeCode" = :insureeCode limit 1), :motorid, '+
            ':grossprem, :duty, :tax, :totalprem, :commout_rate, :commout_amt, :ovout_rate, :ovout_amt, :netflag, :billpremium, :updateusercode, :seqno) ',
                {
                  replacements: {
                    keyidm: billadvisors[0][0].id,
                    policyNo: req.body.detail[i].policyNo,
                    insureeCode: req.body.detail[i].insureeCode,
                    motorid: req.body.detail[i].itemList || null,
                    grossprem: req.body.detail[i].netgrossprem,
                    duty: req.body.detail[i].duty,
                    tax: req.body.detail[i].tax,
                    totalprem: req.body.detail[i].totalprem,
                    commout_rate: req.body.detail[i].commout_rate,
                    commout_amt: req.body.detail[i].commout_amt,
                    ovout_rate: req.body.detail[i].ovout_rate,
                    ovout_amt: req.body.detail[i].ovout_amt,
                    netflag: req.body.detail[i].statementtype,
                    billpremium: req.body.detail[i].billpremium,
                    updateusercode: usercode,
                    seqno: req.body.detail[i].seqNo,
                  },
                  transaction: t ,
                  type: QueryTypes.INSERT
                  
                }
              );

            }
            console.log(billadvisors[0][0].id);
            //update ARAP table
            await sequelize.query(
              'DO $$ '+
                'DECLARE a_polid int; a_billadvisorno text; a_netflag text; a_seqno int;'+
                'BEGIN FOR a_polid,a_billadvisorno,a_netflag, a_seqno IN '+
                    'SELECT polid, billadvisorno, netflag ,seqno FROM static_data.b_jabilladvisors m JOIN static_data.b_jabilladvisordetails d ON m.id = d.keyidm WHERE m.active = \'Y\' and m.id =  '+ billadvisors[0][0].id +
                ' LOOP  '+
                'UPDATE static_data."Transactions" SET billadvisorno = a_billadvisorno, netflag = a_netflag WHERE polid = a_polid and "seqNo" = a_seqno ; '+
                'END LOOP; '+
              'END $$;',{
                transaction: t ,
                raw: true 
              }
              
            )
            await t.commit();
            await res.json({msg:`created billadvisorNO : ${req.body.bill.billadvisor} success!!` })
        } catch (error) {
          console.log(error);
          await t.rollback();
          await res.status(500).json(error);

          }
        
        
}


const findbilladvisor =async (req,res) =>{
  
  const records = await sequelize.query(
    'select (select "insurerCode" from static_data."Insurers" where id = insurerno ), '+
    '(select "agentCode" from static_data."Agents" where id = advisorno ), *  from static_data.b_jabilladvisors '+
    'where 1=1 and cashierreceiptno is null '+ 
    'and active =\'Y\' '+
    'and (case when :insurerid is null then true else insurerno = :insurerid end) '+ 
    'and (case when :agentid is null then true else advisorno = :agentid end) '+
    'and (case when :billadvisorno is null then true else billadvisorno = :billadvisorno end) '+
    'and (case when :billdate is null then true else billdate <= :billdate end) ',
        {
          replacements: {
            insurerid: req.body.insurerid,
            agentid:req.body.agentid,
            billadvisorno: req.body.billadvisorno,
            billdate: req.body.billdate,
          },
          type: QueryTypes.SELECT
        }
      );
      
  await res.json(records)
}

const getbilladvisordetail =async (req,res) =>{
  
  const records = await sequelize.query(
    'select *   from  static_data.b_jabilladvisordetails d '+
    'join  static_data."Policies" pol on pol.id = d.polid '+
    'where 1=1 and d.keyidm = :keymid',
        {
          replacements: {
            keymid: req.body.keymid,
          },
          type: QueryTypes.SELECT
        }
      );

  await res.json(records)
}

const editbilladvisor = async (req,res) =>{
  //insert new bill to master jabilladvisor
  const jwt = req.headers.authorization.split(' ')[1];
    const usercode = decode(jwt).USERNAME;

  const t = await sequelize.transaction();
  try{
    const currentdate = getCurrentDate()
    req.body.bill.billadvisorno = 'BILL' + await getRunNo('bill',null,null,'kw',currentdate,t);
  const billadvisors = await sequelize.query(
    'INSERT INTO static_data.b_jabilladvisors (insurerno, advisorno, billadvisorno, billdate, createusercode, amt, cashierreceiptno, active, old_keyid ) ' +
    'VALUES ((select id from static_data."Insurers" where "insurerCode" = :insurerCode), '+
    '(select id from static_data."Agents" where "agentCode" = :agentCode), '+
    ':billadvisorno, :billdate, :createusercode, :amt, :cashierreceiptno, \'Y\', :old_keyid) RETURNING "id"',
        {
          replacements: {
            insurerCode:req.body.bill.insurerCode,
            agentCode:req.body.bill.agentCode,
            billadvisorno: req.body.bill.billadvisorno,
            billdate: new Date(),
            createusercode: usercode,
            amt:req.body.bill.amt,
            cashierreceiptno:null,
            old_keyid: req.body.bill.old_keyid,
          },
          transaction: t ,
          type: QueryTypes.INSERT
        }
      );

      //update status old bill
       await sequelize.query(
        'UPDATE static_data.b_jabilladvisors SET active = \'N\', inactiveusercode = :inactiveusercode, inactivedate = :inactivedate WHERE id = :old_keyid ;',
            {
              replacements: {
                inactivedate: new Date(),
                inactiveusercode: "kewneditja",
                old_keyid: req.body.bill.old_keyid,
              },
              transaction: t ,
              type: QueryTypes.INSERT
            }
          );

  for (let i = 0; i < req.body.detail.length; i++) {
      //insert to deteil of jabilladvisor
      await sequelize.query(
        'insert into static_data.b_jabilladvisordetails (keyidm, polid, customerid, motorid, grossprem, duty, tax, totalprem, "comm-out%", "comm-out-amt", '+
        ' "ov-out%", "ov-out-amt", netflag, billpremium,updateusercode, seqno) '+
        'values (:keyidm, (select id from static_data."Policies" where "policyNo" = :policyNo), (select id from static_data."Insurees" where "insureeCode" = :insureeCode), :motorid, '+
        ':grossprem, :duty, :tax, :totalprem, :commout_rate, :commout_amt, :ovout_rate, :ovout_amt, :netflag, :billpremium, :updateusercode, :seqno) ',
            {
              replacements: {
                keyidm: billadvisors[0][0].id,
                policyNo: req.body.detail[i].policyNo,
                insureeCode: req.body.detail[i].insureeCode,
                motorid: req.body.detail[i].itemList,
                grossprem: req.body.detail[i].grossprem,
                duty: req.body.detail[i].duty,
                tax: req.body.detail[i].tax,
                totalprem: req.body.detail[i].totalprem,
                commout_rate: req.body.detail[i].commout_rate,
                commout_amt: req.body.detail[i].commout_amt,
                ovout_rate: req.body.detail[i].ovout_rate,
                ovout_amt: req.body.detail[i].ovout_amt,
                netflag: req.body.detail[i].netflag,
                billpremium: req.body.detail[i].billpremium,
                updateusercode: "kewn",
                seqno: req.body.detail[i].seqNo,
              },
              transaction: t ,
              type: QueryTypes.INSERT
            }
          );

        }
        console.log('oldkeyid : ' +req.body.bill.old_keyid);
        console.log('billid : ' +billadvisors[0][0].id);
        //update ARAP table remove old billadvisor && netflag then update
        await sequelize.query(
          `DO $$ 
          DECLARE 
            a_polid int; 
            a_seqno int; 
            a_billadvisorno text; 
            a_netflag text; 
          BEGIN 
            -- Update rows where billadvisor matches
            UPDATE static_data."Transactions" 
            SET billadvisorno = null, netflag = null 
            WHERE billadvisorno = (SELECT billadvisorno FROM static_data.b_jabilladvisors WHERE id = ${req.body.bill.old_keyid} ); 
            
            -- Loop through selected rows and update
            FOR a_polid, a_billadvisorno, a_netflag , a_seqno IN 
              SELECT d.polid, m.billadvisorno, d.netflag ,d.seqno
              FROM static_data.b_jabilladvisordetails d 
              JOIN static_data.b_jabilladvisors m ON m.id = d.keyidm 
              WHERE m.active = 'Y' AND m.id = ${billadvisors[0][0].id} 
            LOOP
              UPDATE static_data."Transactions" 
              SET billadvisorno = a_billadvisorno, netflag = a_netflag 
              WHERE polid = a_polid and "seqNo" = a_seqno; 
            END LOOP; 
          END $$;`,
          { 
          transaction: t ,
          raw: true 
        }
        )

        await t.commit();

     } catch (error) {
      console.log(error);
      await t.rollback();
      await res.status(500).json(error);
      }
    await res.json({msg:"success!!"})
}

const createcashier = async (req,res) =>{
  const jwt = req.headers.authorization.split(' ')[1];
    const usercode = decode(jwt).USERNAME;
  //deaw ma tum tor
  const cashier = await sequelize.query(
    'insert into static_data.b_jacashiers (billadvisorno, cashierreceiven, cashierdate, dfrpreferno, transactiontype, insurercode,advisorcode, customerid, '+
    'receivefrom, receivename, receivetype, "partnerBank", "partnerBankbranch", "partnerAccountno", amt, createusercode, "amityBank", "amityBankbranch", "amityAccountno") '+
    'values ()',
        {
          replacements: {
            insurerID:req.body.bill.insurerID,
            agentID:req.body.bill.agentID,
            billadvisorno: req.body.bill.billadvisorno,
            billdate: Date.now(),
            createusercode: usercode,
            amt:req.body.bill.amt,
            cashierreceiptno:null,
          },
          type: QueryTypes.INSERT
        }
      );
  
    
    await res.json({msg:"success!!"})
}

module.exports = {


  findTransaction,
  findPolicyByPreminDue,
  findPolicyByBillno,
  createbilladvisor,
  findbilladvisor,
  getbilladvisordetail,
  editbilladvisor
};