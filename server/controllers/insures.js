const CommOVIn = require("../models").CommOVIn; //imported fruits array
const InsureType = require("../models").InsureType;
const CommOVOut = require("../models").CommOVOut;
const process = require('process');
require('dotenv').config();

const { Op, QueryTypes, Sequelize, where } = require("sequelize");
//handle index request

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



const getInsureTypeByid = (req, res) => {
    InsureType.findOne ({
    where: {
        id: req.params.id
    }
  }).then((insureType) => {
    res.json(insureType);
  });
};


const getInsureTypeAll = (req, res) => {
  InsureType.findAll ().then((insureType) => {
  res.json(insureType);
});
};
const getInsureByClass =(req, res) => {
  if (req.body.class ==='' ) {
     InsureType.findAll ().then(async (insureType) =>   {
     res.json(insureType);
    });
  }else{

    InsureType.findAll(
      {where:{
        class : req.body.class
      }}
      ).then((insureType) => {
   res.json(insureType);
    });
  }
};

const newInsureType = (req, res) => {
    InsureType.create(req.body.insure).then((insureType) => {
      res.json(insureType);
    });
  };
  
const getCommOVOutByid = (req, res) => {
    CommOVOut.findOne ({
    where: {
        id: req.params.id
    }
  }).then((commovOut) => {
    res.json(commovOut);
  });
};

const newCommOVOut = (req, res) => {
    CommOVOut.create(req.body).then((commovOut) => {
      res.json(commovOut);
    });
  };

  const getCommOVInByid = (req, res) => {
    CommOVIn.findOne ({
    where: {
        id: req.params.id
    }
  }).then((commovIn) => {
    res.json(commovIn);
  });
};

const newCommOVIn = (req, res) => {
    CommOVIn.create(req.body).then((commovIn) => {
      res.json(commovIn);
    });
  };

  const newCommOV = (req, res) => {
    CommOVIn.create({...req.body.commIn, ...req.body.insure}).then((commovIn) => {
      // res.json(commovIn);
      CommOVOut.create({...req.body.commOut, ...req.body.insure}).then((commovIn) => {
        res.json(commovIn);
      });
    });
   
  };
  const getCommOVOut = async (req, res) => {
    const records = await sequelize.query(
      `select comout.*, comin.* ,
      a."premCreditT" as  "creditTAgent", a."premCreditUnit" as  "creditUAgent" ,
      i."premCreditT" as  "creditTInsurer", i."premCreditUnit" as  "creditUInsurer" 
      FROM static_data."CommOVOuts" comout 
      JOIN static_data."CommOVIns" comin ON comin."insurerCode" = comout."insurerCode" and comin."insureID" = comout."insureID"
      left join static_data."Insurers" i on i."insurerCode" = comout."insurerCode" and i.lastversion = 'Y'
      left join static_data."Agents" a on a."agentCode" = comout."agentCode" and a.lastversion = 'Y'
      where comout."agentCode" = :agentcode 
      and comout."insureID" = (select "id" from static_data."InsureTypes" where "class" = :class and  "subClass" = :subClass) 
      and comout."insurerCode" = :insurerCode 
      and comout.lastversion = 'Y'
      and comin.lastversion = 'Y'
      
      `,
      {
        replacements: {
          agentcode: req.body.agentCode,
          class: req.body.class,
          subClass: req.body.subClass,
          insurerCode:req.body.insurerCode
        },
        type: QueryTypes.SELECT
      }
    )
    res.json(records);
      
};
const getCommOVIn = async (req, res) => {
  const records = await sequelize.query(
    `select  comin.* ,
    i."premCreditT" as  "creditTInsurer", i."premCreditUnit" as  "creditUInsurer" 
    FROM static_data."CommOVIns" comin 
    left join static_data."Insurers" i on i."insurerCode" = comin."insurerCode" and i.lastversion = 'Y'
    where comin."insureID" = (select "id" from static_data."InsureTypes" where "class" = :class and  "subClass" = :subClass) 
    and comin."insurerCode" = :insurerCode 
    and comin.lastversion = 'Y'
    `,
    {
      replacements: {
        class: req.body.class,
        subClass: req.body.subClass,
        insurerCode:req.body.insurerCode
      },
      type: QueryTypes.SELECT
    }
  )
  res.json(records);
    
};
module.exports = {
//   showAll,
  getInsureTypeAll,
  getInsureTypeByid,
  newInsureType,
  getCommOVOutByid,
  newCommOVOut,
  getCommOVInByid,
  newCommOVIn,  
  newCommOV,
  getCommOVOut,
  getCommOVIn,
  getInsureByClass

  // removeCar,AgentditCar,
};