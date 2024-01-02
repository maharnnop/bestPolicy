const Policy = require("../models").Policy;
const Transaction = require("../models").Transaction;
const CommOVIn = require("../models").CommOVIn; //imported fruits array
const CommOVOut = require("../models").CommOVOut;
const b_jabilladvisor = require("../models").b_jabilladvisor;
const b_jabilladvisordetail = require("../models").b_jabilladvisordetail;
const process = require("process");
const {getRunNo,getCurrentDate} = require("./lib/runningno");
const {decode} = require('jsonwebtoken');
require("dotenv").config();
const config = require("../config.json");
// const Package = require("../models").Package;
// const User = require("../models").User;

const wht = config.wht

const { Op, QueryTypes, Sequelize } = require("sequelize");

// Replace 'your_database', 'your_username', 'your_password', and 'your_host' with your database credentials
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);


//ตัดหนี้ premin แบบปกติ
const getbilldata = async (req, res) => {
  const records = await sequelize.query(
    `select (select "insurerCode" from static_data."Insurers" where id = insurerno  ), 
    (select "agentCode" from static_data."Agents" where id = advisorno ), *  from static_data.b_jabilladvisors 
    where active ='Y' and billadvisorno = :billadvisorno `,
    {
      replacements: {
        billadvisorno: req.body.billadvisorno.trim(),
      },
      type: QueryTypes.SELECT,
    }
  );
  const trans = await sequelize.query(
    // `select t."agentCode", t."insurerCode", t."withheld",
    //     t."dueDate", t."policyNo", t."endorseNo", j."invoiceNo", t."seqNo" ,
    //     (select "id" from static_data."Insurees" where "insureeCode" = p."insureeCode" ) as customerid, 
    //     (select "t_firstName"||' '||"t_lastName"  as insureeName from static_data."Entities" where id =
    //     (select "entityID" from static_data."Insurees" where "insureeCode" = p."insureeCode" ) ) as insureeName , 
       
    //     j.polid, (select "licenseNo" from static_data."Motors" where id = p."itemList") , (select  "chassisNo" from static_data."Motors" where id = p."itemList"), j.netgrossprem, j.duty, j.tax, j.totalprem, j.commout_rate,
    //     j.commout_amt, j.ovout_rate, j.ovout_amt, t.netflag, t.remainamt
    //     from static_data."Transactions" t 
    //     left join static_data.b_jupgrs j on t.polid = j.polid and t."seqNo" = j."seqNo" 
    //     join static_data."Policies" p on p.id = j.polid
    //     where t.billadvisorno = :billadvisorno 
    //     and t."transType" = 'PREM-IN' and j.installmenttype ='A' 
    //     and t.dfrpreferno is null
    //     and t."agentCode2" is null`
        // get whtcom/ov out only agent1 
        ` select t.id, j.id,t."agentCode", t."insurerCode", t."withheld",
        t."dueDate", t."policyNo", t."endorseNo", t."seqNo" , t.netflag,
        (case when t.netflag = 'N' then j.totalprem - j.withheld -j.commout1_amt - j.ovout1_amt  else
        j.totalprem - j.withheld end ) as remainamt,
        (select "id" from static_data."Insurees" where "insureeCode" = p."insureeCode" ) as customerid,
        (case when e."personType" ='P' then  t2."TITLETHAIBEGIN" || ' ' || e."t_firstName"||' '||e."t_lastName" else 
        t2."TITLETHAIBEGIN"|| ' '|| e."t_ogName"|| ' '|| t2."TITLETHAIEND" end) as insureeName ,
        (select "licenseNo" from static_data."Motors" where id = p."itemList") ,
        (select  "chassisNo" from static_data."Motors" where id = p."itemList"),
        j.grossprem ,j.specdiscamt ,j.netgrossprem, j.duty, j.tax, j.totalprem, j.commout_rate, j."invoiceNo",
        j.commout_amt, j.ovout_rate, j.ovout_amt, j.polid, j.commout_taxamt ,j.ovout_taxamt ,
        (select vatflag from static_data."Agents" where "agentCode" = p."agentCode" and lastversion = 'Y' ) 
        from static_data.b_jupgrs j
        left join static_data."Transactions" t on t.polid = j.polid and t."seqNo" = j."seqNo"
        left join static_data.b_jabilladvisors bj on t.billadvisorno =bj.billadvisorno and bj.active ='Y'
        left join static_data.b_jabilladvisordetails bd on bd.keyidm =bj.id and t."seqNo"  = bd.seqno and t.polid =bd.polid
        left join static_data."Policies" p on p.id = t.polid
        left join static_data."Insurees" i on i."insureeCode" =p."insureeCode" 
        left join static_data."Entities" e on e.id = i."entityID" 
        left join static_data."Titles" t2 on t2."TITLEID" = e."titleID" 
        where t.billadvisorno = :billadvisorno
        and t."transType" = 'PREM-IN' 
   		  and j.installmenttype ='A'
        and t.dfrpreferno is null
        and t."agentCode2" is null;`
        ,
    {
      replacements: {
        billadvisorno: req.body.billadvisorno.trim(),
      },
      type: QueryTypes.SELECT,
    }
  );
  if (records.length === 0) {
    await res.status(201).json({ msg: "not found billadvisorno" });
  } else {
    await res.json({ billdata: records, trans: trans });
  }
};

const getcashierdata = async (req, res) => {
  const records = await sequelize.query(
    "select  *  from static_data.b_jacashiers " +
      "where cashierreceiveno = :cashierreceiveno and transactiontype = :cashierttype",
    {
      replacements: {
        cashierreceiveno: req.body.cashierreceiveno.trim(),
        cashierttype: req.body.cashierttype
      },
      type: QueryTypes.SELECT,
    }
  );

  if (records.length === 0) {
    await res.status(201).json({ msg: "not found cashierno" });
  } else {
    await res.json(records);
  }
};

const getARPremindata = async (req, res) => {
  let cond = ''
  if (req.body.billadvisorno  !== null && req.body.billadvisorno !== '') {
    cond = cond + ` and a.billadvisorno = '${req.body.billadvisorno.trim()}'`
  }
  if (req.body.insurercode  !== null && req.body.insurercode !== '') {
    cond = cond + ` and a.insurerno = (select id from static_data."Insurers" where "insurerCode" = '${req.body.insurercode.trim()}')`
  }
  if (req.body.advisorcode   !== null && req.body.advisorcode !== '' ) {
    cond = cond + ` and a.advisorno = (select id from static_data."Agents" where "agentCode" = '${req.body.advisorcode.trim()}')`
  }
  if (req.body.cashierreceiveno   !== null && req.body.cashierreceiveno !== '' ) {
    cond = cond + ` and a.cashierreceiveno = '${req.body.cashierreceiveno.trim()}'`
  }
  if (req.body.refno  !== null && req.body.refno !== '') {
    cond = cond + ` and a.refno = '${req.body.refno.trim()}'`
  }
  if (req.body.arno  !== null && req.body.arno !== '') {
    cond = cond + ` and a.dfrpreferno = '${req.body.arno.trim()}'`
  }
  if (req.body.ardatestart  !== null && req.body.ardatestart !== '') {
    cond = cond +` and a.rprefdate >= '${req.body.ardate}'`
  }
  if (req.body.ardateend  !== null && req.body.ardateend !== '') {
    cond = cond +` and a.rprefdate <= '${req.body.ardate}'`
  }
  if (req.body.arcreateusercode  !== null && req.body.arcreateusercode !== '') {
    cond = cond +` and a.createusercode ='${req.body.arcreateusercode.trim()}'`
  }
  const records = await sequelize.query(
    `select a.billadvisorno, 
    (select "insurerCode" from static_data."Insurers" where id = a.insurerno ) as insurercode,
    (select "agentCode" from static_data."Agents" where id = a.advisorno ) as advisorcode,
    a.cashierreceiveno, b.cashierdate as cashierdate, a.cashieramt,
    a.dfrpreferno as "ARNO", a.rprefdate as "ARDate",
    a.createusercode as "ARcreateusercode",a.actualvalue,a.diffamt,a.status
    from static_data.b_jaaraps a
    join static_data.b_jacashiers b on b.cashierreceiveno = a.cashierreceiveno
    where 1=1 
    ${cond}`,
    {
      type: QueryTypes.SELECT,
    }
  );

  if (records.length === 0) {
    await res.status(201).json({ msg: "not found cashierno" });
  } else {
    await res.json(records);
  }
};

