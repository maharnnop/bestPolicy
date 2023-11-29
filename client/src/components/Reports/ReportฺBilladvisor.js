import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
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

const ReportฺBilladvisor = () => {
    const url = window.globalConfig.BEST_POLICY_V1_BASE_URL;
    const url_report = window.globalConfig.REPORT_BEST_POLICY_V1_BASE_URL;
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(["jwt"]);
    const headers = {
        headers: { Authorization: `Bearer ${cookies["jwt"]}` }
      };
    
      const [insurercode, setInsurercode] = useState("");
      const [advisorcode, setAdvisorcode] = useState("")
      const [fromBilladvisorno, setFromBilladvisorno] = useState('');
      const [toBilladvisorno, setToBilladvisorno] = useState('');
    

   
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    
    
    // const [orderby, setOrderby] = useState();
    
    const [filterData, setFilterData] = useState({
        "startPolicyDate": "",
        "endPolicyDate": "",
        "createUserCode": "",
        "contactPersonId1": "",
        "contactPersonId2": "",
        "agentCode1": "",
        "agentCode2": "",
        "insurerCode": "",
        "status": "",
        "class": "",
        "subClass": "",
        "orderBy": ""
      }
      )
      const [reportData, setReportData] = useState([])
      const colData = 
    {
        "insurerCode": "รหัสบริษัทประกัน",
        "agentCode1": "รหัสผู้แนะนำ 1",
        "agentCode2": "รหัสผู้แนะนำ 2",
        "dueDate": "วันครบกำหนดชำระ",
        "policyNo": "หมายเลขกรมธรรม์",
        "endorseNo": "หมายเลขสลักหลัง",
        "invoiceNo": "เลขที่ใบแจ้งหนี้",
        "seqNo": "งวดชำระที่",
        "insureeCode": "รหัสผู้เอาประกัน",
        "insureeName": "ชื่อผู้เอาประกัน",
        "licenseNo": "ทะเบียนรถ",
        "province": "จังหวัด",
        "chassisNo": "เลขตัวถัง",
        "grossPrem": "เบี้ยรวม",
        "specDiscRate": "อัตราส่วนลด",
        "specDiscAmt": "มูลค่าส่วนลด",
        "netGrossPrem": "เบี้ยสุทธิ",
        "duty": "อากร",
        "tax": "ภาษี",
        "totalPrem": "เบี้ยประกันรับรวม",
        "commOutRate1": "อัตราคอมมิชชั่นจ่าย 1",
        "commOutAmt1": "ยอดคอมมิชชั่นจ่าย 1",
        "ovOutRate1": "อัตรา OV จ่าย 1",
        "ovOutAmt1": "ยอด OV จ่าย 1",
        "commOutRate2": "อัตราคอมมิชชั่นจ่าย 2",
        "commOutAmt2": "ยอดคอมมิชชั่นจ่าย 2",
        "ovOutRate2": "อัตรา OV จ่าย 2",
        "ovOutAmt2": "ยอด OV จ่าย 2",
        "commOutRate": "อัตราคอมมิชชั่นจ่าย",
        "commOutAmt": "ยอดคอมมิชชั่นจ่าย",
        "ovOutRate": "อัตรา OV จ่าย",
        "ovOutAmt": "ยอด OV จ่าย 2",
        "netFlag": "NetFlag",
        "billPremium": "ยอดชำระรวม",
        "billAdvisorNo": "เลขที่ใบวางบิล",
        "billAdvisorSubNo": "เลขที่ใบวางบิลย่อย",
        "billDate": "วันที่สร้างใบวางบิล"
      }

    useEffect(() => {

    }, []);

    
    const exportExcel =(e) => {
        e.preventDefault()
        axios.post(url_report + "/DailyPolicy/excel", filterData, {
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
           "startBillDate": fromDate,
           "endBillDate": toDate,
        "insurerCode": insurercode,
        "agentCode1": advisorcode,
        "agentCode2": "",
        "startBillAdvisorNo": fromBilladvisorno,
        "endBillAdvisorNo": toBilladvisorno,
      }

      if (document.getElementsByName("insurercodeCB")[0].checked) {
        data.insurerCode = ''
     }
     if (document.getElementsByName("advisorcodeCB")[0].checked) {
        data.agentCode1 = ''
     }
        axios.post(url_report + "/Bill/json", data, {
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
                    if (ele.dueDate) {
                        ele.dueDate =  convertDateFormat(ele.dueDate)
                    }
                    if (ele.billDate) {
                        ele.billDate =  convertDateFormat(ele.billDate)
                    }
                    return ele
                })
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
                        <h2 className="text-center" style={{marginBottom:"30px"}}>รายงานใบวางบิล</h2>
                        
                      

                        {/* insurercode */}
                        <div className="row mb-3">
                            <div className="col-2">
                                <label htmlFor="Insurer" className="form-label">รหัส Insurer</label>
                            </div>
                            <div className="col-7">
                                <input type="text" id="InsurerCode" value={insurercode} onChange={(e) => setInsurercode(e.target.value)} className="form-control"/>
                            </div>
                            <div className="col-1">
                                <input type="checkbox" name="insurercodeCB" className="form-check-input"/>
                                <label htmlFor="cashierReceiptCheckbox" className="form-check-label">&nbsp;ALL</label>
                            </div>
                        </div>
                        
                        {/* advisorcode */}
<div className="row mb-3">
                            <div className="col-2">
                                <label htmlFor="Advisor" className="form-label">รหัส Advisor </label>
                            </div>
                            <div className="col-7">
                                <input type="text" id="Advisor" value={advisorcode} onChange={(e) => setAdvisorcode(e.target.value)} className="form-control"/>
                            </div>
                            <div className="col-1">
                                <input type="checkbox" name="advisorcodeCB" className="form-check-input"/>
                                <label htmlFor="cashierReceiptCheckbox" className="form-check-label">&nbsp;ALL</label>
                            </div>
                        </div>

                                        
                     {/*  billadvisorno */}
                     <div className="row">
                            <div className="col-2">
                                <label htmlFor="Date Select" className="form-label">เลขที่ใบวางบิล </label>
                            </div>
                            <div className="col-4">
                                <label htmlFor="fromBilladvisorno">From &nbsp;</label>
                                <input
                                    type="text"
                                    id="fromBilladvisorno"
                                    className="form-control"
                                    value={fromDate}
                                    onChange={(e) => setFromBilladvisorno(e.target.value)}
                                />
                            </div>
                            <div className="col-4">
                                <label htmlFor="toBilladvisorno">To &nbsp;</label>
                                <input
                                    type="text"
                                    id="toBilladvisorno"
                                    className="form-control"
                                    value={toDate}
                                    onChange={(e) => setToBilladvisorno(e.target.value)}
                                />
                            </div>
                        </div>
                        
                             {/*  billdate */}
                    
                        <div className="row">
                            <div className="col-2">
                                <label htmlFor="Date Select" className="form-label">Bill Date  </label>
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

                        {/* orderby  */}
                        {/* <div className="row my-3">
                            <label class="col-sm-2 col-form-label" htmlFor="orderby">
                                Order BY
                            </label>
                            
                            <div class="form-check col-2">
                    <input class="form-check-input" type="radio" name="orderby" id="orderbyradio1" defaultChecked onChange={(e)=>setOrderby('id')}/>
                    <label class="form-check-label" for="orderbyradio1">
                        ลำดับที่
                    </label>
                    </div>

                    <div class="form-check col-2">
                    <input class="form-check-input" type="radio" name="orderby" id="orderbyradio2" onChange={(e)=>setOrderby('createusercode')}/>
                    <label class="form-check-label" for="orderbyradio2">
                        Createusercode
                    </label>
                    </div>
                    <div class="form-check col-2">
                    <input class="form-check-input" type="radio" name="orderby" id="orderbyradio3" onChange={(e)=>setOrderby('employeecode')}/>
                    <label class="form-check-label" for="orderbyradio3">
                        Employeecode
                    </label>
                    </div>
                    <div class="form-check col-2">
                    <input class="form-check-input" type="radio" name="orderby" id="orderbyradio4" onChange={(e)=>setOrderby('advisorcode')}/>
                    <label class="form-check-label" for="orderbyradio4">
                        Advisorcode
                    </label>
                    </div>
                    <div class="form-check col-2">
                    <input class="form-check-input" type="radio" name="orderby" id="orderbyradio5" onChange={(e)=>setOrderby('insurercode')}/>
                    <label class="form-check-label" for="orderbyradio5">
                        Insurercode
                    </label>
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

export default ReportฺBilladvisor;
