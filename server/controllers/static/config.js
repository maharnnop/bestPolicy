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


const showAllidcardtype = (req,res)=>{
  sequelize.query(
    `select * from static_data."b_tuinico" where initype = 'IDCARDTYPE' and activeflag = 'Y' order by inicode ASC`,
        {
          type: QueryTypes.SELECT
        }
      ).then((idcradtypes) => {
    res.json(idcradtypes);
  });
}


module.exports = {
  showAllidcardtype,
  // postCar,
  // removeCar,
  // editCar,
};