const submitARPremin = async (req, res) => {
  const jwt = req.headers.authorization.split(' ')[1];
  const usercode = decode(jwt).USERNAME;
  const t = await sequelize.transaction();
  try {
    //insert to master jaarap
    const billdate = new Date().toISOString().split("T")[0];
    const cuurentdate = getCurrentDate()
    req.body.master.arno =
      "ARNO" +
      (await getRunNo("arno", null, null, "kw", cuurentdate,t));

    //insert into b_jaaraps
    const arPremIn = await sequelize.query(
      `insert into static_data.b_jaaraps (billadvisorno, cashierreceiveno, cashieramt, insurerno, advisorno, type, transactiontype, actualvalue, diffamt, status, 
            createusercode, dfrpreferno, rprefdate,
             netprem, commout, ovout, whtcommout, whtovout, withheld )
          values( :billadvisorno, :cashierreceiveno, :cashieramt, (select "id" from static_data."Insurers" where "insurerCode" = :insurerCode and lastversion ='Y'), 
          (select "id" from static_data."Agents" where "agentCode" = :agentCode and lastversion ='Y'), :type, :transactiontype, :actualvalue, :diffamt, :status, 
            :createusercode, :dfrpreferno, :rprefdate,
            :netprem, :commout, :ovout, :whtcommout, :whtovout, :withheld ) Returning id`,
      {
        replacements: {
          billadvisorno: req.body.master.billadvisorno,
          cashierreceiveno: req.body.master.cashierreceiveno,
          cashieramt: req.body.master.amt,
          insurerCode: req.body.master.insurerCode,
          agentCode: req.body.master.agentCode,
          type: "AR",
          transactiontype: "PREM-IN",
          actualvalue: req.body.master.actualvalue,
          diffamt: req.body.master.diffamt,
          status: "A",
          createusercode: usercode,
          dfrpreferno: req.body.master.arno,
          rprefdate: billdate,
          billdate: billdate,
          netprem : req.body.master.netprem,
          commout  :req.body.master.commout, 
          ovout  :req.body.master.ovout, 
          whtcommout  :req.body.master.whtcommout, 
          whtovout   :req.body.master.whtovout,
          withheld   :req.body.master.withheld,
        },
        
        transaction: t,
        type: QueryTypes.INSERT,
      }
    );

    //update arno to b_jacashier
    await sequelize.query(
      `update static_data.b_jacashiers set "dfrpreferno" = :arno , status = 'A' where cashierreceiveno = :cashierreceiveno `,
      {
        replacements: {
          arno: req.body.master.arno,
          cashierreceiveno: req.body.master.cashierreceiveno,
        },
        transaction: t,
        type: QueryTypes.UPDATE,
      }
    );
    for (let i = 0; i < req.body.trans.length; i++) {
      //insert to deteil of jaarapds
      await sequelize.query(
        `insert into static_data.b_jaarapds (keyidm, polid, "policyNo", "endorseNo", "invoiceNo", "seqNo", netflag, netamt) 
              values( :keyidm , (select id from static_data."Policies" where "policyNo" = :policyNo ), :policyNo, :endorseNo, :invoiceNo, :seqNo, :netflag, :netamt)`,
        {
          replacements: {
            keyidm: arPremIn[0][0].id,
            policyNo: req.body.trans[i].policyNo,
            endorseNo: req.body.trans[i].endorseNo,
            invoiceNo: req.body.trans[i].invoiceNo,
            seqNo: req.body.trans[i].seqNo,
            netflag: req.body.trans[i].netflag,
            netamt: req.body.trans[i].remainamt,
          },
          transaction: t,
          type: QueryTypes.INSERT,
        }
      );
    
   
    //update arno, refdate to transaction table
    let cond = ' and txtype2 in ( 1, 2, 3, 4, 5 ) and status = \'N\''
    if (req.body.trans[i].endorseNo  !== null && req.body.billadvisorno !== '') {
      cond =cond + ' and "endorseNo"= ' + req.body.trans[i].endorseNo
    }
    if (req.body.trans[i].seqNo  !== null && req.body.billadvisorno !== '') {
      cond = cond +' and "seqNo" = ' +req.body.trans[i].seqNo
    }
    await sequelize.query(
      `update static_data."Transactions" 
      set 
      dfrpreferno = CASE WHEN "transType" = 'PREM-IN' THEN :dfrpreferno ELSE dfrpreferno END,
      rprefdate = CASE WHEN "transType" = 'PREM-IN' THEN :rprefdate ELSE rprefdate END,
      receiptno = CASE WHEN "transType" in ('PREM-IN', 'COMM-OUT', 'OV-OUT') THEN :cashierreceiveno ELSE receiptno END,
          "premin-dfrpreferno" = :dfrpreferno,
          "premin-rprefdate" = :rprefdate
        where  "transType" in ( 'PREM-IN', 'COMM-OUT', 'OV-OUT', 'PREM-OUT', 'COMM-IN', 'OV-IN')
          and "insurerCode" = :insurerCode
          and "agentCode" = :agentCode
          and polid = :polid ${cond}`,
          {replacements:{
            dfrpreferno: req.body.master.arno,
            rprefdate: billdate,
            agentCode: req.body.trans[i].agentCode,
            insurerCode: req.body.trans[i].insurerCode,
            polid: req.body.trans[i].polid,
            
            cashierreceiveno: req.body.master.cashierreceiveno,
            seqNo: req.body.trans[i].seqNo,
          },
          transaction: t,
          type: QueryTypes.UPDATE,
        })
    //update arno, refdate to transaction table when netflag = N
    if (req.body.trans[i].netflag === "N") {
      
    await sequelize.query(
      `update static_data."Transactions" 
        set dfrpreferno = :dfrpreferno ,
          rprefdate = :rprefdate ,
          "premin-dfrpreferno" = :dfrpreferno,
          "premin-rprefdate" = :rprefdate,
          receiptno = :cashierreceiveno
        where "transType" in ('COMM-OUT','OV-OUT')
          and status = 'N'
          and "insurerCode" = :insurerCode
          and "agentCode" = :agentCode
          and polid = :polid
          ${cond}`,
          {replacements:{
            dfrpreferno: req.body.master.arno,
            rprefdate: billdate,
            agentCode: req.body.trans[i].agentCode,
            insurerCode: req.body.trans[i].insurerCode,
            polid: req.body.trans[i].polid,
            // endorseNo: req.body.trans[i].endorseNo,
            cashierreceiveno: req.body.master.cashierreceiveno,
            // seqNo: req.body.trans[i].seqNo,
          },
          transaction: t,
          type: QueryTypes.UPDATE,
        })
    }

  }// end for loop

//insert to deteil of jatw when netflag = N
  if (req.body.master.netflag === "N") {
    const agent = await sequelize.query(
      '(select taxno, deducttaxrate from static_data."Agents" where "agentCode" = :agentCode )',
      {
        replacements: {
          agentCode: req.body.master.agentCode,
        },
        transaction: t,
        type: QueryTypes.SELECT,
      }
      
    ); 
    await sequelize.query(
      `insert into static_data.b_jatws (keyidm, advisorcode, commout_amt, ovout_amt, whtrate, whtcommout_amt,  whtovout_amt, taxid) 
                values(:keyidm, :advisorcode, :commout_amt, :ovout_amt, :deducttaxrate,
                 :whtcommout_amt, :whtovout_amt, :taxno)`,
      {
        replacements: {
          keyidm: arPremIn[0][0].id,
          advisorcode: req.body.master.agentCode,
          taxno: agent[0].taxno,
          deducttaxrate: agent[0].deducttaxrate,
          commout_amt: req.body.master.commout,
          ovout_amt: req.body.master.ovout,
          whtcommout_amt: req.body.master.whtcommout,
          whtovout_amt: req.body.master.whtovout,
        },
        transaction: t,
        type: QueryTypes.INSERT,
      }
    );
  }
    await t.commit();
    await res.json({
      msg: `created ARNO : ${req.body.master.arno } success!!`,
    });
  } catch (error) {
    console.log(error);
    await t.rollback();
    await res.status(500).json({ msg: "internal server error" });
  }

  
};

const saveARPremin = async (req, res) => {
  const jwt = req.headers.authorization.split(' ')[1];
  const usercode = decode(jwt).USERNAME;
  const t = await sequelize.transaction();
  try {
    //insert to master jaarap
    const billdate = new Date().toISOString().split("T")[0];
  
    const arPremIn = await sequelize.query(
      `insert into static_data.b_jaaraps (billadvisorno, cashierreceiveno, cashieramt, insurerno, advisorno, type, transactiontype, actualvalue, diffamt, status, 
            createusercode )
          values( :billadvisorno, :cashierreceiveno, :cashieramt, (select "id" from static_data."Insurers" where "insurerCode" = :insurerCode), 
          (select "id" from static_data."Agents" where "agentCode" = :agentCode), :type, :transactiontype, :actualvalue, :diffamt, :status, 
            :createusercode ) Returning id`,
      {
        replacements: {
          billadvisorno: req.body.master.billadvisorno,
          cashierreceiveno: req.body.master.cashierreceiveno,
          cashieramt: req.body.master.amt,
          insurerCode: req.body.master.insurerCode,
          agentCode: req.body.master.agentCode,
          type: "AR",
          transactiontype: "PREM-IN",
          actualvalue: req.body.master.actualvalue,
          diffamt: req.body.master.diffamt,
          status: "I",
          createusercode: usercode,

          billdate: billdate,
        },
        transaction: t,
        type: QueryTypes.INSERT,
      }
    );
    
    for (let i = 0; i < req.body.trans.length; i++) {
      //insert to deteil of jaarapds
      await sequelize.query(
        `insert into static_data.b_jaarapds (keyidm, polid, "policyNo", "endorseNo", "invoiceNo", "seqNo", netflag, netamt) 
              values( :keyidm , (select id from static_data."Policies" where "policyNo" = :policyNo ), :policyNo, :endorseNo, :invoiceNo, :seqNo, :netflag, :netamt)`,
        {
          replacements: {
            keyidm: arPremIn[0][0].id,
            policyNo: req.body.trans[i].policyNo,
            endorseNo: req.body.trans[i].endorseNo,
            invoiceNo: req.body.trans[i].invoiceNo,
            seqNo: req.body.trans[i].seqNo,
            netflag: req.body.trans[i].netflag,
            netamt: req.body.trans[i].remainamt,
          },
          transaction: t,
          type: QueryTypes.INSERT,
        }
      );
    
    
  }//end for loop

  //insert to deteil of jatw when netflag = N
  if (req.body.master.netflag === "N") {
    const agent = await sequelize.query(
      'select taxno, deducttaxrate from static_data."Agents" where "agentCode" = :agentCode ',
      {
        replacements: {
          agentCode: req.body.master.agentCode,
        },
        transaction: t,
        type: QueryTypes.SELECT,
      }
    );
    console.log(agent[0]);
    await sequelize.query(
      `insert into static_data.b_jatws (keyidm, advisorcode, commout_amt, ovout_amt, whtrate, whtcommout_amt,  whtovout_amt, taxid) 
                values(:keyidm, :advisorcode, :commout_amt, :ovout_amt, :deducttaxrate,
                 :whtcommout_amt, :whtovout_amt, :taxno)`,
      {
        replacements: {
          keyidm: arPremIn[0][0].id,
          advisorcode: req.body.master.agentCode,
          taxno: agent[0].taxno,
          deducttaxrate: agent[0].deducttaxrate,
          commout_amt: req.body.master.commout,
          ovout_amt: req.body.master.ovout,
          whtcommout_amt:  req.body.master.whtcommout,
          whtovout_amt:  req.body.master.whtovout,
        },
        transaction: t,
        type: QueryTypes.INSERT,
      }
    );
  }
    await t.commit();
    await res.json({
      msg: `created billadvisorNO : ${req.body.master.billadvisorno} success!!`,
    });
  } catch (error) {
    console.log(error);
    await t.rollback();
    await res.status(500).json({ msg: "internal server error" });
  }

  
};

