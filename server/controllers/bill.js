const Policy = require("../models").Policy;
const Transaction = require("../models").Transaction;
const CommOVIn = require("../models").CommOVIn; //imported fruits array
const CommOVOut = require("../models").CommOVOut;
const b_jabilladvisor = require('../models').b_jabilladvisor;
const b_jabilladvisordetail = require('../models').b_jabilladvisordetail;
const BankBrand =require('../models').bank_brand;
const BankBranch =require('../models').bank_branch;
const process = require('process');
const {decode} = require('jsonwebtoken');
const config = require("../config.json");
require('dotenv').config();
// const Package = require("../models").Package;
// const User = require("../models").User;

const wht = config.wht

const {Op, QueryTypes, Sequelize} = require("sequelize");
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
const Joi = require('joi');
const {getRunNo,getCurrentDate,getCurrentYY,getCurrentYYMM} = require("./lib/runningno");

const test = (req, res) => {

    res.json("test");
};
//not use
// const createCashier = async (req, res) => {
//     const jwt = req.headers.authorization.split(' ')[1];
//     const usercode = decode(jwt).USERNAME;
//     const t = await sequelize.transaction();
//     let joidata = {
//         keyid: Joi.string().required(),
//         billadvisorno: Joi.string().required(),
//         cashierreceiveno: Joi.string().required(),
//         // cashierdate: Joi.date().required(),
//         dfrpreferno: Joi.string().required(),
//         transactiontype: Joi.string().required(),
//         insurercode: Joi.string().required(),
//         advisorcode: Joi.string().required(),
//         customerid: Joi.string().required(),
//         receivefrom: Joi.string().required(),
//         receivename: Joi.string().required(),
//         receivetype: Joi.string().required(),
        
//         Amt: Joi.number().required(),
//         // createdate: Joi.date().required(),
//         createtime: Joi.string().required(),
//         createusercode: Joi.string().required(),
//         // updatedate: Joi.date().required(),
//         updatetime: Joi.string().required(),
//         updateusercode: Joi.string().required(),
//         // canceldate: Joi.date().required(),
//         canceltime: Joi.string().required(),
//         cancelusercode: Joi.string().required(),
//         status: Joi.string().valid('I').required()
//     }
//     if (req.body.receivetype === "Cheque" || req.body.receivetype === "Bank-Transfer" ) {
//         joidata.PartnerBank =  Joi.string().required()
//         joidata.PartnerBankbranch =  Joi.string().required()
//         joidata.PartnerAccountno =  Joi.string().required()
//         joidata.AmityBank =  Joi.string().required()
//         joidata.AmityBankBranch =  Joi.string().required()
//         joidata.AmityAccountno =  Joi.string().required()
//         joidata.refno =  Joi.string().required()
//     }
//     const schema = Joi.object(joidata);
//     console.log(req.body);
//     const {error} = schema.validate(req.body);

//     if (error) {
//         return res.status(400).json({error: error.details[0].message});
//     }


