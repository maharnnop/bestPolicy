import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
import PolicyCard from "./PolicyCard";
import Modal from 'react-bootstrap/Modal';
import * as XLSX from 'xlsx';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import convertDateFormat from "../lib/convertdateformat";
import {
    BrowserRouter,
    Routes,
    Route,
    Link,
    Navigation,
} from "react-router-dom";
import {
    Header,
    InputBtn,
    LoginBtn,
    BackdropBox1,
} from "../StylesPages/LoginStyles";
import { useCookies } from "react-cookie";
import { date } from "joi";

const config = require("../../config.json");

const NormalText = {
    color: "white",
    paddingBottom: "10px",
};
/* eslint-disable react-hooks/exhaustive-deps */

const FindPolicy = () => {
    const [cookies] = useCookies(["jwt"]);
  const headers = {
    headers: { Authorization: `Bearer ${cookies["jwt"]}` }
};
    const url = window.globalConfig.BEST_POLICY_V1_BASE_URL;
    const navigate = useNavigate();
    const [insureeData, setinsureeData] = useState({ entityID: null });
    const [entityData, setEntityData] = useState({ personType: 'P' });
    const [locationData, setLocationData] = useState({ entityID: null, locationType: 'A' });
    // dropdown
    const [provinceDD, setProvinceDD] = useState([])
    const [filterData, setFilterData] = useState(
        {
            "insurerCode": null,
            "policyNo": null,
            "insureID": null,
            "createdate_start": null,
            "effdate_start": null,
            "createusercode": null,
            "agentCode": null,
            "carRegisNo" : null,
            "chassisNo" : null,
            "provinceID" : null,
            "status" : 'A',
            "applicationNo" : null,

        })
    const [policiesData, setPoliciesData] = useState([])
    const [insureTypeDD, setInsureTypeDD] = useState([]);
    const [exportPolicyData, setExportPolicyData] = useState([])
    const [insurerDD, setInsurerDD] = useState([]);
    const [hidecard, setHidecard] = useState([false,0]);

    const ExportData = () => {
        const filename = 'reports-policy.xlsx';

        var ws = XLSX.utils.json_to_sheet(exportPolicyData);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Policy");
        XLSX.writeFile(wb, filename);
    }

    useEffect(() => {
        //get province
        axios
            .get(url + "/static/provinces/all", headers)
            .then((province) => {
                const array = []
                province.data.forEach(ele => {
                    // array.push(<option key={ele.provinceid} value={ele.provinceid}>{ele.t_provincename}</option>)
                    array.push({label:ele.t_provincename, value:ele.provinceid})
                });
                setProvinceDD(array)
            })
            .catch((err) => {
                // alert("cant get province");
            });

        // get insuretype all
        axios
            .get(url + "/insures/insuretypeall", headers)
            .then((insuretype) => {
                const array = [];
                insuretype.data.forEach((ele) => {
                    array.push(
                        <option key={ele.id} value={ele.id}>
                            {ele.class} : {ele.subClass}
                        </option>
                    );
                });
                setInsureTypeDD(array);
            })
            .catch((err) => { });

        // get insurer all
        axios
            .get(url + "/persons/insurerall", headers)
            .then((insurer) => {
                const array = [];
                insurer.data.forEach((ele) => {
                    array.push(
                        <option key={ele.id} value={ele.insurerCode}>
                            {ele.insurerCode}
                        </option>
                    );
                });
                setInsurerDD(array);
            })
            .catch((err) => { });


    }, []);


    const changestatus = (e) => {
        // e.preventDefault()
        console.log(e.target.checked);
        // e.preventDefault();
        const array = policiesData.map((ele)=>ele)
        array[e.target.id] = { ...policiesData[e.target.id], [e.target.name]: e.target.checked }
        setPoliciesData(array)

    };

    const handleChange = (e) => {
        setFilterData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleChangeDate = (date,name) => {
        setFilterData((prevState) => ({
            ...prevState,
            [name]: date,
        }));
      }

    const handleChangeCard = async (e,index,data) => {
        // e.preventDefault();
        console.log(e.target.name);
        setHidecard([false,0])
        if (e.target.name === 'saveChange') {
          const array =    data
          policiesData[index] = array
          
          setPoliciesData(policiesData)
          // setCurrentForm(formData.slice(currentPage, currentPage + postsPerPage ))
          console.log(policiesData);
        }
      };
    

    const submitFilter = (e) => {
        // e.preventDefault();
        console.log(filterData);
        const data =    {
            "insurerCode": filterData.insurerCode,
            "policyNo": filterData.policyNo,
            "insureID": filterData.insureID,
            "createdate_start": filterData.createdate_start,
            "effdate_start": filterData.effdate_start,
            "createusercode": filterData.createusercode,
            "agentCode": filterData.agentCode,
            "carRegisNo" : filterData.carRegisNo,
            "chassisNo" : filterData.chassisNo,
            "provinceID" : filterData.provinceID,
            "status" : filterData.status,
            "applicationNo" : filterData.applicationNo,

        }
        if (document.getElementsByName("insurerCodeCB")[0].checked) {
            data.insurerCode = null
         }
         if (document.getElementsByName("policyNoCB")[0].checked) {
            data.policyNo = null
         }
         if (document.getElementsByName("applicationNoCB")[0].checked) {
            data.applicationNo = null
         }
         if (document.getElementsByName("insureIDCB")[0].checked) {
            data.insureID = null
         }
         if (document.getElementsByName("createdateCB")[0].checked) {
            data.createdate_end = null
            data.createdate_start = null
         }
         if (document.getElementsByName("effdateCB")[0].checked) {
            data.effdate_start = null
            data.effdate_end = null
         }
         if (document.getElementsByName("createusercodeCB")[0].checked) {
            data.createusercode = null
         }
         if (document.getElementsByName("agentCodeCB")[0].checked) {
            data.agentCode = null
         }
         if (document.getElementsByName("chassisNoCB")[0].checked) {
            data.chassisNo = null
         }
         
        axios
            .post(url + "/policies/policygetlist", data, headers)
            .then((res) => {
                // let token = res.data.jwt;
                // let decode = jwt_decode(token);
                // navigate("/");
                // window.location.reload();
                // localStorage.setItem("jwt", token);
                console.log(res.data);
                if (res.data.length > 0 ) {
                    alert("ค้นหากรมธรรม์สำเร็จ")    
                }else{
                    alert("ไม่พบข้อมูลกรมธรรม์")
                }
                
                const array = []
                res.data.forEach((ele)=>{
                    if (ele.duedateinsurer !== null) {
                        ele.seqNoinsStart = new Date(ele.duedateinsurer)
                    }else{
                        let defualtDueDate = new Date();
                        defualtDueDate = defualtDueDate.setMonth(defualtDueDate.getMonth() + 2)
                        ele.seqNoinsStart = defualtDueDate
                    }
                    if (ele.duedateagent !== null) {
                        ele.seqNoagtStart = new Date(ele.duedateagent)
                    }else{
                        let defualtDueDate = new Date();
                        defualtDueDate = defualtDueDate.setMonth(defualtDueDate.getMonth() + 1)
                        ele.seqNoagtStart = defualtDueDate
                    }
                  
                    array.push(ele)
                })
                setExportPolicyData(array)
                
                setPoliciesData(array)
            })
            .catch((err) => {

                alert("Something went wrong, Try Again.");

            });
    };
    const handleSubmit = async (e) => {
        const data = policiesData.filter((ele) => ele.select)
       
        console.log(data);
        e.preventDefault();
        await axios.post(url + "/policies/policyedit/batch", data, headers).then((res) => {
          alert("policy batch updated");
        //   window.location.reload(false);
        submitFilter()
        }).catch((err)=>{ alert("Something went wrong, Try Again.");});
        
    };
    const editCard =(e) =>{
    console.log(policiesData[e.target.id]);
    setHidecard([true,e.target.id])
    
    };
    const handleClose = (e) =>{
      setHidecard([false,0])
    }

    return (
        <div>
<Modal  size="xl" fullscreen='xxl-down' show={hidecard[0]} onHide={handleClose} dialogClassName="my-modal">
        <Modal.Header closeButton>
          <Modal.Title >แก้ไขกรมธรรม์</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {<PolicyCard index ={hidecard[1]} formData={policiesData[hidecard[1]]} setFormData ={handleChangeCard}/>}
        </Modal.Body>
       
      </Modal>
            {/* <BackdropBox1> */}
            <form className="container-fluid text-left" >
                {/* insurer table */}
                <h1 className="text-center">ค้นหารายการ</h1>
                <div class="row">
                    <div class="col-1">

                    </div>
                    <div class="col-1">
                        <label class="col-form-label">รหัสบริษัทประกัน</label>

                    </div>
                    <div class="col-2 ">
                        <div class="input-group mb-3">
                            {/* <input type="text" class="form-control" placeholder="รหัสบริษัทประกัน" name="insurerCode" onChange={handleChange} /> */}
                            <select name="insurerCode" class="form-control" onChange={handleChange} >
                                <option disabled selected hidden>รหัสบริษัทประกัน</option>
                                {insurerDD}
                            </select>

                            
                           
                        </div>
                       


                    </div>
                    <div className="col-1">
                                <input type="checkbox" name="insurerCodeCB" className="form-check-input"/>
                                <label htmlFor="cashierReceiptCheckbox" className="form-check-label">&nbsp;ALL</label>
                            </div>

                    <div class="col align-self-end ">
                        <div class="input-group mb-3">
                            <button type="button" class="btn btn-primary btn-lg" onClick={submitFilter}>ค้นหารายการ</button>
                        </div>
                    </div>

                </div>
                <div class="row">
                    <div class="col-1">

                    </div>
                    <div class="col-1">
                        <label class="col-form-label">เลขกรมธรรม์</label>

                    </div>
                    <div class="col-2 ">
                        <div class="input-group mb-3">
                            <input type="text" class="form-control" placeholder="เลขกรมธรรม์" name="policyNo" onChange={handleChange} />
                           


                        </div>


                    </div>
                    <div className="col-1">
                                <input type="checkbox" name="policyNoCB" className="form-check-input"/>
                                <label htmlFor="cashierReceiptCheckbox" className="form-check-label">&nbsp;ALL</label>
                            </div>

                    <div class="col-1">
                        <label class="col-form-label">สถานะกรมธรรม์</label>

                    </div>
                    <div class="col-2 ">
                        <div class="input-group mb-3">
                            <select  class="form-control"  name="status" onChange={handleChange} >
                            <option selected value='A'>(AA) กรมธรรม์</option>
                            <option value='I'>(AI) ใบคำขอ</option>
                            </select>
                            

                        </div>


                    </div>

                </div>

                <div class="row">
                    <div class="col-1">

                    </div>
                    <div class="col-1">
                        <label class="col-form-label">เลขที่ใบคำขอ</label>

                    </div>
                    <div class="col-2 ">
                        <div class="input-group mb-3">
                            <input type="text" class="form-control" placeholder="เลขที่ใบคำขอ" name="applicationNo" onChange={handleChange} />
                            


                        </div>


                    </div>
                    <div className="col-1">
                                <input type="checkbox" name="applicationNoCB" className="form-check-input"/>
                                <label htmlFor="cashierReceiptCheckbox" className="form-check-label">&nbsp;ALL</label>
                            </div>
                    

                </div>

                <div class="row">
                    <div class="col-1">

                    </div>
                    <div class="col-1">
                        <label class="col-form-label">Class/Subclass</label>

                    </div>
                    <div class="col-2 ">
                        <div class="input-group mb-3">
                            <select name={`insureID`} class="form-control" onChange={handleChange} >
                                <option disabled selected hidden>Class/Subclass</option>
                                {insureTypeDD}
                            </select>
                            


                        </div>


                    </div>
                    <div className="col-1">
                                <input type="checkbox" name="insureIDCB" className="form-check-input"/>
                                <label htmlFor="cashierReceiptCheckbox" className="form-check-label">&nbsp;ALL</label>
                            </div>



                </div>

                <div class="row">
                    <div class="col-1">

                    </div>
                    <div class="col-1">
                        <label class="col-form-label">วันที่เอาเข้าระบบ </label>

                    </div>

                    <div class="col-3 ">
                        <div class="input-group mb-3">
                            {/* <input type="date" class="form-control " name="createdate_start" onChange={handleChange} value={filterData.createdate_start} 
                            onBlur={(e)=>{setFilterData((prevState) => ({
                                ...prevState,
                                createdate_end: e.target.value,
                            }));}}
                            /> */}
                            <DatePicker
                            style={{textAlign: 'center'}}
                            showIcon
                            className="form-control"
                            todayButton="Vandaag"
                            // isClearable
                            name="createdate_start"
                            showYearDropdown
                            dateFormat="dd/MM/yyyy"
                            dropdownMode="select"
                            id="createdate_start"
                            selected={filterData.createdate_start}
                            onChange={(date) => {
                                handleChangeDate(date,'createdate_start')
                                handleChangeDate(date,'createdate_end')
                        }}
                        //     onBlur={(e)=>{
                        //         setFilterData((prevState) => ({
                        //         ...prevState,
                        //         createdate_end: new Date (e.target.value),
                        //     }))
                        // }
                        // }
                                 />


                        </div>
                    </div>
                    <div class="col-1">
                        <label class="col-form-label">สิ้นสุด</label>
                    </div>
                    <div class="col-2 ">
                        <div class="input-group mb-3">
                            {/* <input type="date" class="form-control" name="createdate_end" onChange={handleChange} value={filterData.createdate_end}/> */}
                            <DatePicker
                            style={{textAlign: 'center'}}
                            showIcon
                            className="form-control"
                            todayButton="Vandaag"
                            // isClearable
                            name="createdate_end"
                            showYearDropdown
                            dateFormat="dd/MM/yyyy"
                            dropdownMode="select"
                            id="createdate_end"
                            selected={filterData.createdate_end}
                            onChange={(date) => handleChangeDate(date,'createdate_end')}
                            
                                 />
                           
                        </div>
                    </div>
                    <div className="col-1">
                                <input type="checkbox" name="createdateCB" className="form-check-input"/>
                                <label htmlFor="cashierReceiptCheckbox" className="form-check-label">&nbsp;ALL</label>
                            </div>


                </div>

                <div class="row">
                    <div class="col-1">

                    </div>
                    <div class="col-1">
                        <label class="col-form-label">วันคุ้มครอง</label>

                    </div>
                    <div class="col-3 ">
                        <div class="input-group mb-3">
                            {/* <input type="date" class="form-control " name="effdate_start" onChange={handleChange} value={filterData.effdate_start} 
                            
                            onBlur={(e)=>{setFilterData((prevState) => ({
                                ...prevState,
                                effdate_end: e.target.value,
                            }));}}/> */}
                            <DatePicker
                            style={{textAlign: 'center'}}
                            showIcon
                            className="form-control"
                            todayButton="Vandaag"
                            // isClearable
                            name="effDatestart"
                            showYearDropdown
                            dateFormat="dd/MM/yyyy"
                            dropdownMode="select"
                            id="effdate_start"
                            selected={filterData.effdate_start}
                            onChange={(date) =>{ 
                                handleChangeDate(date,'effdate_start')
                                handleChangeDate(date,'effdate_end')
                            }}
                            // onBlur={(e)=>{setFilterData((prevState) => ({
                            //     ...prevState,
                            //     effdate_end: new Date (e.target.value),
                            // }));}}
                                 />
                            
                        </div>
                    </div>
                    <div class="col-1">
                        <label class="col-form-label">สิ้นสุด</label>
                    </div>
                    <div class="col-2 ">
                        <div class="input-group mb-3">
                            {/* <input type="date" class="form-control " name="effdate_end" onChange={handleChange} value={filterData.effdate_end}/> */}
                            <DatePicker
                            style={{textAlign: 'center'}}
                            showIcon
                            className="form-control"
                            todayButton="Vandaag"
                            // isClearable
                            name="effDatestart"
                            showYearDropdown
                            dateFormat="dd/MM/yyyy"
                            dropdownMode="select"
                            id="effdate_end"
                            selected={filterData.effdate_end}
                            onChange={(date) => handleChangeDate(date,'effdate_end')}
                        
                                 />
                            
                        </div>
                    </div>
                    <div className="col-1">
                                <input type="checkbox" name="effdateCB" className="form-check-input"/>
                                <label htmlFor="cashierReceiptCheckbox" className="form-check-label">&nbsp;ALL</label>
                            </div>
                </div>

                <div class="row">
                    <div class="col-1">

                    </div>
                    <div class="col-1">
                        <label class="col-form-label">รหัสผู้เอาเข้าระบบ</label>

                    </div>
                    <div class="col-2 ">
                        <div class="input-group mb-3">
                            <input type="text" class="form-control" name="createusercode" onChange={handleChange} />
                            
                        </div>
                    </div>
                    <div className="col-1">
                                <input type="checkbox" name="createusercodeCB" className="form-check-input"/>
                                <label htmlFor="cashierReceiptCheckbox" className="form-check-label">&nbsp;ALL</label>
                            </div>

                    <div class="col-1">
                        <label class="col-form-label">เลขทะเบียนรถ</label>
                    </div>
                    <div class="col-2 ">
                        <input type="text" class="form-control" placeholder="เลขทะเบียนรถ" name="carRegisNo" onChange={handleChange} />
                    </div>
                    <div class="col-2">
                        <label class="col-form-label">จังหวัดจดทะเบียนรถ</label>
                    </div>
                    <div class="col-2 ">
                    <Select
        //   className="form-control"
          name={`provinceID`}
          onChange={ (e) => setFilterData((prevState) => ({
            ...prevState,
            provinceID: e.value,
          }))}
          options={provinceDD}
          styles={{zIndex:2000}}
          // onChange={opt => console.log(opt)}
          />
                        


                    </div>
                </div>

                <div class="row">
                    <div class="col-1">

                    </div>
                    <div class="col-1">
                        <label class="col-form-label">รหัสผู้แนะนำ</label>

                    </div>
                    <div class="col-2 ">
                        <div class="input-group mb-3">
                            <input type="text" class="form-control" name="agentCode" onChange={handleChange} />
                            


                        </div>


                    </div>
                    <div className="col-1">
                                <input type="checkbox" name="agentCodeCB" className="form-check-input"/>
                                <label htmlFor="cashierReceiptCheckbox" className="form-check-label">&nbsp;ALL</label>
                            </div>
                    <div class="col-1">
                        <label class="col-form-label">เลขคัสซี</label>
                    </div>

                    <div class="col-2 ">
                        <div class="input-group mb-3">
                            <input type="text" class="form-control" placeholder="Chassis Number" name="chassisNo" onChange={handleChange} />
                            
                        </div>
                    </div>
                    <div className="col-1">
                                <input type="checkbox" name="chassisNoCB" className="form-check-input"/>
                                <label htmlFor="cashierReceiptCheckbox" className="form-check-label">&nbsp;ALL</label>
                            </div>


                </div>


                <div className="table-responsive overflow-scroll"  >
                <table class="table  table-striped " >
                    <thead>
                        <tr>
                            <th scope="col">ลำดับ</th>
                            <th scope="col">เลือก</th>
                            <th scope="col">แก้ไข</th>
                            
                            <th scope="col">เลขที่ใบคำขอ</th>
                            <th scope="col">เลขที่กรมธรรม์</th>
                            <th scope="col">เลขที่สลักหลัง</th>
                            <th scope="col">เลขที่ใบแจ้งหนี้</th>
                            <th scope="col">เลขที่ใบกำกับภาษี</th>
                            <th scope="col">ลำดับที่</th>
                            <th scope="col">บริษัทรับประกัน</th>


                            <th scope="col">ผู้แนะนำ 1</th>
                            <th scope="col">ผู้แนะนำ 2</th>
                            <th scope="col">Class</th>
                            <th scope="col">Subclass</th>
                            <th scope="col">วันที่สร้าง</th>
                            <th scope="col">วันที่คุ้มครอง-สิ้นสุด</th>
                            <th scope="col">ชื่อผู้เอาประกัน</th>
                            <th scope="col">เลขทะเบียนรถ</th>
                            <th scope="col">เลขตัวถังรถ</th>

                            <th scope="col">เบี้ย</th>
                            <th scope="col">ส่วนลด Walkin</th>
                            <th scope="col">จำนวนเงินส่วนลด</th>
                            
                           
                            <th scope="col">เบี้ยสุทธิ</th>
                            <th scope="col">อากร</th>
                            <th scope="col">ภาษี</th>
                            <th scope="col">เบี้ยรวม</th>
                            <th scope="col">WHT 1%</th>
                            <th scope="col">ค่า Commin (บาท)</th>
                            <th scope="col">ค่า Ovin (บาท)</th>
                            <th scope="col">ค่า Commout (บาท)</th>
                            <th scope="col">ค่า Ovout (บาท)</th>

                        </tr>
                    </thead>
                    <tbody>
                    {policiesData.map((ele, i) => {
                            return (<tr>
                                <th scope="row">{i + 1}</th>
                                {ele.status === 'I'?
                                <>
                                <td scope="row"><input type="checkbox" name="select" id={i} checked={ele.select} onClick={changestatus} /></td>
                                <td scope="row"><button type="button" class="btn btn-secondary " id={i} onClick={(e)=>editCard(e)} >Edit</button></td>
                                </>
                                : <><td></td> <td></td></>}
                                <td>{ele.applicationNo}</td>
                                <td>{ele.policyNo}</td>
                                <td>{ele.endorseNo}</td>
                                <td>{ele.invoiceNo}</td>
                                <td>{ele.taxInvoiceNo}</td>
                                <td>{ele.seqNo}</td>
                                <td>{ele.insurerCode}</td>
                             
                                <td>{ele.agentCode}</td>
                                <td>{ele.agentCode2}</td>
                                <td>{ele.class}</td>
                                <td>{ele.subClass}</td>
                                <td>{ele.polcreatedAt.split(" ")[0]}</td>
                                <td>{convertDateFormat(ele.actDate,false)} - {convertDateFormat(ele.expDate,false)}</td>
                                <td>{ele.fullName}</td>
                                <td>{ele.licenseNo}</td>
                                <td>{ele.chassisNo}</td>
                               
                                <td>{ele.grossprem.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{ele.specdiscrate.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{ele.specdiscamt.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                
                                <td>{ele.netgrossprem.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{ele.duty.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{ele.tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{ele.totalprem.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{ele.withheld.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{ele.commin_amt.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{ele.ovin_amt.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{ele.commout_amt.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{ele.ovout_amt.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                            </tr>)

                        })}

                    </tbody>
                </table>
                </div>


                <div className="d-flex justify-content-center">

                    <button type="button" class="btn btn-primary btn-lg" onClick={ExportData}>Export to Excel</button>
                    <button type="button" class="btn btn-primary btn-lg" onClick={handleSubmit}>บันทึกกรมธรรม์</button>


                </div>
            </form>


            {/* <Link to="/signup" style={NormalText}>
          First time here ? Let's sign up
        </Link> */}
            {/* </BackdropBox1> */}
        </div>
    );
};

export default FindPolicy;
