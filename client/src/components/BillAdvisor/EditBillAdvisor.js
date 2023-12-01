import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
import Modal from 'react-bootstrap/Modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
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

const config = require("../../config.json");

const NormalText = {
    color: "white",
    paddingBottom: "10px",
};
/* eslint-disable react-hooks/exhaustive-deps */

const EditBillAdvisor = (props) => {
    const [cookies] = useCookies(["jwt"]);
    const headers = {
    headers: { Authorization: `Bearer ${cookies["jwt"]}` }
};
    
    const location = useLocation();
   // Access query parameters
  const queryParams = new URLSearchParams(location.search);
  

    const url = window.globalConfig.BEST_POLICY_V1_BASE_URL;
    const wht = config.wht
    const navigate = useNavigate();
    const [insureeData, setinsureeData] = useState({ entityID: null });
    const [entityData, setEntityData] = useState({ personType: 'P' });
    const [locationData, setLocationData] = useState({ entityID: null, locationType: 'A' });

    const [billpremiumData, setBillpremiumData] = useState([]);
    const [billpremiumDataOld, setBillpremiumDataOld] = useState([]);
    const [hidecard, setHidecard] = useState([false, 0]);
    const [filterData, setFilterData] = useState(
        {
            "insurerCode": null,
            "agentCode": null,
            "dueDate": null,
            "policyNoStart": null,
            "policyNoEnd": null,
            "createdDateStart": null,
            "createdDateEnd": null,

        })
    const [policiesData, setPoliciesData] = useState([])
    const [policiesDataOld, setPoliciesDataOld] = useState([])
    const [policiesRender, setPoliciesRender] = useState({
        net:{ no: 0, prem: 0, comm_out: 0, whtcom: 0, ov_out: 0, whtov: 0, },
        gross:{ no: 0, prem: 0 },
        total:{ no: 0, prem: 0, comm_out: 0, whtcom: 0, ov_out: 0, whtov: 0, billprem:0 },
    })
    const [insurerDD, setInsurerDD] = useState([]);
    const [agentDD, setAgentDD] = useState([]);

    useEffect(() => {
        const billno = queryParams.get('billno');

        // get pol in billno
        axios
        .post(url + "/payments/findpolicybyBill",{billadvisorno: billno}, headers)
        .then((res) => {
            console.log(res.data);
            if (res.status === 201) {
                alert("not found policy inbill")

            } else {


                const array = []
                const arrPoldata = []
                for (let i = 0; i < res.data.data.length; i++) {
                    // console.log(statementtypeData[i].statementtype == null? res.data[i].totalprem -res.data[i].commout_amt-res.data[i].ovout_amt: res.data[i].totalprem);
                    array.push(res.data.data[i].totalprem)
                    if(res.data.data[i].netflag === 'N'){

                        arrPoldata.push({...res.data.data[i], 'select':true,'statementtype':true})
                    }else{
                        arrPoldata.push({...res.data.data[i], 'select':true,'statementtype':false})
                    }
                }
                // setPoliciesData(arrPoldata)
                setPoliciesDataOld(arrPoldata)
                setFilterData({...filterData, insurerCode:res.data.data[0].insurerCode, agentCode:res.data.data[0].agentCode ,old_keyid:res.data.old_keyid})
                setBillpremiumData(array)
                setBillpremiumDataOld(array)
                alert("found it") 
            }
        })
        .catch((err) => {  alert("Something went wrong, Try Again."); });

        // get agent all
        axios
            .get(url + "/persons/agentall", headers)
            .then((agent) => {
                const array = [];
                agent.data.forEach((ele) => {
                    array.push(
                        <option key={ele.id} value={ele.agentCode}>
                            {ele.agentCode}
                        </option>
                    );
                });
                setAgentDD(array);
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

    const editCard = (e) => {
        setHidecard([true, 1])
        const array = []
        const net = { no: 0, prem: 0, comm_out: 0, whtcom: 0, ov_out: 0, whtov: 0, }
        const gross = { no: 0, prem: 0 }
        for (let i = 0; i < policiesData.length; i++) {
            if (policiesData[i].select) {
                if (policiesData[i].statementtype) {
                    net.no++
                    net.prem = net.prem + policiesData[i].totalprem
                    net.comm_out = net.comm_out + policiesData[i].commout_amt
                    net.whtcom = net.comm_out * wht
                    net.ov_out = net.ov_out + policiesData[i].ovout_amt
                    net.whtov = net.ov_out * wht
                } else {
                    gross.no++
                    gross.prem = gross.prem + policiesData[i].totalprem
                }

            }

        }

        const total = {
            no: net.no + gross.no,
            prem: net.prem + gross.prem,
            comm_out: net.comm_out,
            whtcom: net.whtcom,
            ov_out: net.ov_out,
            whtov: net.whtov,
            billprem: net.prem + gross.prem + net.comm_out + net.whtcom + net.ov_out + net.whtov
        }
        setPoliciesRender({ net: net, gross: gross, total: total })
    };
    const handleClose = (e) => {
        setHidecard([false, 0])
    }

    const handleChange = (e) => {
        setFilterData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const changestatementtype = (e) => {
        // e.preventDefault();
        const array = policiesData
        array[e.target.id] = { ...policiesData[e.target.id], [e.target.name]: e.target.checked }
        setPoliciesData(array)
        const array2 = billpremiumData
        if (e.target.checked) {
            array2[e.target.id] = array[e.target.id].totalprem - array[e.target.id].commout_amt - array[e.target.id].ovout_amt

        } else {
            array2[e.target.id] = array[e.target.id].totalprem
        }
        setBillpremiumData(array2)
        console.log(array2);

    };




    const selectAll = (e) => {

        const array = []
        console.log(e.target.name);
        policiesData.forEach(ele => array.push({ ...ele, [e.target.name]: e.target.checked }))

        setPoliciesData(array)
        console.log(array);
    };

    //for add new policy in bill
    const submitFilter = (e) => {
        e.preventDefault();
        let data = {
            "insurerCode": filterData.insurerCode,
            "agentCode": filterData.agentCode,
            "dueDate": filterData.dueDate,
            "policyNoStart": filterData.policyNoStart,
            "policyNoEnd": filterData.policyNoEnd,
            "createdDateStart": filterData.createdDateStart,
            "createdDateEnd": filterData.createdDateEnd,
     
        }
        if (document.getElementsByName("policyNoCB")[0].checked) {
            data.policyNoStart = null
            data.policyNoEnd = null
        }
        if (document.getElementsByName("createdDateCB")[0].checked) {
            data.createdDateStart = null
            data.createdDateEnd = null
        }
    console.log(data);
        axios
            .post(url + "/payments/findpolicyinDue", data, headers)
            .then((res) => {
                if (res.status === 201) {
                    console.log(res.data);
                    alert("not found policy")

                } else {

                    const array = billpremiumDataOld.map((ele)=>ele)
                    // const arrPoldata = policiesDataOld.map((ele)=>ele)
                    const arrPoldata =[]
                    for (let i = 0; i < res.data.length; i++) {
                        // console.log(statementtypeData[i].statementtype == null? res.data[i].totalprem -res.data[i].commout_amt-res.data[i].ovout_amt: res.data[i].totalprem);
                        array.push(res.data[i].totalprem)
                        
                            arrPoldata.push(res.data[i])
                        
                    }
                    
                    setPoliciesData(arrPoldata)
                    setFilterData({...filterData, insurerCode:res.data[0].insurerCode, agentCode:res.data[0].agentCode })
                    setBillpremiumData(array)


                    // const array = []
                    // for (let i = 0; i < res.data.length; i++) {
                    //     // console.log(statementtypeData[i].statementtype == null? res.data[i].totalprem -res.data[i].commout_amt-res.data[i].ovout_amt: res.data[i].totalprem);
                    //     array.push(res.data[i].totalprem)

                    // }
                    // console.log(array);
                    // setPoliciesData(...res.data, ...policiesData)
                    // setBillpremiumData(array)
                    alert("find data success")
                }
            })
            .catch((err) => {
                alert("Something went wrong, Try Again.");
                // alert("create snew insuree fail");

            });
    };
    const editbill = (e) => {
        e.preventDefault();
        const array = policiesData.filter((ele) => ele.select)
        for (let i = 0; i < array.length; i++) {
            if (array[i].statementtype ) {
                array[i].statementtype = 'N'
                array[i].billpremium = array[i].totalprem - array[i].duty - array[i].tax
            }else{
                array[i].statementtype = 'G'
                array[i].billpremium = array[i].totalprem 
            }
            
        }
        console.log(array);
        console.log({ bill:{...filterData,amt:policiesRender.total.billprem}, detail:array })
        axios
            .post(url + "/payments/editbill", { bill:{...filterData,amt:policiesRender.total.billprem}, detail:array }, headers)
            .then((res) => {
                // let token = res.data.jwt;
                // let decode = jwt_decode(token);
                // navigate("/");
                // window.location.reload();
                // localStorage.setItem("jwt", token);
                console.log(res.data);
                alert("edit billadvisor success")
            })
            .catch((err) => {
                alert("Something went wrong, Try Again.");
                // alert("create new insuree fail");

            });
    };

    return (
        <div>

            {/* <BackdropBox1> */}
            <form className="container-fluid " onSubmit={submitFilter}>
                {/* insurer table */}
                <h1 className="text-center">แก้ไขรายการ ใบวางบิล {queryParams.get('billno')}</h1>
                <div class="row">
                    <div class="col-1">

                    </div>
                    <div class="col-2">
                        <label class="col-form-label">รหัสบริษัทประกัน</label>

                    </div>
                    <div class="col-2 ">
                        <div class="input-group mb-3">
                            {/* <input type="text" class="form-control" placeholder="รหัสบริษัทประกัน" name="insurerCode" onChange={handleChange} /> */}
                            <select required disabled name="insurerCode" class="form-control" onChange={handleChange} >
                                <option value="" disabled selected hidden>{filterData.insurerCode}</option>
                                {insurerDD}
                            </select>

                         


                        </div>


                    </div>
                    <div class="col align-self-end ">
                        <div class="input-group mb-3">
                            <button type="submit" class="btn btn-primary btn-lg" >ADD new</button>
                        </div>
                    </div>

                </div>
                <div class="row">
                    <div class="col-1">

                    </div>
                    <div class="col-2">
                        <label class="col-form-label">รหัสผู้แนะนำ</label>

                    </div>
                    <div class="col-2 ">
                        <div class="input-group mb-3">
                            <select required disabled name="agentCode" class="form-control" onChange={handleChange} >
                                <option value="" disabled selected hidden>{filterData.agentCode}</option>
                                {agentDD}
                            </select>
                          


                        </div>


                    </div>

                </div>
                <div class="row">
                    <div class="col-1">

                    </div>
                    <div class="col-2">
                        <label class="col-form-label">Due Date</label>

                    </div>
                    <div class="col-2 ">

                        <div class="input-group mb-3">
                            {/* <input required type="date" class="form-control " name="dueDate" onChange={handleChange} /> */}
                            <DatePicker
                            style={{textAlign: 'center'}}
                            showIcon
                            className="form-control"
                            todayButton="Vandaag"
                            // isClearable
                            showYearDropdown
                            dateFormat="dd/MM/yyyy"
                            dropdownMode="select"
                            selected={filterData.dueDate}
                            onChange={(date) => setFilterData((prevState) => ({
                                ...prevState,
                                dueDate: date,
                            }))}
                                 />
                        </div>

                    </div>



                </div>

                <div class="row">
                    <div class="col-1">

                    </div>
                    <div class="col-1">
                        <label class="col-form-label">เลขที่กรมธรรม์</label>

                    </div>
                    <div class="col-1">
                        <label class="col-form-label">จาก</label>
                    </div>
                    <div class="col-2 ">
                        <div class="input-group mb-3">
                            <input type="text" class="form-control " name="policyNoStart" onChange={handleChange} />

                        </div>
                    </div>
                    <div class="col-1">
                        <label class="col-form-label">ถึง</label>
                    </div>
                    <div class="col-2 ">
                        <div class="input-group mb-3">
                            <input type="text" class="form-control" name="policyNoEnd" onChange={handleChange} />
                            
                        </div>
                    </div>
                    <div className="col-1">
                                <input type="checkbox" name="policyNoCB"  className="form-check-input"/>
                                <label htmlFor="cashierReceiptCheckbox" className="form-check-label">&nbsp;ALL</label>
                            </div>


                </div>

                
                <div class="row">
                    <div class="col-1">

                    </div>
                    <div class="col-1">
                        <label class="col-form-label">วันที่บันทึกกรมธรรม์</label>

                    </div>
                    <div class="col-1">
                        <label class="col-form-label">จากวันที่</label>
                    </div>
                    <div class="col-2 ">
                        <div class="input-group mb-3">
                            {/* <input type="text" class="form-control " name="createdDateStart" onChange={handleChange} /> */}
                            <DatePicker
                            showIcon
                            className="form-control"
                            todayButton="Vandaag"
                            // isClearable
                            showYearDropdown
                            dateFormat="dd/MM/yyyy"
                            dropdownMode="select"
                            selected={filterData.createdDateStart}
                            onChange={(date) => setFilterData((prevState) => ({
                                ...prevState,
                                createdDateStart: date,
                            }))}
                            />
                        </div>
                    </div>
                    <div class="col-1">
                        <label class="col-form-label">ถึง</label>
                    </div>
                    <div class="col-2 ">
                        <div class="input-group mb-3">
                            {/* <input type="text" class="form-control" name="createdDateEnd" onChange={handleChange} /> */}
                            <DatePicker
                            showIcon
                            className="form-control"
                            todayButton="Vandaag"
                            // isClearable
                            showYearDropdown
                            dateFormat="dd/MM/yyyy"
                            dropdownMode="select"
                            selected={filterData.createdDateEnd}
                            onChange={(date) => setFilterData((prevState) => ({
                                ...prevState,
                                createdDateEnd: date,
                            }))}
                            />
                           
                        </div>
                    </div>
                    <div className="col-1">
                                <input type="checkbox" name="createdDateCB"  className="form-check-input"/>
                                <label htmlFor="cashierReceiptCheckbox" className="form-check-label">&nbsp;ALL</label>
                            </div>

                </div>
            </form>
            <form className="container-fluid " >
            <div className="table-responsive overflow-scroll"  >
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">เลือก</th>
                            <th scope="col">เลขที่กรมธรรม์</th>
                            <th scope="col">เลขที่สลักหลัง</th>
                            <th scope="col">เลขที่ใบแจ้งหนี้</th>
                            <th scope="col">เลขที่ใบกำกับภาษี</th>
                            <th scope="col">ลำดับที่</th>

                            <th scope="col">รหัสบริษัทประกัน</th>
                            <th scope="col">รหัสผู้แนะนำ</th>
                            <th scope="col">Due date</th>

                            <th scope="col">รหัสผู้อาประกัน</th>
                            <th scope="col">ชื่อผู้เอาประกัน</th>
                            <th scope="col">เลขทะเบียนรถ</th>
                            <th scope="col">จังหวัดที่จดทะเบียน</th>
                            <th scope="col">เลขคัชซี</th>
                            
                            <th scope="col">เบี้ย</th>
                            <th scope="col">ส่วนลด Walkin</th>
                            <th scope="col">จำนวนเงินส่วนลด</th>
                            

                            <th scope="col">เบี้ยสุทธิ</th>
                            <th scope="col">อากร</th>
                            <th scope="col">ภาษี</th>
                            <th scope="col">เบี้ยประกันรวม</th>
                            <th scope="col">ภาษีหัก ณ ที่จ่าย (1%)</th>
                            <th scope="col">comm-out%</th>
                            <th scope="col">จำนวนเงิน</th>
                            <th scope="col">ov-out%</th>
                            <th scope="col">จำนวนเงิน</th>
                            <th scope="col"><input type="checkbox" name="statementtype"  onClick={selectAll} />net</th>
                            {/* <th scope="col">billpremium</th> */}

                        </tr>
                    </thead>
                    <tbody>
                    {policiesDataOld.map((ele, i) => {
                            return (<tr>
                                <th scope="row" style={{'text-align': 'center'}}><input type="checkbox" name="select" checked={ele.select} id={i} onClick={changestatementtype} />{i + 1}</th>
                                <td>{ele.policyNo}</td>
                                <td>{ele.endorseNo}</td>
                                <td>{ele.invoiceNo}</td>
                                <td>{ele.taxinvoiceNo}</td>
                                <td>{ele.seqNo}</td>

                                <td style={{'text-align': 'center'}} >{ele.insurerCode}</td>
                                <td>{ele.agentCode}</td>
                                <td>{ele.dueDate}</td>

                                <td>{ele.insureeCode}</td>
                                <td>{ele.insureename}</td>
                                <td>{ele.licenseNo}</td>
                                <td>{ele.motorprovince}</td>
                                <td>{ele.chassisNo}</td>

                                <td>{ele.grossprem.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{ele.specdiscrate.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{ele.specdiscamt.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>

                                <td>{ele.netgrossprem.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{ele.duty.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{ele.tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{ele.totalprem.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{ele.withheld ? ele.withheld.toLocaleString(undefined, { minimumFractionDigits: 2 }): 0}</td>
                                <td>{ele.commout_rate.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{ele.commout_amt.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{ele.ovout_rate.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{ele.ovout_amt.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td><input type="checkbox" name="statementtype" checked={ele.statementtype} id={i} onClick={changestatementtype} /></td>
                                {/* <td><input type="number" disabled value={billpremiumData[i]} /></td> */}
                            </tr>)

                        })}
                        {policiesData.map((ele, i) => {
                            return (<tr>
                                <th scope="row" style={{'text-align': 'center'}}><input type="checkbox" name="select" checked={ele.select} id={i} onClick={changestatementtype} />{i + 1}</th>
                                <td>{ele.policyNo}</td>
                                <td>{ele.endorseNo}</td>
                                <td>{ele.invoiceNo}</td>
                                <td>{ele.taxinvoiceNo}</td>
                                <td>{ele.seqNo}</td>

                                <td style={{'text-align': 'center'}} >{ele.insurerCode}</td>
                                <td>{ele.agentCode}</td>
                                <td>{ele.dueDate}</td>

                                <td>{ele.insureeCode}</td>
                                <td>{ele.insureename}</td>
                                <td>{ele.licenseNo}</td>
                                <td>{ele.motorprovince}</td>
                                <td>{ele.chassisNo}</td>

                                <td>{ele.grossprem.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{ele.specdiscrate.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{ele.specdiscamt.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>

                                <td>{ele.netgrossprem.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{ele.duty.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{ele.tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{ele.totalprem.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{ele.withheld ? ele.withheld.toLocaleString(undefined, { minimumFractionDigits: 2 }): 0}</td>
                                <td>{ele.commout_rate.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{ele.commout_amt.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{ele.ovout_rate.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{ele.ovout_amt.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td><input type="checkbox" name="statementtype" checked={ele.statementtype} id={i} onClick={changestatementtype} /></td>
                                {/* <td><input type="number" disabled value={billpremiumData[i]} /></td> */}
                            </tr>)

                        })}


                    </tbody>
                </table>
                </div>

                <div className="d-flex justify-content-center">
                    {/* <LoginBtn type="submit">confirm</LoginBtn> */}
                    <button type="button" class="btn btn-primary " onClick={(e) => editCard(e)} >ยืนยัน</button>
                </div>
            </form>



            <Modal size='xl' show={hidecard[0]} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title >Confirm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div class="row">
                        <div class="col-2">
                            <label class="col-form-label">เลขที่ใบวางบิล</label>
                        </div>
                        <div class="col-2">{filterData.billadvisorno}</div>
                    </div>
                    <div class="row">
                        <div class="col-2">
                            <label class="col-form-label">billpremium</label>
                        </div>
                        <div class="col-2"> {policiesRender.total.billprem}</div>
                    </div>
                    <div class="row">
                        <div class="col-2">
                            <label class="col-form-label">billdate</label>
                        </div>
                        <div class="col-2"> <label class="col-form-label">{new Date().toLocaleDateString()}</label></div>
                    </div>
                    <div class="row">
                        <div class="col-2">
                            <label class="col-form-label">create by </label>
                        </div>
                        <div class="col-2">
                            <label class="col-form-label">Kwanmhn</label>
                        </div>
                    </div>
                    
                    <table class="table table-hover">
                        <thead>
                            <tr>

                                <th scope="col">ชำระแบบ</th>
                                <th scope="col">รายการ</th>
                                <th scope="col">จำนวนเงินค่าเบี้ย</th>
                                <th scope="col">comm-out</th>
                                <th scope="col"> WHT 3%</th>
                                <th scope="col">ov-out</th>
                                <th scope="col"> WHT 3%</th>

                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>net</td>
                                <td>{policiesRender.net.no}</td>
                                <td>{policiesRender.net.prem}</td>
                                <td>{policiesRender.net.comm_out}</td>
                                <td>{policiesRender.net.whtcom}</td>
                                <td>{policiesRender.net.ov_out}</td>
                                <td>{policiesRender.net.whtov}</td>
                            </tr>
                            <tr>
                                <td>gross</td>
                                <td>{policiesRender.gross.no}</td>
                                <td>{policiesRender.gross.prem}</td>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                            </tr>
                            <tr>
                                <td>รวมทั้งสิ้น</td>
                                <td>{policiesRender.total.no}</td>
                                <td>{policiesRender.total.prem}</td>
                                <td>{policiesRender.total.comm_out}</td>
                                <td>{policiesRender.total.whtcom}</td>
                                <td>{policiesRender.total.ov_out}</td>
                                <td>{policiesRender.total.whtov}</td>
                            </tr>
                        </tbody>
                    </table>
                    

                </Modal.Body>
                <Modal.Footer>
                    <button type="button" class="btn btn-primary" onClick={editbill}>Save changes</button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal" onClick={handleClose}>Close</button>
                </Modal.Footer>
            </Modal>

        </div>
    );
};

export default EditBillAdvisor;