//     const insertQuery = `
//     INSERT INTO static_data."b_jacashiers"
//     (
//          billadvisorno, cashierreceiveno, cashierdate, 
//          transactiontype, insurercode, advisorcode, 
//         customerid, receivefrom, receivename, receivetype, 
//         "partnerBank", "partnerBankbranch", "partnerAccountno", 
//         "amityBank", "amityBankbranch", "amityAccountno", 
//         amt, "createdAt", createusercode, 
//         "updatedAt", updateusercode, 
//         "canceledAt", cancelusercode, status
//     ) 
//     VALUES 
//     (
//          :billadvisorno, :cashierreceiveno, :cashierdate, 
//          :transactiontype, :insurercode, :advisorcode, 
//         :customerid, :receivefrom, :receivename, :receivetype, 
//         :PartnerBank, :PartnerBankbranch, :PartnerAccountno, 
//         :AmityBank, :AmityBankBranch, :AmityAccountno, 
//         :Amt, :createdate, :createusercode, 
//         :updatedate, :updateusercode, 
//         :canceldate, :cancelusercode, :status
//     );
// `;
//     await sequelize.query(insertQuery, {
//         replacements: {
//             // keyid: req.body.keyid,
//             billadvisorno: req.body.billadvisorno,
//             cashierreceiveno: req.body.cashierreceiveno,
//             cashierdate: null,
//             // dfrpreferno: req.body.dfrpreferno,
//             transactiontype: req.body.transactiontype,
//             insurercode: req.body.insurercode,
//             advisorcode: req.body.advisorcode,
//             customerid: req.body.customerid,
//             receivefrom: req.body.receivefrom,
//             receivename: req.body.receivename,
//             receivetype: req.body.receivetype,
//             PartnerBank: req.body.PartnerBank,
//             PartnerBankbranch: req.body.PartnerBankbranch,
//             PartnerAccountno: req.body.PartnerAccountno,
//             AmityBank: req.body.AmityBank,
//             AmityBankBranch: req.body.AmityBankBranch,
//             AmityAccountno: req.body.AmityAccountno,
//             Amt: req.body.Amt,
//             createdate: new Date(),
//             createtime: req.body.createtime,
//             createusercode: usercode,
//             updatedate: new Date(),
//             updatetime: req.body.updatetime,
//             updateusercode: req.body.updateusercode,
//             canceldate: null,
//             canceltime: req.body.canceltime,
//             cancelusercode: req.body.cancelusercode,
//             status: req.body.status || 'I'  // Assuming default is 'I' if not provided
//         },
//         transaction: t ,
//         type: QueryTypes.INSERT
//     })
//         .then(result => {
//             console.log("Record inserted successfully");
//             res.status(200).json(result);
//         })
//         .catch(error => {
//             console.log("Error inserting record: ", error);
//             res.status(500).json(error);
//         });
// }

const findDataByCashierNo = async (req, res) => {
    await sequelize.query(`select * from static_data.b_jacashiers bj where cashierreceiveno = :cashierreceiveno  ; `, {
        replacements: {
            cashierreceiveno: req.body.cashierreceiveno,
        },
        type: QueryTypes.SELECT
    })
        .then(result => {
            console.log("Record find successfully");
            res.status(200).json(result);
        })
        .catch(error => {
            console.log("Error find record: ", error);
            res.status(500).json(error);
        });
}
const findDataByBillAdvisoryNo = async (req, res) => {
    let insertQuery =''
    if (req.query.txtype === 'premin') {
        insertQuery = 
        `SELECT *, 
            (case when e."personType" = 'P' then ti."TITLETHAIBEGIN"||' '||e."t_firstName"||' '||e."t_lastName"||' '||ti."TITLETHAIEND" 
            else ti."TITLETHAIBEGIN"||' '||e."t_ogName"||' '||ti."TITLETHAIEND" end )   as receivename 
        FROM static_data.b_jabilladvisors b 
        join static_data."Agents" A on b."advisorno" = A."id" 
        join static_data."Insurers" I on B."insurerno" = I."id" 
        left join static_data."Entities" e  on  e.id = a."entityID"
        left join static_data."Titles" ti  on  ti."TITLEID" = e."titleID"
        WHERE 1=1 AND billadvisorno = :filter;`;    
    } else{
        insertQuery = 
        ` SELECT   (case when e."personType" = 'P' then ti."TITLETHAIBEGIN"||' '||e."t_firstName"||' '||e."t_lastName"||' '||ti."TITLETHAIEND"
        else ti."TITLETHAIBEGIN"||' '||e."t_ogName"||' '||ti."TITLETHAIEND" end )   as receivename,
        bj.transactiontype, I."insurerCode", '-' as "agentCode",
        (select SUM(t.commamt)  from static_data."Transactions" t where t."premout-dfrpreferno" = bj.dfrpreferno and "transType" in ('OV-IN','COMM-IN') and t.dfrpreferno is null) as commamt,
        (select SUM(t.ovamt) from static_data."Transactions" t where t."premout-dfrpreferno" = bj.dfrpreferno and "transType" in ('OV-IN','COMM-IN') and t.dfrpreferno is null) as ovamt
        FROM static_data.b_jaaraps bj 
        left join static_data."Insurers" I on bj."insurerno"  = I.id  and I.lastversion = 'Y'
        left join static_data."Entities" e  on  e.id = I."entityID"
        left join static_data."Titles" ti  on  ti."TITLEID" = e."titleID"
        WHERE  bj.dfrpreferno  = :filter 
       	and  bj.transactiontype = 'PREM-OUT' `
    }
    const schema = Joi.object({
        filter: Joi.string().required(),
    });

    const {error} = schema.validate(req.body);
    if (error) {
        return res.status(400).json({error: error.details[0].message});
    }


    
    await sequelize.query(insertQuery, {
        replacements: {
            // keyid: req.body.keyid,
            filter: req.body.filter,
        },
        type: QueryTypes.SELECT
    })
        .then(result => {
            if (req.query.txtype === 'commin') {
                let whtcom = parseFloat((result[0].commamt * wht).toFixed(2))
                let whtov = parseFloat((result[0].ovamt * wht).toFixed(2))
                result[0].amt = result[0].ovamt + result[0].commamt - whtcom - whtov
            }
            console.log("Record inserted successfully");
            res.status(200).json(result);
        })
        .catch(error => {
            console.log("Error inserting record: ", error);
            res.status(500).json(error);
        });
}

