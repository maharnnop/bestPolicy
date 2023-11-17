import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
import Modal from 'react-bootstrap/Modal';
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
            "policyNoAll": true,
            "policyNoStart": '000000',
            "policyNoEnd": '0000000',
            "agentCode": null,
            

        })
    const [policiesData, setPoliciesData] = useState([])
    const [policiesRender, setPoliciesRender] = useState({
        
        net:{ no: 0, prem: 0, comm_out: 0, whtcom: 0, ov_out: 0, whtov: 0, },
        gross:{ no: 0, prem: 0 },
        total:{ no: 0, prem: 0, comm_out: 0, whtcom: 0, ov_out: 0, whtov: 0, billprem:0 },
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
                    net.prem = net.prem + policiesData[i].totalprem - policiesData[i].commout_amt - policiesData[i].ovout_amt - policiesData[i].withheld
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
            billprem: net.prem + gross.prem - net.comm_out + net.whtcom - net.ov_out + net.whtov
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

    const submitFilter = (e) => {
        e.preventDefault();
        console.log(filterData);
        axios
            .post(url + "/payments/findpolicyinDue", filterData, headers)
            .then((res) => {
                if (res.status === 201) {
                    console.log(res.data);
                    alert("not found policy")

                } else {


                    const array = []
                    for (let i = 0; i < res.data.length; i++) {
                        // console.log(statementtypeData[i].statementtype == null? res.data[i].totalprem -res.data[i].commout_amt-res.data[i].ovout_amt: res.data[i].totalprem);
                        array.push(res.data[i].totalprem)

                    }
                    console.log(array);
                    console.log(res.data);
                    setPoliciesData(res.data)
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
                array[i].billpremium = array[i].totalprem - array[i].commout_amt - array[i].ovout_amt
            }else{
                array[i].statementtype = 'G'
                array[i].billpremium = array[i].totalprem 
            }
            
        }
        console.log({bill:{...filterData,amt:policiesRender.total.billprem}, detail:array });
        console.log(Date.now)
    
        axios
            .post(url + "/payments/createbill", { bill:{...filterData,amt:policiesRender.total.billprem}, detail:array }, headers)
            .then((res) => {
                // let token = res.data.jwt;
                // let decode = jwt_decode(token);
                // navigate("/");
                // window.location.reload();
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
                <h1 className="text-center">ค้นหารายการเบี้ยค้างที่กำหนดชำระแล้ว</h1>
                <div class="row">
                    <div class="col-1">

                    </div>
                    <div class="col-2">
                        <label class="col-form-label">รหัสบริษัทประกัน</label>

                    </div>
                    <div class="col-2 ">
                        <div class="input-group mb-3">
                            {/* <input type="text" class="form-control" placeholder="รหัสบริษัทประกัน" name="insurerCode" onChange={handleChange} /> */}
                            <select required name="insurerCode" class="form-control" onChange={handleChange} >
                                <option value="" disabled selected hidden>รหัสบริษัทประกัน</option>
                                {insurerDD}
                            </select>

                            <div class="input-group-append">
                                <div class="input-group-text ">
                                    <div class="form-check checkbox-xl">
                                        <input class="form-check-input" type="checkbox" value="" onChange={handleChange} />
                                        <label class="form-check-label" >All</label>
                                    </div>
                                </div>
                            </div>


                        </div>


                    </div>
                    <div class="col align-self-end ">
                        <div class="input-group mb-3">
                            <button type="submit" class="btn btn-primary btn-lg" >ค้นหา</button>
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
                            <select required name="agentCode" class="form-control" onChange={handleChange} >
                                <option value="" disabled selected hidden>รหัสผู้แนะนำ</option>
                                {agentDD}
                            </select>
                            <div class="input-group-append">
                                <div class="input-group-text ">
                                    <div class="form-check checkbox-xl">
                                        <input class="form-check-input" type="checkbox" value="" />
                                        <label class="form-check-label" >All</label>
                                    </div>
                                </div>
                            </div>


                        </div>


                    </div>

                </div>
                <div class="row">
                    <div class="col-1">

                    </div>
                    <div class="col-2">
                        <label class="col-form-label">Duedate</label>

                    </div>
                    <div class="col-2 ">

                        <div class="input-group mb-3">
                            <input required type="date" class="form-control " name="dueDate" onChange={handleChange} />

                        </div>

                    </div>



                </div>

                <div class="row">
                    <div class="col-1">

                    </div>
                    <div class="col-1">
                        <label class="col-form-label">เลขกรมธรรม์</label>

                    </div>
                    <div class="col-1">
                        <label class="col-form-label">จากวันที่</label>
                    </div>
                    <div class="col-2 ">
                        <div class="input-group mb-3">
                            <input type="text" class="form-control " name="policyNoStart" onChange={handleChange} />

                        </div>
                    </div>
                    <div class="col-1">
                        <label class="col-form-label">ถึงวันที่</label>
                    </div>
                    <div class="col-2 ">
                        <div class="input-group mb-3">
                            <input type="text" class="form-control" name="policyNoEnd" onChange={handleChange} />
                            <div class="input-group-append">
                                <div class="input-group-text ">
                                    <div class="form-check checkbox-xl">
                                        <input class="form-check-input" type="checkbox" name="policyNoAll" onClick={(e) => {
                                            setFilterData((prevState) => ({
                                                ...prevState,
                                                policyNoAll: e.target.checked,
                                            }))
                                        }} />
                                        <label class="form-check-label" >All</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </form>
            <form className="container-fluid " >
            <div className="table-responsive overflow-scroll"  >
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col"><input type="checkbox" name="select" onClick={selectAll} />select</th>
                            <th scope="col">รหัสบริษัทประกัน</th>
                            <th scope="col">รหัสผู้แนะนำ</th>
                            <th scope="col">Duedate</th>
                            <th scope="col">เลขกรมธรรม์</th>
                            <th scope="col">เลขสลักหลัง</th>
                            <th scope="col">เลขใบแจ้งหนี้</th>
                            <th scope="col">seqno</th>
                            <th scope="col">idผู้อาประกัน</th>
                            <th scope="col">ชื่อผู้เอาประกัน</th>
                            <th scope="col">เลขทะเบียนรถ</th>
                            <th scope="col">จังหวัดที่จดทะเบียน</th>
                            <th scope="col">เลขคัชซี</th>
                            
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
                        {policiesData.map((ele, i) => {
                            return (<tr>
                                <th scope="row"><input type="checkbox" name="select" id={i} onClick={changestatementtype} />{i + 1}</th>
                                <td>{ele.insurerCode}</td>
                                <td>{ele.agentCode}</td>
                                <td>{ele.dueDate}</td>
                                <td>{ele.policyNo}</td>
                                <td>{ele.endorseNo}</td>
                                <td>{ele.invoiceNo}</td>
                                <td>{ele.seqNo}</td>
                                <td>{ele.insureeCode}</td>
                                <td>{ele.insureename}</td>
                                <td>{ele.licenseNo}</td>
                                <td>{ele.motorprovinceID}</td>
                                <td>{ele.chassisNo}</td>
                                <td>{ele.netgrossprem.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{ele.duty.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{ele.tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{ele.totalprem.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{ele.withheld ? ele.withheld.toLocaleString(undefined, { minimumFractionDigits: 2 }): 0}</td>
                                <td>{ele.commout_rate.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{ele.commout_amt.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{ele.ovout_rate.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{ele.ovout_amt.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td><input type="checkbox" name="statementtype" id={i} onClick={changestatementtype} /></td>
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
                        <div class="col-2"> {policiesRender.total.prem.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
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
                                <td>{policiesRender.net.prem.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{policiesRender.net.comm_out.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{policiesRender.net.whtcom.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{policiesRender.net.ov_out.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{policiesRender.net.whtov.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                            </tr>
                            <tr>
                                <td>gross</td>
                                <td>{policiesRender.gross.no}</td>
                                <td>{policiesRender.gross.prem.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                            </tr>
                            <tr>
                                <td>รวมทั้งสิ้น</td>
                                <td>{policiesRender.total.no}</td>
                                <td>{policiesRender.total.prem.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
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
                        <div class="col-2"> {(policiesRender.total.prem + policiesRender.total.whtov + policiesRender.total.whtcom).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
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