const getARtrans = async (req, res) => {
  
  let cond = ''
  let sql = ''
  if (req.body.billadvisorno  !== null && req.body.billadvisorno !== '') {
    cond = cond + ` and t.billadvisorno = '${req.body.billadvisorno}'` 
  }
  if (req.body.insurerCode  !== null && req.body.insurerCode !== '') {
    cond = cond + ` and t."insurerCode" = '${req.body.insurerCode}'` 
  }
  if (req.body.agentCode  !== null && req.body.agentCode !== '') {
    cond = cond + ` and t."agentCode" = '${req.body.agentCode}'` 
  }
  if (req.body.cashierreceiveno  !== null && req.body.cashierreceiveno !== '') {
    cond = cond + ` and t.receiptno = '${req.body.cashierreceiveno}'` 
  }
  if (req.body.arno  !== null && req.body.arno !== '') {
    cond = cond + ` and t."premin-dfrpreferno" = '${req.body.arno}'` 
  }
  if (req.body.type === 'prem_out') {
    sql = `select t."agentCode", t."insurerCode",  
          t."dueDate", t."policyNo", t."endorseNo", j."invoiceNo", j."taxInvoiceNo", t."seqNo" ,
          (select "id" from static_data."Insurees" where "insureeCode" = p."insureeCode" ) as customerid, 
          (case when ent."personType" = 'P' then  tt."TITLETHAIBEGIN" ||' '|| ent."t_firstName"|| ' ' || ent."t_lastName"  || ' ' ||  tt."TITLETHAIEND" 
          else tt."TITLETHAIBEGIN" ||' '|| ent."t_ogName" || ' ' ||  tt."TITLETHAIEND"  end  ) as insureeName , 
          j.polid, (select "licenseNo" from static_data."Motors" where id = p."itemList") , 
          (select  "chassisNo" from static_data."Motors" where id = p."itemList"), 
          t.netflag, j.netgrossprem, j.duty, j.tax, j.totalprem, j."withheld" ,
          (case when t.netflag = 'N' then  j.commin_rate else 0 end ) as commin_rate,
          (case when t.netflag = 'N' then  j.commin_amt else 0  end ) as commin_amt,
          (case when t.netflag = 'N' then  j.ovin_rate else 0  end ) as ovin_rate,
          (case when t.netflag = 'N' then  j.ovin_amt else 0  end ) as ovin_amt,
          -- j.commout_rate, j.commout_amt, j.ovout_rate, j.ovout_amt, 
          (case when t.netflag = 'N' then j.totalprem - j.withheld - j.commin_amt - j.ovin_amt else j.totalprem - j.withheld end ) as remainamt 
          from static_data."Transactions" t 
          join static_data.b_jupgrs j on t.polid = j.polid and t."seqNo" = j."seqNo" 
          join static_data."Policies" p on p.id = j.polid
          left join static_data."Insurees" insuree on insuree."insureeCode" = p."insureeCode" 
          left join static_data."Entities" ent on ent.id = insuree."entityID"
          left join static_data."Titles" tt on tt."TITLEID" = ent."titleID"
          where t.txtype2 in ( 1, 2, 3, 4, 5 )
          and t.status ='N'
          and "premin-rprefdate" is not null
          and  "premin-dfrpreferno" is not null
          and j.installmenttype ='I' 
          and t."transType" = 'PREM-OUT' 
          and "premout-rprefdate" is null
          and "premout-dfrpreferno" is null
          and rprefdate is null ${cond}`
  }else if (req.body.type === 'comm/ov_out') {
    sql =   `select t."mainaccountcode" as "agentCode" , t."insurerCode",  
            t."dueDate", t."policyNo", t."endorseNo", j."invoiceNo",  j."taxInvoiceNo", t."seqNo" ,
            (select "id" from static_data."Insurees" where "insureeCode" = p."insureeCode" ) as customerid, 
            (case when ent."personType" = 'P' then  tt."TITLETHAIBEGIN" ||' '|| ent."t_firstName"|| ' ' || ent."t_lastName"  || ' ' ||  tt."TITLETHAIEND" 
            else tt."TITLETHAIBEGIN" ||' '|| ent."t_ogName" || ' ' ||  tt."TITLETHAIEND"  end  ) as insureeName , 
            j.polid, (select "licenseNo" from static_data."Motors" where id = p."itemList") , 
            (select  "chassisNo" from static_data."Motors" where id = p."itemList"), 
            t.netflag, j.netgrossprem, j.duty, j.tax, j.totalprem, j."withheld" , t."premin-dfrpreferno", t.billadvisorno, t.receiptno,
            -- j.commin_rate, j.commin_amt, j.ovin_rate, j.ovin_amt,
            -- (case when t."agentCode2" is null then  j.commout1_rate else j.commout2_rate  end ) as commout_rate,
            -- (case when t."agentCode2" is null then  j.ovout1_rate else j.ovout2_rate  end ) as ovout_rate,
            (case when t."agentCode2" is null then  j.commout1_amt else j.commout2_amt  end ) as commout_amt,
            (case when t."agentCode2" is null then  j.ovout1_amt else j.ovout2_amt  end ) as ovout_amt,
            (case when t."agentCode2" is null then  j.commout1_amt + j.ovout1_amt else j.commout2_amt + j.ovout2_amt  end ) as remainamt 
            from static_data."Transactions" t 
            join static_data.b_jupgrs j on t.polid = j.polid and t."seqNo" = j."seqNo" 
            join static_data."Policies" p on p.id = j.polid
            left join static_data."Insurees" insuree on insuree."insureeCode" = p."insureeCode" 
            left join static_data."Entities" ent on ent.id = insuree."entityID"
            left join static_data."Titles" tt on tt."TITLEID" = ent."titleID"
            where t.txtype2 in ( 1, 2, 3, 4, 5 )
            and t.status ='N'
            and "premin-rprefdate" is not null
            and  "premin-dfrpreferno" is not null
            and j.installmenttype ='A' 
            and t."transType" in ( 'COMM-OUT' ) and rprefdate is null ${cond}`
  }else if (req.body.type === 'wht_out') {
    cond = cond + ` and t."transType" in ( 'COMM-OUT', 'OV-OUT' ) and rprefdate is not null`     
  }
  
  const trans = await sequelize.query(
    sql,
    {
      replacements: {
        billadvisorno: req.body.billadvisorno,
      },
      type: QueryTypes.SELECT,
    }
  );
  if (trans.length === 0) {
    await res.status(201).json({ msg: "not found transaction" });
  } else {
    await res.json({ trans: trans });
  }
};

//ตัดหนี้ premin แบบ advisor มาจ่ายโดยตรงที่บริษัทประกัน (direct)
const findARPremInDirect = async (req, res) => {
  let cond = ''
  if (req.body.insurerCode  !== null && req.body.insurerCode !== '') {
    cond = cond + ` and t."insurerCode" = '${req.body.insurerCode}'`
  }
  if (req.body.agentCode  !== null && req.body.agentCode !== '') {
    cond = cond + ` and t."agentCode" = '${req.body.agentCode}'`
  }
  if (req.body.policyNoStart  !== null && req.body.policyNoStart !== '') {
    cond = cond + ` and t."policyNo" >= '${req.body.policyNoStart}'`
  }
  if (req.body.policyNoEnd  !== null && req.body.policyNoEnd !== '') {
    cond = cond + ` and t."policyNo" <= '${req.body.policyNoEnd}'`
  }
  if (req.body.endorseNoStart  !== null && req.body.endorseNoStart !== '') {
    cond = cond + ` and j."endorseNo" = '${req.body.endorseNoStart}'`
  }
  if (req.body.endorseNoEnd  !== null && req.body.endorseNoEnd !== '') {
    cond = cond + ` and j."endorseNo" = '${req.body.endorseNoEnd}'`
  }
  if (req.body.invoiceNoStart  !== null && req.body.invoiceNoStart !== '') {
    cond = cond + ` and j."invoiceNo" = '${req.body.invoiceNoStart}'`
  }
  if (req.body.invoiceNoEnd  !== null && req.body.invoiceNoEnd !== '') {
    cond = cond + ` and j."invoiceNo" = '${req.body.invoiceNoEnd}'`
  }
  const trans = await sequelize.query(
    `select true as select, t."agentCode", t."insurerCode", t."withheld" ,
        t."dueDate", t."policyNo", t."endorseNo", j."invoiceNo", t."seqNo" ,
        (select "id" from static_data."Insurees" where "insureeCode" = p."insureeCode" ) as customerid, 
        (select "t_firstName"||' '||"t_lastName"  as insureeName from static_data."Entities" where id =
        (select "entityID" from static_data."Insurees" where "insureeCode" = p."insureeCode" ) ) as insureeName , 
       
        j.polid, (select "licenseNo" from static_data."Motors" where id = p."itemList") , (select  "chassisNo" from static_data."Motors" where id = p."itemList"), j.netgrossprem, j.duty, j.tax, j.totalprem, j.commout_rate,
        j.commout_amt, j.ovout_rate, j.ovout_amt, 'N' as netflag, t.remainamt, j.commin_amt, j.ovin_amt, j.commin_rate, j.ovin_rate
        from static_data."Transactions" t 
        join static_data.b_jupgrs j on t.polid = j.polid and t."seqNo" = j."seqNo" 
        join static_data."Policies" p on p.id = j.polid
        where t."transType" = 'PREM-IN' 
        and t.dfrpreferno is null
        and j.installmenttype ='A' ${cond} `,
    {
      
      type: QueryTypes.SELECT,
    }
  );
  if (trans.length === 0) {
    await res.status(201).json({ msg: "not found policy" });
  } else {
    await res.json( trans );
  }
};

const saveARPreminDirect = async (req, res) => {
  const jwt = req.headers.authorization.split(' ')[1];
  const usercode = decode(jwt).USERNAME;
  const t = await sequelize.transaction();
  try {
    const billdate = new Date().toISOString().split("T")[0];
    
    //insert to master jaarap
    const arPremIn = await sequelize.query(
      `insert into static_data.b_jaaraps (insurerno, advisorno, type, transactiontype, actualvalue, diffamt, status, 
            createusercode, netprem, commin, ovin, vatcommin, vatovin, whtcommin, whtovin, commout, ovout, whtcommout, whtovout)
          values((select "id" from static_data."Insurers" where "insurerCode" = :insurerCode), 
          (select "id" from static_data."Agents" where "agentCode" = :agentCode), :type, :transactiontype, :actualvalue, :diffamt, :status, 
            :createusercode, :netprem, :commin , :ovin, :vatcommin, :vatovin, :whtcommin, :whtovin, :commout, :ovout, :whtcommout, :whtovout) Returning id`,
      {
        replacements: {
          insurerCode: req.body.master.insurerCode,
          agentCode: req.body.master.agentCode,
          type: "AR",
          transactiontype: "PREM-INS",
          actualvalue: req.body.master.actualvalue,
          diffamt: 0,
          status: "I",
          createusercode: usercode,
          billdate: billdate,
          netprem : req.body.master.netprem,
          commin :  req.body.master.commin,
          ovin :  req.body.master.ovin,
          vatcommin :  req.body.master.vatcommin,
          vatovin :  req.body.master.vatovin,
          whtcommin :  req.body.master.whtcommin,
          whtovin :  req.body.master.whtovin,
          commout :  req.body.master.commout,
          ovout :  req.body.master.ovout,
          whtcommout :  req.body.master.whtcommout,
          whtovout :  req.body.master.whtovout,
        },
        transaction: t,
        type: QueryTypes.INSERT,
      }
    );
    
    for (let i = 0; i < req.body.trans.length; i++) {
      //insert to deteil of jaarapds
      await sequelize.query(
        `insert into static_data.b_jaarapds (keyidm, polid, "policyNo", "endorseNo", "invoiceNo", "seqNo", netflag, netamt) 
              values( :keyidm , (select id from static_data."Policies" where "policyNo" = :policyNo ), :policyNo, :endorseNo, :invoiceNo, :seqNo, :netflag, :netamt)`,
        {
          replacements: {
            keyidm: arPremIn[0][0].id,
            policyNo: req.body.trans[i].policyNo,
            endorseNo: req.body.trans[i].endorseNo,
            invoiceNo: req.body.trans[i].invoiceNo,
            seqNo: req.body.trans[i].seqNo,
            netflag: req.body.trans[i].netflag,
            netamt: req.body.trans[i].remainamt,
          },
          transaction: t,
          type: QueryTypes.INSERT,
        }
      );
    
    
  }//end for loop

  //insert to deteil of jatw when netflag = N
  if (req.body.master.netflag === "N") {
    const agent = await sequelize.query(
      'select taxno, deducttaxrate from static_data."Agents" where "agentCode" = :agentCode ',
      {
        replacements: {
          agentCode: req.body.master.agentCode,
        },
        transaction: t,
        type: QueryTypes.SELECT,
      }
    );
    console.log(agent[0]);
    await sequelize.query(
      `insert into static_data.b_jatws (keyidm, advisorcode, commout_amt, ovout_amt, whtrate, whtcommout_amt,  whtovout_amt, taxid) 
                values(:keyidm, :advisorcode, :commout_amt, :ovout_amt, :deducttaxrate,
                 :whtcommout_amt, :whtovout_amt, :taxno)`,
      {
        replacements: {
          keyidm: arPremIn[0][0].id,
          advisorcode: req.body.master.agentCode,
          taxno: agent[0].taxno,
          deducttaxrate: agent[0].deducttaxrate,
          commout_amt: req.body.master.commout,
          ovout_amt: req.body.master.ovout,
          whtcommout_amt:  req.body.master.whtcommout,
          whtovout_amt:  req.body.master.whtovout,
        },
        transaction: t,
        type: QueryTypes.INSERT,
      }
    );
  }
    await t.commit();
    await res.json({
      msg: `created billadvisorNO : ${req.body.master.billadvisorno} success!!`,
    });
  } catch (error) {
    console.log(error);
    await t.rollback();
    await res.status(500).json({ msg: "internal server error" });
  }

  
};

