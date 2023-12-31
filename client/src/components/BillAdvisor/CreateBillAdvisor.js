import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Select from 'react-select';
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

const CreateBillAdvisor = () => {

    //style react-select
  const customStyles = {
    menu: (provided) => ({
      ...provided,
      width: 'auto',
      zIndex: 2000,
      whiteSpace: 'nowrap', // Prevent line breaks in dropdown options
    }),
  };

    const [cookies] = useCookies(["jwt"]);
    const headers = {
    headers: { Authorization: `Bearer ${cookies["jwt"]}` }
};
    const url = window.globalConfig.BEST_POLICY_V1_BASE_URL;
    const wht = config.wht
    const navigate = useNavigate();
    
    const [insureeData, setinsureeData] = useState({ entityID: null });
    const [entityData, setEntityData] = useState({ personType: 'P' });
    const [locationData, setLocationData] = useState({ entityID: null, locationType: 'A' });

    const [billpremiumData, setBillpremiumData] = useState([]);
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
            insurerAll:true,
            agentAll:true,
            policyNoAll: true,
            createDateAll:true,
            

        })
    const [policiesData, setPoliciesData] = useState([])
    const [policiesRender, setPoliciesRender] = useState({
        
        net:{ no: 0, prem: 0, comm_out: 0, withheld:0, whtcom: 0, ov_out: 0, whtov: 0, },
        gross:{ no: 0, prem: 0, withheld:0 },
        total:{ no: 0, prem: 0, withheld:0, comm_out: 0, whtcom: 0, ov_out: 0, whtov: 0, billprem:0 },
    })
    const [insurerDD, setInsurerDD] = useState([]);
    const [agentDD, setAgentDD] = useState([]);

    useEffect(() => {

        // get agent all
        axios
            .get(url + "/persons/agentall", headers)
            .then((agent) => {
                const array = [];
                agent.data.forEach((ele) => {
                    array.push(
                        // <option key={ele.id} value={ele.agentCode}>
                        //     {ele.agentCode}
                        // </option>
                        { label: ele.agentCode, value: ele.agentCode }
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
        const net = { no: 0, prem: 0, comm_out: 0, withheld:0, whtcom: 0, ov_out: 0, whtov: 0, bill:0}
        const gross = { no: 0, prem: 0, withheld:0, }
        for (let i = 0; i < policiesData.length; i++) {
            if (policiesData[i].select) {
                if (policiesData[i].statementtype) {
                    net.no++
                    net.bill = net.bill + policiesData[i].totalprem - policiesData[i].commout1_amt - policiesData[i].ovout1_amt - policiesData[i].withheld
                    net.prem = net.prem + policiesData[i].totalprem
                    net.withheld = net.withheld + policiesData[i].withheld
                    net.comm_out = net.comm_out + policiesData[i].commout1_amt
                    net.ov_out = net.ov_out + policiesData[i].ovout1_amt
                    // net.whtcom = net.whtcom + policiesData[i].commout_taxamt
                    // net.whtov = net.whtov + policiesData[i].ovout_taxamt
                    
                } else {
                    gross.no++
                    gross.prem = gross.prem + policiesData[i].totalprem
                    gross.withheld = gross.withheld + policiesData[i].withheld
                }

            }

        }
        if (filterData.vatflag === 'Y') {
            
            net.whtcom = parseFloat((net.comm_out * wht).toFixed(2))
            net.whtov = parseFloat((net.ov_out * wht).toFixed(2))
        }

        const total = {
            no: net.no + gross.no,
            prem: parseFloat((net.prem + gross.prem).toFixed(2)),
            withheld : parseFloat((net.withheld + gross.withheld).toFixed(2)),
            comm_out: parseFloat((net.comm_out).toFixed(2)),
            whtcom: parseFloat((net.whtcom).toFixed(2)),
            ov_out: parseFloat((net.ov_out).toFixed(2)),
            whtov: parseFloat((net.whtov).toFixed(2)),
            billprem: parseFloat(( net.prem + gross.prem - net.comm_out + net.whtcom - net.ov_out + net.whtov - net.withheld - gross.withheld).toFixed(2)),
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
    const handleChangeCheckbox = (e) => {
        setFilterData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.checked,
        }));
    };


    const changestatementtype = (e) => {
        // e.preventDefault();
        const array = policiesData.map((ele)=>ele)
        array[e.target.id] = { ...policiesData[e.target.id], [e.target.name]: e.target.checked }
        setPoliciesData(array)
        // const array2 = billpremiumData
        // if (e.target.checked) {
        //     array2[e.target.id] = array[e.target.id].totalprem - array[e.target.id].commout_amt - array[e.target.id].ovout_amt

        // } else {
        //     array2[e.target.id] = array[e.target.id].totalprem
        // }
        // setBillpremiumData(array2)
        console.log(array);

    };




    const selectAll = (e) => {

        const array = []
        console.log(e.target.name);
        policiesData.forEach(ele => array.push({ ...ele, [e.target.name]: e.target.checked }))

        setPoliciesData(array)
        console.log(array);
    };

    const submitFilter = (e) => {
        e.preventDefault();
        setPoliciesData([])
        let data = {
            "insurerCode": filterData.insurerCode,
            "agentCode": filterData.agentCode,
            "dueDate": filterData.dueDate,
            "policyNoStart": filterData.policyNoStart,
            "policyNoEnd": filterData.policyNoEnd,
            "createdDateStart": filterData.createdDateStart,
            "createdDateEnd": filterData.createdDateEnd,
     
        }
            
            // if (document.getElementsByName("insurerCodeCB")[0].checked) {
            //     data.insurerCode = null
            // }
            // if (document.getElementsByName("agentCodeCB")[0].checked) {
            //     data.agentCode = null
            // }
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
                    console.log(res.data.records);
                    alert("ไม่พบรายการ")

                } else {


                    const array = []
                    for (let i = 0; i < res.data.records.length; i++) {
                        // console.log(statementtypeData[i].statementtype == null? res.data[i].totalprem -res.data[i].commout_amt-res.data[i].ovout_amt: res.data[i].totalprem);
                        array.push(res.data.records[i].totalprem)

                    }
                    console.log({...data, ...res.data.vatflag[0]});
                    console.log(res.data);
                    setFilterData({...data, ...res.data.vatflag[0]})
                    setPoliciesData(res.data.records)
                    setBillpremiumData(array)
                    alert("find data success")
                }
            })
            .catch((err) => {
                alert("Something went wrong, Try Again.");
                // alert("create snew insuree fail");

            });
    };
    const createbill = (e) => {
        e.preventDefault();
        const array = policiesData.filter((ele) => ele.select)
        for (let i = 0; i < array.length; i++) {
            if (array[i].statementtype ) {
                array[i].statementtype = 'N'
                array[i].billpremium = array[i].totalprem - array[i].withheld - array[i].commout_amt - array[i].ovout_amt
            }else{
                array[i].statementtype = 'G'
                array[i].billpremium = array[i].totalprem - array[i].withheld
            }
            
        }
        const bill ={
            agentCode : filterData.agentCode,
            insurerCode : filterData.insurerCode,
            amt : policiesRender.total.billprem,
            totalprem : policiesRender.total.prem,
            withheld : policiesRender.total.withheld,
            commout_amt : policiesRender.total.comm_out,
            ovout_amt : policiesRender.total.ov_out,
            commout_whtamt : policiesRender.total.whtcom,
            ovout_whtamt : policiesRender.total.whtov,
        }
        console.log({ bill:{...bill}, detail:array });
        console.log(Date.now)
    
        axios
            .post(url + "/payments/createbill", { bill:{...bill}, detail:array }, headers)
            .then((res) => {
                // let token = res.data.jwt;
                // let decode = jwt_decode(token);
                // navigate("/");
                window.location.reload();
                // localStorage.setItem("jwt", token);
                console.log(res.data);
                alert(res.data.msg)
            })
            .catch((err) => {

                alert("create billadvisor fail");

            });
    };

    return (
        <div>

            {/* <BackdropBox1> */}
            <form className="container-fluid " onSubmit={submitFilter}>
                {/* insurer table */}
                <h1 className="text-center">ค้นหารายการเบี้ยค้างที่ครบกำหนดชำระ</h1>
                <div class="row">
                    <div class="col-1">

                    </div>
                    <div class="col-2">
                        <label class="col-form-label">รหัสบริษัทประกัน</label>
                        <span class="text-danger"> *</span>
                    </div>
                    <div class="col-2 ">
                        <div class="input-group mb-3">
                            {/* <input type="text" class="form-control" placeholder="รหัสบริษัทประกัน" name="insurerCode" onChange={handleChange} /> */}
                            <select  name="insurerCode" required class="form-control" onChange={handleChange} >
                                <option value=""   disabled selected hidden>รหัสบริษัทประกัน</option>
                                {insurerDD}
                            </select>

                           


                        </div>


                    </div>
                    {/* <div className="col-1">
                                <input type="checkbox" name="insurerCodeCB" defaultChecked className="form-check-input"/>
                                <label htmlFor="cashierReceiptCheckbox" className="form-check-label">&nbsp;ALL</label>
                            </div> */}

                    <div class="col align-self-end ">
                        <div class="input-group mb-3">
                            <button type="submit" class="btn btn-primary btn-lg" >ค้นหารายการ</button>
                        </div>
                    </div>

                </div>
                <div class="row">
                    <div class="col-1">

                    </div>
                    <div class="col-2">
                        <label class="col-form-label">รหัสผู้แนะนำ</label>
                        <span class="text-danger"> *</span>
                    </div>
                    <div class="col-2 ">
                        
                            {/* <select name="agentCode" required class="form-control" value={filterData.agentCode} onChange={handleChange} >
                                <option value=""  disabled selected hidden>รหัสผู้แนะนำ</option>
                                {agentDD}
                            </select> */}

                            <Select
                                // styles={customStyles}
                                required
                                class="form-control"
                                name={`agentCode`}
                                onChange={(e) => setFilterData((prevState) => ({
                                    ...prevState,
                                    agentCode: e.value,
                                  }))}
                                options={agentDD}

                            />
                    


                    </div>
                    {/* <div className="col-1">
                                <input type="checkbox" name="agentCodeCB" defaultChecked className="form-check-input"/>
                                <label htmlFor="cashierReceiptCheckbox" className="form-check-label">&nbsp;ALL</label>
                            </div> */}

                </div>
                <div class="row">
                    <div class="col-1">

                    </div>
                    <div class="col-2">
                        <label class="col-form-label">DueDate</label>
                        <span class="text-danger"> *</span>
                    </div>
                    <div class="col-2 ">

                        <div class="input-group mb-3">
                            {/* <input required type="date" class="form-control " name="dueDate" onChange={handleChange} /> */}
                            <DatePicker
                            showIcon
                            className="form-control"
                            todayButton="Vandaag"
                            // isClearable
                            required
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
                                <input type="checkbox" name="policyNoCB" defaultChecked className="form-check-input"/>
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
                                <input type="checkbox" name="createdDateCB" defaultChecked className="form-check-input"/>
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
                            <th scope="col">net</th>
                            <th scope="col">เลขที่กรมธรรม์</th>
                            <th scope="col">เลขที่สลักหลัง</th>
                            <th scope="col">เลขที่ใบแจ้งหนี้ (อะมิตี้)</th>
                            {/* <th scope="col">เลขที่ใบกำกับภาษี</th> */}
                            <th scope="col">งวด</th>

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
                            
                            {/* <th scope="col">billpremium</th> */}

                        </tr>
                    </thead>
                    <tbody>
                        {policiesData.map((ele, i) => {
                            return (<tr>
                                <th scope="row" style={{'text-align': 'center'}}><input type="checkbox" name="select" checked={ele.select} id={i} onClick={changestatementtype} />{i + 1}</th>
                                <td><input type="checkbox" name="statementtype" checked={ele.statementtype} id={i} onClick={changestatementtype} /></td>
                                <td>{ele.policyNo}</td>
                                <td>{ele.endorseNo}</td>
                                <td>{ele.invoiceNo}</td>
                                {/* <td>{ele.taxinvoiceNo}</td> */}
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
                                <td>{ele.commout1_rate.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{ele.commout1_amt.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{ele.ovout1_rate.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{ele.ovout1_amt.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                
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
                            <label class="col-form-label">จำนวนเงินสุทธิ</label>
                        </div>
                        <div class="col-2">  <label class="col-form-label">{policiesRender.total.billprem.toLocaleString(undefined, { minimumFractionDigits: 2 })}</label></div>
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
                            <label class="col-form-label">{jwt_decode(cookies["jwt"]).USERNAME}</label>
                        </div>
                    </div>
                    {/* <div class="row">
                        <div class="col-1">
                            <label class="col-form-label">ชำระแบบ net </label>
                        </div>
                        <div class="col-1">
                            <label class="col-form-label">{} รายการ</label>
                         </div>
                         <div class="col-1">
                            <label class="col-form-label">{} จำนวนเงินค่าเบี้ย</label>
                         </div>
                         <div class="col-1">
                            <label class="col-form-label">{}</label>
                         </div>
                         <div class="col-1">
                            <label class="col-form-label">{}comm-out</label>
                         </div>
                         <div class="col-1">
                            <label class="col-form-label">{} </label>
                         </div>
                         <div class="col-1">
                            <label class="col-form-label">{} WHT 3%</label>
                         </div>
                         <div class="col-1">
                            <label class="col-form-label">{} </label>
                         </div>
                         <div class="col-1">
                            <label class="col-form-label">{}ov-out</label>
                         </div>
                         <div class="col-1">
                            <label class="col-form-label">{} </label>
                         </div>
                         <div class="col-1">
                            <label class="col-form-label">{} WHT 3%</label>
                         </div>
                         <div class="col-1">
                            <label class="col-form-label">{} </label>
                         </div>
                    </div> */}
                    <table class="table table-hover">
                        <thead className="table-success">
                            <tr>

                                <th scope="col">ชำระแบบ</th>
                                <th scope="col">รายการ</th>
                                <th scope="col">ค่าเบี้ยประกันรวม</th>
                                <th scope="col">ภาษีหัก ณ ที่จ่าย (1%)</th>
                                <th scope="col">Comm Out</th>
                                <th scope="col"> WHT 3%</th>
                                <th scope="col">OV Out</th>
                                <th scope="col"> WHT 3%</th>

                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>net</td>
                                <td>{policiesRender.net.no}</td>
                                <td>{policiesRender.net.prem.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{policiesRender.net.withheld.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{policiesRender.net.comm_out.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{policiesRender.net.whtcom.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{policiesRender.net.ov_out.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{policiesRender.net.whtov.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                            </tr>
                            <tr>
                                <td>gross</td>
                                <td>{policiesRender.gross.no}</td>
                                <td>{policiesRender.gross.prem.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{policiesRender.gross.withheld.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                            </tr>
                            <tr className="table-info">
                                <td>รวมทั้งสิ้น</td>
                                <td>{policiesRender.total.no}</td>
                                <td>{policiesRender.total.prem.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{policiesRender.total.withheld.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{policiesRender.total.comm_out.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{policiesRender.total.whtcom.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{policiesRender.total.ov_out.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{policiesRender.total.whtov.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="row">
                        <div class="col-2">
                            <label class="col-form-label">Bill Payment</label>
                        </div>
                        <div class="col-2"> <label class="col-form-label">{(policiesRender.total.billprem).toLocaleString(undefined, { minimumFractionDigits: 2 })}</label></div>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <button type="button" class="btn btn-primary" onClick={createbill}>Save changes</button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal" onClick={handleClose}>Close</button>
                </Modal.Footer>
            </Modal>

        </div>
    );
};

export default CreateBillAdvisor;
