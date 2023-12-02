import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import jwt_decode from "jwt-decode";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ReportTable from "./ReportTable";
import {convertDateFormat, getDateReport} from "../lib/convertdateformat";


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

const ReportPolicy = () => {
    const url = window.globalConfig.BEST_POLICY_V1_BASE_URL;
    const url_report = window.globalConfig.REPORT_BEST_POLICY_V1_BASE_URL;
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(["jwt"]);
    const headers = {
        headers: { Authorization: `Bearer ${cookies["jwt"]}` }
      };
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [createusercode, setCreateusercode] = useState("");
    
    const [employeecode, setEmployeecode] = useState("");
    
    const [insurercode, setInsurercode] = useState("");
    
    const [advisorcode, setAdvisorcode] = useState("")
    
    const [status, setStatus] = useState('I'); // I or A

    const [insureTypeDD, setInsureTypeDD] = useState([]);
    const [insureClassDD, setInsureClassDD] = useState([]);
  const [insureSubClassDD, setInsureSubClassDD] = useState([]);
    
    const [orderby, setOrderby] = useState();
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
      const colData = {
        "applicationNo": "ApplicationNo",
    "policyNo": "หมายเลขกรมธรรม์",
    "policyDate": "วันที่นำข้อมูลเข้า",
    "actDate": "วันที่เริ่มคุ้มครอง",
    "expDate": "วันที่สิ้นสุดคุ้มครอง",
    "issueDate": "วันที่ทำสัญญา",
    "createUserCode": "รหัสผู้บันทึก",
    "username": "Username ผู้บันทึก",
    "contactPersonId1": "รหัสผู้ดูแล 1",
    "contactPersonName1": "ชื่อผู้ดูแล 1",
    "contactPersonId2": "รหัสผู้ดูแล 2",
    "contactPersonName2": "ชื่อผู้ดูแล 2",
    "agentCode1": "รหัสผู้แนะนำ 1",
    "agentName1": "ชื่อผู้แนะนำ 1",
    "agentCode2": "รหัสผู้แนะนำ 2",
    "agentName2": "ชื่อผู้แนะนำ 2",
    "insureeCode": "รหัสผู้เอาประกัน",
    "insureeName": "ชื่อผู้เอาประกัน",
    "class": "ประเภทประกัน",
    "subClass": "ประเภทย่อยประกัน",
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
    "commInRate": "อัตราคอมมิชชั่นรับ",
    "commInAmt": "ยอดคอมมิชชั่นรับ",
    "commInTaxAmt": "ยอดภาษีคอมมิชชั่นรับ",
    "ovInRate": "อัตรา OV รับ",
    "ovInAmt": "ยอด OV รับ",
    "ovInTaxAmt": "ยอดภาษี OV รับ",
    "commOutRate": "อัตราคอมมิชชั่นจ่าย",
    "commOutAmt": "ยอดคอมมิชชั่นจ่าย",
    "ovOutRate":  "อัตรา OV จ่าย",
    "ovOutAmt": "ยอด OV จ่าย",
    "insurerCode": "บริษัทประกัน"
    
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
    
    const exportExcel =(e) => {
        e.preventDefault()
        const data = 
        {
            "startPolicyDate": fromDate,
            "endPolicyDate": toDate,
            "createUserCode": createusercode,
            "contactPersonId1": employeecode,
            "contactPersonId2": "",
            "agentCode1": advisorcode,
            "agentCode2": "",
            "insurerCode": insurercode,
            "status": status,
            "class": filterData.class,
            "subClass": filterData.subClass,
            "orderBy": orderby
          }
          
          if (document.getElementsByName("createusercodeCB")[0].checked) {
            data.createUserCode = ''
         }
         if (document.getElementsByName ("employeecodeCB")[0].checked) {
            data.contactPersonId1 = ''
         }
         if (document.getElementsByName ("advisorcodeCB")[0].checked) {
            data.agentCode1 = ''
         }
         if (document.getElementsByName ("insurercodeCB")[0].checked) {
            data.insurerCode = ''
         }
        axios.post(url_report + "/DailyPolicy/excel", filterData, {
            headers: {
                'Content-Type': 'application/json'
            },
            
                responseType: 'blob',
              
        })
            .then((response) => {
              
      // Extract filename from Content-Disposition header, if available
      const filename = `รายงานบันทึกกรมธรม์ประจำวัน_${getDateReport('D')}`;
      
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
        const data = 
        {
            "startPolicyDate": fromDate,
            "endPolicyDate": toDate,
            "createUserCode": createusercode,
            "contactPersonId1": employeecode,
            "contactPersonId2": "",
            "agentCode1": advisorcode,
            "agentCode2": "",
            "insurerCode": insurercode,
            "status": status,
            "class": filterData.class,
            "subClass": filterData.subClass,
            "orderBy": orderby
          }
          
          if (document.getElementsByName("createusercodeCB")[0].checked) {
            data.createUserCode = ''
         }
         if (document.getElementsByName ("employeecodeCB")[0].checked) {
            data.contactPersonId1 = ''
         }
         if (document.getElementsByName ("advisorcodeCB")[0].checked) {
            data.agentCode1 = ''
         }
         if (document.getElementsByName ("insurercodeCB")[0].checked) {
            data.insurerCode = ''
         }

        axios.post(url_report + "/DailyPolicy/json", data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                console.log(response);
                // setTableData(response.data)
                if (response.data.length < 1) {
                    alert('ไม่พบข้อมูล')
                    return
                }
                const rawdata = response.data.map((ele,index)=>{
                    if (ele.policyDate) {
                        ele.policyDate =  convertDateFormat(ele.policyDate)
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
                    return ele
                })
                setReportData(response.data)
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <div className="container" style={{ paddingTop: "30px", paddingBottom: "30px" }}>
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    <form>
                        <h2 className="text-center" style={{ marginBottom: "30px" }}>รายงานบันทึกกรมธรรม์</h2>

                        {/* Date Select */}
                        <div className="row">
                            <div className="col-2">
                                <label htmlFor="Date Select" className="form-label">วันที่เอาเข้าระบบ จาก </label>
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
                                <label htmlFor="toDate">ถึง &nbsp;</label>
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

                        {/* createusercode */}
                        <div className="row mb-3">
                            <div className="col-2">
                                <label htmlFor="createusercode" className="form-label">Createusercode</label>
                            </div>
                            <div className="col-3">
                                <input type="text" id="createusercode" value={createusercode} onChange={(e) => setCreateusercode(e.target.value)} className="form-control" />
                            </div>
                            <div className="col-1">
                                <input type="checkbox" name="createusercodeCB"   className="form-check-input" />
                                <label htmlFor="cashierReceiptCheckbox" className="form-check-label">&nbsp;ALL</label>
                            </div>
                        </div>

                        {/* employeecode */}
                        <div className="row mb-3">
                            <div className="col-2">
                                <label htmlFor="employeecode" className="form-label">EmployeeID</label>
                            </div>
                            <div className="col-3">
                                <input type="text" id="employeecode" value={employeecode} onChange={(e) => setEmployeecode(e.target.value)} className="form-control" />
                            </div>
                            <div className="col-1">
                                <input type="checkbox" name="employeecodeCB"  className="form-check-input" />
                                <label htmlFor="cashierReceiptCheckbox" className="form-check-label">&nbsp;ALL</label>
                            </div>
                        </div>
                        {/* advisorcode */}
                        <div className="row mb-3">
                            <div className="col-2">
                                <label htmlFor="Advisor" className="form-label">Advisor Code</label>
                            </div>
                            <div className="col-3">
                                <input type="text" id="Advisor" value={advisorcode}  onChange={(e) => setAdvisorcode(e.target.value)} className="form-control" />
                            </div>
                            <div className="col-1">
                                <input type="checkbox" name="advisorcodeCB"  className="form-check-input" />
                                <label htmlFor="cashierReceiptCheckbox" className="form-check-label">&nbsp;ALL</label>
                            </div>
                        </div>

                        {/* insurercode */}
                        <div className="row mb-3">
                            <div className="col-2">
                                <label htmlFor="Insurer" className="form-label">InsurerCode</label>
                            </div>
                            <div className="col-3">
                                <input type="text" id="InsurerCode" value={insurercode}  onChange={(e) => setInsurercode(e.target.value)} className="form-control" />
                            </div>
                            <div className="col-1">
                                <input type="checkbox" name="insurercodeCB"  className="form-check-input" />
                                <label htmlFor="cashierReceiptCheckbox" className="form-check-label">&nbsp;ALL</label>
                            </div>
                        </div>



                        {/* status  */}
                        <div className="row my-3">
                            <label class="col-sm-2 col-form-label" htmlFor="insurerCode">
                                สถานะ
                            </label>

                            <div class="form-check col-2">
                                <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" defaultChecked onChange={(e) => setStatus('I')} />
                                <label class="form-check-label" for="flexRadioDefault1">
                                    (AI) ใบคำขอ
                                </label>
                            </div>
                            <div class="form-check col-2">
                                <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" onChange={(e) => setStatus('A')} />
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
                                    id="transactionType"
                                    name="class"
                                    onChange={handleChange}
                                    className="form-control"
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
                                    name="subClass"
                                    onChange={handleChange}
                                    className="form-control"
                                >
                                   <option value="" selected  hidden>Select SubClass</option>

                                {insureSubClassDD}
                                </select>
                            </div>
                        </div>


                        {/* orderby  */}
                        <div className="row my-3">
                            <label class="col-sm-2 col-form-label" htmlFor="orderby">
                                Order BY
                            </label>

                            <div class="form-check col-2">
                                <input class="form-check-input" type="radio" name="orderby" id="orderbyradio1" defaultChecked onChange={(e) => setOrderby('id')} />
                                <label class="form-check-label" for="orderbyradio1">
                                    ลำดับที่
                                </label>
                            </div>

                            <div class="form-check col-2">
                                <input class="form-check-input" type="radio" name="orderby" id="orderbyradio2" onChange={(e) => setOrderby('createusercode')} />
                                <label class="form-check-label" for="orderbyradio2">
                                    Createusercode
                                </label>
                            </div>
                            <div class="form-check col-2">
                                <input class="form-check-input" type="radio" name="orderby" id="orderbyradio3" onChange={(e) => setOrderby('employeecode')} />
                                <label class="form-check-label" for="orderbyradio3">
                                    Employeecode
                                </label>
                            </div>
                            <div class="form-check col-2">
                                <input class="form-check-input" type="radio" name="orderby" id="orderbyradio4" onChange={(e) => setOrderby('advisorcode')} />
                                <label class="form-check-label" for="orderbyradio4">
                                    Advisorcode
                                </label>
                            </div>
                            <div class="form-check col-2">
                                <input class="form-check-input" type="radio" name="orderby" id="orderbyradio5" onChange={(e) => setOrderby('insurercode')} />
                                <label class="form-check-label" for="orderbyradio5">
                                    Insurercode
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
                    <div style={{ overflowY: 'auto', height: '400px', marginTop: "50px" }}>
                        {reportData.length > 0 ?
                        
                        <div>
        <ReportTable cols={colData} rows={reportData} />
        
      </div>
                        :
                            <div className="container" style={{ marginTop: "30px" }}>
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
            </div>
        </div>
    );
};

export default ReportPolicy;