const submitARPreminDirect = async (req, res) => {
  const jwt = req.headers.authorization.split(' ')[1];
  const usercode = decode(jwt).USERNAME;
  const t = await sequelize.transaction();
  try {
    //insert to master jaarap
    const billdate = new Date().toISOString().split("T")[0];
    const cuurentdate = getCurrentDate()
    req.body.master.arno =
      "ARNO" +
      (await getRunNo("arno", null, null, "kw", cuurentdate,t));

    //insert into b_jaaraps
    const arPremIn = await sequelize.query(
      `insert into static_data.b_jaaraps (insurerno, advisorno, type, transactiontype, actualvalue, diffamt, status, 
            createusercode, netprem, commin, ovin, vatcommin, vatovin, whtcommin, whtovin, commout, ovout, whtcommout, whtovout, dfrpreferno, rprefdate )
          values((select "id" from static_data."Insurers" where "insurerCode" = :insurerCode), 
          (select "id" from static_data."Agents" where "agentCode" = :agentCode), :type, :transactiontype, :actualvalue, :diffamt, :status, 
            :createusercode, :netprem, :commin , :ovin, :vatcommin, :vatovin, :whtcommin, :whtovin, :commout, :ovout, :whtcommout, :whtovout, :dfrpreferno, :rprefdate ) Returning id`,
      {
        replacements: {
          insurerCode: req.body.master.insurerCode,
          agentCode: req.body.master.agentCode,
          type: "AR",
          transactiontype: "PREM-INS",
          actualvalue: req.body.master.actualvalue,
          diffamt: 0,
          status: "A",
          createusercode: usercode,
          billdate: billdate,
          netprem : req.body.master.netprem,
          commin :  req.body.master.commin,
          ovin :  req.body.master.ovin,
          vatcommin :  req.body.master.vatcommin,
          vatovin :  req.body.master.vatovin,
          whtcommin :  req.body.master.whtcommin,
          whtovin :  req.body.master.whtovin,
          commout :  req.body.master.commout,
          ovout :  req.body.master.ovout,
          whtcommout :  req.body.master.whtcommout,
          whtovout :  req.body.master.whtovout,
          dfrpreferno: req.body.master.arno,
          rprefdate: billdate,
        },
        transaction: t,
        type: QueryTypes.INSERT,
      }
    );
    
    for (let i = 0; i < req.body.trans.length; i++) {
      //insert to deteil of jaarapds
      await sequelize.query(
        `insert into static_data.b_jaarapds (keyidm, polid, "policyNo", "endorseNo", "invoiceNo", "seqNo", netflag, netamt) 
              values( :keyidm , (select id from static_data."Policies" where "policyNo" = :policyNo ), :policyNo, :endorseNo, :invoiceNo, :seqNo, :netflag, :netamt)`,
        {
          replacements: {
            keyidm: arPremIn[0][0].id,
            policyNo: req.body.trans[i].policyNo,
            endorseNo: req.body.trans[i].endorseNo,
            invoiceNo: req.body.trans[i].invoiceNo,
            seqNo: req.body.trans[i].seqNo,
            netflag: req.body.trans[i].netflag,
            netamt: req.body.trans[i].remainamt,
          },
          transaction: t,
          type: QueryTypes.INSERT,
        }
      );
    
   
    //update arno, refdate to transaction table
    let cond = ' and txtype2 in ( 1, 2, 3, 4, 5 ) and status = \'N\''
    if (req.body.trans[i].endorseNo  !== null && req.body.endorseNo !== '') {
      cond =cond + ' and "endorseNo"= ' + req.body.trans[i].endorseNo
    }
    if (req.body.trans[i].seqNo  !== null && req.body.seqNo !== '') {
      cond = cond +' and "seqNo" = ' +req.body.trans[i].seqNo
    }
    await sequelize.query(
      `update static_data."Transactions" 
      set 
      dfrpreferno = CASE WHEN "transType" in ( 'PREM-IN', 'PREM-OUT' ) THEN :dfrpreferno ELSE dfrpreferno END,
      rprefdate = CASE WHEN "transType" in ( 'PREM-IN', 'PREM-OUT' ) THEN :rprefdate ELSE rprefdate END,
          "premin-dfrpreferno" = :dfrpreferno,
          "premin-rprefdate" = :rprefdate,
          "premout-dfrpreferno" = :dfrpreferno,
          "premout-rprefdate" = :rprefdate
        where  "transType" in ( 'PREM-IN', 'COMM-OUT', 'OV-OUT', 'PREM-OUT', 'COMM-IN', 'OV-IN')
          and "insurerCode" = :insurerCode
          and "agentCode" = :agentCode
          and polid = :polid ${cond}`,
          {replacements:{
            dfrpreferno: req.body.master.arno,
            rprefdate: billdate,
            agentCode: req.body.trans[i].agentCode,
            insurerCode: req.body.trans[i].insurerCode,
            polid: req.body.trans[i].polid,
            seqNo: req.body.trans[i].seqNo,
          },
          transaction: t,
          type: QueryTypes.UPDATE,
        })
    //update arno, refdate to transaction table when netflag = N
    if (req.body.trans[i].netflag === "N") {
    
    await sequelize.query(
      `update static_data."Transactions" 
        set dfrpreferno = :dfrpreferno ,
          rprefdate = :rprefdate ,
          "premin-dfrpreferno" = :dfrpreferno,
          "premin-rprefdate" = :rprefdate
        where "transType" in ('COMM-OUT','OV-OUT')
          and status = 'N'
          and "insurerCode" = :insurerCode
          and "agentCode" = :agentCode
          and polid = :polid
          ${cond}`,
          {replacements:{
            dfrpreferno: req.body.master.arno,
            rprefdate: billdate,
            agentCode: req.body.trans[i].agentCode,
            insurerCode: req.body.trans[i].insurerCode,
            polid: req.body.trans[i].polid,
            // endorseNo: req.body.trans[i].endorseNo,
            // seqNo: req.body.trans[i].seqNo,
          },
          transaction: t,
          type: QueryTypes.UPDATE,
        })
    }

  }// end for loop

//insert to deteil of jatw when netflag = N
  if (req.body.master.netflag === "N") {
    const agent = await sequelize.query(
      '(select taxno, deducttaxrate from static_data."Agents" where "agentCode" = :agentCode )',
      {
        replacements: {
          agentCode: req.body.master.agentCode,
        },
        transaction: t,
        type: QueryTypes.SELECT,
      }
    );
    await sequelize.query(
      `insert into static_data.b_jatws (keyidm, advisorcode, commout_amt, ovout_amt, whtrate, whtcommout_amt,  whtovout_amt, taxid) 
                values(:keyidm, :advisorcode, :commout_amt, :ovout_amt, :deducttaxrate,
                 :whtcommout_amt, :whtovout_amt, :taxno)`,
      {
        replacements: {
          keyidm: arPremIn[0][0].id,
          advisorcode: req.body.master.agentCode,
          taxno: agent[0].taxno,
          deducttaxrate: agent[0].deducttaxrate,
          commout_amt: req.body.master.commout,
          ovout_amt: req.body.master.ovout,
          whtcommout_amt: req.body.master.whtcommout,
          whtovout_amt: req.body.master.whtovout,
        },
        transaction: t,
        type: QueryTypes.INSERT,
      }
    );
  }
    await t.commit();
    await res.json({
      msg: `created ARNO : ${req.body.master.arno } success!!`,
    });
  } catch (error) {
    console.log(error);
    await t.rollback();
    await res.status(500).json({ msg: "internal server error" });
  }

  
};

