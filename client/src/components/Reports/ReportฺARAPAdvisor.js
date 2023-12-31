import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import jwt_decode from "jwt-decode";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ReportTable from "./ReportTable";
import {convertDateFormat , getDateReport} from "../lib/convertdateformat";

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

const ReportฺARAPAdvisor = () => {
    const url = window.globalConfig.BEST_POLICY_V1_BASE_URL;
    const url_report = window.globalConfig.REPORT_BEST_POLICY_V1_BASE_URL;
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(["jwt"]);
    const headers = {
        headers: { Authorization: `Bearer ${cookies["jwt"]}` }
      };
      const [reporttype, setReporttype] = useState('Open');
      const [type, setType] = useState('In');
      
      const [fromDate, setFromDate] = useState('');
      const [toDate, setToDate] = useState('');
      const [atdate, setAtdate] = useState('');
      
      const [createusercode, setCreateusercode] = useState("");
      
      const [employeecode, setEmployeecode] = useState("");
      
      const [insurercode, setInsurercode] = useState("");
      
      const [advisorcode, setAdvisorcode] = useState("")
      
      const [status, setStatus] = useState('A'); // I or A

    const [insureTypeDD, setInsureTypeDD] = useState([]);
    const [insureClassDD, setInsureClassDD] = useState([]);
  const [insureSubClassDD, setInsureSubClassDD] = useState([]);

    const [filterData, setFilterData] = useState(
        {
        "startPolicyIssueDate": "",
        "endPolicyIssueDate": "",
        "asAtDate": "",
        "createUserCode": "",
        "mainAccountContactPersonId": "",
        "mainAccountCode": "",
        "insurerCode": "",
        "policyStatus": "",
        "class": "",
        "subClass": "",
        "transactionType": ""
      }
      )
      const [reportData, setReportData] = useState([])
      const colData =
      {
        "policyNo": "หมายเลขกรมธรรม์",
        "endorseNo": "หมายเลขสลักหลัง",
        "invoiceNo": "หมายเลขใบแจ้งหนี้",
        "seqNo": "เลขที่งวด",
        "cashierReceiveNo": "เลขที่แคชเชียร์",
        "cashierDate": "วันที่แคชเชียร์",
        "cashierAmt": "ยอดแคชเชียร์",
        "cashierReceiveType": "CashierReceiveType",
        "cashierRefNo": "CashierRefNo",
        "cashierRefDate": "CashierRefDate",
        "premInDfRpReferNo": "เลขที่ตัดหนี้ PremIn",
        "rpRefDate": "วันที่ตัดหนี้",
        "grossPrem": "เบี้ยรวม",
        "specDiscRate": "อัตราส่วนลด",
        "specDiscAmt": "มูลค่าส่วนลด",
        "netGrossPrem": "เบี้ยสุทธิ",
        "duty": "อากร",
        "tax": "ภาษี",
        "totalPrem": "เบี้ยประกันภัยรับรวม",
        "netFlag": "NetFlag",
        "actDate": "วันที่เริ่มคุ้มครอง",
        "expDate": "วันที่สิ้นสุดคุ้มครอง",
        "mainAccountCode": "รหัส Main Account",
        "mainAccountName": "ชื่อ Main Account",
        "insureeCode": "รหัสผู้เอาประกัน",
        "insureeName": "ชื่อผู้เอาประกัน",
        "class": "ประเภทประกัน",
        "subClass": "ประเภทย่อยประกัน",
        "licenseNo": "ทะเบียนรถ",
        "province": "จังหวัด",
        "chassisNo": "เลขตัวถัง",
        "commOutRate": "อัตราคอมมิชชั่นจ่าย",
        "ovOutRate": "อัตรา OV จ่าย",
        "ovOutAmt": "ยอด OV จ่าย",
        "commOutDfRpReferNo": "CommOutDfRpReferNo",
        "commOutRpRefDate": "CommOutRpRefDate",
        "commOutPaidAmt": "CommOutPaidAmt",
        "commOutDiffAmt": "CommOutDiffAmt",
        "ovOutPaidAmt": "OvOutPaidAmt",
        "ovOutDiffAmt": "OvOutDiffAmt",
        "issueDate": "วันที่ทำสัญญา",
        "policyCreateUserCode": "ผู้เอาเข้าระบบ",
        // "mainAccountContactPersonId": "",
        "insurerCode": "บริษัทประกัน",
        // "policyStatus": "A",
        // "transactionType": "COMM-OUT"
      }

      const handleChange =  (e) => {
        e.preventDefault();
       
        //set dropdown subclass when class change
        if (e.target.name === "class") {
          const array = [];
          insureTypeDD.forEach((ele) => {
            if (e.target.value === ele.class) {
              array.push(
                <option key={ele.id} value={ele.subClass}>
                  {ele.subClass}
                </option>
              );
            }
          });
          setInsureSubClassDD(array);
        }
        setFilterData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,    
          }))
    
      };
        
    useEffect(() => {
//get insureType
axios
.get(url + "/insures/insuretypeall", headers)
.then((insuretype) => {
  
  const uniqueClasses = [...new Set(insuretype.data.map(ele => ele.class))];

  const array = uniqueClasses.map((className, index) => (
    <option key={index} value={className}>
      {className}
    </option>
  ));

  setInsureTypeDD(insuretype.data);
  setInsureClassDD(array);
})
.catch((err) => { });
    }, []);


    
    const exportExcel = (e) => {
        e.preventDefault()
        let url_type
        let filename
       if (type === 'In') {
        if (reporttype === 'Open') {
            
        }else if(reporttype === 'Clear') {

        }else if(reporttype === 'Outstand') {
            
        }
       }else if (type === 'Out'){
        if (reporttype === 'Open') {
            url_type = 'commOutOvOutOpenItem'
            filename =`รายงานตัดจ่ายค่าCommOV_ตัวตั้ง_${getDateReport('D')}`;
        }else if(reporttype === 'Clear') {
            url_type = 'commOutOvOutClearing'
            filename =`รายงานตัดจ่ายค่าCommOV_ตัวตัด_${getDateReport('D')}`;
        }else if(reporttype === 'Outstand') {
            url_type = 'commOutOvOutOutstanding'
            filename =`รายงานตัดจ่ายค่าCommOV_ตัวคงเหลือ_${getDateReport('D')}`;
        }
       }
       const data = 
        {
            "startPolicyIssueDate": fromDate,
            "endPolicyIssueDate": toDate,
            "asAtDate": atdate,
            "createUserCode": createusercode,
            "mainAccountContactPersonId": employeecode,
            "mainAccountCode": advisorcode,
            "insurerCode": insurercode,
            
            "policyStatus": status,
            "class": filterData.class,
            "subClass": filterData.subClass,
            "transactionType": ""

        
          }
          
          if (document.getElementsByName("createusercodeCB")[0].checked) {
            data.createUserCode = ''
         }
         if (document.getElementsByName ("employeecodeCB")[0].checked) {
            data.mainAccountContactPersonId = ''
         }
         if (document.getElementsByName ("advisorcodeCB")[0].checked) {
            data.mainAccountCode = ''
         }
         if (document.getElementsByName ("insurercodeCB")[0].checked) {
            data.insurerCode = ''
         }

        axios.post(url_report + `/ArAp/${url_type}/excel`, data, {
            headers: {
                'Content-Type': 'application/json'
            },            
            responseType: 'blob',
        
        })
        .then((response) => {
            // Extract filename from Content-Disposition header, if available
 
  
  const blob = new Blob([response.data], { type: response.headers['content-type'] });

  // Create a temporary link element
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = filename;

  // Trigger a click on the link to start the download
  link.click();

  // Remove the link from the DOM
  document.body.removeChild(link);
         
        })
            .catch((error) => {
                console.log(error);
            });
    }
    const searchdata = (e) => {
        e.preventDefault()
        let url_type
       if (type === 'In') {
        if (reporttype === 'Open') {
            
        }else if(reporttype === 'Clear') {

        }else if(reporttype === 'Outstand') {
            
        }
       }else if (type === 'Out'){
        if (reporttype === 'Open') {
            url_type = 'commOutOvOutOpenItem'
        }else if(reporttype === 'Clear') {
            url_type = 'commOutOvOutClearing'
        }else if(reporttype === 'Outstand') {
            url_type = 'commOutOvOutOutstanding'
        }
       }
       const data = 
        {
            "startPolicyIssueDate": fromDate,
            "endPolicyIssueDate": toDate,
            "asAtDate": atdate,
            "createUserCode": createusercode,
            "mainAccountContactPersonId": employeecode,
            "mainAccountCode": advisorcode,
            "insurerCode": insurercode,
            
            "policyStatus": status,
            "class": filterData.class,
            "subClass": filterData.subClass,
            "transactionType": ""

        
          }
          
          if (document.getElementsByName("createusercodeCB")[0].checked) {
            data.createUserCode = ''
         }
         if (document.getElementsByName ("employeecodeCB")[0].checked) {
            data.mainAccountContactPersonId = ''
         }
         if (document.getElementsByName ("advisorcodeCB")[0].checked) {
            data.mainAccountCode = ''
         }
         if (document.getElementsByName ("insurercodeCB")[0].checked) {
            data.insurerCode = ''
         }

        axios.post(url_report + `/ArAp/${url_type}/json`, data, {
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
                    if (ele.cashierDate) {
                        ele.cashierDate =  convertDateFormat(ele.cashierDate)
                    }
                    if (ele.cashierRefDate) {
                        ele.cashierRefDate =  convertDateFormat(ele.cashierRefDate)
                    }
                    if (ele.rpRefDate) {
                        ele.rpRefDate =  convertDateFormat(ele.rpRefDate)
                    }
                    
                    if (ele.actDate) {
                        ele.actDate =  convertDateFormat(ele.actDate)
                    }
                    if (ele.expDate) {
                        ele.expDate =  convertDateFormat(ele.expDate)
                    }
                    
                    if (ele.issueDate) {
                        ele.issueDate =  convertDateFormat(ele.issueDate)
                    }
                    if (ele.commOutRpRefDate) {
                        ele.commOutRpRefDate =  convertDateFormat(ele.commOutRpRefDate)
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
                        <h2 className="text-center" style={{marginBottom:"30px"}}>รายงานตัดหนี้/ตัดจ่าย ตัวแทน</h2>
                {/* report type  */}
                <div className="row my-3">
                            <label class="col-sm-2 col-form-label" htmlFor="reporttype">
                                ประเภทรายงาน
                            </label>

                            <div class="form-check col-2">
                                <input class="form-check-input" type="radio" name="reporttype" id="reporttype1" defaultChecked onChange={(e) => setReporttype('Open')} />
                                <label class="form-check-label" for="reporttype1">
                                    ตัวตั้ง
                                </label>
                            </div>
                            <div class="form-check col-2">
                                <input class="form-check-input" type="radio" name="reporttype" id="reporttype2" onChange={(e) => setReporttype('Clear')} />
                                <label class="form-check-label" for="reporttype2">
                                    ตัวตัด
                                </label>
                            </div>
                            <div class="form-check col-2">
                                <input class="form-check-input" type="radio" name="reporttype" id="reporttype3" onChange={(e) => setReporttype('Outstand')} />
                                <label class="form-check-label" for="reporttype3">
                                    ตัวคงเหลือ
                                </label>
                            </div>
                        </div>
                        <div className="row my-3">
                            <label class="col-sm-2 col-form-label" htmlFor="type">
                                
                            </label>

                            <div class="form-check col-2">
                                <input class="form-check-input" type="radio" name="type" id="type1" defaultChecked onChange={(e) => setType('In')} />
                                <label class="form-check-label" for="type1">
                                ตัดหนี้
                                </label>
                            </div>
                            <div class="form-check col-2">
                                <input class="form-check-input" type="radio" name="type" id="type2" onChange={(e) => setType('Out')} />
                                <label class="form-check-label" for="type2">
                                ตัดจ่าย
                                </label>
                            </div>
                            
                        </div>

     {/* Date Select */}
     <div className="row">
                            <div className="col-2">
                                <label htmlFor="Date Select" className="form-label">Policy Approve Date from</label>
                            </div>
                            <div className="col-4">
                                
                              
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

{/* as at date */}
{reporttype === '3' ? 

<div className="row mb-3">
                            <div className="col-2">
                                <label htmlFor="createusercode" className="form-label">As At Date</label>
                            </div>
                            <div className="col-4">
                                {/* <input type="date" id="atdate" value={atdate} onChange={(e) => setAtdate(e.target.value)} className="form-control" /> */}
                                <DatePicker
                            showIcon
                            className="form-control"
                            todayButton="Vandaag"
                            // isClearable
                            showYearDropdown
                            dateFormat="dd/MM/yyyy"
                            dropdownMode="select"
                            selected={atdate}
                            onChange={(date) =>setAtdate(date)}
                                 />
                            </div>
                            
                        </div>
:null}
                        {/* createusercode */}
                        <div className="row mb-3">
                            <div className="col-2">
                                <label htmlFor="createusercode" className="form-label">Createusercode</label>
                            </div>
                            <div className="col-7">
                                <input type="text" id="createusercode" value={createusercode} onChange={(e) => setCreateusercode(e.target.value)} className="form-control" />
                            </div>
                            <div className="col-1">
                                <input type="checkbox"  name="createusercodeCB" className="form-check-input" />
                                <label htmlFor="cashierReceiptCheckbox" className="form-check-label">&nbsp;ALL</label>
                            </div>
                        </div>

                        {/* employeecode */}
                        <div className="row mb-3">
                            <div className="col-2">
                                <label htmlFor="employeecode" className="form-label">EmployeeID</label>
                            </div>
                            <div className="col-7">
                                <input type="text" id="employeecode" value={employeecode} onChange={(e) => setEmployeecode(e.target.value)} className="form-control" />
                            </div>
                            <div className="col-1">
                                <input type="checkbox"  name="employeecodeCB" className="form-check-input" />
                                <label htmlFor="cashierReceiptCheckbox" className="form-check-label">&nbsp;ALL</label>
                            </div>
                        </div>
                        {/* advisorcode */}
                        <div className="row mb-3">
                            <div className="col-2">
                                <label htmlFor="Advisor" className="form-label">Advisor Code</label>
                            </div>
                            <div className="col-7">
                                <input type="text" id="Advisor" value={advisorcode}  onChange={(e) => setAdvisorcode(e.target.value)} className="form-control" />
                            </div>
                            <div className="col-1">
                                <input type="checkbox" name="advisorcodeCB" className="form-check-input" />
                                <label htmlFor="cashierReceiptCheckbox" className="form-check-label">&nbsp;ALL</label>
                            </div>
                        </div>

                        {/* insurercode */}
                        <div className="row mb-3">
                            <div className="col-2">
                                <label htmlFor="Insurer" className="form-label">InsurerCode</label>
                            </div>
                            <div className="col-7">
                                <input type="text" id="InsurerCode" value={insurercode}  onChange={(e) => setInsurercode(e.target.value)} className="form-control" />
                            </div>
                            <div className="col-1">
                                <input type="checkbox" name="insurercodeCB" className="form-check-input" />
                                <label htmlFor="cashierReceiptCheckbox" className="form-check-label">&nbsp;ALL</label>
                            </div>
                        </div>

                        {/* status  */}
                        <div className="row my-3">
                            <label class="col-sm-2 col-form-label" htmlFor="insurerCode">
                                สถานะ
                            </label>

                            <div class="form-check col-2">
                                <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1"  onChange={(e) => setStatus('I')} />
                                <label class="form-check-label" for="flexRadioDefault1">
                                    (AI) ใบคำขอ
                                </label>
                            </div>
                            <div class="form-check col-2">
                                <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" defaultChecked onChange={(e) => setStatus('A')} />
                                <label class="form-check-label" for="flexRadioDefault2">
                                    (AA) กรมธรรม์
                                </label>
                            </div>
                        </div>

                        {/* insuranceclass */}
                        <div className="row mb-3">
                            <div className="col-2">
                                <label htmlFor="transactionType" className="form-label">Insurance Class</label>
                            </div>
                            <div className="col-2">
                                <select
                                    
                                    value={filterData.class}
                                    onChange={handleChange}
                                    className="form-control"
                                    name="class"
                                   
                                    
                                >
                                    <option value="" selected  hidden>Select Class</option>

{insureClassDD}

                                </select>
                            </div>
                            <div className="col-2">
                                <label htmlFor="transactionType" className="form-label">SubClass</label>
                            </div>
                            <div className="col-2">
                                <select
                                    id="transactionType"
                                    value={filterData.subClass}
                                    onChange={handleChange}
                                    className="form-control"
                                    name="subClass"
                                    
                                >
                                    <option value="" selected  hidden>Select SubClass</option>

                                    {insureSubClassDD}
                                </select>
                            </div>
                        </div>

                        {/* transaction type  */}
                {/* {type === '2'? 
                <div className="row my-3">
                            <label class="col-sm-2 col-form-label" htmlFor="transtype">
                            Transaction Type
                            </label>
                            
                            <div class="form-check col-2">
                    <input class="form-check-input" type="radio" name="transtype" id="transtyperadio1" defaultChecked onChange={(e)=>setTranstype('COMM-OUT')}/>
                    <label class="form-check-label" for="transtyperadio1">
                        COMM-OUT
                    </label>
                    </div>

                    <div class="form-check col-2">
                    <input class="form-check-input" type="radio" name="transtype" id="transtyperadio2" onChange={(e)=>setTranstype('OV-OUT')}/>
                    <label class="form-check-label" for="transtyperadio2">
                        OV-OUT
                    </label>
                    </div>
                    <div class="form-check col-2">
                    <input class="form-check-input" type="radio" name="transtype" id="transtyperadio3" onChange={(e)=>setTranstype('ALL')}/>
                    <label class="form-check-label" for="transtyperadio3">
                        ALL
                    </label>
                    </div>
                    
                            </div>
                    : null} */}

                        <div className="row" style={{ marginTop: '20px' }}>
                            <div className="col-12 text-center">
                                <button type="submit" className="btn btn-primary btn-lg" onClick={searchdata} >Search</button>
                            </div>
                        </div>
                        

                    </form>
                </div>
                <div className="col-lg-12">
                    <div style={{ overflowY: 'auto', height: '400px' , marginTop:"50px" }}>
                        {reportData.length!=0 ?
                        <div>
                        <ReportTable cols={colData} rows={reportData} />
                        
                      </div>:
                            <div className="container" style={{marginTop:"30px"}}>
                                <div className="row justify-content-center">
                                    <h2 className={"text-center"}>No Data</h2>
                                </div>
                            </div>}
                    </div>
                    <div className="d-flex justify-content-center">
        <button className="btn btn-primary" onClick={exportExcel}>Export To Excel</button>
        {/* <button className="btn btn-warning" onClick={(e)=>saveapcommin(e)}>save</button>
        <button className="btn btn-success" onClick={(e)=>submitapcommin(e)}>submit</button> */}
        </div>
                </div>
            </div >
        </div >
    );
};

export default ReportฺARAPAdvisor;