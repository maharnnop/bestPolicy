const Amphur = require("../../models").Amphur; //imported fruits array
const Province =require("../../models").Province;
// const Package = require("../models").Package;
// const User = require("../models").User;
const { Op, QueryTypes, Sequelize  } = require("sequelize");
//handle index request
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

const showAll = (req,res) =>{
    Amphur.findAll({
      attributes: ['amphurid', 't_amphurname','e_amphurname','provinceid']
    }).then((amphur)=>{
        res.json(amphur);
    })
}

const showAllinProvince = (req, res) => {
  Amphur.findAll ({
    attributes: ['amphurid', 't_amphurname','e_amphurname','provinceid'],
    where: {
        provinceid: req.params.index
    },order:[['t_amphurname',  'ASC']],
  }).then((amphur) => {
    res.json(amphur);
  });
};

const showAllinProvincename = (req,res)=>{
  sequelize.query(
    'select * from static_data."Amphurs" a join static_data.provinces p on p.provinceid = a.provinceid where p.t_provincename = :provincename order by a.t_amphurname ASC',
        {
          replacements: {
            provincename:req.body.provincename,
          },
          type: QueryTypes.SELECT
        }
      ).then((amphur) => {
    res.json(amphur);
  });
}


module.exports = {
  showAll,
  showAllinProvince,
  showAllinProvincename,
  // postCar,
  // removeCar,
  // editCar,
};