//Account payment prem out
const findAPPremOut = async (req, res) => {
  let cond = ''
  if (req.body.insurerCode  !== null && req.body.insurerCode !== '' ) {
    cond = cond + ` and t."insurerCode" = '${req.body.insurerCode}'`
  }
  if (req.body.agentCode  !== null && req.body.agentCode !== '' ) {
    cond = cond + ` and t."agentCode" = '${req.body.agentCode}'`
  }
  if (req.body.reconcileno  !== null && req.body.reconcileno !== '' ) {
    cond = cond + ` and r.reconcileno = '${req.body.reconcileno}'`
  }
  if (req.body.dueDate  !== null && req.body.dueDate !== '' ) {
    cond = cond + ` and   t."dueDate" <= '${req.body.dueDate}' `
  }

  if (req.body.dfrprefernostart  !== null && req.body.dfrprefernostart !== '' ) {
    cond = cond + ` and   t."premin-dfrpreferno" >= '${req.body.dfrprefernostart}' `
  }
  if (req.body.dfrprefernoend  !== null && req.body.dfrprefernoend !== '' ) {
    cond = cond + ` and   t."premin-dfrpreferno" <= '${req.body.dfrprefernoend}' `
  }
  if (req.body.rprefdatestart  !== null && req.body.rprefdatestart !== '' ) {
    cond = cond + ` and   t."premin-rprefdate" >= '${req.body.rprefdatestart}' `
  }
  if (req.body.rprefdateend  !== null && req.body.rprefdateend !== '' ) {
    cond = cond + ` and   t."premin-rprefdate" <= '${req.body.rprefdateend}' `
  }
  
  
  //wait rewrite when clear reconcile process
  const trans = await sequelize.query(
    `select  'true' as select , t."insurerCode", t."agentCode", t."withheld" ,
    t."dueDate", t."policyNo", t."endorseNo", j."invoiceNo", j."taxInvoiceNo" , t."seqNo" ,
    (select "id" from static_data."Insurees" where "insureeCode" = p."insureeCode" ) as customerid, 
    (case when e."personType" ='P' then  t2."TITLETHAIBEGIN" || ' ' || e."t_firstName"||' '||e."t_lastName" else 
    t2."TITLETHAIBEGIN"|| ' '|| e."t_ogName"|| ' '|| t2."TITLETHAIEND" end) as insureename ,
    j.polid, (select "licenseNo" from static_data."Motors" where id = p."itemList") , (select  "chassisNo" from static_data."Motors" where id = p."itemList"), 
    j.grossprem , j.specdiscamt , j.netgrossprem, j.withheld , j.duty, j.tax, j.totalprem,
    j.commin_rate, j.commin_amt ,j.commin_taxamt, j.ovin_rate, j.ovin_amt, j.ovin_taxamt ,
     (case when i2."stamentType" = 'Gross' then 'G' else 'N' end ) as netflag, 
    (case when i2."stamentType" = 'Gross' then j.totalprem - j.withheld  else j.totalprem - j.withheld - j.commin_amt -j.ovin_amt + j.commin_taxamt + j.ovin_taxamt end )  as "paymentamt",
    t."premin-dfrpreferno", t."premin-rprefdate"
    from static_data."Transactions" t 
    join static_data.b_jupgrs j on t.polid = j.polid and t."seqNo" = j."seqNo" 
    join static_data."Policies" p on p.id = j.polid
    left join static_data."Insurees" i on i."insureeCode" = p."insureeCode" 
    left join static_data."Insurers" i2 on i2."insurerCode" = p."insurerCode" and i2.lastversion ='Y'
    left join static_data."Entities" e on e.id = i."entityID" 
    left join static_data."Titles" t2 on t2."TITLEID" = e."titleID" 
    where t."transType" = 'PREM-OUT' 
    and t.txtype2 in ( 1, 2, 3, 4, 5 )
    and t.status = 'N'
    and t.rprefdate is null
    and t.dfrpreferno is null
    and t."premin-rprefdate" is not null
    and t."premin-dfrpreferno" is not null
    and j.installmenttype ='I' ${cond} `,
    {
      
      type: QueryTypes.SELECT,
    }
  );
  if (trans.length === 0) {
    await res.status(201).json({ msg: "not found policy" });
  } else {
    await res.json( trans );
  }
};
const getARAPtransAll = async (req, res) => {
  
  let cond = ''
  if (req.body.billadvisorno  !== null && req.body.billadvisorno !== '') {
    cond = cond + ` and t."billadvisorno" = '${req.body.billadvisorno}'` 
  }
  if (req.body.insurerCode  !== null && req.body.insurerCode !== '') {
    cond = cond + ` and t."insurerCode" = '${req.body.insurerCode}'` 
  }
  if (req.body.agentCode  !== null && req.body.agentCode !== '') {
    cond = cond + ` and t."agentCode" = '${req.body.agentCode}'` 
  }
  if (req.body.receiptno  !== null && req.body.receiptno !== '') {
    cond = cond + ` and t.receiptno = '${req.body.receiptno}'` 
  }
  if (req.body.rprefdatestart  !== null && req.body.rprefdatestart !== '') {
    cond = cond + ` and t.rprefdate >= '${req.body.rprefdatestart}'` 
  }
  if (req.body.rprefdateend  !== null && req.body.rprefdateend !== '') {
    cond = cond + ` and t.rprefdate <= '${req.body.rprefdateend}'` 
  }
  if (req.body.type === 'prem_in') {
    cond = cond + ` and t."transType" = 'PREM-IN'` 
  }else if (req.body.type === 'prem_out') {
    cond = cond + ` and t."transType" = 'PREM-OUT'` 
  }else if (req.body.type === 'comm/ov_out') {
    cond = cond + ` and t."transType" in ( 'COMM-OUT', 'OV-OUT' )` 
  }else if (req.body.type === 'comm/ov_in') {
    cond = cond + ` and t."transType" in ( 'COMM-IN', 'OV-IN' )`     
  }
  
  const trans = await sequelize.query(
    `select t."agentCode", t."insurerCode",  t."withheld" , 
        t."dueDate", t."policyNo", t."endorseNo", j."invoiceNo", t."seqNo" ,
        (select "id" from static_data."Insurees" where "insureeCode" = p."insureeCode" ) as customerid, 
        (select "t_firstName"||' '||"t_lastName"  as insureeName from static_data."Entities" where id =
        (select "entityID" from static_data."Insurees" where "insureeCode" = p."insureeCode" ) ) as insureeName , 
       
        j.polid, (select "licenseNo" from static_data."Motors" where id = p."itemList") , (select  "chassisNo" from static_data."Motors" where id = p."itemList"), j.netgrossprem, j.duty, j.tax, j.totalprem, j.commout_rate,
        j.commout_amt, j.ovout_rate, j.ovout_amt, t.netflag, t.remainamt, t."transType",
        t.rprefdate, t.dfrpreferno, t."premin-dfrpreferno", t."premout-dfrpreferno"
        from static_data."Transactions" t 
        join static_data.b_jupgrs j on t.polid = j.polid and t."seqNo" = j."seqNo" 
        join static_data."Policies" p on p.id = j.polid
        where t.txtype2 in ( 1, 2, 3, 4, 5 )
        and t.status ='N'
        and t.dfrpreferno is not null
        and j.installmenttype ='I' ${cond} 
        order by t."policyNo", j."seqNo", t."transType"`,
    {
      replacements: {
        billadvisorno: req.body.billadvisorno,
      },
      type: QueryTypes.SELECT,
    }
  );
  if (trans.length === 0) {
    await res.status(201).json({ msg: "not found transaction" });
  } else {
    await res.json({ trans: trans });
  }
};

const saveAPPremOut = async (req, res) => {
  const jwt = req.headers.authorization.split(' ')[1];
  const usercode = decode(jwt).USERNAME;
  const t = await sequelize.transaction();
  try {
    const billdate = new Date().toISOString().split("T")[0];
    
    //insert to master jaarap
    const arPremIn = await sequelize.query(
      `insert into static_data.b_jaaraps (insurerno, advisorno, type, transactiontype, actualvalue,  status, 
            createusercode, netprem, commin, ovin, vatcommin, vatovin, whtcommin, whtovin )
          values((select "id" from static_data."Insurers" where "insurerCode" = :insurerCode), 
          (select "id" from static_data."Agents" where "agentCode" = :agentCode), :type, :transactiontype, :actualvalue,  :status, 
            :createusercode, :netprem, :commin , :ovin, :vatcommin, :vatovin, :whtcommin, :whtovin) Returning id`,
      {
        replacements: {
          insurerCode: req.body.master.insurerCode,
          agentCode: req.body.master.agentCode,
          type: "AP",
          transactiontype: "PREM-OUT",
          actualvalue: req.body.master.actualvalue,
          
          status: "I",
          createusercode: usercode,
          billdate: billdate,
          netprem : req.body.master.netprem,
          commin :  req.body.master.commin,
          ovin :  req.body.master.ovin,
          vatcommin :  req.body.master.vatcommin,
          vatovin :  req.body.master.vatovin,
          whtcommin :  req.body.master.whtcommin,
          whtovin :  req.body.master.whtovin,
        },
        transaction: t,
        type: QueryTypes.INSERT,
      }
    );
    
    for (let i = 0; i < req.body.trans.length; i++) {
      //insert to deteil of jaarapds
      await sequelize.query(
        `insert into static_data.b_jaarapds (keyidm, polid, "policyNo", "endorseNo", "invoiceNo", "seqNo", netflag, netamt) 
              values( :keyidm , (select id from static_data."Policies" where "policyNo" = :policyNo ), :policyNo, :endorseNo, :invoiceNo, :seqNo, :netflag, :netamt)`,
        {
          replacements: {
            keyidm: arPremIn[0][0].id,
            policyNo: req.body.trans[i].policyNo,
            endorseNo: req.body.trans[i].endorseNo,
            invoiceNo: req.body.trans[i].invoiceNo,
            seqNo: req.body.trans[i].seqNo,
            netflag: req.body.trans[i].netflag,
            netamt: req.body.trans[i].paymentamt,
          },
          transaction: t,
          type: QueryTypes.INSERT,
        }
      );
    
  }//end for loop
    await t.commit();
    await res.json({
      msg: `created billadvisorNO : ${req.body.master.billadvisorno} success!!`,
    });
  } catch (error) {
    console.log(error);
    await t.rollback();
    await res.status(500).json({ msg: "internal server error" });
  }

  
};

const submitAPPremOut = async (req, res) => {
  const jwt = req.headers.authorization.split(' ')[1];
  const usercode = decode(jwt).USERNAME;
  const t = await sequelize.transaction();
  try {
    //insert to master jaarap
    const billdate = new Date().toISOString().split("T")[0];
    const cuurentdate = getCurrentDate()
    req.body.master.apno =
      "APNO" +
      (await getRunNo("apno", null, null, "kw", cuurentdate,t));

    //insert into b_jaaraps
    const arPremIn = await sequelize.query(
      `insert into static_data.b_jaaraps (insurerno, advisorno, type, transactiontype, actualvalue, diffamt, status, 
            createusercode, netprem, commin, ovin, vatcommin, vatovin, whtcommin, whtovin, dfrpreferno, rprefdate, withheld )
          values((select "id" from static_data."Insurers" where "insurerCode" = :insurerCode and lastversion = 'Y'), 
          (select "id" from static_data."Agents" where "agentCode" = :agentCode and lastversion ='Y'), :type, :transactiontype, :actualvalue, :diffamt, :status, 
            :createusercode, :netprem, :commin , :ovin, :vatcommin, :vatovin, :whtcommin, :whtovin,  :dfrpreferno, :rprefdate, :withheld ) Returning id`,
      {
        replacements: {
          insurerCode: req.body.master.insurerCode,
          agentCode: req.body.master.agentCode,
          type: "AP",
          transactiontype: "PREM-OUT",
          actualvalue: req.body.master.actualvalue,
          diffamt: 0,
          status: "A",
          createusercode: usercode,
          billdate: billdate,
          netprem : req.body.master.netprem,
          commin :  req.body.master.commin,
          ovin :  req.body.master.ovin,
          vatcommin :  req.body.master.vatcommin,
          vatovin :  req.body.master.vatovin,
          whtcommin :  req.body.master.whtcommin,
          whtovin :  req.body.master.whtovin,
          withheld :  req.body.master.withheld,
          dfrpreferno: req.body.master.apno,
          rprefdate: billdate,
        },
        transaction: t,
        type: QueryTypes.INSERT,
      }
    );
    
  

    for (let i = 0; i < req.body.trans.length; i++) {
      //insert to deteil of jaarapds
      await sequelize.query(
        `insert into static_data.b_jaarapds (keyidm, polid, "policyNo", "endorseNo", "invoiceNo", "seqNo", netflag, netamt) 
              values( :keyidm , (select id from static_data."Policies" where "policyNo" = :policyNo ), :policyNo, :endorseNo, :invoiceNo, :seqNo, :netflag, :netamt)`,
        {
          replacements: {
            keyidm: arPremIn[0][0].id,
            policyNo: req.body.trans[i].policyNo,
            endorseNo: req.body.trans[i].endorseNo,
            invoiceNo: req.body.trans[i].invoiceNo,
            seqNo: req.body.trans[i].seqNo,
            netflag: req.body.trans[i].netflag,
            netamt: req.body.trans[i].paymentamt,
          },
          transaction: t,
          type: QueryTypes.INSERT,
        }

      )
    
   
    //update arno, refdate to transaction table
    let cond = ' and txtype2 in ( 1, 2, 3, 4, 5 ) and status = \'N\''
    if (req.body.trans[i].endorseNo  !== null && req.body.endorseNo !== '') {
      cond =cond + ' and "endorseNo"= ' + req.body.trans[i].endorseNo
    }
    if (req.body.trans[i].seqNo  !== null && req.body.seqNo !== '') {
      cond = cond +' and "seqNo" = ' +req.body.trans[i].seqNo
    }
    await sequelize.query(
      `update static_data."Transactions" 
      set 
      dfrpreferno = CASE WHEN "transType" = 'PREM-OUT'  THEN :dfrpreferno ELSE dfrpreferno END,
      rprefdate = CASE WHEN "transType" = 'PREM-OUT'  THEN :rprefdate ELSE rprefdate END,
      netflag = CASE WHEN "transType" in ('PREM-OUT','COMM-IN', 'OV-IN') THEN :netflag else netflag END,
          "premout-dfrpreferno" = :dfrpreferno,
          "premout-rprefdate" = :rprefdate
        where  "transType" in ( 'PREM-IN', 'COMM-OUT', 'OV-OUT', 'PREM-OUT', 'COMM-IN', 'OV-IN')
          and "insurerCode" = :insurerCode
          and "agentCode" = :agentCode
          and polid = :polid ${cond}`,
          {replacements:{
            dfrpreferno: req.body.master.apno,
            rprefdate: billdate,
            agentCode: req.body.trans[i].agentCode,
            insurerCode: req.body.trans[i].insurerCode,
            polid: req.body.trans[i].polid,
            seqNo: req.body.trans[i].seqNo,
            netflag: req.body.trans[i].netflag,
          },
          transaction: t,
          type: QueryTypes.UPDATE,
        })

    //insert to deteil of transaction when netflag = N
    if (req.body.trans[i].netflag === "N") {
      
      //update arno, refdate to transaction table
    await sequelize.query(
      `update static_data."Transactions" 
        set dfrpreferno = :dfrpreferno ,
          rprefdate = :rprefdate 
        where "transType" in ('COMM-IN','OV-IN')
          and status = 'N'
          and "insurerCode" = :insurerCode
          and "agentCode" = :agentCode
          and polid = :polid
          ${cond}`,
          {replacements:{
            dfrpreferno: req.body.master.apno,
            rprefdate: billdate,
            agentCode: req.body.trans[i].agentCode,
            insurerCode: req.body.trans[i].insurerCode,
            polid: req.body.trans[i].polid,
            // endorseNo: req.body.trans[i].endorseNo,
            // seqNo: req.body.trans[i].seqNo,
          },
          transaction: t,
          type: QueryTypes.UPDATE,
        })
    }

  }// end for loop
    await t.commit();
    await res.json({
      msg: `created APNO : ${req.body.master.apno } success!!`,
    });
  } catch (error) {
    console.log(error);
    await t.rollback();
    await res.status(500).json({ msg: "internal server error" });
  }

  
};

