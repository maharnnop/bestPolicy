import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { Button } from "react-bootstrap";
import { useCookies } from "react-cookie";

const config = require("../../config.json");

const NormalText = {
    color: "white",
    paddingBottom: "10px",
};
// import joi from joi;
const Joi = require('joi');
/* eslint-disable react-hooks/exhaustive-deps */

const CreateCashierReceive = () => {
    const [cookies] = useCookies(["jwt"]);
    const headers = {
    headers: { 'Content-Type': 'application/json',
                'Authorization': `Bearer ${cookies["jwt"]}` }
};
    const url = window.globalConfig.BEST_POLICY_V1_BASE_URL;
    const navigate = useNavigate();
    const { txtype } = useParams();

    const [billAdvisorNo, setBillAdvisorNo] = useState("-")
    const [dfrpreferno, setDfrpreferno] = useState("-");
    const [Insurer, setInsurer] = useState("");
    const [Advisor, setAdvisor] = useState("")
    const [Customer, setCustomer] = useState("0");
    const [cashierReceiptNo, setCashierReceiptNo] = useState("");
    const [cashierDate, setCashierDate] = useState("");
    const [receiveForm, setReceiveForm] = useState("Advisor");
    const [receiveName, setReceiveName] = useState("");
    const [receiveType, setReceiveType] = useState("");
    const [refno, setRefno] = useState("");
    const [transactionType, setTransactionType] = useState("PREM-IN");
    const [bankPartner, setBankPartner] = useState("");
    const [bankBranchPartner, setBankBranchPartner] = useState("");
    const [bankNoPartner, setBankNoPartner] = useState("");
    const [bankAmity, setBankAmity] = useState("");
    const [bankBranchAmity, setBankBranchAmity] = useState("");
    const [bankNo, setBankNo] = useState("");
    const [amount, setAmount] = useState("");

    //select data
    const [bankAmityBrandData, setBankAmityBrandData] = useState([]);
    const [bankAmityBranchData, setBankAmityBranchData] = useState([])
    const [bankAmityNoData, setBankAmityNoData] = useState([])
    //partner Data
    const [bankPartnerBrandData, setBankPartnerBrandData] = useState([]);
    const [bankPartnerBranchData, setBankPartnerBranchData] = useState([]);
    const [bankPartnerNoData, setBankPartnerNoData] = useState([]);

    //read only
    const [advisoryReadOnly, setAdvisoryReadOnly] = useState(false)
    const [insurerReadOnly, setInsurerReadOnly] = useState(false)
    const [transactionTypeReadOnly, setTransactionTypeReadOnly] = useState(false)
    const [receiveFromReadOnly, setReceiveFromReadOnly] = useState(false)

    //modal
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [modalText, setModalText] = useState()



    const onSearch = (e) => {
        e.preventDefault()
        console.log(billAdvisorNo)

        let data = JSON.stringify({
            "filter": txtype === 'premin' ? billAdvisorNo : dfrpreferno
        });
        axios.post(window.globalConfig.BEST_POLICY_V1_BASE_URL + "/bills/findDataByBillAdvisoryNo?txtype=" + txtype, data, headers)
            .then((response) => {
                console.log(response);
                if (response.data.length <1 || (response.data[0].transactiontype !== 'PREM-OUT' && txtype === 'comin')) {
                    alert("เลขที่ใบวางบิลไม่สามารถทำการตัดหนี้ได้")
                    setInsurer("")
                setInsurerReadOnly(false)
                setAdvisoryReadOnly(false)
                setAdvisor("")
                setTransactionTypeReadOnly(false)
                setReceiveFromReadOnly(false)
                setReceiveName("")
                setAmount("")
                }else{

                
                setInsurer(response.data[0].insurerCode)
                setInsurerReadOnly(true)
                setAdvisoryReadOnly(true)
                setAdvisor(response.data[0].agentCode)
                setTransactionTypeReadOnly(true)
                setReceiveFromReadOnly(true)
                if (txtype === 'premin') {
                    setReceiveForm("Advisor")
                } else {
                    setReceiveForm("Insurer")
                }
                setReceiveName(response.data[0].receivename)
                setAmount(response.data[0].amt)
            }

            })

            .catch((error) => {
                console.log(error);
                alert("Something went wrong, Try Again.");
            });

    }

    useEffect(() => {
        console.log(txtype);
        let data = {}
        axios.get(window.globalConfig.BEST_POLICY_V1_BASE_URL + "/static/bank/BankAmityBrand",  headers)
            .then((response) => {
                console.log(response.data);
                setBankAmityBrandData(response.data)
                setBankAmity(response.data[0].bankBrand)

            })

            .catch((error) => {
                console.log(error);
                alert("Something went wrong, Try Again.");
            });

        axios.get(window.globalConfig.BEST_POLICY_V1_BASE_URL + "/static/bank/BankPartnerBrand?" + "type=I",  headers)
            .then((response) => {
                console.log(response.data);
                setBankPartnerBrandData(response.data)
                setBankPartner(response.data[0].bankBrand)

            })

            .catch((error) => {
                console.log(error);
                alert("Something went wrong, Try Again.");
            });

        if (txtype === 'premin') {
            setTransactionType('PREM-IN')
        } else if (txtype === 'commin') {
            setReceiveForm('Insurer')
            setTransactionType('COMM-IN')
        }
    }, []);


    useEffect(() => {
        let data = {}
        if (bankAmity != "")
            axios.get(window.globalConfig.BEST_POLICY_V1_BASE_URL + "/static/bank/BankAmityBranch?brand=" + bankAmity, headers)
                .then((response) => {
                    console.log(response.data);
                    setBankAmityBranchData(response.data)

                })

                .catch((error) => {
                    console.log(error);
                    alert("Something went wrong, Try Again.");
                });


    }, [bankAmity]);
    useEffect(() => {
        let data = {}
        console.log(bankBranchAmity)
        if (bankBranchAmity != "")
            axios.get(window.globalConfig.BEST_POLICY_V1_BASE_URL + "/static/bank/BankAmityBranch?branch=" + bankBranchAmity + "&brand=" + bankAmity, headers)
                .then((response) => {
                    // console.log(response.data);
                    setBankAmityNoData(response.data)

                })

                .catch((error) => {
                    alert("Something went wrong, Try Again.");
                    console.log(error);
                });


    }, [bankBranchAmity]);

    useEffect(() => {
        let data = {}
        if (bankPartner != "")
            axios.get(window.globalConfig.BEST_POLICY_V1_BASE_URL + "/static/bank/BankPartnerBranch?brand=" + bankPartner + "&type=I", headers)
                .then((response) => {
                    console.log(response.data);
                    setBankPartnerBranchData(response.data)

                })

                .catch((error) => {
                    alert("Something went wrong, Try Again.");
                    console.log(error);
                });


    }, [bankPartner]);
    useEffect(() => {
        let data = {}
        console.log(bankBranchAmity)
        if (bankBranchPartner != "")
            axios.get(window.globalConfig.BEST_POLICY_V1_BASE_URL + "/static/bank/BankAmityBranch?branch=" + bankBranchPartner + "&brand=" + bankPartner + "&type=I",  headers)
                .then((response) => {
                    // console.log(response.data);
                    setBankPartnerNoData(response.data)

                })

                .catch((error) => {
                    alert("Something went wrong, Try Again.");
                    console.log(error);
                });


    }, [bankBranchPartner]);




    useEffect(() => {


    }, [receiveForm]);

    const handleSubmit = () => {
        let data = {
            // keyid: Joi.string().required(),
            billadvisorno: billAdvisorNo,
            dfrpreferno: dfrpreferno,
            // cashierreceiveno: cashierReceiptNo,
            cashierdate: cashierDate,
            dfrpreferno: dfrpreferno,
            transactiontype: transactionType,
            insurercode: Insurer,
            advisorcode: Advisor,
            customerid: Customer,
            receivefrom: receiveForm,
            receivename: receiveName,
            receivetype: receiveType,

            Amt: amount
            // createdate: Joi.date().required(),
            // createtime: Joi.string().required(),
            // createusercode: Joi.string().required(),
            // updatedate: Joi.date().required(),
            // updatetime: Joi.string().required(),
            // updateusercode: Joi.string().required(),
            // canceldate: Joi.date().required(),
            // canceltime: Joi.string().required(),
            // cancelusercode: Joi.string().required(),
            // status: Joi.string().valid('I').required()
        }

        const joidata = {
            // keyid: Joi.string().required(),
            billadvisorno: Joi.string(),
            // cashierreceiveno: Joi.required(),
            cashierdate: Joi.date().required(),
            dfrpreferno: Joi.string(),
            transactiontype: Joi.string().required(),
            insurercode: Joi.string().required(),
            advisorcode: Joi.string().required(),
            customerid: Joi.string().required(),
            receivefrom: Joi.string().required(),
            receivename: Joi.string().required(),
            receivetype: Joi.string().required(),
            Amt: Joi.number().required(),
            // createdate: Joi.date().required(),
            // createtime: Joi.string().required(),
            // createusercode: Joi.string().required(),
            // updatedate: Joi.date().required(),
            // updatetime: Joi.string().required(),
            // updateusercode: Joi.string().required(),
            // canceldate: Joi.date().required(),
            // canceltime: Joi.string().required(),
            // cancelusercode: Joi.string().required(),
            // status: Joi.string().valid('I').required()
        }
        if (receiveType === "Cheque" || receiveType === "Bank-Transfer") {
            joidata.refno = Joi.string().required()
            joidata.PartnerBank = Joi.string().required()
            joidata.PartnerBankbranch = Joi.string().required()
            joidata.PartnerAccountno = Joi.string().required()
            joidata.AmityBank = Joi.string().required()
            joidata.AmityBankBranch = Joi.string().required()
            joidata.AmityAccountno = Joi.string().required()

            // data
            data.PartnerBank = bankPartner
            data.PartnerBankbranch = bankPartner
            data.PartnerAccountno = bankNoPartner
            data.AmityBank = bankAmity
            data.AmityBankBranch = bankBranchAmity
            data.AmityAccountno = bankNo
            data.refno = refno
        }
        const schema = Joi.object(joidata);


        const { error } = schema.validate(data);
        if (error) {
            console.log(data)
            console.log(error)
            setModalText(error.toString())
            setShow(true)
            return
        }
        console.log(data);  
        axios.post(window.globalConfig.BEST_POLICY_V1_BASE_URL + "/bills/submitCasheir?txtype=" + txtype, data, headers)
            .then((response) => {

                if (response.status == 200) {
                    console.log("Success")
                    alert(`สร้างใบเสร็จรับเงินเลขที่ ${response.data.CashierReceiveNo}`)
                    // setModalText(`สร้างใบเสร็จรับเงินเลขที่ ${response.data.CashierReceiveNo}`)
                    // setShow(true)
                    window.location.reload(false);
                } else {
                    setModalText(response.data.error)
                    setShow(true)
                }
            })
            .catch((error) => {
                alert("Something went wrong, Try Again.");
                console.log(error);
            });

    };
    const handleSave = () => {
        const schema = Joi.object({
            // keyid: Joi.string().required(),
            // billadvisorno: Joi.string().required(),
            // cashierreceiveno: Joi.string().required(),
            // cashierdate: Joi.date().required(),
            // dfrpreferno: Joi.string().required(),
            transactiontype: Joi.string().required(),
            insurercode: Joi.string().required(),
            advisorcode: Joi.string().required(),
            customerid: Joi.string().required(),
            receivefrom: Joi.string().required(),
            receivename: Joi.string().required(),
            refno: Joi.string().required(),
            receivetype: Joi.string().required(),
            PartnerBank: Joi.string().required(),
            PartnerBankbranch: Joi.string().required(),
            PartnerAccountno: Joi.string().required(),
            AmityBank: Joi.string().required(),
            AmityBankBranch: Joi.string().required(),
            AmityAccountno: Joi.string().required(),
            Amt: Joi.number().required(),
            // createdate: Joi.date().required(),
            // createtime: Joi.string().required(),
            // createusercode: Joi.string().required(),
            // updatedate: Joi.date().required(),
            // updatetime: Joi.string().required(),
            // updateusercode: Joi.string().required(),
            // canceldate: Joi.date().required(),
            // canceltime: Joi.string().required(),
            // cancelusercode: Joi.string().required(),
            // status: Joi.string().valid('I').required()
        });
        let data = {
            // keyid: Joi.string().required(),
            dfrpreferno: dfrpreferno,
            billadvisorno: billAdvisorNo,
            // cashierreceiveno: Joi.string().required(),
            // cashierdate: Joi.date().required(),
            // dfrpreferno: Joi.string().required(),
            transactiontype: transactionType,
            insurercode: Insurer,
            advisorcode: Advisor,
            customerid: Customer,
            receivefrom: receiveForm,
            receivename: receiveName,
            receivetype: receiveType,
            refno: refno,
            PartnerBank: bankPartner,
            PartnerBankbranch: bankPartner,
            PartnerAccountno: bankNoPartner,
            AmityBank: bankAmity,
            AmityBankBranch: bankBranchAmity,
            AmityAccountno: bankNo,
            Amt: amount
            // createdate: Joi.date().required(),
            // createtime: Joi.string().required(),
            // createusercode: Joi.string().required(),
            // updatedate: Joi.date().required(),
            // updatetime: Joi.string().required(),
            // updateusercode: Joi.string().required(),
            // canceldate: Joi.date().required(),
            // canceltime: Joi.string().required(),
            // cancelusercode: Joi.string().required(),
            // status: Joi.string().valid('I').required()
        }
        const { error } = schema.validate(data);
        if (error) {
            setModalText(error)
            return
        }
        axios.post(window.globalConfig.BEST_POLICY_V1_BASE_URL + "/bills/saveCasheir", data, headers)
            .then((response) => {
                console.log(response)
                if (response.status == 200) {
                    setModalText("Success")
                    setShow(true)
                    console.log("Success")
                }
            })
            .catch((error) => {
                alert("Something went wrong, Try Again.");
                console.log(error);
            });

    };
    const searchBill = (e) => {
        e.preventDefault()
        let data = JSON.stringify({
            "billadvisorno": billAdvisorNo
        });
        axios.post(window.globalConfig.BEST_POLICY_V1_BASE_URL + "/bills/findDataByBillAdvisoryNo", data, headers)
            .then((response) => {
                // console.log(response.data);
                if (response.data[0]) {
                    Insurer(response.data[0].insurerCode)
                    Advisor(response.data[0].agentCode)
                    setTransactionType("PREM-IN")
                    setInsurerReadOnly(true)
                    setAdvisoryReadOnly(true)
                    setTransactionTypeReadOnly(true)
                    setModalText("Success")
                }

            })
            .catch((error) => {
                alert("Something went wrong, Try Again.");
                console.log(error);
            });
    }

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal Heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalText}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <div className="container" style={{ paddingTop: "30px", paddingBottom: "30px" }}>
                <div className="row justify-content-center">
                    <div className="col-lg-6">
                        <form>
                            {txtype === 'premin' ?
                                <h2 className="text-center" style={{ marginBottom: "30px" }}>สร้างรายการรับเงิน PREM-IN ใหม่</h2>
                                :
                                <h2 className="text-center" style={{ marginBottom: "30px" }}>สร้างรายการรับเงิน COMM-IN ใหม่</h2>
                            }
                            {/* Bill Advisor No */}
                            {txtype === 'premin' ?
                                <div className="row mb-3">
                                    <div className="col-4">
                                        <label htmlFor="billAdvisorNo" className="form-label">Bill Advisor No</label>
                                    </div>
                                    <div className="col-7">
                                        <input type="text" required id="billAdvisorNo" value={billAdvisorNo} onChange={(e) => setBillAdvisorNo(e.target.value)} className="form-control" />
                                    </div>
                                    <div className="col-1 text-center">
                                        <button type="submit" className="btn btn-primary" onClick={onSearch}>ค้นหา</button>
                                    </div>
                                </div>
                                :

                                <div className="row mb-3">
                                    <div className="col-4">
                                        <label htmlFor="dfrpreferno" className="form-label">เลขที่ตัดจ่าย Prem Out</label>
                                    </div>
                                    <div className="col-7">
                                        <input type="text" required id="dfrpreferno" value={dfrpreferno} onChange={(e) => setDfrpreferno(e.target.value)} className="form-control" />
                                    </div>
                                    <div className="col-1 text-center">
                                        <button type="submit" className="btn btn-primary" onClick={onSearch}>ค้นหา</button>
                                    </div>
                                </div>
                            }



                            {/* Insurer */}
                            <div className="row mb-3">
                                <div className="col-4">
                                    <label htmlFor="Insurer" className="form-label">บริษัทประกัน</label>
                                </div>
                                <div className="col-7">
                                    <input type="text" id="Insurer" required value={Insurer} readOnly={insurerReadOnly}
                                        disabled={receiveFromReadOnly}
                                        style={{
                                            backgroundColor: receiveFromReadOnly ? 'grey' : 'white',
                                            color: receiveFromReadOnly ? 'white' : null
                                        }}
                                        onChange={(e) => setInsurer(e.target.value)} 
                                        className="form-control text-left" />
                                </div>
                            </div>
                            {/* Advisor */}
                            <div className="row mb-3">
                                <div className="col-4">
                                    <label htmlFor="Advisor" className="form-label">ผู้แนะนำ</label>
                                </div>
                                <div className="col-7">
                                    <input type="text" id="Advisor" required value={Advisor} readOnly={advisoryReadOnly}
                                        disabled={receiveFromReadOnly}
                                        style={{
                                            backgroundColor: receiveFromReadOnly ? 'grey' : 'white',
                                            color: receiveFromReadOnly ? 'white' : null
                                        }} onChange={(e) => setAdvisor(e.target.value)} className="form-control text-left" />
                                </div>
                            </div>

                            {/* Customer */}
                            {/* <div className="row mb-3">
                                <div className="col-4">
                                    <label htmlFor="CustomerId" className="form-label">ID ลูกค้า</label>
                                </div>
                                <div className="col-7">
                                    <input type="number" id="Customer" value={Customer} required onChange={(e) => setCustomer(e.target.value)} className="form-control" />
                                </div>
                            </div> */}

                            {/* Cashier Receipt No */}
                            {/* <div className="row mb-3">
                                <div className="col-4">
                                    <label htmlFor="cashierReceiptNo" className="form-label">Cashier Receipt No</label>
                                </div>
                                <div className="col-7">
                                    <input type="number" id="cashierReceiptNo" required value={cashierReceiptNo} onChange={(e) => setCashierReceiptNo(e.target.value)} className="form-control" />
                                </div>
                            </div> */}

                            {/* Cashier Date */}
                            <div className="row mb-3">
                                <div className="col-4">
                                    <label htmlFor="cashierDate" className="form-label">วันที่รับเงิน</label>
                                </div>
                                <div className="col-7">
                                    {/* <input type="datetime-local" id="cashierDate" required value={cashierDate} onChange={(e) => setCashierDate(e.target.value)} className="form-control" /> */}
                                    <DatePicker
                                        showIcon
                                        className="form-control col"
                                        todayButton="Vandaag"
                                        id="cashierDate"
                                        required
                                        showYearDropdown
                                        dateFormat="dd/MM/yyyy"
                                        dropdownMode="select"
                                        selected={cashierDate}
                                        onChange={(date) => setCashierDate(date)}
                                        />
                                </div>
                            </div>

                            {/* Receive Form */}
                            <div className="row mb-3">
                                <div className="col-4">
                                    <label htmlFor="receiveForm" className="form-label">รับเงิน จาก</label>
                                </div>
                                <div className="col-7">
                                    {txtype === 'premin' ?
                                        <select type="text" id="receiveForm" value={receiveForm} onChange={(e) => setReceiveForm(e.target.value)}
                                            className="form-control"
                                            disabled={receiveFromReadOnly}
                                            style={{
                                                backgroundColor: receiveFromReadOnly ? 'grey' : 'white',
                                                color: receiveFromReadOnly ? 'white' : null
                                            }}

                                        >
                                            <option value="" disabled>Select Transaction Type</option>
                                            <option value="Advisor">ผู้แนะนำ</option>

                                            <option value="Customer">ผู้เอาประกัน</option>
                                        </select>
                                        :
                                        <select type="text" id="receiveForm" value={receiveForm} onChange={(e) => setReceiveForm(e.target.value)}
                                            className="form-control" disabled

                                            style={{ backgroundColor: 'grey', color: 'white' }}

                                        >
                                            <option value="" disabled>Select Transaction Type</option>

                                            <option value="Insurer">บริษัทประกัน</option>

                                        </select>}
                                </div>
                            </div>

                            {/* Receive Name */}
                            <div className="row mb-3">
                                <div className="col-4">
                                    <label htmlFor="receiveName" className="form-label">ชื่อผู้จ่าย</label>
                                </div>
                                <div className="col-7">
                                    <input type="text" id="receiveName" value={receiveName} required
                                        disabled={receiveFromReadOnly}
                                        style={{
                                            backgroundColor: receiveFromReadOnly ? 'grey' : 'white',
                                            color: receiveFromReadOnly ? 'white' : null
                                        }}
                                        onChange={(e) => setReceiveName(e.target.value)} className="form-control text-left" />
                                </div>
                            </div>
                            {/* Receive Type */}
                            <div className="row mb-3">
                                <div className="col-4">
                                    <label htmlFor="receiveType" className="form-label">รูปแบบการชำระ</label>
                                </div>
                                <div className="col-7">
                                    <select id="receiveType" value={receiveType} onChange={(e) => setReceiveType(e.target.value)} className="form-control">
                                        <option value="" disabled>Select Transaction Type</option>
                                        <option value="Bank-Transfer">เงินโอน</option>
                                        <option value="Cheque">เช็ค</option>
                                        <option value="Cash">เงินสด</option>
                                        <option value="Draft">draft</option>
                                        <option value="ETC">อื่นๆ</option>
                                    </select>
                                </div>
                            </div>

                            {/* Transaction Type */}
                            <div className="row mb-3">
                                <div className="col-4">
                                    <label htmlFor="transactionType" className="form-label">ประเภทธุรกรรม</label>
                                </div>
                                <div className="col-7">
                                    <select
                                        id="transactionType"
                                        value={transactionType}
                                        onChange={(e) => setTransactionType(e.target.value)}
                                        className="form-control"
                                        disabled
                                        style={{ backgroundColor: 'grey', color: 'white' }}
                                    >
                                        <option value="" disabled>Select Transaction Type</option>
                                        <option value="PREM-IN">PREM-IN</option>
                                        <option value="PREM-OUT">PREM-OUT</option>
                                        <option value="COMM-OUT">COMM-OUT</option>
                                        <option value="COMM-IN">COMM-IN</option>
                                    </select>
                                </div>
                            </div>

                            {receiveType === 'Bank-Transfer' || receiveType === 'Cheque' ?
                                <>

                                    {/* Ref no  */}
                                    <div className="row mb-3">
                                        <div className="col-4">
                                            <label htmlFor="refno" className="form-label">เลขที่อ้างอิง</label>
                                        </div>
                                        <div className="col-7">
                                            <input type="text" id="refno" required value={refno} onChange={(e) => setRefno(e.target.value)} className="form-control" />
                                        </div>
                                    </div>


                                    {/* Bank Partner */}
                                    <div className="row mb-3">
                                        <div className="col-4">
                                            <label htmlFor="bankPartner" className="form-label">จากธนาคาร</label>
                                        </div>
                                        <div className="col-7">
                                            <select
                                                id="bankPartner"
                                                value={bankPartner}
                                                onChange={(e) => {
                                                    setBankPartner(e.target.value)
                                                }
                                                }
                                                className="form-control"
                                            >
                                                <option value="" disabled>Select Partner Bank</option>
                                                {

                                                    bankPartnerBrandData.map((bank, index) => (
                                                        <option key={index} value={bank.bankBrand}>
                                                            {`${bank.bankBrand} `}
                                                        </option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                    </div>

                                    {/* Bank Branch Partner */}
                                    <div className="row mb-3">
                                        <div className="col-4">
                                            <label htmlFor="bankBranchPartner" className="form-label">สาขา</label>
                                        </div>
                                        <div className="col-7">
                                            <select
                                                id="bankBranchPartner"
                                                value={bankBranchPartner}
                                                onChange={(e) => {
                                                    setBankBranchPartner(e.target.value)
                                                }
                                                }
                                                className="form-control"
                                            >
                                                <option value="" disabled>Select Partner Bank Branch</option>
                                                {
                                                    bankPartnerBranchData.map((bank, index) => (
                                                        <option key={index} value={bank.bankBranch}>
                                                            {`${bank.bankBranch} `}
                                                        </option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                    </div>

                                    {/* Bank No Partner */}
                                    <div className="row mb-3">
                                        <div className="col-4">
                                            <label htmlFor="bankNoPartner" className="form-label">เลขที่บัญชี</label>
                                        </div>
                                        <div className="col-7">
                                            <select
                                                id="bankNoPartner"
                                                value={bankNoPartner}
                                                onChange={(e) => {
                                                    setBankNoPartner(e.target.value)
                                                }
                                                }
                                                className="form-control"
                                            >
                                                <option value="" disabled>Select Partner Bank No</option>
                                                {
                                                    bankPartnerBranchData.map((bank, index) => (
                                                        <option key={index} value={bank.bankNo}>
                                                            {`${bank.bankNo} `}
                                                        </option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                    </div>

                                    {/* Bank Amity */}
                                    <div className="row mb-3">
                                        <div className="col-4">
                                            <label htmlFor="bankAmity" className="form-label">ธนาคาร (Amity)</label>
                                        </div>
                                        <div className="col-7">
                                            <select
                                                id="bankAmity"
                                                value={bankAmity}
                                                onChange={(e) => {
                                                    setBankAmity(e.target.value)
                                                }
                                                }
                                                className="form-control"
                                            >
                                                <option value="" disabled>Select Amity Bank</option>
                                                {

                                                    bankAmityBrandData.map((bank, index) => (
                                                        <option key={index} value={bank.bankBrand}>
                                                            {`${bank.bankBrand} `}
                                                        </option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                    </div>

                                    {/* Bank Branch Amity */}
                                    <div className="row mb-3">
                                        <div className="col-4">
                                            <label htmlFor="bankBranchAmity" className="form-label">สาขา (Amity)</label>
                                        </div>
                                        <div className="col-7">
                                            <select
                                                id="bankBranchAmity"
                                                value={bankBranchAmity}
                                                onChange={(e) => {
                                                    setBankBranchAmity(e.target.value)
                                                }
                                                }
                                                className="form-control"
                                            >
                                                <option value="" disabled>Select Amity Bank Branch</option>
                                                {
                                                    bankAmityBranchData.map((bank, index) => (
                                                        <option key={index} value={bank.bankBranch}>
                                                            {`${bank.bankBranch} `}
                                                        </option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                    </div>

                                    {/* Bank No */}
                                    <div className="row mb-3">
                                        <div className="col-4">
                                            <label htmlFor="bankNo" className="form-label">เลขที่บัญชี (Amity)</label>
                                        </div>
                                        <div className="col-7">
                                            <select
                                                id="bankAmityNo"
                                                value={bankNo}
                                                onChange={(e) => {
                                                    setBankNo(e.target.value)
                                                }
                                                }
                                                className="form-control"
                                            >
                                                <option value="" disabled>Select Amity Bank No</option>
                                                {
                                                    bankAmityNoData.map((bank, index) => (
                                                        <option key={index} value={bank.bankNo}>
                                                            {`${bank.bankNo} `}
                                                        </option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                    </div>
                                </>
                                : null}
                            {/* Amount */}
                            <div className="row mb-3">
                                <div className="col-4">
                                    <label htmlFor="amount" className="form-label">จำนวนเงิน</label>
                                </div>
                                <div className="col-7">
                                    <input type="text" id="amount" required 
                                    value={amount.toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0}
                                        disabled={receiveFromReadOnly}
                                        style={{
                                            backgroundColor: receiveFromReadOnly ? 'grey' : 'white',
                                            color: receiveFromReadOnly ? 'white' : null
                                        }}
                                        onChange={(e) => setAmount(e.target.value)} className="form-control" />
                                </div>
                            </div>

                        </form>


                        <div className="row" style={{ marginTop: '20px' }}>
                            {/* <div className="col-12 text-center">
                                <button type="submit" className="btn btn-primary btn-lg" onClick={handleSave}>Save</button>
                            </div> */}
                        </div>
                        <div className="row" style={{ marginTop: '20px' }}>
                            <div className="col-12 text-center">
                                <button type="submit" className="btn btn-primary btn-lg" onClick={handleSubmit}>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default CreateCashierReceive;
