import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ReportTable from "./ReportTable";
import convertDateFormat from "../lib/convertdateformat";

import {
    BrowserRouter,
    Routes,
    Route,
    Link,
    Navigation
} from "react-router-dom";
import {
    Header,
    InputBtn,
    LoginBtn,
    BackdropBox1,
} from "../StylesPages/LoginStyles";

const config = require("../../config.json");

const NormalText = {
    color: "white",
    paddingBottom: "10px",
};
/* eslint-disable react-hooks/exhaustive-deps */

const ReportฺCashier = () => {
    const url = window.globalConfig.BEST_POLICY_V1_BASE_URL;
    const url_report = window.globalConfig.REPORT_BEST_POLICY_V1_BASE_URL;
    const navigate = useNavigate();

   
   
    const [transactionType, setTransactionType] = useState("PREM-IN");
    
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
   
    const [filterData, setFilterData] = useState({
        "startCashierDate": "",
        "endCashierDate": "",
        "startCashierReceiveSubNo": "",
        "endCashierReceiveSubNo": "",
        "transactionType": ""
      }
      )
      const [reportData, setReportData] = useState([])
      const colData =
      {
        "cashierReceiveNo": "เลขใบรับเงิน",
        "cashierDate": "วันที่รับเงิน",
        "billAdvisorNo": "BillAdvisorNo",
        "billDate": "วันที่ออกใบวางบิล",
        "receiveFrom": "ReceiveFrom",
        "receiveName": "ReceiveName",
        "receiveType": "ReceiveType",
        "refNo": "RefNo",
        "refDate": "RefDate",
        "transactionType": "TransactionType",
        "cashierAmt": "CashierAmt",
        "dfRpReferNo": "เลขที่ตัดชำระ",
        "rpRefDate": "วันที่ตัดชำระ",
        "actualValue": "จำนวนเงินตัดชำระ",
        "diffAmt": "จำนวนเงินคงเหลือ",
        "status": "สถานะรายการ",
        "cashierReceiveSubNo": "subno"
      }

      const handleChange =  (e) => {
        e.preventDefault();
       
        setFilterData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,    
          }))
    
      };

    useEffect(() => {

    }, []);

    
   
    const exportExcel =(e) => {
        e.preventDefault()
        axios.post(url_report + "/Cashier/excel", filterData, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                
            })
            .catch((error) => {
                console.log(error);
            });
    }
    const searchdata = (e) =>{
        e.preventDefault()
       let data = {
        "startCashierDate": fromDate,
        "endCashierDate": toDate,
        "startCashierReceiveSubNo": filterData.startCashierReceiveSubNo,
        "endCashierReceiveSubNo": filterData.endCashierReceiveSubNo ,
        "transactionType": transactionType
      }
        axios.post(url_report+"/Cashier/json",data,{
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                if (response.data.length < 1) {
                    alert('ไม่พบข้อมูล')
                    return
                }
                const rawdata = response.data.map((ele,index)=>{
                    if (ele.billDate) {
                        ele.billDate =  convertDateFormat(ele.billDate)
                    }
                    if (ele.rpRefDate) {
                        ele.rpRefDate =  convertDateFormat(ele.rpRefDate)
                    }
                    if (ele.refDate) {
                        ele.refDate =  convertDateFormat(ele.refDate)
                    }
                    if (ele.cashierDate) {
                        ele.cashierDate =  convertDateFormat(ele.cashierDate)
                    }
                    
                    return ele
                })
                // console.log(response.data);
                setReportData(response.data)
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <div className="container" style={{paddingTop: "30px", paddingBottom: "30px" }}>
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    <form>
                        <h2 className="text-center" style={{marginBottom:"30px"}}>รายงานรับเงิน (Cashier)</h2>
                        
   {/*  Cashier Date */}
                        <div className="row">
                            <div className="col-2">
                                <label htmlFor="Date Select" className="form-label">Cashier Date  </label>
                            </div>
                            <div className="col-4">
                                <label htmlFor="fromDate">From &nbsp;</label>
                                {/* <input
                                    type="date"
                                    id="fromDate"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                /> */}
                                <DatePicker
                            showIcon
                            className="form-control"
                            todayButton="Vandaag"
                            // isClearable
                            showYearDropdown
                            dateFormat="dd/MM/yyyy"
                            dropdownMode="select"
                            selected={fromDate}
                            onChange={(date) =>setFromDate(date)}
                                 />
                            </div>
                            <div className="col-4">
                                <label htmlFor="toDate">To &nbsp;</label>
                                {/* <input
                                    type="date"
                                    id="toDate"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                /> */}
                                <DatePicker
                            showIcon
                            className="form-control"
                            todayButton="Vandaag"
                            // isClearable
                            showYearDropdown
                            dateFormat="dd/MM/yyyy"
                            dropdownMode="select"
                            selected={toDate}
                            onChange={(date) =>setToDate(date)}
                                 />
                            </div>
                        </div>
       
                     {/* Cashier No */}
                     <div className="row">
                            <div className="col-2">
                                <label htmlFor="Date Select" className="form-label">Cashier No </label>
                            </div>
                            <div className="col-4">
                                <label htmlFor="fromCashierno">From &nbsp;</label>
                                <input
                                    type="text"
                                    id="fromCashierno"
                                    name="startCashierReceiveSubNo"
                                    value={filterData.startCashierReceiveSubNo}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-4">
                                <label htmlFor="toCashierno">To &nbsp;</label>
                                <input
                                    type="text"
                                    id="toCashierno"
                                    name="endCashierReceiveSubNo"
                                    value={filterData.endCashierReceiveSubNo}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        
                          
                        {/* transaction type  */}
                        <div className="row my-3">
                            <label class="col-sm-2 col-form-label" htmlFor="transtype">
                            Transaction Type
                            </label>
                            
                            <div class="form-check col-2">
                    <input class="form-check-input" type="radio" name="transtype" id="transtyperadio1" defaultChecked onChange={(e)=>setTransactionType('PREM-IN')}/>
                    <label class="form-check-label" for="transtyperadio1">
                        PREM-IN
                    </label>
                    </div>

                    <div class="form-check col-2">
                    <input class="form-check-input" type="radio" name="transtype" id="transtyperadio2" onChange={(e)=>setTransactionType('PREM-INS')}/>
                    <label class="form-check-label" for="transtyperadio2">
                        PREM-INS
                    </label>
                    </div>
                    <div class="form-check col-2">
                    <input class="form-check-input" type="radio" name="transtype" id="transtyperadio3" onChange={(e)=>setTransactionType('COMM-IN')}/>
                    <label class="form-check-label" for="transtyperadio3">
                        COMM-IN
                    </label>
                    </div>
                    <div class="form-check col-2">
                    <input class="form-check-input" type="radio" name="transtype" id="transtyperadio4" onChange={(e)=>setTransactionType('')}/>
                    <label class="form-check-label" for="transtyperadio4">
                        ALL
                    </label>
                    </div>
                    
                            </div>

                        <div className="row" style={{ marginTop: '20px' }}>
                            <div className="col-12 text-center">
                                <button type="submit" className="btn btn-primary btn-lg" onClick={searchdata} >Search</button>
                            </div>
                        </div>
                        

                    </form>
                </div>
                <div className="col-lg-12">
                    <div style={{ overflowY: 'auto', height: '400px' , marginTop:"50px" }}>
                        {reportData.length!=0?
                         <div>
                         <ReportTable cols={colData} rows={reportData} />
                         <button className="btn btn-primary" onClick={exportExcel}>Export To Excel</button>
                         {/* <button className="btn btn-warning" onClick={(e)=>saveapcommin(e)}>save</button>
                         <button className="btn btn-success" onClick={(e)=>submitapcommin(e)}>submit</button> */}
                       </div>
                       :
                            <div className="container" style={{marginTop:"30px"}}>
                                <div className="row justify-content-center">
                                    <h2 className={"text-center"}>No Data</h2>
                                </div>
                            </div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportฺCashier;
