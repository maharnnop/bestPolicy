const Amphur = require("../../models").Amphur; //imported fruits array
const Province =require("../../models").Province;
const { Op, QueryTypes, Sequelize  } = require("sequelize");
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

const createBank = async (req, res) => {
    // Schema Validation
    const schema = Joi.object({
        bankBrand: Joi.string().required(),
        bankBranch: Joi.string().required(),
        bankNo: Joi.string().required(),
        type: Joi.string().length(1).required(),
        code: Joi.string().required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    // Insert Query
    const insertQuery = `INSERT INTO static_data."Bank"("bankBrand", "bankBranch", "bankNo", "type", "code") VALUES (:bankBrand, :bankBranch, :bankNo, :type, :code);`;

    await sequelize.query(insertQuery, {
        replacements: {
            bankBrand: req.body.bankBrand,
            bankBranch: req.body.bankBranch,
            bankNo: req.body.bankNo,
            type: req.body.type,
            code: req.body.code
        },
        type: QueryTypes.INSERT
    })
        .then(result => {
            console.log("Record inserted successfully");
            res.status(200);
        })
        .catch(error => {
            console.log("Error inserting record: ", error);
            res.status(500).json(error);
        });
};
const findAllBanks = async (req, res) => {
    const selectQuery = `SELECT * FROM static_data."Bank";`;

    await sequelize.query(selectQuery, {
        type: QueryTypes.SELECT
    })
        .then(result => {
            if (result.length === 0) {
                return res.status(404).json({ message: "No records found" });
            }
            console.log("All records fetched successfully");
            res.status(200).json(result);
        })
        .catch(error => {
            console.log("Error fetching records: ", error);
            res.status(500).json(error);
        });
};


const findBanksByType = async (req, res) => {
    // Schema Validation for 'type'
    const schema = Joi.object({
        type: Joi.string().length(1).required()
    });

    const { error } = schema.validate(req.query);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const selectQuery = `SELECT * FROM static_data."Bank" WHERE type = :type;`;

    await sequelize.query(selectQuery, {
        replacements: {
            type: req.query.type
        },
        type: QueryTypes.SELECT
    })
        .then(result => {
            if (result.length === 0) {
                return res.status(404).json({ message: "No records found" });
            }
            console.log("Records by type fetched successfully");
            res.status(200).json(result);
        })
        .catch(error => {
            console.log("Error fetching records: ", error);
            res.status(500).json(error);
        });
};

const findBankAmity = async (req, res) => {
    const selectQuery = `SELECT * FROM static_data."Bank" where type  = 'M';`;

    await sequelize.query(selectQuery, {
        type: QueryTypes.SELECT
    })
        .then(result => {
            if (result.length === 0) {
                return res.status(404).json({ message: "No records found" });
            }
            console.log("All records fetched successfully");
            res.status(200).json(result);
        })
        .catch(error => {
            console.log("Error fetching records: ", error);
            res.status(500).json(error);
        });
};

const findBankAmityBrand = async (req, res) => {
    const selectQuery = `SELECT DISTINCT "bankBrand" FROM static_data."Bank" WHERE type = 'M';`;

    await sequelize.query(selectQuery, {
        type: QueryTypes.SELECT
    })
        .then(result => {
            if (result.length === 0) {
                return res.status(404).json({ message: "No records found" });
            }
            console.log("All records fetched successfully");
            res.status(200).json(result);
        })
        .catch(error => {
            console.log("Error fetching records: ", error);
            res.status(500).json(error);
        });
};
const findBankAmityBranch = async (req, res) => {
    const selectQuery = `SELECT * FROM static_data."Bank" WHERE type = 'M' and "bankBrand" = :brand ;`;

    await sequelize.query(selectQuery, {
        replacements: {
            brand: req.query.brand
        },
        type: QueryTypes.SELECT
    })
        .then(result => {
            if (result.length === 0) {
                return res.status(404).json({ message: "No records found" });
            }
            console.log("All records fetched successfully");
            res.status(200).json(result);
        })
        .catch(error => {
            console.log("Error fetching records: ", error);
            res.status(500).json(error);
        });
};
const findBankAmityNo = async (req, res) => {
    const selectQuery = `SELECT * FROM static_data."Bank" WHERE type = 'M' and "bankBranch" = :branch and "bankBrand" = :brand ;`;

    await sequelize.query(selectQuery, {
        replacements: {
            brand: req.query.brand,
            branch: req.query.branch
        },
        type: QueryTypes.SELECT
    })
        .then(result => {
            if (result.length === 0) {
                return res.status(404).json({ message: "No records found" });
            }
            console.log("All records fetched successfully");
            res.status(200).json(result);
        })
        .catch(error => {
            console.log("Error fetching records: ", error);
            res.status(500).json(error);
        });
};
const findBankPartnerBrand = async (req, res) => {
    const selectQuery = `SELECT DISTINCT "bankBrand" FROM static_data."Bank" WHERE "type" = :type;`;

    await sequelize.query(selectQuery, {
        replacements: {
            type:req.query.type
        },

        type: QueryTypes.SELECT
    })
        .then(result => {
            if (result.length === 0) {
                return res.status(404).json({ message: "No records found" });
            }
            console.log("All records fetched successfully");
            res.status(200).json(result);
        })
        .catch(error => {
            console.log("Error fetching records: ", error);
            res.status(500).json(error);
        });
};
const findBankPartnerBranch = async (req, res) => {
    const selectQuery = `SELECT * FROM static_data."Bank" WHERE type = :type and "bankBrand" = :brand ;`;

    await sequelize.query(selectQuery, {
        replacements: {
            type:req.query.type,
            brand: req.query.brand
        },
        type: QueryTypes.SELECT
    })
        .then(result => {
            if (result.length === 0) {
                return res.status(404).json({ message: "No records found" });
            }
            console.log("All records fetched successfully");
            res.status(200).json(result);
        })
        .catch(error => {
            console.log("Error fetching records: ", error);
            res.status(500).json(error);
        });
};
const findBankPartneryNo = async (req, res) => {
    const selectQuery = `SELECT * FROM static_data."Bank" WHERE type = :type and "bankBranch" = :branch and "bankBrand" = :brand ;`;

    await sequelize.query(selectQuery, {
        replacements: {
            brand: req.query.brand,
            branch: req.query.branch,
            type:req.query.type,
        },
        type: QueryTypes.SELECT
    })
        .then(result => {
            if (result.length === 0) {
                return res.status(404).json({ message: "No records found" });
            }
            console.log("All records fetched successfully");
            res.status(200).json(result);
        })
        .catch(error => {
            console.log("Error fetching records: ", error);
            res.status(500).json(error);
        });
};
const findBankbyPersonCode = async (req, res ) =>{
    try {
        let jointable = ''
        let cond = ''
        if(req.body.type === 'insurer'){
          jointable = ` JOIN static_data."Insurers" a ON e.id = a."entityID"  
                        join static_data."Bank" b on a."insurerCode"  = b.code `
          if (req.body.insurerCode !== '' && req.body.insurerCode !== null ) {
            cond = cond + ` and a."insurerCode" like '%${req.body.insurerCode}%' `
          }
        }else{
          jointable = ` JOIN static_data."Agents" a ON e.id = a."entityID"  
                        join static_data."Bank" b on a."agentCode"  = b.code `
          if (req.body.agentCode !== '' && req.body.agentCode !== null ) {
            cond = cond + ` and a."agentCode" like '%${req.body.agentCode}%' `
          }
        }
    
        
        
       
    
        if (req.body.firstname !== '' && req.body.personType === 'P') {
          cond = cond + ` and e."t_firstName" like '%${req.body.firstname}%' `
        }
        if (req.body.lastname !== '' && req.body.personType === 'P') {
          cond = cond + ` and  e."t_lastName"  like '%${req.body.lastname}%' `
        }
        if (req.body.ogname !== '' && req.body.personType === 'O') {
          cond = cond + ` and e."t_ogName"  like '%${req.body.ogname}%' `
        }
          const persons = await sequelize.query(
            `select 
            '${req.body.type}' as type,
            e."personType",
            (case when e."personType" = 'O' then  t."TITLETHAIBEGIN" ||' '|| e."t_ogName" || ' ' ||  t."TITLETHAIEND" 
            else t."TITLETHAIBEGIN" ||' '|| e."t_firstName"|| ' ' || e."t_lastName"  || ' ' ||  t."TITLETHAIEND"  end) as fullname,
            b.code
            ,bb."bankName" 
            ,bb2."branchName" 
           * from static_data."Entities" e 
           ${jointable}
           join static_data."Titles" t on t."TITLEID" = e."titleID" 
           join static_data.bank_brands bb on bb."bankCode" = b."bankBrand"
            join static_data.bank_branches bb2  on bb2."branchCode" = b."bankBranch" and bb2."bankCode" =b."bankBrand" 
           where a.lastversion ='Y'
           and b.lastversion ='Y'
           ${cond}`,
            {
              
              type: QueryTypes.SELECT,
            }
            
          ); 
         
          await res.json(persons);
        } catch (error) {
          console.log(error);
          await res.status(500).json({ msg: "internal server error" });
        }
   
}
module.exports = {
    createBank,
    findBanksByType,
    findAllBanks,
    findBankAmity,
    findBankAmityBrand,
    findBankAmityBranch,
    findBankAmityNo,
    findBankPartnerBranch,
    findBankPartnerBrand,
    findBankPartneryNo,
    findBankbyPersonCode
};