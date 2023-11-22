// const apm = require('elastic-apm-node').start();

// import express from 'express'
// import https from "https";
// import fs from 'fs'
const express = require('express');
const https = require('https');
const fs = require('fs');
require("dotenv").config();

//for log file

// import { logger, requestLogger } from './logger';
const { logger, requestLogger } = require('./logger');
console.log = (...args) => logger.info(args.join(' '));
console.error = (...args) => logger.error(args.join(' '));
console.warn = (...args) => logger.warn(args.join(' '));

// import methodOverride from "method-override";
// import bodyParser from "body-parser";
// import jwt from "jsonwebtoken";
// import cookieParser from "cookie-parser";
// import nodemailer from 'nodemailer';
// import cors from "cors";

const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const nodemailer = require('nodemailer');
const cors = require("cors");

const app = express();
const port = process.env.PORT ;

const corsOptions = {
  origin: process.env.alloworigin,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}


//for validate token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.secretkey , (err, user) => {
    console.log(err)

    if (err) return res.sendStatus(403)

    req.user = user

    next()
  })
}

//middleware-every request goes through it
app.use(cors(corsOptions));
// app.use(bodyParser);
app.use(bodyParser.json({ limit: '200Mb' }));
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(requestLogger);



//------------ for send mail
// const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 587,
//     secure: false, // true for 465, false for other ports
//     auth: { // ข้อมูลการเข้าสู่ระบบ
//       user: 'kwanmhn@gmail.com', // email user ของเรา
//       pass: 'lxgjroepchqevxcv' // email password
//     }
//    });
const routes = require("./routes");

//static data
app.use("/", routes.system);
app.use("/v1/static/provinces",authenticateToken , routes.provinces);
app.use("/v1/static/amphurs",authenticateToken , routes.amphurs);
app.use("/v1/static/tambons",authenticateToken , routes.tambons);
app.use("/v1/static/titles",authenticateToken , routes.titles);
app.use("/v1/static/mt_brands",authenticateToken , routes.MT_Brands);
app.use("/v1/static/mt_models",authenticateToken , routes.MT_Models);
app.use("/v1/static/bank",authenticateToken, routes.banks);

app.use("/v1/locations",authenticateToken, routes.locations);
app.use("/v1/persons",authenticateToken, routes.persons);
app.use("/v1/auth", routes.auth);
app.use("/v1/insures",authenticateToken, routes.insures);
app.use("/v1/policies",authenticateToken, routes.policies);
app.use("/v1/payments",authenticateToken, routes.payments);
app.use("/v1/bills",authenticateToken, routes.bills);
// app.use("/v1/reports", routes.reports);
app.use("/v1/getrunno",authenticateToken, routes.runno);  
app.use("/v1/araps",authenticateToken, routes.arap); 
app.use("/v1/endorses",authenticateToken, routes.endorses);  



// app.listen(port, () => {
//     console.log(`App running on http://localhost:${port}
//                 --- env config ---
//                 DB_USERNAME = ${process.env.DB_USERNAME}
//                 DB_PASSWORD = ${process.env.DB_PASSWORD}
//                 DB_NAME     = ${process.env.DB_NAME}
//                 DB_HOST     = ${process.env.DB_HOST}
//                 DB_DIALECT  = ${process.env.DB_DIALECT}
//                 DB_PORT     = ${process.env.DB_PORT}
//                 secretkey   = ${process.env.secretkey}
//                 alloworigin = ${process.env.alloworigin}`);
// });

const options ={
  cert: fs.readFileSync('./certssl/Certificate_amityinsure.com.crt'),
   ca: fs.readFileSync("./certssl/intermediateCA_amityinsure.com.cer"),
  key: fs.readFileSync("./certssl/PRIVATEKEY_amityinsure.com.key"),
  // cert: fs.readFileSync('./certssl/server.cert'),
  // key: fs.readFileSync("./certssl/server.key"),
}

const server = https.createServer(options, app);

server.listen(port, () => {
  console.log(`App running on https://localhost:${port}
              --- env config ---
              DB_USERNAME = ${process.env.DB_USERNAME}
              DB_PASSWORD = ${process.env.DB_PASSWORD}
              DB_NAME     = ${process.env.DB_NAME}
              DB_HOST     = ${process.env.DB_HOST}
              DB_DIALECT  = ${process.env.DB_DIALECT}
              DB_PORT     = ${process.env.DB_PORT}
              secretkey   = ${process.env.secretkey}
              alloworigin = ${process.env.alloworigin}`);
});
