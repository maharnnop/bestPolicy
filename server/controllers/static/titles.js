const Title = require("../../models").Title; //imported fruits array
// const Package = require("../models").Package;
// const User = require("../models").User;
const { Op } = require("sequelize");
//handle index request
const showAllCompany = (req,res) =>{
    Title.findAll({
        attributes: ['TITLEID','TITLETHAIBEGIN','TITLETHAIEND','DHIPTITLE','seqno'],
        where: {
            TITLETYPE: "O",
            [Op.or]: [
              {
                TITLETHAIBEGIN: {
                  [Op.not]:""
                }
              },
              {
                TITLETHAIEND: {
                  [Op.not]:""
                }
              }
            ]

        },
        order:[['seqno',  'ASC'],
        ['TITLETHAIBEGIN',  'ASC'],
        ['TITLETHAIEND',  'ASC'],
       ]
    }).then((tambon)=>{
        res.json(tambon);
    })
}

const showAllPerson = (req, res) => {
  Title.findAll ({
    attributes: ['TITLEID','TITLETHAIBEGIN','TITLETHAIEND','DHIPTITLE','GENDER'],
    where: {
        TITLETYPE: "P",
        TITLETHAIBEGIN: {
          [Op.not]:""
        },
    },
    order:[['seqno',  'ASC'],
    ['TITLETHAIBEGIN',  'ASC'],
    ['TITLETHAIEND',  'ASC'],
   ]
  }).then((tambon) => {
    res.json(tambon);
  });
};

const searchByCompany = (req,res)=>{
  Title.findAll({
    attributes: ['TITLEID','TITLETHAIBEGIN','TITLETHAIEND','DHIPTITLE'],
    where: {
        TITLETYPE: "C",
      [req.params.para] :{
        [Op.like]:'%'+ req.params.value +'%'
      }
    }
  }).then((tambon) => {
    res.json(tambon);
  });
}

const searchByPerson = (req,res)=>{
    Title.findAll({
      attributes: ['TITLEID','TITLETHAIBEGIN','TITLETHAIEND','DHIPTITLE','GENDER'],
      where: {
        TITLETYPE: "P",
        [req.params.para] :{
          [Op.like]:'%'+ req.params.value +'%'
        }
      }
    }).then((tambon) => {
      res.json(tambon);
    });
  }
  
  const showById = (req,res) =>{
    Title.findOne({
        attributes: ['TITLEID','TITLETHAIBEGIN','TITLETHAIEND','DHIPTITLE','GENDER'],
      where: {
        TITLEID:req.params.index
      }
    }).then((title) => {
      res.json(title);
    });
    
  }


module.exports = {
  showAllCompany,
  showAllPerson,
  searchByCompany,
  searchByPerson,
  showById
  // postCar,
  // removeCar,
  // editCar,
};