//Account recieve comm/ov in
const findARCommIn = async (req, res) => {

  let cond = ''
  if (req.body.artype === 'N'){
    cond = cond + ` and a.transactiontype = 'PREM-OUT'`
  }else {
    cond = cond + ` and a.transactiontype = 'PREM-INS'`
  }


  // if (req.body.insurerCode  !== null && req.body.insurerCode !== '') {
  //   cond = cond + ` and t."insurerCode" = '${req.body.insurerCode}'`
  // }
  // if (req.body.agentCode  !== null && req.body.agentCode !== '') {
  //   cond = cond + ` and t."agentCode" = '${req.body.agentCode}'`
  // }
  if (req.body.dfrpreferno  !== null && req.body.dfrpreferno !== '') {
    cond = cond + ` and a.dfrpreferno = '${req.body.dfrpreferno}'`
  }
  
  //wait rewrite when clear reconcile process
  const trans = await sequelize.query(
    `select  true as select, t."insurerCode", t."agentCode", t."withheld" ,t."premout-dfrpreferno",
    t."dueDate", t."policyNo", t."endorseNo", j."invoiceNo", j."taxInvoiceNo",  t."seqNo" ,
    (select "id" from static_data."Insurees" where "insureeCode" = p."insureeCode" ) as customerid,
    (case when ent."personType" = 'O' then tt."TITLETHAIBEGIN" ||' ' || ent."t_ogName"|| ' ' || tt."TITLETHAIEND"  else tt."TITLETHAIBEGIN" || ' ' || ent."t_firstName"||' '||ent."t_lastName"  end) as insureename,
    j.polid, (select "licenseNo" from static_data."Motors" where id = p."itemList") , (select  "chassisNo" from static_data."Motors" where id = p."itemList"),
    j.grossprem , j.specdiscamt ,j.netgrossprem, j.duty, j.tax, j.totalprem,
    j.commin_rate, j.commin_amt, j.commin_taxamt ,
    j.ovin_rate, j.ovin_amt, j.ovin_taxamt ,t.netflag
    from static_data."Transactions" t
    join static_data.b_jupgrs j on t.polid = j.polid and t."seqNo" = j."seqNo"
    join static_data."Policies" p on p.id = j.polid
    left join static_data."Insurees" insuree on insuree."insureeCode" = p."insureeCode"
  left join static_data."Entities" ent on ent.id = insuree."entityID"
  left join static_data."Titles" tt on tt."TITLEID" = ent."titleID"
    join static_data.b_jaarapds ad on ad.polid = j.polid
    join static_data.b_jaaraps a on ad.keyidm =a.id
    where t."transType" = 'COMM-IN'
    and t.txtype2 in ( 1, 2, 3, 4, 5 )
    and t.status = 'N'
    and t.rprefdate is null
    and t.dfrpreferno is null
    and t."premout-rprefdate" is not null
    and t."premout-dfrpreferno" is not null
    and j.installmenttype ='I'
        ${cond} `,
    {
      
      type: QueryTypes.SELECT,
    }
  );

  const bill = await sequelize.query(
    `select (select "insurerCode" from static_data."Insurers" where id = bj.insurerno ), 
    (select "agentCode" from static_data."Agents" where id = bj.advisorno ), 
    (select SUM(t.commamt)  from static_data."Transactions" t where t."premout-dfrpreferno" = bj.dfrpreferno and "transType" in ('OV-IN','COMM-IN') and t.dfrpreferno is null) as commamt,
    (select SUM(t.ovamt) from static_data."Transactions" t where t."premout-dfrpreferno" = bj.dfrpreferno and "transType" in ('OV-IN','COMM-IN') and t.dfrpreferno is null) as ovamt

    from static_data.b_jaaraps bj
    where status ='A' and dfrpreferno = :billadvisorno `,
    {
      replacements: {
        billadvisorno: req.body.dfrpreferno,
      },
      type: QueryTypes.SELECT,
    }
  );
  
  if (trans.length === 0) {
    await res.status(201).json({ msg: "not found policy" });
  } else {
    let whtcomm = parseFloat((bill[0].commamt * wht).toFixed(2))
    let whtov = parseFloat((bill[0].ovamt * wht).toFixed(2))
    bill[0].whtcomm = whtcomm
    bill[0].whtov = whtov
    bill[0].actualvalue = bill[0].commamt + bill[0].ovamt - whtcomm - whtov 
    await res.json({billdata:bill, trans :trans });
  }
};

const saveARCommIn = async (req, res) => {
  const jwt = req.headers.authorization.split(' ')[1];
  const usercode = decode(jwt).USERNAME;
  const t = await sequelize.transaction();
  try {
    const billdate = new Date().toISOString().split("T")[0];
    
    //insert to master jaarap COMM-IN
    const arCommIn = await sequelize.query(
      `insert into static_data.b_jaaraps (insurerno, advisorno, type, transactiontype, actualvalue,  status, 
            createusercode,  commin,  whtcommin,  ovin,  whtovin)
          values((select "id" from static_data."Insurers" where "insurerCode" = :insurerCode), 
          (select "id" from static_data."Agents" where "agentCode" = :agentCode), :type, :transactiontype, :actualvalue,  :status, 
            :createusercode, :commin ,  :whtcommin, :ovin ,  :whtovin) Returning id`,
      {
        replacements: {
          insurerCode: req.body.master.insurerCode,
          agentCode: req.body.master.agentCode,
          type: "AR",
          transactiontype: "COMM-IN",
          actualvalue: req.body.master.actualvalue,
          status: "I",
          createusercode: usercode,
          billdate: billdate,
          // netprem : req.body.master.netprem,
          commin :  req.body.master.commin,
          ovin :  req.body.master.ovin,
          // vatcommin :  req.body.master.vatcommin,
          // vatovin :  req.body.master.vatovin,
          whtcommin :  req.body.master.whtcommin,
          whtovin :  req.body.master.whtovin,
        },
        transaction: t,
        type: QueryTypes.INSERT,
      }
    );
    
 //insert to master jaarap OV-IN
//  const arOvIn = await sequelize.query(
//   `insert into static_data.b_jaaraps (insurerno, advisorno, type, transactiontype, actualvalue,  status, 
//         createusercode,   ovin,   whtovin )
//       values((select "id" from static_data."Insurers" where "insurerCode" = :insurerCode), 
//       (select "id" from static_data."Agents" where "agentCode" = :agentCode), :type, :transactiontype, :actualvalue,  :status, 
//         :createusercode, :ovin,  :whtovin) Returning id`,
//   {
//     replacements: {
//       insurerCode: req.body.master.insurerCode,
//       agentCode: req.body.master.agentCode,
//       type: "AR",
//       transactiontype: "OV-IN",
//       actualvalue: req.body.master.actualvalue,
//       status: "I",
//       createusercode: "kkk",
//       billdate: billdate,
//       createusercode: "kewn",
//       // netprem : req.body.master.netprem,
//       // commin :  req.body.master.commin,
//       ovin :  req.body.master.ovin,
//       // vatcommin :  req.body.master.vatcommin,
//       // vatovin :  req.body.master.vatovin,
//       // whtcommin :  req.body.master.whtcommin,
//       whtovin :  req.body.master.whtovin,
//     },
//     transaction: t,
//     type: QueryTypes.INSERT,
//   }
// );

    for (let i = 0; i < req.body.trans.length; i++) {
      //insert to deteil of jaarapds
      await sequelize.query(
        `insert into static_data.b_jaarapds (keyidm, polid, "policyNo", "endorseNo", "invoiceNo", "seqNo", netflag, netamt) 
              values( :keyidm , (select id from static_data."Policies" where "policyNo" = :policyNo ), :policyNo, :endorseNo, :invoiceNo, :seqNo, :netflag, :netamt)`,
        {
          replacements: {
            keyidm: arCommIn[0][0].id,
            policyNo: req.body.trans[i].policyNo,
            endorseNo: req.body.trans[i].endorseNo,
            invoiceNo: req.body.trans[i].invoiceNo,
            seqNo: req.body.trans[i].seqNo,
            netflag: req.body.trans[i].netflag,
            netamt: req.body.trans[i].paymentamt,
          },
          transaction: t,
          type: QueryTypes.INSERT,
        }

        
      );
      // ovin
      // await sequelize.query(
      //   `insert into static_data.b_jaarapds (keyidm, polid, "policyNo", "endorseNo", "invoiceNo", "seqNo", netflag, netamt) 
      //         values( :keyidm , (select id from static_data."Policies" where "policyNo" = :policyNo ), :policyNo, :endorseNo, :invoiceNo, :seqNo, :netflag, :netamt)`,
      //   {
      //     replacements: {
      //       keyidm: arOvIn[0][0].id,
      //       policyNo: req.body.trans[i].policyNo,
      //       endorseNo: req.body.trans[i].endorseNo,
      //       invoiceNo: req.body.trans[i].invoiceNo,
      //       seqNo: req.body.trans[i].seqNo,
      //       netflag: req.body.trans[i].netflag,
      //       netamt: req.body.trans[i].ovin_amt,
      //     },
      //     transaction: t,
      //     type: QueryTypes.INSERT,
      //   }

        
      // );
    
  }//end for loop
    await t.commit();
    await res.json({
      msg: `created billadvisorNO : ${req.body.master.billadvisorno} success!!`,
    });
  } catch (error) {
    console.log(error);
    await t.rollback();
    await res.status(500).json({ msg: "internal server error" });
  }

  
};