//find cashier
const findbill = async (req, res) => {
    let {
        billadvisorno,
        insurercode,
        advisorcode,
        refno,
        cashierreceiveno,
        transactionType,
        checkboxValue,
        createUserCode,
        fromDate,
        toDate,
        dfrpreferno,
        status,
    } = req.body; // Replace this with your state variables
    // transactionType = "PREM-IN"
    let whereClauses = [];

    if (billadvisorno) whereClauses.push(`cs.billadvisorno = :billadvisorno`);
    if (insurercode) whereClauses.push(`cs.insurercode = :insurercode`);
    if (advisorcode) whereClauses.push(`cs.advisorcode = :advisorcode`);
    if (refno) whereClauses.push(`cs.refno = :refno`);
    if (cashierreceiveno) whereClauses.push(`cs.cashierreceiveno = :cashierreceiveno`);
    if (transactionType) whereClauses.push(`cs."transactiontype" = :transactionType`);
    if (fromDate) whereClauses.push(`cs."createdAt" >= :fromDate`);
    if (toDate) whereClauses.push(`cs."createdAt" <= :toDate`);
    if (dfrpreferno) whereClauses.push(`cs.dfrpreferno = :dfrpreferno`);
    if (status) whereClauses.push(`cs.status = :status`);

    let whereClause = whereClauses.length ? ' WHERE ' + whereClauses.join(' AND ') : '';

    const query = `SELECT cs.*, arap.rprefdate  FROM static_data.b_jacashiers cs
                    left join static_data.b_jaaraps arap on arap.dfrpreferno = cs.dfrpreferno ${whereClause}`;

    await sequelize.query(query, {
        replacements: {
            billadvisorno,
            insurercode,
            advisorcode,
            refno,
            cashierreceiveno,
            transactionType,
            checkboxValue,
            createUserCode,
            fromDate,
            toDate,
            dfrpreferno,
            status,
        },
        type: QueryTypes.SELECT,
    })
        .then(result => {
            console.log("Query executed successfully");
            res.status(200).json(result);
        })
        .catch(error => {
            console.log("Error executing query: ", error);
            res.status(500).json(error);
        });
};

