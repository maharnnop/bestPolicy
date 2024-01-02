import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import jwt_decode from "jwt-decode";
import EditBillAdvisor from "./EditBillAdvisor";
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
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
import { useCookies } from "react-cookie";


const config = require("../../config.json");

const NormalText = {
    color: "white",
    paddingBottom: "10px",
};
/* eslint-disable react-hooks/exhaustive-deps */

const FindBillAdvisor = () => {
    
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
    const [stamenttypeData, setStamenttypeData] = useState([]);

    const [filterData, setFilterData] = useState(
        {
            "insurerId": null,
            "agentId":null,
            "billadvisorno": null,
            "billdate": null

        })
    const [policiesData, setPoliciesData] = useState([])
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
                        // <option key={ele.id} value={ele.id}>
                        //     {ele.agentCode}
                        // </option>
                        { label: ele.agentCode, value: ele.id }
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
                        <option key={ele.id} value={ele.id}>
                            {ele.insurerCode}
                        </option>
                    );
                });
                setInsurerDD(array);
            })
            .catch((err) => { });


    }, []);


    const handleChange = (e) => {
        console.log(typeof(e.target.value));
        setFilterData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const changeStamenttype = (e) => {
        // e.preventDefault();
        const array = policiesData
        console.log(e.target.id);

        array[e.target.id] = { ...policiesData[e.target.id], [e.target.name]: e.target.checked }


        setPoliciesData(array)
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
        console.log(filterData);
        const data = {
            "insurerId": filterData.insurerId,
            "agentId":filterData.agentId,
            "billadvisorno": filterData.billadvisorno,
            "billdate": filterData.billdate

        }
        const d = new Date();
        // console.log(d.getVarDate());
        data.billdate = data.billdate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          });
        if (document.getElementsByName("insurerIdCB")[0].checked) {
            data.insurerId = null
         }
         if (document.getElementsByName("agentIdCB")[0].checked) {
            data.agentId = null
         }
         
        axios
            .post(url + "/payments/findbill", data, headers)
            .then((res) => {
                // let token = res.data.jwt;
                // let decode = jwt_decode(token);
                // navigate("/");
                // window.location.reload();
                // localStorage.setItem("jwt", token);
                console.log(res.data);
                // alert("create new insuree success")
                if (res.data.length < 1) {
                    alert("ไม่พบข้อมูลใบวางบิล")                    
                }
                const array = []
              
                console.log(array);
                setPoliciesData(res.data)
                // setPoliciesData(array)
                // alert("create new insuree success")
            })
            .catch((err) => {
                alert("Something went wrong, Try Again.");
                // alert("create snew insuree fail");

            });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const array = policiesData.filter((ele) => ele.select)
        console.log(array);
        // axios
        //     .post(url + "/persons/insureenew", { policy:policiesData })
        //     .then((res) => {
        //         // let token = res.data.jwt;
        //         // let decode = jwt_decode(token);
        //         // navigate("/");
        //         // window.location.reload();
        //         // localStorage.setItem("jwt", token);
        //         console.log(res.data);
        //         alert("create new insuree success")
        //     })
        //     .catch((err) => {

        //         alert("create new insuree fail");

        //     });
    };

    return (
        <div>

            {/* <BackdropBox1> */}
            <form className="container-fluid " onSubmit={submitFilter}>
                {/* insurer table */}
                <h1 className="text-center">ค้นหาใบวางบิล</h1>
                <div class="row">
                    <div class="col-1">

                    </div>
                    <div class="col-2">
                        <label class="col-form-label">รหัสบริษัทประกัน</label>
                        
                    </div>
                    <div class="col-2 ">
                        <div class="input-group mb-3">
                            {/* <input type="text" class="form-control" placeholder="รหัสบริษัทประกัน" name="insurerCode" onChange={handleChange} /> */}
                            <select  name="insurerId"  class="form-control" onChange={handleChange} >
                                <option value="" disabled selected hidden>รหัสบริษัทประกัน</option>
                                {insurerDD}
                            </select>

                        </div>


                    </div>
                    <div className="col-1">
                                <input type="checkbox" name="insurerIdCB" className="form-check-input"/>
                                <label htmlFor="cashierReceiptCheckbox" className="form-check-label">&nbsp;ALL</label>
                            </div>
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
                        
                    </div>
                    <div class="col-2 ">
                            {/* <select  name="agentId"  class="form-control" onChange={handleChange} >
                                <option value="" disabled selected hidden>รหัสผู้แนะนำ</option>
                                {agentDD}
                            </select> */}
                            
                            <Select
                                class="form-control col"
                                name={`agentId`}
                                onChange={(e) => setFilterData((prevState) => ({
                                    ...prevState,
                                    agentId: e.value,
                                  }))}
                                options={agentDD}

                            />
                        


                    </div>
                    <div className="col-1">
                                <input type="checkbox" name="agentIdCB" className="form-check-input"/>
                                <label htmlFor="cashierReceiptCheckbox" className="form-check-label">&nbsp;ALL</label>
                            </div>
                </div>

                <div class="row">
                    <div class="col-1">

                    </div>
                    <div class="col-2">
                        <label class="col-form-label">เลขที่วางบิล</label>

                    </div>
                    <div class="col-2 ">
                        <div class="input-group mb-3">
                            <input
                                className="form-control"
                                type="text"

                                name="billadvisorno"
                                onChange={handleChange}
                            />



                        </div>


                    </div>

                </div>

                <div class="row">
                    <div class="col-1">

                    </div>
                    <div class="col-2">
                        <label class="col-form-label">billdate</label>
                        <span class="text-danger"> *</span>
                    </div>
                    <div class="col-2 ">

                        <div class="input-group mb-3">
                            {/* <input  type="date" class="form-control " name="billdate"   onChange={handleChange}  /> */}
                            <DatePicker
                            style={{textAlign: 'center'}}
                            showIcon
                            required
                            className="form-control"
                            todayButton="Vandaag"
                            // isClearable
                            showYearDropdown
                            dateFormat="dd/MM/yyyy"
                            dropdownMode="select"
                            selected={filterData.billdate}
                            onChange={(date) => setFilterData((prevState) => ({
                                ...prevState,
                                billdate: date,
                            }))}
                                 />
                        </div>

                    </div>



                </div>


            </form>
            <form className="container-fluid " onSubmit={submitFilter}>

                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">รหัสบริษัทประกัน</th>
                            <th scope="col">รหัสผู้แนะนำ</th>
                            <th scope="col">เลขที่ใบวางบิล</th>
                            <th scope="col">วันที่</th>
                            <th scope="col">จำนวนเงิน</th>
                            <th scope="col">รหัสผู้สร้าง</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {policiesData.map((ele, i) => {
                            // console.log(stamenttypeData[i].stamenttype == null? ele.totalprem -ele.commout_amt-ele.ovout_amt: ele.totalprem);
                            return (<tr>
                                <td>{ele.insurerCode}</td>
                                <td>{ele.agentCode}</td>
                                <td>{ele.billadvisorno}</td>
                                <td>{ele.billdate}</td>
                                <td>{ele.amt.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{ele.createusercode}</td>
                                <td>{ele.editflag ? <button onClick={() =>navigate('/bill/editbill?billno=' + ele.billadvisorno)}>แก้ไข</button> 
                                :  <button onClick={() =>navigate('/bill/getbill?billno=' + ele.billadvisorno)}>ดูรายละเอียด</button> }</td>
                            </tr>)

                        })}

                    </tbody>
                </table>


                <div className="d-flex justify-content-center">
                    <LoginBtn type="submit">ยืนยัน</LoginBtn>
                </div>
            </form>


            {/* <Link to="/signup" style={NormalText}>
          First time here ? Let's sign up
        </Link> */}
            {/* </BackdropBox1> */}
        </div>
    );
};

export default FindBillAdvisor;
