import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
import EditCashierReceive from "./EditCashierReceive";
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

const FindCashierReceive = () => {
    const [cookies] = useCookies(["jwt"]);
    const headers = {
    headers: {'Content-Type': 'application/json', Authorization: `Bearer ${cookies["jwt"]}` }
};
    const url = window.globalConfig.BEST_POLICY_V1_BASE_URL;
    const navigate = useNavigate();

    const [tableData, setTableData] = useState([])
    const [billAdvisorNo, setBillAdvisorNo] = useState("")
    const [insurercode, setInsurercode] = useState("");
    const [advisorcode, setAdvisorcode] = useState("")
    const [refno, setRefno] = useState("");
    const [cashierReceiptNo, setCashierReceiptNo] = useState("");
    const [transactionType, setTransactionType] = useState("PREM-IN");
    const [checkboxValue, setCheckboxValue] = useState();
    const [createUserCode, setCreateUserCode] = useState();
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [dfrpreferno, setDfrpreferno] = useState();
    const [advisoryReadOnly, setAdvisoryReadOnly] = useState(false)
    const [insurerReadOnly, setInsurerReadOnly] = useState(false)
    const [transactionTypeReadOnly, setTransactionTypeReadOnly] = useState(false)
    
    useEffect(() => {

    }, [billAdvisorNo]);

    
    const searchBill = (e) =>{
        e.preventDefault()
        let data = JSON.stringify({
            "billadvisorno": billAdvisorNo
        });
        axios.post(url+"/bills/findDataByBillAdvisoryNo",data,headers)
            .then((response) => {
                // console.log(response.data);
                if (response.data[0])
                {
                    setInsurercode(response.data[0].insurerCode)
                    setAdvisorcode(response.data[0].agentCode)
                    setTransactionType("PREM-IN")
                    setInsurerReadOnly(true)
                    setAdvisoryReadOnly(true)
                    setTransactionTypeReadOnly(true)
                }
                
            })
            .catch((error) => {
                alert("Something went wrong, Try Again.");
                console.log(error);
            });
    }
    const searchdata = (e) =>{
        e.preventDefault()
        let data = JSON.stringify({
            "billadvisorno": billAdvisorNo,
            "insurercode":insurercode,
            "advisorcode":advisorcode,
            "refno":refno,
            "cashierReceiptNo":cashierReceiptNo,
            "transactionType":transactionType,
            "createUserCode":createUserCode,
            "fromDate":fromDate,
            "toDate":toDate,
            "dfrpreferno":dfrpreferno
        });
        axios.post(url+"/bills/findbill",data,headers)
            .then((response) => {
                // console.log(response.data);
                if (response.data.length < 1) {
                    alert("ไม่พบข้อมูล");
                }
                setTableData(response.data)
            })
            .catch((error) => {
                alert("Something went wrong, Try Again.");
                console.log(error);
            });
    }

    return (
        <div className="container" style={{paddingTop:"30px",paddingBottom:"30px"}}>
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    <form>
                        <h2 className="text-center" style={{marginBottom:"30px"}}>ค้นหา ใบรับเงิน</h2>

                        {/* Bill advisorcode No */}
                        <div className="row mb-3">
                            <div className="col-3">
                                <label htmlFor="billAdvisorNo" className="form-label">เลขที่ใบวางบิล</label>
                            </div>
                            <div className="col-4">
                                <input type="text" id="billAdvisorNo" value={billAdvisorNo} onChange={(e) => setBillAdvisorNo(e.target.value)} className="form-control"/>
                            </div>
                            {/* <div className="col-1 text-center">
                                <button type="submit" className="btn btn-primary" onClick={searchBill}>ค้นหา</button>
                            </div> */}
                        </div>
                        
                        {/* Cashier Receipt No */}
                        <div className="row mb-3">
                            <div className="col-3">
                                <label htmlFor="cashierReceiptNo" className="form-label">เลขที่ใบรับเงิน</label>
                            </div>
                            <div className="col-4">
                                <input type="text" id="cashierReceiptNo" value={cashierReceiptNo} onChange={(e) => setCashierReceiptNo(e.target.value)} className="form-control"/>
                            </div>
                            <div className="col-1">
                                <input type="checkbox" id="cashierReceiptCheckbox" value={checkboxValue} onChange={(e) => setCheckboxValue(e.target.checked)} className="form-check-input"/>
                                <label htmlFor="cashierReceiptCheckbox" className="form-check-label">&nbsp;ALL</label>
                            </div>
                        </div>


                        {/* insurercode */}
                        <div className="row mb-3">
                            <div className="col-3">
                                <label htmlFor="Insurer" className="form-label">รหัสบริษัทประกัน</label>
                            </div>
                            <div className="col-4">
                                <input type="text" id="InsurerCode" value={insurercode} readOnly={insurerReadOnly} onChange={(e) => setInsurercode(e.target.value)} className="form-control"/>
                            </div>
                            <div className="col-1">
                                <input type="checkbox" id="cashierReceiptCheckbox" value={checkboxValue}  onChange={(e) => setCheckboxValue(e.target.checked)} className="form-check-input"/>
                                <label htmlFor="cashierReceiptCheckbox" className="form-check-label">&nbsp;ALL</label>
                            </div>
                        </div>
                        {/* advisorcode */}
                        <div className="row mb-3">
                            <div className="col-3">
                                <label htmlFor="Advisor" className="form-label">รหัสผู้แนะนำ</label>
                            </div>
                            <div className="col-4">
                                <input type="text" id="Advisor" value={advisorcode} readOnly={advisoryReadOnly}  onChange={(e) => setAdvisorcode(e.target.value)} className="form-control"/>
                            </div>
                            <div className="col-1">
                                <input type="checkbox" id="cashierReceiptCheckbox" value={checkboxValue} onChange={(e) => setCheckboxValue(e.target.checked)} className="form-check-input"/>
                                <label htmlFor="cashierReceiptCheckbox" className="form-check-label">&nbsp;ALL</label>
                            </div>
                        </div>
                        {/* Date Select */}
                        <div className="row">
                            <div className="col-3">
                                <label htmlFor="Date Select" className="form-label">วันที่สร้าง จาก</label>
                            </div>
                            <div className="col-4">
                                {/* <label htmlFor="fromDate" className="form-label">จาก วันที่&nbsp;</label> */}
                                {/* <input
                                    type="date"
                                    id="fromDate"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                /> */}
                                <DatePicker
                            style={{textAlign: 'center'}}
                            showIcon
                            className="form-control"
                            todayButton="Vandaag"
                            // isClearable
                            showYearDropdown
                            dateFormat="dd/MM/yyyy"
                            dropdownMode="select"
                            id="fromDate"
                            selected={fromDate}
                            onChange={(date) => setFromDate(date)}
                                 />
                            </div>
                            <div className="col-1">
                            <label htmlFor="toDate">ถึง &nbsp;</label>
                            </div>
                            <div className="col-4">
                                
                                {/* <input
                                    type="date"
                                    id="toDate"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                /> */}
                                <DatePicker
                            style={{textAlign: 'center'}}
                            showIcon
                            className="form-control"
                            todayButton="Vandaag"
                            // isClearable
                            showYearDropdown
                            dateFormat="dd/MM/yyyy"
                            dropdownMode="select"
                            id="toDate"
                            selected={toDate}
                            onChange={(date) => setToDate(date)}
                                 />
                                
                            </div>
                        </div>

                        {/* create user code */}
                        <div className="row mb-3" style={{marginTop:"20px"}}>
                            <div className="col-3">
                                <label htmlFor="create user code" className="form-label">รหัสผู้บันทึก</label>
                            </div>
                            <div className="col-4">
                                <input type="text" id="create user code" value={createUserCode} onChange={(e) => setCreateUserCode(e.target.value)} className="form-control"/>
                            </div>
                        </div>
                        {/* refno */}
                        <div className="row mb-3">
                            <div className="col-3">
                                <label htmlFor="Customer" className="form-label">ชื่อผู้แนะนำ</label>
                            </div>
                            <div className="col-4">
                                <input type="text" id="Customer" value={refno} onChange={(e) => setRefno(e.target.value)} className="form-control"/>
                            </div>
                        </div>



                        {/* Transaction Type */}
                        <div className="row mb-3">
                            <div className="col-3">
                                <label htmlFor="transactionType" className="form-label">ประเภทธุรกรรม</label>
                            </div>
                            <div className="col-4">
                                <select
                                    id="transactionType"
                                    value={transactionType}
                                    onChange={(e) => setTransactionType(e.target.value)}
                                    className="form-control"
                                    disabled={transactionTypeReadOnly}
                                    style={{ backgroundColor: transactionTypeReadOnly ? 'white' : '' }}
                                >
                                    <option value="" disabled>เลือกประเภทธุรกรรม</option>
                                    <option value="PREM-IN">PREM-IN</option>
                                    {/* <option value="PREM-OUT">PREM-OUT</option>
                                    <option value="COMM-OUT">COMM-OUT</option> */}
                                    <option value="COMM-IN">COMM-IN</option>
                                </select>
                            </div>
                        </div>
                        {/* dfrpreferno */}
                        <div className="row mb-3">
                            <div className="col-3">
                                <label htmlFor="Customer" className="form-label">เลขที่ตัดหนี้</label>
                            </div>
                            <div className="col-4">
                                <input type="text" id="dfrpreferno" value={dfrpreferno} onChange={(e) => setDfrpreferno(e.target.value)} className="form-control"/>
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
                    <div style={{ overflowY: 'auto', height: '400px' , marginTop:"50px" }}>
                        {tableData.length!=0?<table className="table table-striped table-bordered">
                            <thead>
                            <tr>
                                <th>เลขที่ใบวางบิล</th>
                                <th>DFR Preder No</th>
                                <th>รหัสบริษัทประกัน</th>
                                <th>รหัสผู้แนะนำ</th>
                                <th>เลขที่ใบรับเงิน</th>
                                <th>วันที่รับเงิน</th>
                                <th>เลขที่ตัดหนี้</th>
                                <th>จ่ายโดย</th>
                                <th>ชื่อผู้จ่าย</th>
                                <th>รหัสผู้สร้าง</th>
                                <th>วันที่สร้าง</th>
                                <th>จำนวนเงิน</th>
                                <th>ประเภทการจ่าย</th>
                                <th>เลขบัญชี Amity</th>
                                <th>ธนาคาร Amity</th>
                                <th>สาขาธนาคาร Amity </th>
                                <th>เลขที่อ้างอิง</th>
                                <th>ธนาคาร</th>
                                <th>สาขาธนาคาร</th>
                                <th>สถานะ</th>
                            </tr>
                            </thead>
                            <tbody>
                            {tableData.map((row, index) => (
                                <tr key={index}>
                                    <td>{row.billadvisorno}</td>
                                    <td>{row.dfrprederno ? row.dfrprederno : 'N/A'}</td>
                                    <td>{row.insurercode}</td>
                                    <td>{row.advisorcode}</td>
                                    <td>{row.cashierreceiveno ? row.cashierreceiveno : 'N/A'}</td>
                                    <td>{row.cashierdate ? row.cashierdate : 'N/A'}</td>
                                    <td>{row.dfrpreferno ? row.dfrpreferno : 'N/A'}</td>
                                    <td>{row.receivefrom}</td>
                                    <td>{row.receivename}</td>
                                    <td>{row.createusercode}</td>
                                    <td>{row.createdAt}</td>
                                    <td>{row.amt}</td>
                                    <td>{row.receivetype}</td>
                                    <td>{row.amityAccountno}</td>
                                    <td>{row.amityBank}</td>
                                    <td>{row.amityBankbranch}</td>
                                    <td>{row.partnerAccountno ? row.partnerAccountno : 'N/A'}</td>
                                    <td>{row.partnerBank}</td>
                                    <td>{row.partnerBankbranch}</td>
                                    <td>{row.status}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>:
                            <div className="container" style={{marginTop:"30px"}}>
                                <div className="row justify-content-center">
                                    <h2 className={"text-center"}>ไม่มีข้อมูล</h2>
                                </div>
                            </div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FindCashierReceive;
