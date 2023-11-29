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

const ReportฺTax = () => {
    const url = window.globalConfig.BEST_POLICY_V1_BASE_URL;
    const url_report = window.globalConfig.REPORT_BEST_POLICY_V1_BASE_URL;
    const navigate = useNavigate();

    const [tableData, setTableData] = useState([])
    const [billAdvisorNo, setBillAdvisorNo] = useState("")
    const [insurercode, setInsurercode] = useState("");
    const [advisorcode, setAdvisorcode] = useState("")
    const [type, setType] = useState("");
    const [advisorAll, setAdvisorAll] = useState();
    const [insurerAll, setInsurerAll] = useState(false);
    
    const [createUserCode, setCreateUserCode] = useState();
    const [fromDate, setFromDate] = useState('');
    const [reporttype, setReporttype] = useState('SellTax');
    const [toDate, setToDate] = useState('');
    
    const [advisoryReadOnly, setAdvisoryReadOnly] = useState(false)
    const [insurerReadOnly, setInsurerReadOnly] = useState(false)
    
    const [filterData, setFilterData] = useState(
        {
            "insurerCode": "",
            "advisorCode": "",
            "startRpRefDate": "",
            "endRpRefDate": ""
          }
      )
      const [reportData, setReportData] = useState([])
      const colData =
      
      {
        "dfRpReferNo": "เลขที่ตัดรับ",
        "rpRefDate": "วันที่ตัดรับ",
        "insurerCode": "รหัสบริษัทประกัน",
        "insurerName": "ชื่อบริษัทประกัน",
        "commInAmt": "ยอดคอมมิสชั่นรับ",
        "vatCommInAmt": "ยอดภาษีขายคอมมิสชั่นรับ",
        "ovInAmt": "ยอด OV รับ",
        "vatOvInAmt": "ยอดภาษีขาย OV รับ",
        "transactionStatus": "สถานะรายการ",
        // "transactionType": "COMM-IN",
        // "policyStatus": "A"
      }
      

    useEffect(() => {

    }, [billAdvisorNo]);

    const handleChange = async (e) => {
        e.preventDefault();
          setFilterData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
          }));
      };
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
    const searchdata = (e) => {
        e.preventDefault()
        let url_type
        const data = filterData
        if (reporttype === 'SellTax') {
         if (type === 'COMM-IN') {
            url_type =  'OutputVatCommIn'
         }else if(type === 'OV-IN') {
            url_type =  'OutputVatOvIn'
         }
         
         if (document.getElementsByName ("insurerAll")[0].checked) {
            data.insurerCode = ''
         }
        }else if (reporttype === 'BuyTax'){
            if (type === 'COMM-OUT') {
             
            }else if(type === 'OV-OUT') {
    
            }
            if (document.getElementsByName ("advisorAll")[0].checked) {
                data.advisorCode = ''
             }
        }
        
        axios.post(url_report + `/${url_type}/json`, data, {
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
                    if (ele.rpRefDate) {
                        ele.rpRefDate =  convertDateFormat(ele.rpRefDate)
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
                        <h2 className="text-center" style={{marginBottom:"30px"}}>รายงานภาษี</h2>
                {/* report type  */}
                <div className="row my-3">
                            <label class="col-sm-2 col-form-label" htmlFor="reporttype">
                                ประเภทรายงาน
                            </label>

                            <div class="form-check col-2">
                                <input class="form-check-input" type="radio" name="reporttype" id="reporttype1" defaultChecked onChange={(e) => setReporttype('SellTax')} />
                                <label class="form-check-label" for="reporttype1">
                                    ภาษีซื้อ
                                </label>
                            </div>
                            <div class="form-check col-2">
                                <input class="form-check-input" type="radio" name="reporttype" id="reporttype2" onChange={(e) => setReporttype('BuyTax')} />
                                <label class="form-check-label" for="reporttype2">
                                ภาษีขาย
                                </label>
                            </div>
                            {/* <div class="form-check col-2">
                                <input class="form-check-input" type="radio" name="reporttype" id="reporttype3" onChange={(e) => setReporttype('WHT')} />
                                <label class="form-check-label" for="reporttype3">
                                WHT 3%
                                </label>
                            </div> */}
                            {/* <div className="col-1 text-center">
                                <button type="submit" className="btn btn-primary" onClick={searchBill}>Search</button>
                            </div> */}
                        </div>

                        {reporttype === 'SellTax' ? 
                          <div className="row my-3">
                          <label class="col-sm-2 col-form-label" htmlFor="type">
                              
                          </label>

                          <div class="form-check col-2">
                              <input class="form-check-input" type="radio" name="type" id="type1"  onChange={(e) => setType('COMM-IN')} />
                              <label class="form-check-label" for="type1">
                              COMM-IN
                              </label>
                          </div>
                          <div class="form-check col-2">
                              <input class="form-check-input" type="radio" name="type" id="type2" onChange={(e) => setType('OV-IN')} />
                              <label class="form-check-label" for="type2">
                              OV-IN
                              </label>
                          </div>
                          
                      </div>
                      : reporttype === 'BuyTax' ? 
                      <div className="row my-3">
                      <label class="col-sm-2 col-form-label" htmlFor="type">
                          
                      </label>

                      <div class="form-check col-2">
                          <input class="form-check-input" type="radio" name="type" id="type1"  onChange={(e) => setType('COMM-OUT')} />
                          <label class="form-check-label" for="type1">
                          COMM-OUT
                          </label>
                      </div>
                      <div class="form-check col-2">
                          <input class="form-check-input" type="radio" name="type" id="type2" onChange={(e) => setType('OV-OUT')} />
                          <label class="form-check-label" for="type2">
                          OV-OUT
                          </label>
                      </div>
                      
                  </div>
                      : null}
                      

     {/* Date Select */}

                        <div className="row">
                            <div className="col-2">
                                <label htmlFor="Date Select" className="form-label">rprefdate Date  </label>
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
                            selected={filterData.startRpRefDate}
                            onChange={(date) =>setFilterData((prevState) => ({
                                ...prevState,
                                startRpRefDate: date,    
                              }))
                            }
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
                            selected={filterData.endRpRefDate}
                            onChange={(date) =>setFilterData((prevState) => ({
                                ...prevState,
                               endRpRefDate: date,    
                              }))
                            }
                                 />
                            </div>
                        </div>


                        {/* advisorcode */}
                        {reporttype === 'BuyTax' ?                         
                        <div className="row mb-3">
                            <div className="col-2">
                                <label htmlFor="Advisor" className="form-label">Advisor Code</label>
                            </div>
                            <div className="col-7">
                                <input type="text" name="advisorCode" value={filterData.advisorCode} onChange={handleChange} className="form-control" />
                            </div>
                            <div className="col-1">
                                <input type="checkbox" name="advisorAll" value={advisorAll} onChange={(e) => setAdvisorAll(e.target.checked)} className="form-check-input" />
                                <label htmlFor="cashierReceiptCheckbox" className="form-check-label">&nbsp;ALL</label>
                            </div>
                        </div>
                        : null}
{/* insurercode */}
{reporttype === 'SellTax' ? 


                        
                        <div className="row mb-3">
                            <div className="col-2">
                                <label htmlFor="Insurer" className="form-label">InsurerCode</label>
                            </div>
                            <div className="col-7">
                                <input type="text" name="insurerCode" value={filterData.insurerCode} onChange={handleChange} className="form-control" />
                            </div>
                            <div className="col-1">
                                <input type="checkbox" name="insurerAll" value={insurerAll} onChange={(e) => setInsurerAll(e.target.checked)} className="form-check-input" />
                                <label htmlFor="cashierReceiptCheckbox" className="form-check-label">&nbsp;ALL</label>
                            </div>
                        </div>
: null}
                        {/* status  */}
                        {/* <div className="row my-3">
                            <label class="col-sm-2 col-form-label" htmlFor="insurerCode">
                                สถานะ
                            </label>

                            <div class="form-check col-2">
                                <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" defaultChecked onChange={(e) => setStatus('I')} />
                                <label class="form-check-label" for="flexRadioDefault1">
                                    (I) ใบคำขอ
                                </label>
                            </div>
                            <div class="form-check col-2">
                                <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" onChange={(e) => setStatus('A')} />
                                <label class="form-check-label" for="flexRadioDefault2">
                                    (A) กรมธรรม์
                                </label>
                            </div>
                        </div> */}

                        {/* insuranceclass */}
                        {/* <div className="row mb-3">
                            <div className="col-2">
                                <label htmlFor="transactionType" className="form-label">Insurance Class</label>
                            </div>
                            <div className="col-2">
                                <select
                                    id="transactionType"
                                    value={transactionType}
                                    onChange={(e) => setTransactionType(e.target.value)}
                                    className="form-control"
                                    disabled={transactionTypeReadOnly}
                                    style={{ backgroundColor: transactionTypeReadOnly ? 'white' : '' }}
                                >
                                    <option value="" disabled>Select Transaction Type</option>
                                    <option value="PREM-IN">PREM-IN</option>
                                    <option value="PREM-OUT">PREM-OUT</option>
                                    <option value="COMM-OUT">COMM-OUT</option>
                                    <option value="COMM-IN">COMM-IN</option>
                                </select>
                            </div>
                            <div className="col-2">
                                <label htmlFor="transactionType" className="form-label">SubClass</label>
                            </div>
                            <div className="col-2">
                                <select
                                    id="transactionType"
                                    value={transactionType}
                                    onChange={(e) => setTransactionType(e.target.value)}
                                    className="form-control"
                                    disabled={transactionTypeReadOnly}
                                    style={{ backgroundColor: transactionTypeReadOnly ? 'white' : '' }}
                                >
                                    <option value="" disabled>Select Transaction Type</option>
                                    <option value="PREM-IN">PREM-IN</option>
                                    <option value="PREM-OUT">PREM-OUT</option>
                                    <option value="COMM-OUT">COMM-OUT</option>
                                    <option value="COMM-IN">COMM-IN</option>
                                </select>
                            </div>
                        </div> */}

                      
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
                      </div>:
                            <div className="container" style={{marginTop:"30px"}}>
                                <div className="row justify-content-center">
                                    <h2 className={"text-center"}>No Data</h2>
                                </div>
                            </div>}
                    </div>
                </div>
            </div >
        </div >
    );
};

export default ReportฺTax;