const submitARCommIn = async (req, res) => {
  const jwt = req.headers.authorization.split(' ')[1];
  const usercode = decode(jwt).USERNAME;
  const t = await sequelize.transaction();
  try {
    //insert to master jaarap
    const billdate = new Date().toISOString().split("T")[0];
    const cuurentdate = getCurrentDate()
    req.body.master.arno =
      "ARNO" +
      (await getRunNo("arno", null, null, "kw", cuurentdate,t));

    //insert to master jaarap COMM-IN
    const arCommIn = await sequelize.query(
      `insert into static_data.b_jaaraps (insurerno, advisorno, type, transactiontype, actualvalue,  status, 
            createusercode,  commin,  whtcommin, ovin,  whtovin, dfrpreferno, rprefdate, cashierreceiveno, cashieramt, diffamt)
          values((select "id" from static_data."Insurers" where "insurerCode" = :insurerCode and lastversion = 'Y'), 
          (select "id" from static_data."Agents" where "agentCode" = :agentCode and lastversion = 'Y'), :type, :transactiontype, :actualvalue,  :status, 
            :createusercode, :commin ,  :whtcommin,  :ovin ,  :whtovin, :dfrpreferno, :rprefdate, :cashierreceiveno, :cashieramt, :diffamt) Returning id`,
      {
        replacements: {
          cashierreceiveno: req.body.master.cashierreceiveno,
          cashieramt: req.body.master.cashieramt,
          insurerCode: req.body.master.insurerCode,
          agentCode: req.body.master.agentCode,
          type: "AR",
          transactiontype: "COMM-IN",
          actualvalue: req.body.master.actualvalue,
          diffamt: req.body.master.diffamt,
          status: "A",
          createusercode: usercode,
          billdate: billdate,
          // netprem : req.body.master.netprem,
          commin :  req.body.master.commin,
          ovin :  req.body.master.ovin,
          // vatcommin :  req.body.master.vatcommin,
          // vatovin :  req.body.master.vatovin,
          whtcommin :  req.body.master.whtcommin,
          whtovin :  req.body.master.whtovin,
          dfrpreferno: req.body.master.arno,
          rprefdate: billdate,
          
        },
        transaction: t,
        type: QueryTypes.INSERT,
      }
    );
    
 //insert to master jaarap OV-IN
//  const arOvIn = await sequelize.query(
//   `insert into static_data.b_jaaraps (insurerno, advisorno, type, transactiontype, actualvalue,  status, 
//         createusercode,   ovin,   whtovin,  dfrpreferno, rprefdate )
//       values((select "id" from static_data."Insurers" where "insurerCode" = :insurerCode), 
//       (select "id" from static_data."Agents" where "agentCode" = :agentCode), :type, :transactiontype, :actualvalue,  :status, 
//         :createusercode, :ovin,  :whtovin,  :dfrpreferno, :rprefdate) Returning id`,
//   {
//     replacements: {
//       insurerCode: req.body.master.insurerCode,
//       agentCode: req.body.master.agentCode,
//       type: "AR",
//       transactiontype: "OV-IN",
//       actualvalue: req.body.master.actualvalue,
//       status: "A",
//       createusercode: "kkk",
//       billdate: billdate,
//       createusercode: "kewn",
//       // netprem : req.body.master.netprem,
//       // commin :  req.body.master.commin,
//       ovin :  req.body.master.ovin,
//       // vatcommin :  req.body.master.vatcommin,
//       // vatovin :  req.body.master.vatovin,
//       // whtcommin :  req.body.master.whtcommin,
//       whtovin :  req.body.master.whtovin,
      
//       dfrpreferno: req.body.master.arno,
//       rprefdate: billdate,
//     },
//     transaction: t,
//     type: QueryTypes.INSERT,
//   }
// );

 //update arno to b_jacashier
 await sequelize.query(
  `update static_data.b_jacashiers set "dfrpreferno" = :arno , status = 'A' where cashierreceiveno = :cashierreceiveno `,
  {
    replacements: {
      arno: req.body.master.arno,
      cashierreceiveno: req.body.master.cashierreceiveno,
    },
    transaction: t,
    type: QueryTypes.UPDATE,
  }
);

    for (let i = 0; i < req.body.trans.length; i++) {
      //insert to deteil of jaarapds
      await sequelize.query(
        `insert into static_data.b_jaarapds (keyidm, polid, "policyNo", "endorseNo", "invoiceNo", "seqNo", netflag, netamt) 
              values( :keyidm , (select id from static_data."Policies" where "policyNo" = :policyNo ), :policyNo, :endorseNo, :invoiceNo, :seqNo, :netflag, :netamt)`,
        {
          replacements: {
            keyidm: arCommIn[0][0].id,
            policyNo: req.body.trans[i].policyNo,
            endorseNo: req.body.trans[i].endorseNo,
            invoiceNo: req.body.trans[i].invoiceNo,
            seqNo: req.body.trans[i].seqNo,
            netflag: req.body.trans[i].netflag,
            netamt: req.body.trans[i].totalprem,
          },
          transaction: t,
          type: QueryTypes.INSERT,
        }

      )
        // ovin
      // await sequelize.query(
      //   `insert into static_data.b_jaarapds (keyidm, polid, "policyNo", "endorseNo", "invoiceNo", "seqNo", netflag, netamt) 
      //         values( :keyidm , (select id from static_data."Policies" where "policyNo" = :policyNo ), :policyNo, :endorseNo, :invoiceNo, :seqNo, :netflag, :netamt)`,
      //   {
      //     replacements: {
      //       keyidm: arOvIn[0][0].id,
      //       policyNo: req.body.trans[i].policyNo,
      //       endorseNo: req.body.trans[i].endorseNo,
      //       invoiceNo: req.body.trans[i].invoiceNo,
      //       seqNo: req.body.trans[i].seqNo,
      //       netflag: req.body.trans[i].netflag,
      //       netamt: req.body.trans[i].ovin_amt,
      //     },
      //     transaction: t,
      //     type: QueryTypes.INSERT,
      //   }

      // )
    
   
    //update arno, refdate to transaction table
    let cond = ' and txtype2 in ( 1, 2, 3, 4, 5 ) and status = \'N\''
    if (req.body.trans[i].endorseNo  !== null && req.body.endorseNo !== '') {
      cond =cond + ' and "endorseNo"= ' + req.body.trans[i].endorseNo
    }
    if (req.body.trans[i].seqNo  !== null && req.body.seqNo !== '') {
      cond = cond +' and "seqNo" = ' +req.body.trans[i].seqNo
    }
    await sequelize.query(
      `update static_data."Transactions" 
      set 
      dfrpreferno = :dfrpreferno ,
      rprefdate = :rprefdate ,
      receiptno = :cashierreceiveno
        where  "transType" in ( 'COMM-IN', 'OV-IN')
          and "insurerCode" = :insurerCode
          and "agentCode" = :agentCode
          and polid = :polid ${cond}`,
          {replacements:{
            dfrpreferno: req.body.master.arno,
            rprefdate: billdate,
            agentCode: req.body.trans[i].agentCode,
            insurerCode: req.body.trans[i].insurerCode,
            polid: req.body.trans[i].polid,
            seqNo: req.body.trans[i].seqNo,
            cashierreceiveno: req.body.master.cashierreceiveno,
          },
          transaction: t,
          type: QueryTypes.UPDATE,
        })
   

  }// end for loop
    await t.commit();
    await res.json({
      msg: `created ARNO : ${req.body.master.arno } success!!`,
    });
  } catch (error) {
    console.log(error);
    await t.rollback();
    await res.status(500).json({ msg: "internal server error" });
  }

  
};

//account payment comm/ov out 
const findAPCommOut = async (req, res) => {

  // let cond = ` and (p."actDate" between '${req.body.effDatestart}' and '${req.body.effDateend}'   or p."expDate" between '${req.body.effDatestart}' and '${req.body.effDateend}')`
let cond = ''
  if (req.body.insurerCode  !== null && req.body.insurerCode !== '') {
    cond = cond + ` and t."insurerCode" = '${req.body.insurerCode}'`
  }
  if (req.body.agentCode  !== null && req.body.agentCode !== '') {
    cond = cond + ` and t."mainaccountcode" = '${req.body.agentCode}'`
  }
  if (req.body.AR_PREM_IN  !== null && req.body.AR_PREM_IN !== '') {
    cond = cond + ` and t."premin-dfrpreferno" = '${req.body.AR_PREM_IN}'`
  }
  if (req.body.AR_PREM_OUT  !== null && req.body.AR_PREM_OUT !== '') {
    cond = cond + ` and t."premout-dfrpreferno" = '${req.body.AR_PREM_OUT}'`
  }
  if (req.body.AR_COMM_IN  !== null && req.body.AR_AR_COMM_IN !== '') {
    cond = cond +` and (t.polid,t."seqNo") = (select bj.polid ,bj."seqNo" from static_data.b_jaarapds bj where bj.keyidm = 
    (select id from static_data.b_jaaraps bj2 where bj2.dfrpreferno = '${req.body.AR_AR_COMM_IN}' and bj2.status = 'A' and bj2.transactiontype = 'COMM-IN'))`
  }
  if (req.body.policyNostart  !== null && req.body.policyNostart !== '') {
    cond = cond + ` and p."policyNo" >= '${req.body.policyNostart}'`
  }
  if (req.body.policyNoend  !== null && req.body.policyNoend !== '') {
    cond = cond + ` and p."policyNo" <= '${req.body.policyNoend}'`
  }
  if (req.body.dueDate  !== null && req.body.dueDate !== '') {
    cond = cond + ` and  t."dueDate" <= '${req.body.dueDate}'`
  }
  
  //wait rewrite when clear reconcile process
  const trans = await sequelize.query(
    ` select  true as select , t."insurerCode", t."agentCode", t."withheld" ,
    t."dueDate", t."policyNo", t."endorseNo", j."invoiceNo", t."seqNo" ,
    (select "id" from static_data."Insurees" where "insureeCode" = p."insureeCode" ) as customerid,
    (case when ent."personType" = 'O' then tt."TITLETHAIBEGIN" ||' ' || ent."t_ogName"|| ' ' || tt."TITLETHAIEND"  else tt."TITLETHAIBEGIN" || ' ' || ent."t_firstName"||' '||ent."t_lastName"  end) as insureename,
    j.polid, (select "licenseNo" from static_data."Motors" where id = p."itemList") , (select  "chassisNo" from static_data."Motors" where id = p."itemList"), j.netgrossprem, j.duty, j.tax, j.totalprem,
    (case when t."agentCode2" is null then j.commout1_rate else j.commout2_rate end) as commout_rate,
    (case when t."agentCode2" is null then j.commout1_amt else j.commout2_amt end) as commout_amt,
    (case when t."agentCode2" is null then j.ovout1_amt else j.ovout2_amt end) as ovout_amt,
    (case when t."agentCode2" is null then j.ovout1_rate else j.ovout2_rate end) as ovout_rate,
     t."premin-rprefdate" , t."premin-dfrpreferno"
    from static_data."Transactions" t
    join static_data.b_jupgrs j on t.polid = j.polid and t."seqNo" = j."seqNo"
    join static_data."Policies" p on p.id = j.polid
    left join static_data."Insurees" i on i."insureeCode" = p."insureeCode"
    left join static_data."Entities" ent on ent.id = i."entityID" and ent.lastversion ='Y'
    left join static_data."Titles" tt on tt."TITLEID" = ent."titleID"
    where t."transType" = 'COMM-OUT'
    and t.txtype2 in ( 1, 2, 3, 4, 5 )
    and t.status = 'N'
    and t.rprefdate is null
    and t.dfrpreferno is null
    and t."premin-rprefdate" is not null
    and t."premin-dfrpreferno" is not null
    and j.installmenttype ='A'   ${cond} `,
    {
      
      type: QueryTypes.SELECT,
    }
  );

  if (trans.length === 0) {
    await res.status(201).json({ msg: "not found policy" });
  } else {
    await res.json( trans );
  }
};

