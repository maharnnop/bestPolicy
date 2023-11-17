import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
import PremInTable from "../PremIn/PremInTable";

import Modal from 'react-bootstrap/Modal';
import * as XLSX from 'xlsx';
import Select from 'react-select';
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

const FindPerson = () => {
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
            "type": 'insurer',
            "insurerCode": '',
            "agentCode": '',
            "firstname": '',
            "lastname": '',
            "ogname": ''
        })
    const [personsData, setPersonsData] = useState([])
    const [insureTypeDD, setInsureTypeDD] = useState([]);
    const [exportPolicyData, setExportPolicyData] = useState([])
    const [insurerDD, setInsurerDD] = useState([]);
    const [hidecard, setHidecard] = useState([false, 0]);

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
                    array.push({ label: ele.t_provincename, value: ele.provinceid })
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



    const handleChange = (e) => {
        setFilterData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };



    const submitFilter = (e) => {
        // e.preventDefault();
        console.log(filterData);
        if (filterData.type === 'bank') {
            axios
            .post(url + "/persons/findagentinsurer", filterData, headers)
            .then((res) => {

                console.log(res.data);
                alert("find data success")
                const array = []
                setExportPolicyData(res.data)


                setPersonsData(res.data)
            })
            .catch((err) => {

                alert("Something went wrong, Try Again.");

            });
        }else{
            axios
            .post(url + "/persons/findagentinsurer", filterData, headers)
            .then((res) => {

                console.log(res.data);
                alert("find data success")
                const array = []
                setExportPolicyData(res.data)


                setPersonsData(res.data)
            })
            .catch((err) => {

                alert("Something went wrong, Try Again.");

            });
        }
        
    };

    const editperson = (e) => {
        const type = e.target.id.split(':')[0]
        const code = e.target.id.split(':')[1]
        navigate(`/edit${type}/${code}`) // redirect to edit page
    };
    const handleClose = (e) => {
        setHidecard([false, 0])
    }

    return (
        <div>

            {/* <BackdropBox1> */}
            <form className="container-fluid text-left" >
                {/* insurer table */}
                <h1 className="text-center">ค้นหาผู้แนะนำ / บริษัทประกัน</h1>
                <div class="row">
                    <div class="col-1">

                    </div>
                    <div class="col-1">
                        <label class="col-form-label">ประเภท</label>

                    </div>
                    <div class="col-2 ">

                        {/* <input type="text" class="form-control" placeholder="รหัสบริษัทประกัน" name="insurerCode" onChange={handleChange} /> */}
                        <select name="type" class="form-control" onChange={handleChange} >
                            <option value={'insurer'}>บริษัทประกัน</option>
                            <option value={'agent'}>ผู้แนะนำ</option>
                            <option value={'bank'}>บัญชีธนาคาร</option>
                        </select>




                    </div>
                    <div class="col align-self-end ">
                        <div class="input-group mb-3">
                            <button type="button" class="btn btn-primary btn-lg" onClick={submitFilter}>ค้นหา</button>
                        </div>
                    </div>

                </div>
                {filterData.type === 'insurer' ?
                    <>
                    <div class="row">
                        <div class="col-1">

                        </div>
                        <div class="col-1">
                            <label class="col-form-label">รหัสบริษัทประกัน</label>

                        </div>
                        <div class="col-2 ">
                            <div class="input-group mb-3">
                                <input type="text" class="form-control" placeholder="กรอกรหัส" name="insurerCode" onChange={handleChange} />



                            </div>


                        </div>


                    </div>
                    <div class="row">
                                <div class="col-1">

                                </div>
                
                                        <div class="col-1">
                                            <label class="col-form-label">ชื่อบริษัทประกัน</label>

                                        </div>
                                        <div class="col-2">
                                            <input type="text" class="form-control" name="ogname" onChange={handleChange} />
                                        </div>
                                


                            </div>
                    </>
                    : filterData.type === 'agent' ?
                        <>
                            <div class="row">
                                <div class="col-1">

                                </div>
                                <div class="col-1">
                                    <label class="col-form-label">รหัสผู้แนะนำ</label>

                                </div>
                                <div class="col-2 ">
                                    <div class="input-group mb-3">
                                        <input type="text" class="form-control" placeholder="กรอกรหัส" name="agentCode" onChange={handleChange} />



                                    </div>


                                </div>

                            </div>
                            <div class="row">
                                <div class="col-1">

                                </div>
                                <div class="col-1">
                                    {/* <label class="col-form-label">ประเภทบุคคล</label> */}

                                </div>
                                <div class="col-2 ">

                                    <select name={`personType`} class="form-control" onChange={handleChange} >
                                        <option selected hidden >เลือกประเภทบุคคล</option>
                                        <option value={'P'}>บุคคลธรรมดา</option>
                                        <option value={'O'}>นิติบุคคล</option>

                                    </select>

                                </div>
                                {filterData.personType === 'P' ?
                                    <>
                                        <div class="col-1">
                                            <label class="col-form-label">ชื่อ</label>

                                        </div>
                                        <div class="col-2">
                                            <input type="text" class="form-control" name="firstname" onChange={handleChange} />
                                        </div>
                                        <div class="col-1">
                                            <label class="col-form-label">นามสกุล</label>

                                        </div>
                                        <div class="col-2">
                                            <input type="text" class="form-control" name="lastname" onChange={handleChange} />
                                        </div>
                                    </>
                                    :
                                    <>
                                        <div class="col-1">
                                            <label class="col-form-label">ชื่อ</label>

                                        </div>
                                        <div class="col-2">
                                            <input type="text" class="form-control" name="ogname" onChange={handleChange} />
                                        </div>
                                    </>
                                }


                            </div>
                        </>
                    : filterData.type === 'bank' ? 
                    <>
                    <div className="row">
                        <div className="col-1"></div>
                    <div className="col-1">
                        <label htmlFor="bankOf" className="form-label">Bank Of</label>
                    </div>
                    <div className="col-2">
                        <select id="bankOf" name='bankOf' onChange={handleChange} className="form-control">
                            <option value="M">Amity</option>
                            <option value="I">Insurer</option>
                            <option value="A">Advisor</option>
                            {/*amity ="M" insurer = "I"  advisor = "A" customer = "C"';*/}
                        </select>
                    </div>

                </div>

{filterData.bankOf === 'I' ?
<>
<div class="row">
    <div class="col-1">

    </div>
    <div class="col-1">
        <label class="col-form-label">รหัสบริษัทประกัน</label>

    </div>
    <div class="col-2 ">
        <div class="input-group mb-3">
            <input type="text" class="form-control" placeholder="กรอกรหัส" name="insurerCode" onChange={handleChange} />



        </div>


    </div>


</div>
<div class="row">
            <div class="col-1">

            </div>

                    <div class="col-1">
                        <label class="col-form-label">ชื่อบริษัทประกัน</label>

                    </div>
                    <div class="col-2">
                        <input type="text" class="form-control" name="ogname" onChange={handleChange} />
                    </div>
            


        </div>
</>
: filterData.bankOf === 'A' ?
    <>
        <div class="row">
            <div class="col-1">

            </div>
            <div class="col-1">
                <label class="col-form-label">รหัสผู้แนะนำ</label>

            </div>
            <div class="col-2 ">
                <div class="input-group mb-3">
                    <input type="text" class="form-control" placeholder="กรอกรหัส" name="agentCode" onChange={handleChange} />



                </div>


            </div>

        </div>
        <div class="row">
            <div class="col-1">

            </div>
            <div class="col-1">
                {/* <label class="col-form-label">ประเภทบุคคล</label> */}

            </div>
            <div class="col-2 ">

                <select name={`personType`} class="form-control" onChange={handleChange} >
                    <option selected hidden >เลือกประเภทบุคคล</option>
                    <option value={'P'}>บุคคลธรรมดา</option>
                    <option value={'O'}>นิติบุคคล</option>

                </select>

            </div>
            {filterData.personType === 'P' ?
                <>
                    <div class="col-1">
                        <label class="col-form-label">ชื่อ</label>

                    </div>
                    <div class="col-2">
                        <input type="text" class="form-control" name="firstname" onChange={handleChange} />
                    </div>
                    <div class="col-1">
                        <label class="col-form-label">นามสกุล</label>

                    </div>
                    <div class="col-2">
                        <input type="text" class="form-control" name="lastname" onChange={handleChange} />
                    </div>
                </>
                :
                <>
                    <div class="col-1">
                        <label class="col-form-label">ชื่อ</label>

                    </div>
                    <div class="col-2">
                        <input type="text" class="form-control" name="ogname" onChange={handleChange} />
                    </div>
                </>
            }


        </div>
    </> : null}</>
                    :
                        null}











                <div className="table-responsive overflow-scroll"  >
                    <table class="table  table-striped " >
                        <thead>
                            <tr>
                                <th scope="col">ลำดับ</th>

                                <th scope="col">แก้ไข</th>
                                <th scope="col">ประเภท</th>
                                <th scope="col">รหัส</th>
                                <th scope="col">ประเภทบุคคล</th>
                                <th scope="col">ชื่อเต็ม</th>
                                <th scope="col">ประเภทการชำระ</th>
                                <th scope="col">เครดิตเทอมค่าเบี้ย</th>
                                <th scope="col">เครดิตเทอมค่า Comm/OV</th>
                                <th scope="col">อยู่ในระบบ VAT</th>
                                <th scope="col">สาขาที่</th>


                            </tr>
                        </thead>
                        <tbody>
                            {personsData.map((ele, i) => {
                                return (<tr>
                                    <th scope="row">{i + 1}</th>
                                    <td scope="row"><button type="button" class="btn btn-secondary " id={ele.type === 'insurer' ? ele.type + ':' + ele.insurerCode : ele.type + ':' + ele.agentCode} onClick={e => editperson(e)}>Edit</button></td>
                                    <td>{ele.type}</td>
                                    <td>{ele.type === 'insurer' ? ele.insurerCode : ele.agentCode}</td>
                                    <td>{ele.personType}</td>
                                    <td>{ele.fullname}</td>
                                    <td>{ele.stamentType}</td>
                                    <td>{ele.premCreditT}  {ele.premCreditUnit === 'D' ? 'วัน' : ele.premCreditUnit === 'M' ? 'เดือน' : 'ปี'}</td>
                                    <td>{ele.commovCreditT}  {ele.commovCreditUnit === 'D' ? 'วัน' : ele.commovCreditUnit === 'M' ? 'เดือน' : 'ปี'}</td>
                                    <td>{ele.vatRegis}</td>
                                    <td>{ele.branch}</td>
                                </tr>)

                            })}

                        </tbody>
                    </table>
                </div>



            </form>


            {/* <Link to="/signup" style={NormalText}>
          First time here ? Let's sign up
        </Link> */}
            {/* </BackdropBox1> */}
        </div>
    );
};

export default FindPerson;
