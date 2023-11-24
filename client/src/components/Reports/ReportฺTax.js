import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
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

const config = require("../../config.json");

const NormalText = {
    color: "white",
    paddingBottom: "10px",
};
/* eslint-disable react-hooks/exhaustive-deps */

const ReportฺTax = () => {
    const url = window.globalConfig.BEST_POLICY_V1_BASE_URL;
    const navigate = useNavigate();

    const [tableData, setTableData] = useState([])
    const [billAdvisorNo, setBillAdvisorNo] = useState("")
    const [insurercode, setInsurercode] = useState("");
    const [advisorcode, setAdvisorcode] = useState("")
    const [refno, setRefno] = useState("");
    const [atdate, setAtdate] = useState("");
    const [type, setType] = useState("");
    const [cashierReceiptNo, setCashierReceiptNo] = useState("");
    const [transactionType, setTransactionType] = useState({});
    const [checkboxValue, setCheckboxValue] = useState();
    const [createUserCode, setCreateUserCode] = useState();
    const [fromDate, setFromDate] = useState('');
    const [reporttype, setReporttype] = useState('');
    const [toDate, setToDate] = useState('');
    const [fromCashierno, setFromCashierno] = useState('');
    const [toCashierno, setToCashierno] = useState('');
    const [dfrpreferno, setDfrpreferno] = useState();
    const [createusercode, setCreateusercode] = useState();
    const [employeecode, setEmployeecode] = useState();
    const [status, setStatus] = useState();
    const [transtype, setTranstype] = useState();
    const [advisoryReadOnly, setAdvisoryReadOnly] = useState(false)
    const [insurerReadOnly, setInsurerReadOnly] = useState(false)
    const [transactionTypeReadOnly, setTransactionTypeReadOnly] = useState(false)

    useEffect(() => {

    }, [billAdvisorNo]);


    const searchBill = (e) => {
        e.preventDefault()
        let data = JSON.stringify({
            "billadvisorno": billAdvisorNo
        });
        axios.post(window.globalConfig.BEST_POLICY_V1_BASE_URL + "/bills/findDataByBillAdvisoryNo", data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                // console.log(response.data);
                if (response.data[0]) {
                    setInsurercode(response.data[0].insurerCode)
                    setAdvisorcode(response.data[0].agentCode)
                    setTransactionType("PREM-IN")
                    setInsurerReadOnly(true)
                    setAdvisoryReadOnly(true)
                    setTransactionTypeReadOnly(true)
                }

            })
            .catch((error) => {
                console.log(error);
            });
    }
    const searchdata = (e) => {
        e.preventDefault()
        let data = JSON.stringify({
            "billadvisorno": billAdvisorNo,
            "insurercode": insurercode,
            "advisorcode": advisorcode,
            "refno": refno,
            "cashierReceiptNo": cashierReceiptNo,
            "transactionType": transactionType,
            "createUserCode": createUserCode,
            "fromDate": fromDate,
            "toDate": toDate,
            "dfrpreferno": dfrpreferno
        });
        axios.post(window.globalConfig.BEST_POLICY_V1_BASE_URL + "/bills/findbill", data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                // console.log(response.data);
                setTableData(response.data)
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
                        <h2 className="text-center" style={{marginBottom:"30px"}}>รายงานภาษี</h2>
                {/* report type  */}
                <div className="row my-3">
                            <label class="col-sm-2 col-form-label" htmlFor="reporttype">
                                ประเภทรายงาน
                            </label>

                            <div class="form-check col-2">
                                <input class="form-check-input" type="radio" name="reporttype" id="reporttype1" defaultChecked onChange={(e) => setReporttype('1')} />
                                <label class="form-check-label" for="reporttype1">
                                    ภาษีขาย
                                </label>
                            </div>
                            <div class="form-check col-2">
                                <input class="form-check-input" type="radio" name="reporttype" id="reporttype2" onChange={(e) => setReporttype('2')} />
                                <label class="form-check-label" for="reporttype2">
                                ภาษีซื้อ
                                </label>
                            </div>
                            <div class="form-check col-2">
                                <input class="form-check-input" type="radio" name="reporttype" id="reporttype3" onChange={(e) => setReporttype('3')} />
                                <label class="form-check-label" for="reporttype3">
                                WHT 3%
                                </label>
                            </div>
                            <div className="col-1 text-center">
                                <button type="submit" className="btn btn-primary" onClick={searchBill}>Search</button>
                            </div>
                        </div>

                        {reporttype === '1' ? 
                          <div className="row my-3">
                          <label class="col-sm-2 col-form-label" htmlFor="type">
                              
                          </label>

                          <div class="form-check col-2">
                              <input class="form-check-input" type="radio" name="type" id="type1" defaultChecked onChange={(e) => setType('COMM-IN')} />
                              <label class="form-check-label" for="type1">
                              COMM-IN
                              </label>
                          </div>
                          <div class="form-check col-2">
                              <input class="form-check-input" type="radio" name="type" id="type2" onChange={(e) => setType('OV-IN')} />
                              <label class="form-check-label" for="type2">
                              OV-IN
                              </label>
                          </div>
                          
                      </div>
                      : reporttype === '3' ? 
                      <div className="row my-3">
                      <label class="col-sm-2 col-form-label" htmlFor="type">
                          
                      </label>

                      <div class="form-check col-2">
                          <input class="form-check-input" type="radio" name="type" id="type1" defaultChecked onChange={(e) => setType('COMM-OUT')} />
                          <label class="form-check-label" for="type1">
                          COMM-OUT
                          </label>
                      </div>
                      <div class="form-check col-2">
                          <input class="form-check-input" type="radio" name="type" id="type2" onChange={(e) => setType('OV-OUT')} />
                          <label class="form-check-label" for="type2">
                          OV-OUT
                          </label>
                      </div>
                      
                  </div>
                      : null}
                      

     {/* Date Select */}

                        <div className="row">
                            <div className="col-2">
                                <label htmlFor="Date Select" className="form-label">rprefdate Date  </label>
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


                        {/* advisorcode */}
                        {reporttype === '3' ?                         
                        <div className="row mb-3">
                            <div className="col-2">
                                <label htmlFor="Advisor" className="form-label">Advisor Code</label>
                            </div>
                            <div className="col-7">
                                <input type="text" id="Advisor" value={advisorcode} readOnly={advisoryReadOnly} onChange={(e) => setAdvisorcode(e.target.value)} className="form-control" />
                            </div>
                            <div className="col-1">
                                <input type="checkbox" id="cashierReceiptCheckbox" value={checkboxValue} onChange={(e) => setCheckboxValue(e.target.checked)} className="form-check-input" />
                                <label htmlFor="cashierReceiptCheckbox" className="form-check-label">&nbsp;ALL</label>
                            </div>
                        </div>
                        : null}
{/* insurercode */}
{reporttype === '1' ? 


                        
                        <div className="row mb-3">
                            <div className="col-2">
                                <label htmlFor="Insurer" className="form-label">InsurerCode</label>
                            </div>
                            <div className="col-7">
                                <input type="text" id="InsurerCode" value={insurercode} readOnly={insurerReadOnly} onChange={(e) => setInsurercode(e.target.value)} className="form-control" />
                            </div>
                            <div className="col-1">
                                <input type="checkbox" id="cashierReceiptCheckbox" value={checkboxValue} onChange={(e) => setCheckboxValue(e.target.checked)} className="form-check-input" />
                                <label htmlFor="cashierReceiptCheckbox" className="form-check-label">&nbsp;ALL</label>
                            </div>
                        </div>
: null}
                        {/* status  */}
                        <div className="row my-3">
                            <label class="col-sm-2 col-form-label" htmlFor="insurerCode">
                                สถานะ
                            </label>

                            <div class="form-check col-2">
                                <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" defaultChecked onChange={(e) => setStatus('I')} />
                                <label class="form-check-label" for="flexRadioDefault1">
                                    (I) ใบคำขอ
                                </label>
                            </div>
                            <div class="form-check col-2">
                                <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" onChange={(e) => setStatus('A')} />
                                <label class="form-check-label" for="flexRadioDefault2">
                                    (A) กรมธรรม์
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
                                    value={transactionType}
                                    onChange={(e) => setTransactionType(e.target.value)}
                                    className="form-control"
                                    disabled={transactionTypeReadOnly}
                                    style={{ backgroundColor: transactionTypeReadOnly ? 'white' : '' }}
                                >
                                    <option value="" disabled>Select Transaction Type</option>
                                    <option value="PREM-IN">PREM-IN</option>
                                    <option value="PREM-OUT">PREM-OUT</option>
                                    <option value="COMM-OUT">COMM-OUT</option>
                                    <option value="COMM-IN">COMM-IN</option>
                                </select>
                            </div>
                            <div className="col-2">
                                <label htmlFor="transactionType" className="form-label">SubClass</label>
                            </div>
                            <div className="col-2">
                                <select
                                    id="transactionType"
                                    value={transactionType}
                                    onChange={(e) => setTransactionType(e.target.value)}
                                    className="form-control"
                                    disabled={transactionTypeReadOnly}
                                    style={{ backgroundColor: transactionTypeReadOnly ? 'white' : '' }}
                                >
                                    <option value="" disabled>Select Transaction Type</option>
                                    <option value="PREM-IN">PREM-IN</option>
                                    <option value="PREM-OUT">PREM-OUT</option>
                                    <option value="COMM-OUT">COMM-OUT</option>
                                    <option value="COMM-IN">COMM-IN</option>
                                </select>
                            </div>
                        </div>

                        {/* transaction type  */}
                {type === '1'? 
                <div className="row my-3">
                            <label class="col-sm-2 col-form-label" htmlFor="transtype">
                            Transaction Type
                            </label>
                            
                            <div class="form-check col-2">
                    <input class="form-check-input" type="radio" name="transtype" id="transtyperadio1" defaultChecked onChange={(e)=>setTranstype('COMM-IN')}/>
                    <label class="form-check-label" for="transtyperadio1">
                        COMM-IN
                    </label>
                    </div>

                    <div class="form-check col-2">
                    <input class="form-check-input" type="radio" name="transtype" id="transtyperadio2" onChange={(e)=>setTranstype('OV-IN')}/>
                    <label class="form-check-label" for="transtyperadio2">
                        OV-IN
                    </label>
                    </div>
                    <div class="form-check col-2">
                    <input class="form-check-input" type="radio" name="transtype" id="transtyperadio3" onChange={(e)=>setTranstype('ALL')}/>
                    <label class="form-check-label" for="transtyperadio3">
                        ALL
                    </label>
                    </div>
                    
                            </div>
                    : null}
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
                                <th>Bill Advisor No</th>
                                <th>DFR Preder No</th>
                                <th>Insurer Code</th>
                                <th>Advisor Code</th>
                                <th>Cashier Receipt No</th>
                                <th>Cashier Date</th>
                                <th>ARNO</th>
                                <th>Receive From</th>
                                <th>Receive Name</th>
                                <th>User Code</th>
                                <th>Create Date</th>
                                <th>Amt</th>
                                <th>Receive Type</th>
                                <th>Amity Account No</th>
                                <th>Amity Bank</th>
                                <th>Amity Bank Branch</th>
                                <th>Ref No</th>
                                <th>Bank</th>
                                <th>Bank Branch</th>
                                <th>Status</th>
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
                                    <td>{row.ARNO ? row.ARNO : 'N/A'}</td>
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
                                    <h2 className={"text-center"}>No Data</h2>
                                </div>
                            </div>}
                    </div>
                </div>
            </div >
        </div >
    );
};

export default ReportฺTax;