const saveAPCommOut = async (req, res) => {
  const jwt = req.headers.authorization.split(' ')[1];
  const usercode = decode(jwt).USERNAME;
  const t = await sequelize.transaction();
  try {
    const billdate = new Date().toISOString().split("T")[0];
    
    //insert to master jaarap COMM-OUT
    const arCommOut = await sequelize.query(
      `insert into static_data.b_jaaraps (insurerno, advisorno, type, transactiontype, actualvalue,  status, 
            createusercode,  commout,  whtcommout,  ovout,  whtovout)
          values((select "id" from static_data."Insurers" where "insurerCode" = :insurerCode), 
          (select "id" from static_data."Agents" where "agentCode" = :agentCode), :type, :transactiontype, :actualvalue,  :status, 
            :createusercode, :commout ,  :whtcommout, :ovout ,  :whtovout) Returning id`,
      {
        replacements: {
          insurerCode: req.body.master.insurerCode,
          agentCode: req.body.master.agentCode,
          type: "AP",
          transactiontype: "COMM-OUT",
          actualvalue: req.body.master.actualvalue,
          status: "I",
          createusercode: usercode,
          billdate: billdate,
          // netprem : req.body.master.netprem,
          commout :  req.body.master.commout,
          ovout :  req.body.master.ovout,
          // vatcommin :  req.body.master.vatcommin,
          // vatovin :  req.body.master.vatovin,
          whtcommout :  req.body.master.whtcommout,
          whtovout :  req.body.master.whtovout,
        },
        transaction: t,
        type: QueryTypes.INSERT,
      }
    );
    


    for (let i = 0; i < req.body.trans.length; i++) {
      //insert to deteil of jaarapds
      await sequelize.query(
        `insert into static_data.b_jaarapds (keyidm, polid, "policyNo", "endorseNo", "invoiceNo", "seqNo", netflag, netamt) 
              values( :keyidm , (select id from static_data."Policies" where "policyNo" = :policyNo ), :policyNo, :endorseNo, :invoiceNo, :seqNo, :netflag, :netamt)`,
        {
          replacements: {
            keyidm: arCommIn[0][0].id,
            policyNo: req.body.trans[i].policyNo,
            endorseNo: req.body.trans[i].endorseNo,
            invoiceNo: req.body.trans[i].invoiceNo,
            seqNo: req.body.trans[i].seqNo,
            netflag: req.body.trans[i].netflag,
            netamt: req.body.trans[i].paymentamt,
          },
          transaction: t,
          type: QueryTypes.INSERT,
        }

        
      );

    
  }//end for loop
    await t.commit();
    await res.json({
      msg: `created billadvisorNO : ${req.body.master.billadvisorno} success!!`,
    });
  } catch (error) {
    console.log(error);
    await t.rollback();
    await res.status(500).json({ msg: "internal server error" });
  }

  
};

const submitAPCommOut = async (req, res) => {
  const jwt = req.headers.authorization.split(' ')[1];
  const usercode = decode(jwt).USERNAME;
  const t = await sequelize.transaction();
  try {
    //insert to master jaarap
    const billdate = new Date().toISOString().split("T")[0];
    const cuurentdate = getCurrentDate()
    req.body.master.apno =
      "APNO" +
      (await getRunNo("apno", null, null, "kw", cuurentdate,t));

    //insert to master jaarap COMM-OUT
    const arCommOut = await sequelize.query(
      `insert into static_data.b_jaaraps (insurerno, advisorno, type, transactiontype, actualvalue,  status, 
            createusercode,  commout,  whtcommout, ovout,  whtovout, dfrpreferno, rprefdate)
          values((select "id" from static_data."Insurers" where "insurerCode" = :insurerCode and lastversion = 'Y'), 
          (select "id" from static_data."Agents" where "agentCode" = :agentCode and lastversion = 'Y'), :type, :transactiontype, :actualvalue,  :status, 
            :createusercode, :commout ,  :whtcommout,  :ovout ,  :whtovout, :dfrpreferno, :rprefdate) Returning id`,
      {
        replacements: {
          insurerCode: req.body.master.insurerCode,
          agentCode: req.body.master.agentCode,
          type: "AP",
          transactiontype: "COMM-OUT",
          actualvalue: req.body.master.actualvalue,
          status: "A",
          createusercode: usercode,
          billdate: billdate,
          // netprem : req.body.master.netprem,
          commout :  req.body.master.commout,
          ovout :  req.body.master.ovout,
          // vatcommin :  req.body.master.vatcommin,
          // vatovin :  req.body.master.vatovin,
          whtcommout :  req.body.master.whtcommout,
          whtovout :  req.body.master.whtovout,

          dfrpreferno: req.body.master.apno,
          rprefdate: billdate,
        },
        transaction: t,
        type: QueryTypes.INSERT,
      }
    );

  //insert to deteil of jatw 
  
    const agent = await sequelize.query(
      '(select taxno, "deductTaxRate" from static_data."Agents" where "agentCode" = :agentCode )',
      {
        replacements: {
          agentCode: req.body.master.agentCode,
        },
        transaction: t,
        type: QueryTypes.SELECT,
      }
      
    ); 
    await sequelize.query(
      `insert into static_data.b_jatws (keyidm, advisorcode, commout_amt, ovout_amt, whtrate, whtcommout_amt,  whtovout_amt, taxid) 
                values(:keyidm, :advisorcode, :commout_amt, :ovout_amt, :deducttaxrate,
                 :whtcommout_amt, :whtovout_amt, :taxno)`,
      {
        replacements: {
          keyidm: arCommOut[0][0].id,
          advisorcode: req.body.master.agentCode,
          taxno: agent[0].taxno,
          deducttaxrate: agent[0].deductTaxRate,
          commout_amt: req.body.master.commout,
          ovout_amt: req.body.master.ovout,
          whtcommout_amt: req.body.master.whtcommout,
          whtovout_amt: req.body.master.whtovout,
        },
        transaction: t,
        type: QueryTypes.INSERT,
      }
    );
  

    for (let i = 0; i < req.body.trans.length; i++) {
      //insert to deteil of jaarapds
      await sequelize.query(
        `insert into static_data.b_jaarapds (keyidm, polid, "policyNo", "endorseNo", "invoiceNo", "seqNo", netamt) 
              values( :keyidm , (select id from static_data."Policies" where "policyNo" = :policyNo limit 1), :policyNo, :endorseNo, :invoiceNo, :seqNo, :netamt)`,
        {
          replacements: {
            keyidm: arCommOut[0][0].id,
            policyNo: req.body.trans[i].policyNo,
            endorseNo: req.body.trans[i].endorseNo,
            invoiceNo: req.body.trans[i].invoiceNo,
            seqNo: req.body.trans[i].seqNo,
            // netflag: req.body.trans[i].netflag,
            netamt: req.body.trans[i].commout_amt + req.body.trans[i].ovout_amt,
          },
          transaction: t,
          type: QueryTypes.INSERT,
        }

      )   
   
    //update arno, refdate to transaction table
    let cond = ' and txtype2 in ( 1, 2, 3, 4, 5 ) and status = \'N\''
    if (req.body.trans[i].endorseNo  !== null && req.body.endorseNo !== '') {
      cond =cond + ' and "endorseNo"= ' + req.body.trans[i].endorseNo
    }
    if (req.body.trans[i].seqNo  !== null && req.body.seqNo !== '') {
      cond = cond +' and "seqNo" = ' +req.body.trans[i].seqNo
    }
    await sequelize.query(
      `update static_data."Transactions" 
      set 
      dfrpreferno = :dfrpreferno ,
      rprefdate = :rprefdate 
        where  "transType" in ( 'COMM-OUT', 'OV-OUT')
          and "insurerCode" = :insurerCode
          and "mainaccountcode" = :agentCode
          and polid = :polid ${cond}`,
          {replacements:{
            dfrpreferno: req.body.master.apno,
            rprefdate: billdate,
            agentCode: req.body.trans[i].agentCode,
            insurerCode: req.body.trans[i].insurerCode,
            polid: req.body.trans[i].polid,
            seqNo: req.body.trans[i].seqNo,
          },
          transaction: t,
          type: QueryTypes.UPDATE,
        })
   

  }// end for loop
    await t.commit();
    await res.json({
      msg: `created APNO : ${req.body.master.apno } success!!`,
    });
  } catch (error) {
    console.log(error);
    await t.rollback();
    await res.status(500).json({ msg: "internal server error" });
  }

  
};


module.exports = {
  getbilldata,
  findARPremInDirect,
  getcashierdata,
  getARPremindata,
  submitARPremin,
  saveARPremin,
  getARtrans,
  saveARPreminDirect,
  submitARPreminDirect,
  findAPPremOut,
  saveAPPremOut,
  submitAPPremOut,
  findARCommIn,
  saveARCommIn,
  submitARCommIn,
  findAPCommOut,
  saveAPCommOut,
  submitAPCommOut,
  getARAPtransAll

};
