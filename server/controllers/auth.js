const User = require("../models").User; //imported fruits array
// const Package = require("../models").Package;
// const User = require("../models").User;
const { Op } = require("sequelize");
const crypto = require('crypto'); 
const secretKey = process.env.secretkey
const jwt = require('jsonwebtoken');
//handle index request
const showAll = (req,res) =>{
    User.findAll({
        // where:{
        //     FLAGDELETE:'N'
        // }
    }).then((users)=>{
        res.json(users);
    }).catch((err)=>
        res.send(err)
    )
}

const showByUsername = (req, res) => {
  User.findOne ({
    
    where: {
        userName: req.body.userName
    }
  }).then((user) => {
    res.json(user);
  });
};

const signup = (req,res)=>{
  
       const password = req.body.password
    // hash password
    const hash = crypto.pbkdf2Sync(password, secretKey,  
        1000, 64, `sha512`).toString(`hex`); 
        req.body.password = hash

        User.create(req.body)
            .then((newUser) => {
              const token = jwt.sign(
                {
                    USERID: newUser.id,
                    USERNAME : newUser.userName
                },
                secretKey,
                {
                  expiresIn: "2 hours",
                }
              );
              res.json({ jwt: token });
            })
            .catch((err) => {
              res.sendStatus(401);
            });

    
}
const login = (req,res)=>{
    User.findOne({
        where: {
            userName: req.body.userName
          }
    }).then(foundUser => {
        if (foundUser === null) {
          return res.status(201).json({ errors: [{ msg: "USER NOT FOUND" }] })
        } else{
            const hash = crypto.pbkdf2Sync(req.body.password, secretKey,  
                1000, 64, `sha512`).toString(`hex`); 
            //check status login failed
            if(foundUser.loginFailCount >= 4){
                    res.status(401).json({ errors: [{ msg: "USER HAS BEEN LOGGED PLEASE CONTACT KWAN!!" }] })
            }else{
                //check password
                // if(hash == foundUser.password){
                  if(req.body.password === foundUser.password){
                    console.log(foundUser);
                  foundUser.loginFailCount = 0
                    foundUser.save()
                      const token = jwt.sign(
                        {
                            USERID: foundUser.id,
                            USERNAME : foundUser.userName
                        },
                        secretKey,
                        {
                            expiresIn: "8 hours",
                        }
                        );
                        res.status(200).json({ jwt: token });   
                  
                      
                }else{
                    foundUser.loginFailCount ++
                    foundUser.save()
                    res.status(401).json({ errors: [{ msg: "WRONG PASSWORD" }] })
                   
                }
            }
            
        }
    }).catch((err) =>{
        res.status(501).send(err)
    })
    
}

// const unlockUser =(req,res) =>{
//     User.findOne({
//         where: {
//             USERNAME: req.body.USERNAME
//           }
//     }).then(foundUser =>{
//         //set default password
//         const password = '1212312121'
//         const hash = crypto.pbkdf2Sync(password, secretKey,  
//             1000, 64, `sha512`).toString(`hex`); 
//             foundUser.PASSWORD = hash
//             foundUser.LOGINFAIL_NO = 0
//             foundUser.save()
//             res.status(200).json({ msg: `unlock user : ${req.body.USERNAME} success new password is ${password}` });     
    
//     }).catch(err =>{
//         res.status(501).send(err)
//     })
// }

module.exports = {
  showAll,
  showByUsername,
  signup,
  login,
//   unlockUser,
  
};