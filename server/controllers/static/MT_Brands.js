// const Amphur = require("../../models").Amphur; //imported fruits array
const MT_Brand = require("../../models").MT_Brand
const Tmnvc = require("../../models").tmnvc
const Tmcc = require("../../models").tmcc
const { Op } = require("sequelize");
//handle index request
const showAll = (req,res) =>{
    MT_Brand.findAll({
      attributes: ['BRANDCODE','BRANDNAME','BRANDNAMETH'],
      where: {
        'activeflag' : 'Y',
        "BRANDNAMETH": {
          [Op.not]:null
        },
        "BRANDNAME": {
          [Op.not]:null
        }
      },
      order:[['seqno',  'ASC'],['BRANDNAMETH',  'ASC']],

    }).then((brand)=>{
        res.json(brand);
    })
}

// const showAllinProvince = (req, res) => {
//   Amphur.findAll ({
//     attributes: ['amphurid', 't_amphurname','e_amphurname','provinceid'],
//     where: {
//         provinceid: req.params.index
//     }
//   }).then((amphur) => {
//     res.json(amphur);
//   });
// };

const searchByinBrand = (req,res)=>{
  if (req.params.para === 'EN') {
    MT_Brand.findAll({
      attributes: ['BRANDCODE','BRANDNAME','BRANDNAMETH'],
      where: {
          BRANDNAME :{
          [Op.like]:'%'+ req.params.value +'%'
        }
      }
    }).then((amphur) => {
      res.json(amphur);
    });
  } else if (req.params.para === 'TH') {
    MT_Brand.findAll({
      attributes: ['BRANDCODE','BRANDNAME','BRANDNAMETH'],
      where: {
        BRANDNAMETH :{
          [Op.like]:'%'+ req.params.value +'%'
        }
      }
    }).then((amphur) => {
      res.json(amphur);
    });
  }
  
}

const getallVC =(req,res) =>{
  Tmnvc.findAll({
    attributes: ['newvoluntarycode','t_description'],
    where: {
      'active' : 'Y'
    }
  }).then((re)=>{
      res.json(re);
  })
}

const getCCbyVC =(req,res) =>{
  Tmcc.findAll({
    attributes: ['compulsorycode','t_description'],
    where: {
      'newvoluntarycode': req.body.voluntarycode,
      'active' : 'Y'
    }
  }).then((re)=>{
      res.json(re);
  })
}

module.exports = {
  showAll,
  searchByinBrand,
  getallVC,
  getCCbyVC,
  
  // removeCar,
  // editCar,
};