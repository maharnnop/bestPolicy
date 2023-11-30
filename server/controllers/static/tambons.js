const Tambon = require("../../models").Tambon; //imported fruits array
// const Package = require("../models").Package;
// const User = require("../models").User;
const { Op, QueryTypes, Sequelize   } = require("sequelize");
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
    Tambon.findAll({
      attributes: ['tambonid','t_tambonname','e_tambonname','amphurid','postcodeall']
    }).then((tambon)=>{
        res.json(tambon);
    })
}

const showAllinAmphur = (req, res) => {
  Tambon.findAll ({
    attributes: ['tambonid','t_tambonname','e_tambonname','amphurid','postcodeall'],
    where: {
        amphurid: req.params.index
    },order:[['t_tambonname',  'ASC']],
  }).then((tambon) => {
    res.json(tambon);
  });
};

const showAllinAmphurname = (req,res)=>{
  sequelize.query(
    'select * from static_data."Tambons" t join static_data."Amphurs" a on a.amphurid = t.amphurid where a.t_amphurname = :amphurname  order by t.t_tambonname',
        {
          replacements: {
            amphurname:req.body.amphurname,
          },
          type: QueryTypes.SELECT
        }
      ).then((tambon) => {
    res.json(tambon);
  });
}

const showZipinTambon = (req, res) => {
    Tambon.findOne ({
      attributes: ['postcodeall'],
      where: {
        tambonid: req.params.index
      }
    }).then((tambon) => {
      let data = tambon.postcodeall.split('/')
      res.json({zipcode: data});
    });
  };
  


module.exports = {
  showAll,
  showAllinAmphur,
  showAllinAmphurname,
  showZipinTambon
  // postCar,
  // removeCar,
  // editCar,
};