const submitCashier = async (req, res) => {
    const jwt = req.headers.authorization.split(' ')[1];
    const usercode = decode(jwt).USERNAME;
    let joidata = {
        // keyid: Joi.string().required(),
        Amt: Joi.number().required(),
        billadvisorno: Joi.string().required(),
        // cashierreceiveno: Joi.string().required(),
        // cashierdate: Joi.date().required(),
        dfrpreferno: Joi.string().required(),
        transactiontype: Joi.string().required(),
        insurercode: Joi.string().required(),
        advisorcode: Joi.string().required(),
        customerid: Joi.string().required(),
        receivefrom: Joi.string().required(),
        receivename: Joi.string().required(),
        receivetype: Joi.string().required(),
        // createdate: Joi.date().required(),
        // createtime: Joi.string().required(),
        // createusercode: Joi.string().required(),
        // updatedate: Joi.date().required(),
        // updatetime: Joi.string().required(),
        // updateusercode: Joi.string().required(),
        // canceldate: Joi.date().required(),
        // canceltime: Joi.string().required(),
        // cancelusercode: Joi.string().required(),
        // status: Joi.string().valid('I').required()
    }
    if (req.body.receivetype === "Cheque" || req.body.receivetype === "Bank-Transfer" ) {
        joidata.PartnerBank =  Joi.string().required()
        joidata.PartnerBankbranch =  Joi.string().required()
        joidata.PartnerAccountno =  Joi.string().required()
        joidata.AmityBank =  Joi.string().required()
        joidata.AmityBankBranch =  Joi.string().required()
        joidata.AmityAccountno =  Joi.string().required()
        joidata.refno =  Joi.string().required()
    }
    const schema = Joi.object(joidata);
    const {error} = schema.validate(req.body);
    // if (error) {
    //     return res.status(400).json({error: error.details[0].message});
    // }

    const t = await sequelize.transaction();
    try{

    
    const insertQuery = `
    INSERT INTO static_data."b_jacashiers"
    (
        billadvisorno, cashierreceiveno, cashierdate,
        transactiontype, insurercode, advisorcode,
        customerid, receivefrom, receivename, receivetype,
        "partnerBank", "partnerBankbranch", "partnerAccountno",
        "amityBank", "amityBankbranch", "amityAccountno",
        amt, "createdAt", createusercode, status , refno,dfrpreferno
    )
    VALUES
    (
        :billadvisorno, :cashierreceiveno, :cashierdate,
        :transactiontype, :insurercode, :advisorcode,
        :customerid, :receivefrom, :receivename, :receivetype,
        :PartnerBank, :PartnerBankbranch, :PartnerAccountno,
        :AmityBank, :AmityBankBranch, :AmityAccountno,
        :Amt, :createdate, :createusercode, :status ,:refno,:dfrpreferno
    );
    `;
    const currentdate = getCurrentDate()
    // let cashierreceiveno = await getRunNo('cash',null,null,'kw',currentdate,t)
    let cashierreceiveno = getCurrentYYMM() +'/'+ String(await getRunNo('cash',null,null,'kw',currentdate,t)).padStart(5, '0')
    const replacevalue ={
         // keyid: req.body.keyid,
         billadvisorno: req.body.billadvisorno,
         cashierreceiveno: cashierreceiveno,
         cashierdate: req.body.cashierdate,
         dfrpreferno: null,
         transactiontype: req.body.transactiontype,
         insurercode: req.body.insurercode,
         advisorcode: req.body.advisorcode,
         customerid: req.body.customerid,
         receivefrom: req.body.receivefrom,
         receivename: req.body.receivename,
         receivetype: req.body.receivetype,
         refno: null,
         PartnerBank: null,
         PartnerBankbranch: null,
         PartnerAccountno: null,
         AmityBank: null,
         AmityBankBranch: null,
         AmityAccountno: null,
         Amt: req.body.Amt,
         createdate: new Date(),
         createtime: new Date(),
         createusercode: usercode,
         updatedate: new Date(),
         updatetime: new Date(),
         updateusercode: usercode,
         status: 'I'
    }
    if (req.body.receivetype === "Cheque" || req.body.receivetype === "Bank-Transfer" ) {
        replacevalue.refno = req.body.refno
         replacevalue.PartnerBank = req.body.PartnerBank
         replacevalue.PartnerBankbranch = req.body.PartnerBankbranch
         replacevalue.PartnerAccountno = req.body.PartnerAccountno
         replacevalue.AmityBank = req.body.AmityBank
         replacevalue.AmityBankBranch = req.body.AmityBankBranch
         replacevalue.AmityAccountno = req.body.AmityAccountno
    }

    
    await sequelize.query(insertQuery, {
        replacements:replacevalue,
        transaction: t,
        type: QueryTypes.INSERT
    })

    await updateCashierReceiveNo (cashierreceiveno,req.body.billadvisorno,t)
    await t.commit();
    console.log(`สร้างใบเสร็จรับเงินเลขที่ : ${cashierreceiveno} สำเร็จ`);

    //TABLE b_jugltx  
    res.status(200).json(({CashierReceiveNo : cashierreceiveno}))

} catch (error) {
    console.log(error);
    await t.rollback();
    console.log("Error inserting record: ", error);
    res.status(500).json(error);
  }

            
    
}
const saveCashier = async (req, res) => {
    const jwt = req.headers.authorization.split(' ')[1];
    const usercode = decode(jwt).USERNAME;
    let joidata = {
        keyid: Joi.string().required(),
        billadvisorno: Joi.string().required(),
        cashierreceiveno: Joi.string().required(),
        // cashierdate: Joi.date().required(),
        dfrpreferno: Joi.string().required(),
        transactiontype: Joi.string().required(),
        insurercode: Joi.string().required(),
        advisorcode: Joi.string().required(),
        customerid: Joi.string().required(),
        receivefrom: Joi.string().required(),
        receivename: Joi.string().required(),
        receivetype: Joi.string().required(),
        
        Amt: Joi.number().required(),
        // createdate: Joi.date().required(),
        createtime: Joi.string().required(),
        createusercode: Joi.string().required(),
        // updatedate: Joi.date().required(),
        updatetime: Joi.string().required(),
        updateusercode: Joi.string().required(),
        // canceldate: Joi.date().required(),
        canceltime: Joi.string().required(),
        cancelusercode: Joi.string().required(),
        status: Joi.string().valid('I').required()
    }
    if (req.body.receivetype === "Cheque" || req.body.receivetype === "Bank-Transfer" ) {
        joidata.PartnerBank =  Joi.string().required()
        joidata.PartnerBankbranch =  Joi.string().required()
        joidata.PartnerAccountno =  Joi.string().required()
        joidata.AmityBank =  Joi.string().required()
        joidata.AmityBankBranch =  Joi.string().required()
        joidata.AmityAccountno =  Joi.string().required()
        joidata.refno =  Joi.string().required()
    }
    const schema = Joi.object(joidata);
    const {error} = schema.validate(req.body);
    if (error) {
        return res.status(400).json({error: error.details[0].message});
    }
    const insertQuery = `
    INSERT INTO static_data."b_jacashiers"
    (
        billadvisorno, cashierreceiveno, cashierdate,
        transactiontype, insurercode, advisorcode,
        customerid, receivefrom, receivename, receivetype,
        "partnerBank", "partnerBankbranch", "partnerAccountno",
        "amityBank", "amityBankbranch", "amityAccountno",
        amt, "createdAt", createusercode, status, refno,dfrpreferno
    )
    VALUES
    (
        :billadvisorno, :cashierreceiveno, :cashierdate,
        :transactiontype, :insurercode, :advisorcode,
        :customerid, :receivefrom, :receivename, :receivetype,
        :PartnerBank, :PartnerBankbranch, :PartnerAccountno,
        :AmityBank, :AmityBankBranch, :AmityAccountno,
        :Amt, :createdate, :createusercode, :status, :refno,:dfrpreferno
    );
    `;
    await sequelize.query(insertQuery, {
        replacements: {
            // keyid: req.body.keyid,
            billadvisorno: req.body.billadvisorno,
            cashierreceiveno: null,
            cashierdate: null,
            dfrpreferno: null,
            transactiontype: req.body.transactiontype,
            insurercode: req.body.insurercode,
            advisorcode: req.body.advisorcode,
            customerid: req.body.customerid,
            receivefrom: req.body.receivefrom,
            receivename: req.body.receivename,
            receivetype: req.body.receivetype,
            refno: req.body.refno,
            PartnerBank: req.body.PartnerBank,
            PartnerBankbranch: req.body.PartnerBankbranch,
            PartnerAccountno: req.body.PartnerAccountno,
            AmityBank: req.body.AmityBank,
            AmityBankBranch: req.body.AmityBankBranch,
            AmityAccountno: req.body.AmityAccountno,
            Amt: req.body.Amt,
            createdate: new Date(),
            createtime: req.body.createtime,
            createusercode: usercode,
            updatedate: new Date(),
            updatetime: req.body.updatetime,
            updateusercode: req.body.updateusercode,
            // canceldate: null,
            // canceltime: req.body.canceltime,
            // cancelusercode: req.body.cancelusercode,
            status: 'I',
            dfrpreferno: req.body.dfrpreferno
        },
        type: QueryTypes.INSERT
    })
        .then(result => {
            console.log("Record inserted successfully");
            res.status(200).json(({}))
        })
        .catch(error => {
            console.log("Error inserting record: ", error);
            res.status(500).json(error);
        });

}

const editSaveBill = async (req, res) => {
    const schema = Joi.object({
        id:Joi.number().required(),
        // keyid: Joi.string().required(),
        billadvisorno: Joi.string().required(),
        // cashierreceiveno: Joi.string().required(),
        // cashierdate: Joi.date().required(),
        // dfrpreferno: Joi.string().required(),
        transactiontype: Joi.string().required(),
        insurercode: Joi.string().required(),
        advisorcode: Joi.string().required(),
        customerid: Joi.required(),
        receivefrom: Joi.string().required(),
        receivename: Joi.string().required(),
        receivetype: Joi.string().required(),
        refno: Joi.string().required(),
        PartnerBank: Joi.string().required(),
        PartnerBankbranch: Joi.string().required(),
        PartnerAccountno: Joi.string().required(),
        AmityBank: Joi.string().required(),
        AmityBankBranch: Joi.string().required(),
        AmityAccountno: Joi.string().required(),
        Amt: Joi.number().required(),
        // createdate: Joi.date().required(),
        // createtime: Joi.string().required(),
        // createusercode: Joi.string().required(),
        // updatedate: Joi.date().required(),
        // updatetime: Joi.string().required(),
        // updateusercode: Joi.string().required(),
        // canceldate: Joi.date().required(),
        // canceltime: Joi.string().required(),
        // cancelusercode: Joi.string().required(),
        // status: Joi.string().valid('I').required()
    });
    const {error} = schema.validate(req.body);
    if (error) {
        return res.status(400).json({error: error.details[0].message});
    }
    const updateQuery = `
  UPDATE static_data."b_jacashiers"
  SET
    cashierreceiveno = :cashierreceiveno,
    cashierdate = :cashierdate,
    transactiontype = :transactiontype,
    insurercode = :insurercode,
    advisorcode = :advisorcode,
    customerid = :customerid,
    receivefrom = :receivefrom,
    receivename = :receivename,
    receivetype = :receivetype,
    refno = :refno,
    "partnerBank" = :PartnerBank,
    "partnerBankbranch" = :PartnerBankbranch,
    "partnerAccountno" = :PartnerAccountno,
    "amityBank" = :AmityBank,
    "amityBankbranch" = :AmityBankBranch,
    "amityAccountno" = :AmityAccountno,
    amt = :Amt,
    "updatedAt" = :updatedate,
    status = :status,
    "updateusercode" = :updateusercode
  WHERE
    id=:id
  `;

    await sequelize.query(updateQuery, {
        replacements: {
            id:req.body.id,
            billadvisorno: req.body.billadvisorno,
            cashierreceiveno: null,
            cashierdate: null,
            transactiontype: req.body.transactiontype,
            insurercode: req.body.insurercode,
            advisorcode: req.body.advisorcode,
            customerid: req.body.customerid,
            receivefrom: req.body.receivefrom,
            receivename: req.body.receivename,
            receivetype: req.body.receivetype,
            refno: req.body.refno,
            PartnerBank: req.body.PartnerBank,
            PartnerBankbranch: req.body.PartnerBankbranch,
            PartnerAccountno: req.body.PartnerAccountno,
            AmityBank: req.body.AmityBank,
            AmityBankBranch: req.body.AmityBankBranch,
            AmityAccountno: req.body.AmityAccountno,
            Amt: req.body.Amt,
            updatedate: new Date(),
            updateusercode: "testUser",
            status: 'I'
        },
        type: Sequelize.QueryTypes.UPDATE
    })
        .then(result => {
            console.log("Record inserted successfully");
            res.status(200).json(({}))
        })
        .catch(error => {
            console.log("Error inserting record: ", error);
            res.status(500).json(error);
        });

}
const editSubmitBill = async (req, res) => {
    // const schema = Joi.object({
    //     id:Joi.number().required(),
    //     // keyid: Joi.string().required(),
    //     billadvisorno: Joi.string().required(),
    //     cashierreceiveno: Joi.string().required(),
    //     cashierdate: Joi.date().required(),
    //     // dfrpreferno: Joi.string().required(),
    //     transactiontype: Joi.string().required(),
    //     insurercode: Joi.string().required(),
    //     advisorcode: Joi.string().required(),
    //     customerid: Joi.required(),
    //     receivefrom: Joi.string().required(),
    //     receivename: Joi.string().required(),
    //     receivetype: Joi.string().required(),
    //     refno: Joi.string().required(),
    //     PartnerBank: Joi.string().required(),
    //     PartnerBankbranch: Joi.string().required(),
    //     PartnerAccountno: Joi.string().required(),
    //     AmityBank: Joi.string().required(),
    //     AmityBankBranch: Joi.string().required(),
    //     AmityAccountno: Joi.string().required(),
    //     Amt: Joi.number().required(),
    // });
    // const {error} = schema.validate(req.body);
    // if (error) {
    //     return res.status(400).json({error: error.details[0].message});
    // }
    const updateQuery = `
  UPDATE static_data."b_jacashiers"
  SET
    cashierreceiveno = :cashierreceiveno,
    cashierdate = :cashierdate,
    transactiontype = :transactiontype,
    insurercode = :insurercode,
    advisorcode = :advisorcode,
    customerid = :customerid,
    receivefrom = :receivefrom,
    receivename = :receivename,
    receivetype = :receivetype,
    refno = :refno,
    "partnerBank" = :PartnerBank,
    "partnerBankbranch" = :PartnerBankbranch,
    "partnerAccountno" = :PartnerAccountno,
    "amityBank" = :AmityBank,
    "amityBankbranch" = :AmityBankBranch,
    "amityAccountno" = :AmityAccountno,
    amt = :Amt,
    "updatedAt" = :updatedate,
    status = :status,
    "updateusercode" = :updateusercode
  WHERE
    id=:id
  `;
  const currentdate = getCurrentDate()
    let cashierreceiveno = getCurrentYYMM() +'/'+ String(await getRunNo('cash',null,null,'kw',currentdate,t)).padStart(5, '0')
    await sequelize.query(updateQuery, {
        replacements: {
            id:req.body.id,
            billadvisorno: req.body.billadvisorno,
            cashierreceiveno: cashierreceiveno,
            cashierdate: req.body.cashierdate,
            transactiontype: req.body.transactiontype,
            insurercode: req.body.insurercode,
            advisorcode: req.body.advisorcode,
            customerid: req.body.customerid,
            receivefrom: req.body.receivefrom,
            receivename: req.body.receivename,
            receivetype: req.body.receivetype,
            refno: req.body.refno,
            PartnerBank: req.body.PartnerBank,
            PartnerBankbranch: req.body.PartnerBankbranch,
            PartnerAccountno: req.body.PartnerAccountno,
            AmityBank: req.body.AmityBank,
            AmityBankBranch: req.body.AmityBankBranch,
            AmityAccountno: req.body.AmityAccountno,
            Amt: req.body.Amt,
            updatedate: new Date(),
            updateusercode: "testUser",
            status: 'A'
        },
        type: Sequelize.QueryTypes.UPDATE
    })
        .then(result => {
             updateCashierReceiveNo (cashierreceiveno,req.body.billadvisorno,t)
            
            console.log("Record inserted successfully");
            res.status(200).json(({}))
        })
        .catch(error => {
            console.log("Error inserting record: ", error);
            res.status(500).json(error);
        });

}
const editCashier = async (req, res) => {
    const jwt = req.headers.authorization.split(' ')[1];
    const usercode = decode(jwt).USERNAME;
    const t = await sequelize.transaction();
    const updateQuery = `
    UPDATE static_data."b_jacashiers"
    SET
    billadvisorno = :billadvisorno,
    -- cashierreceiveno = :cashierreceiveno,
      cashierdate = :cashierdate,
      dfrpreferno = :dfrpreferno,
      insurercode = :insurercode,
      advisorcode = :advisorcode,
      receivefrom = :receivefrom,
      receivename = :receivename,
      receivetype = :receivetype,
      "partnerBank" = :PartnerBank,
      "partnerBankbranch" = :PartnerBankbranch,
      "partnerAccountno" = :PartnerAccountno,
      "amityBank" = :AmityBank,
      "amityBankbranch" = :AmityBankBranch,
      "amityAccountno" = :AmityAccountno,
      amt = :Amt,
      "updatedAt" = :updatedate,
      "updateusercode" = :updateusercode,
      refno = :refno
    WHERE
      id=:id
`;
try {
    let result = await sequelize.query(updateQuery, {
        replacements: {
            id: req.body.id,
            billadvisorno: req.body.billadvisorno,
            // cashierreceiveno: req.body.cashierreceiveno,
            cashierdate: req.body.cashierdate,
            dfrpreferno: req.body.dfrpreferno,
            // transactiontype: req.body.transactiontype,
            insurercode: req.body.insurercode,
            advisorcode: req.body.advisorcode,
            receivefrom: req.body.receivefrom,
            receivename: req.body.receivename,
            receivetype: req.body.receivetype,
            PartnerBank: req.body.PartnerBank,
            PartnerBankbranch: req.body.PartnerBankbranch,
            PartnerAccountno: req.body.PartnerAccountno,
            AmityBank: req.body.AmityBank,
            AmityBankBranch: req.body.AmityBankBranch,
            AmityAccountno: req.body.AmityAccountno,
            Amt: req.body.Amt,
            refno: req.body.refno,
            updatedate: new Date(),
            // updatetime: req.body.updatetime,
            updateusercode: usercode,
            // status: req.body.status || 'I'  // Assuming default is 'I' if not provided
        },
        type: QueryTypes.UPDATE,
        transaction:t
    })

    if (transactiontype === 'PREM-IN') {
        updateCashierReceiveNo (req.body.cashierreceiveno,req.body.billadvisorno,t)
    }
        await t.commit();
        console.log("Record updated successfully");
        await res.status(200).json(result);
} catch (error) {
    console.log(error);
    await t.rollback();
    await res.status(500).json(error);
    
}
   
}
// function getCurrentDate() {
//     const today = new Date();
//     const year = today.getFullYear();
//     const month = String(today.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
//     const day = String(today.getDate()).padStart(2, '0');
//     let result = `${year}-${month}-${day}`
//     return result.toString();
// }
const updateCashierReceiveNo = async (cashierreceiveno,billadvisorno,t) => {
    try {
      
            const jacashierCashierReceiveNo = cashierreceiveno;
            const jacaahierBillAdvisorNo = billadvisorno;

            // Perform the update operation
            await sequelize.query(
                `UPDATE static_data."b_jabilladvisors" SET cashierreceiptno = :cashierreceiveno WHERE billadvisorno = :billadvisorno`,
                {
                    replacements: {
                        cashierreceiveno: jacashierCashierReceiveNo,
                        billadvisorno: jacaahierBillAdvisorNo,
                    },
                    transaction: t,
                }
            );
       
        } catch (error) {
            throw error;
        }
};

const getBrandall = (req,res) =>{
    BankBrand.findAll().then((agent) => {
        res.json(agent);
      })
}

const getBankBranchInBrand = (req,res) =>{
    BankBranch.findAll({
        where: {
          bankCode: req.body.bankCode
        }
      }).then((agent) => {
        res.json(agent);
      })
}



module.exports = {
    test,
    // createCashier,
    findDataByBillAdvisoryNo,
    findbill,
    submitCashier,
    saveCashier,
    editSaveBill,
    editSubmitBill,
    getBrandall,
    getBankBranchInBrand,
    findDataByCashierNo,
    editCashier
};