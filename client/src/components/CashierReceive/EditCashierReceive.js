import React, {useEffect, useRef, useState} from "react";
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
import {Button, Form} from "react-bootstrap";
import { useCookies } from "react-cookie";

const config = require("../../config.json");

const NormalText = {
    color: "white",
    paddingBottom: "10px",
};
/* eslint-disable react-hooks/exhaustive-deps */

const EditCashierReceive = (props) => {
    const [cookies] = useCookies(["jwt"]);
    const headers = {
    headers: { 'Content-Type': 'application/json',
                'Authorization': `Bearer ${cookies["jwt"]}` }
};
    const url = window.globalConfig.BEST_POLICY_V1_BASE_URL;
    const navigate = useNavigate();
    const searchButtonRef = useRef(null);



    const [tableData, setTableData] = useState([])
    const [billAdvisorNo, setBillAdvisorNo] = useState("")
    const [insurercode, setInsurercode] = useState("");
    const [advisorcode, setAdvisorcode] = useState("")
    const [refno, setRefno] = useState("");
    const [cashierReceiptNo, setCashierReceiptNo] = useState("");
    const [transactionType, setTransactionType] = useState({});
    const [checkboxValue, setCheckboxValue] = useState();
    const [createUserCode, setCreateUserCode] = useState();
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [dfrpreferno, setDfrpreferno] = useState();
    

    const [Insurer, setInsurer] = useState("");
    const [Advisor, setAdvisor] = useState("")
    const [Customer, setCustomer] = useState("");
    const [cashierDate, setCashierDate] = useState("");
    const [receiveForm, setReceiveForm] = useState("Advisor");
    const [receiveName, setReceiveName] = useState("");
    const [receiveType, setReceiveType] = useState("เงินโอน");
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

    //select cashier
    const [selectId, setSelectId] = useState("123");
    
    
    const onSearch = (e) =>{
        e.preventDefault()
        console.log(billAdvisorNo)

        let data = JSON.stringify({
            "billadvisorno": billAdvisorNo
        });
        axios.post(window.globalConfig.BEST_POLICY_V1_BASE_URL+"/bills/findDataByBillAdvisoryNo",data, headers)
            .then((response) => {
                // console.log(response);
                setInsurer(response.data[0].insurerCode)
                setInsurerReadOnly(true)
                setAdvisoryReadOnly(true)
                setAdvisor(response.data[0].agentCode)
                setTransactionTypeReadOnly(true)
                setReceiveFromReadOnly(true)
                setReceiveForm("Advisor")


            })

            .catch((error) => {
                alert("Something went wrong, Try Again.");
                console.log(error);
            });

    }

    useEffect(() => {
        let data={}
        axios.get(window.globalConfig.BEST_POLICY_V1_BASE_URL+"/static/bank/BankAmityBrand", headers)
            .then((response) => {
                console.log(response.data);
                setBankAmityBrandData(response.data)
                setBankAmity(response.data[0].bankBrand)

            })

            .catch((error) => {
                alert("Something went wrong, Try Again.");
                console.log(error);
            });

        axios.get(window.globalConfig.BEST_POLICY_V1_BASE_URL+"/static/bank/BankPartnerBrand?"+"type=I", headers)
            .then((response) => {
                console.log(response.data);
                setBankPartnerBrandData(response.data)
                setBankPartner(response.data[0].bankBrand)

            })

            .catch((error) => {
                alert("Something went wrong, Try Again.");
                console.log(error);
            });
    }, []);


    useEffect(() => {
        let data={}
        if (bankAmity!="")
            axios.get(window.globalConfig.BEST_POLICY_V1_BASE_URL+"/static/bank/BankAmityBranch?brand="+bankAmity,data, headers)
                .then((response) => {
                    console.log(response.data);
                    setBankAmityBranchData(response.data)

                })

                .catch((error) => {
                    alert("Something went wrong, Try Again.");
                    console.log(error);
                });


    }, [bankAmity]);
    useEffect(() => {
        let data={}
        console.log(bankBranchAmity)
        if (bankBranchAmity!="")
            axios.get(window.globalConfig.BEST_POLICY_V1_BASE_URL+"/static/bank/BankAmityBranch?branch="+bankBranchAmity+"&brand="+bankAmity, headers)
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
        let data={}
        if (bankPartner!="")
            axios.get(window.globalConfig.BEST_POLICY_V1_BASE_URL+"/static/bank/BankPartnerBranch?brand="+bankPartner+"&type=I", headers)
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
        let data={}
        console.log(bankBranchAmity)
        if (bankBranchPartner!="")
            axios.get(window.globalConfig.BEST_POLICY_V1_BASE_URL+"/static/bank/BankAmityBranch?branch="+bankBranchPartner+"&brand="+bankPartner+"&type=I", headers)
                .then((response) => {
                    // console.log(response.data);
                    setBankPartnerNoData(response.data)

                })

                .catch((error) => {
                    alert("Something went wrong, Try Again.");
                    console.log(error);
                });


    }, [bankBranchPartner]);

    
    const handleSubmit = () => {
        let data={
            id:selectData.id,
            // keyid: Joi.string().required(),
            billadvisorno: billAdvisorNo,
            cashierreceiveno: cashierReceiptNo,
            cashierdate: cashierDate,
            // dfrpreferno: Joi.string().required(),
            transactiontype: transactionType,
            insurercode: insurercode,
            advisorcode: advisorcode,
            customerid: Customer,
            receivefrom: receiveForm,
            receivename: receiveName,
            receivetype: receiveType,
            PartnerBank: bankPartner,
            PartnerBankbranch: bankPartner,
            PartnerAccountno: bankNoPartner,
            AmityBank: bankAmity,
            AmityBankBranch: bankBranchAmity,
            AmityAccountno: bankNo,
            Amt: amount,
        }
        axios.post(window.globalConfig.BEST_POLICY_V1_BASE_URL+"/bills/editsubmitCasheir",data, headers)
            .then((response) => {

                if (response.status==200) {
                    console.log("Success")
                    setModalText("Success")
                    // if (searchButtonRef.current) {
                    //     searchButtonRef.current.click();
                    // }
                    // setTableData([])
                    window.location.reload()
                    setShowSuccess(true)
                    
                }else{
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
        let data={
            id:selectData.id,
            // keyid: Joi.string().required(),
            billadvisorno: billAdvisorNo,
            // cashierreceiveno: Joi.string().required(),
            // cashierdate: Joi.date().required(),
            // dfrpreferno: Joi.string().required(),
            transactiontype: transactionType,
            insurercode: insurercode,
            advisorcode: advisorcode,
            customerid: Customer,
            receivefrom: receiveForm,
            receivename: receiveName,
            receivetype: receiveType,
            PartnerBank: bankPartner,
            PartnerBankbranch: bankPartner,
            PartnerAccountno: bankNoPartner,
            AmityBank: bankAmity,
            AmityBankBranch: bankBranchAmity,
            AmityAccountno: bankNo,
            Amt: amount
        }
        axios.post(window.globalConfig.BEST_POLICY_V1_BASE_URL+"/bills/editsaveCasheir",data, headers)
            .then((response) => {
                console.log(response)
                if (response.status==200) {
                    setModalText("Success")
                    // setTableData([])
                    window.location.reload()
                    setShowSuccess(true)
                    // if (searchButtonRef.current) {
                    //     searchButtonRef.current.click();
                    // }
                    console.log("Success")
                }
            })
            .catch((error) => {
                alert("Something went wrong, Try Again.");
                console.log(error);
            });

    };


    const searchBill = (e) =>{
        e.preventDefault()
        let data = JSON.stringify({
            "billadvisorno": billAdvisorNo
        });
        axios.post(window.globalConfig.BEST_POLICY_V1_BASE_URL+"/bills/findDataByBillAdvisoryNo",data, headers)
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
        axios.post(window.globalConfig.BEST_POLICY_V1_BASE_URL+"/bills/findbill",data, headers)
            .then((response) => {
                // console.log(response.data);
                setTableData(response.data)
            })
            .catch((error) => {
                alert("Something went wrong, Try Again.");
                console.log(error);
            });
    }

    const [selectData, setSelectData] = useState({});
    const click=(rowData)=>{
        setShow(true)
        setSelectId(rowData.billadvisorno)
        setSelectData(rowData);
        
    }
    useEffect(() => {
        if (selectData) {
            setBillAdvisorNo(selectData.billadvisorno || "");
            if(selectData.insurercode)
            setInsurercode(selectData.insurercode || "");
            if (selectData.advisorcode)
            setAdvisorcode(selectData.advisorcode || "");
            setRefno(selectData.dfrprederno || "");
            setCashierReceiptNo(selectData.cashierreceiveno || "");
            if (selectData.transactiontype)
            setTransactionType(selectData.transactiontype || {});
            setCreateUserCode(selectData.createusercode || "");
            setDfrpreferno(selectData.dfrprederno || "");

            // Set the rest of the state variables based on the keys in selectData
            setInsurer(selectData.insurer || "");
            setAdvisor(selectData.advisor || "");
            setCustomer(selectData.customerid || "");
            setCashierDate(selectData.cashierdate || "");
            setReceiveForm(selectData.receivefrom || "Advisor");
            setReceiveName(selectData.receivename || "");
            setReceiveType(selectData.receivetype || "เงินโอน");
            setBankPartner(selectData.partnerBank || "");
            setBankBranchPartner(selectData.partnerBankbranch || "");
            setBankNoPartner(selectData.partnerAccountno || "");
            setBankAmity(selectData.amityBank || "");
            setBankBranchAmity(selectData.amityBankbranch || "");
            setBankNo(selectData.amityAccountno || "");
            setAmount(selectData.amt || "");
        }
    }, [selectData]);
    const [showSuccess, setShowSuccess] = useState(false);

    return (
        <>
            <Modal show={showSuccess} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal Heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalText}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={()=>{
                        handleClose()
                        setShowSuccess(false)
                    }}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={show} onHide={handleClose} size={"xl"}>
                <Modal.Header closeButton>
                    <Modal.Title>Bill Advisory Number {selectId}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <h2 className="text-center" style={{marginBottom:"30px"}}>สร้างรายการ Cashier ใหม่</h2>

                        {/* Bill Advisor No */}
                        <div className="row mb-3">
                            <div className="col-4">
                                <label htmlFor="billAdvisorNo" className="form-label">Bill Advisor No</label>
                            </div>
                            <div className="col-7">
                                <input type="text" id="billAdvisorNo" required value={billAdvisorNo} onChange={(e) => setBillAdvisorNo(e.target.value)} className="form-control"/>
                            </div>
                            <div className="col-1 text-center" style={{paddingRight:"20px"}}>
                                <button type="submit" ref={searchButtonRef} className="btn btn-primary" id={"click"} onClick={onSearch}>Search</button>
                            </div>
                        </div>

                        {/* Insurer */}
                        <div className="row mb-3">
                            <div className="col-4">
                                <label htmlFor="Insurer" className="form-label">Insurer</label>
                            </div>
                            <div className="col-7">
                                <input type="text" id="Insurer" required value={insurercode} readOnly={insurerReadOnly} onChange={(e) => setInsurer(e.target.value)} className="form-control"/>
                            </div>
                        </div>
                        {/* Advisor */}
                        <div className="row mb-3">
                            <div className="col-4">
                                <label htmlFor="Advisor" className="form-label">Advisor</label>
                            </div>
                            <div className="col-7">
                                <input type="text" id="Advisor" required value={advisorcode} readOnly={advisoryReadOnly} onChange={(e) => setAdvisor(e.target.value)} className="form-control"/>
                            </div>
                        </div>

                        {/* Customer */}
                        <div className="row mb-3">
                            <div className="col-4">
                                <label htmlFor="Customer" className="form-label">Customer</label>
                            </div>
                            <div className="col-7">
                                <input type="text" id="Customer" required value={Customer} onChange={(e) => setCustomer(e.target.value)} className="form-control"/>
                            </div>
                        </div>

                        {/* Cashier Receipt No */}
                        <div className="row mb-3">
                            <div className="col-4">
                                <label htmlFor="cashierReceiptNo" className="form-label">Cashier Receipt No</label>
                            </div>
                            <div className="col-7">
                                <input type="text" id="cashierReceiptNo" required value={cashierReceiptNo} onChange={(e) => setCashierReceiptNo(e.target.value)} className="form-control"/>
                            </div>
                        </div>

                        {/* Cashier Date */}
                        <div className="row mb-3">
                            <div className="col-4">
                                <label htmlFor="cashierDate" className="form-label">Cashier Date</label>
                            </div>
                            <div className="col-7">
                                <input type="datetime-local" id="cashierDate" required value={cashierDate} onChange={(e) => setCashierDate(e.target.value)} className="form-control"/>
                            </div>
                        </div>

                        {/* Receive Form */}
                        <div className="row mb-3">
                            <div className="col-4">
                                <label htmlFor="receiveForm" className="form-label">Receive Form</label>
                            </div>
                            <div className="col-7">
                                <select type="text" id="receiveForm" value={receiveForm} onChange={(e) => setReceiveForm(e.target.value)}
                                        className="form-control"
                                        disabled={receiveFromReadOnly}
                                        style={{ backgroundColor: receiveFromReadOnly ? 'grey' : 'white' }}
                                >
                                    <option value="" disabled>Select Transaction Type</option>
                                    <option value="PREM-IN">Advisor</option>
                                    <option value="PREM-OUT">Insurer</option>
                                    <option value="COMM-OUT">Customer</option>
                                </select>
                            </div>
                        </div>

                        {/* Receive Name */}
                        <div className="row mb-3">
                            <div className="col-4">
                                <label htmlFor="receiveName" className="form-label">Receive Name</label>
                            </div>
                            <div className="col-7">
                                <input type="text" id="receiveName" required value={receiveName} onChange={(e) => setReceiveName(e.target.value)} className="form-control"/>
                            </div>
                        </div>
                        {/* Receive Type */}
                        <div className="row mb-3">
                            <div className="col-4">
                                <label htmlFor="receiveType" className="form-label">Receive Type</label>
                            </div>
                            <div className="col-7">
                                <select  id="receiveType" value={receiveType} onChange={(e) => setReceiveType(e.target.value)} className="form-control">
                                    <option value="" disabled>Select Transaction Type</option>
                                    <option value="PREM-IN">เงินโอน</option>
                                    <option value="PREM-OUT">เช็ค</option>
                                    <option value="COMM-OUT">เงินสด</option>
                                    <option value="COMM-IN">draft</option>
                                    <option value="COMM-IN">อื่นๆ</option>
                                </select>
                            </div>
                        </div>

                        {/* Transaction Type */}
                        <div className="row mb-3">
                            <div className="col-4">
                                <label htmlFor="transactionType" className="form-label">Transaction Type</label>
                            </div>
                            <div className="col-7">
                                <select
                                    id="transactionType"
                                    value={transactionType}
                                    onChange={(e) => setTransactionType(e.target.value)}
                                    className="form-control"
                                    disabled={transactionTypeReadOnly}
                                    style={{ backgroundColor: transactionTypeReadOnly ? 'grey' : 'white' }}
                                >
                                    <option value="" disabled>Select Transaction Type</option>
                                    <option value="PREM-IN">PREM-IN</option>
                                    <option value="PREM-OUT">PREM-OUT</option>
                                    <option value="COMM-OUT">COMM-OUT</option>
                                    <option value="COMM-IN">COMM-IN</option>
                                </select>
                            </div>
                        </div>


                        {/* Bank Partner */}
                        <div className="row mb-3">
                            <div className="col-4">
                                <label htmlFor="bankPartner" className="form-label">Bank Partner</label>
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
                                <label htmlFor="bankBranchPartner" className="form-label">Bank Branch Partner</label>
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
                                <label htmlFor="bankNoPartner" className="form-label">Bank No Partner</label>
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
                                <label htmlFor="bankAmity" className="form-label">Bank Amity</label>
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
                                <label htmlFor="bankBranchAmity" className="form-label">Bank Branch Amity</label>
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
                                <label htmlFor="bankNo" className="form-label">Bank No</label>
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

                        {/* Amount */}
                        <div className="row mb-3">
                            <div className="col-4">
                                <label htmlFor="amount" className="form-label">Amount</label>
                            </div>
                            <div className="col-7">
                                <input type="text" id="amount" required value={amount} onChange={(e) => setAmount(e.target.value)} className="form-control"/>
                            </div>
                        </div>

                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <div className="row" style={{ marginTop: '20px' }}>
                        <div className="col-12 text-center">
                            <button type="submit" className="btn btn-primary btn-lg" onClick={handleSubmit}>Submit</button>
                        </div>
                    </div>

                    <div className="row" style={{ marginTop: '20px' }}>
                        <div className="col-12 text-center">
                            <button type="submit" className="btn btn-primary btn-lg" onClick={handleSave}>Save</button>
                        </div>
                    </div>

                    <div className="row" style={{ marginTop: '20px' }}>
                        <div className="col-12 text-center">
                            <button type="submit" className="btn btn-primary btn-lg" onClick={handleClose}>Close</button>
                        </div>
                    </div>

                </Modal.Footer>
            </Modal>
        <div className="container" style={{paddingTop:"30px",paddingBottom:"30px"}}>
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    <form>
                        <h2 className="text-center" style={{marginBottom:"30px"}}>แก้ไข ใบรับเงิน</h2>

                        {/* Bill advisorcode No */}
                        <div className="row mb-3">
                            <div className="col-3">
                                <label htmlFor="billAdvisorNo" className="form-label">เลขที่ใบวางบิล</label>
                            </div>
                            <div className="col-7">
                                <input type="text" id="billAdvisorNo" value={billAdvisorNo} onChange={(e) => setBillAdvisorNo(e.target.value)} className="form-control"/>
                            </div>
                            <div className="col-1 text-center">
                                <button type="submit" className="btn btn-primary" onClick={searchBill}>ค้นหา</button>
                            </div>
                        </div>

                        {/* Cashier Receipt No */}
                        <div className="row mb-3">
                            <div className="col-3">
                                <label htmlFor="cashierReceiptNo" className="form-label">เลขที่ใบรับเงิน</label>
                            </div>
                            <div className="col-7">
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
                            <div className="col-7">
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
                            <div className="col-7">
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
                                <label htmlFor="Date Select" className="form-label">วันที่สร้าง</label>
                            </div>
                            <div className="col-4">
                                <label htmlFor="fromDate">จาก วันที่&nbsp;</label>
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
                            <div className="col-4">
                                <label htmlFor="toDate">ถึง วันที่&nbsp;</label>
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
                            <div className="col-7">
                                <input type="text" id="create user code" value={createUserCode} onChange={(e) => setCreateUserCode(e.target.value)} className="form-control"/>
                            </div>
                        </div>
                        {/* refno */}
                        <div className="row mb-3">
                            <div className="col-3">
                                <label htmlFor="Customer" className="form-label">ชื่อผู้แนะนำ</label>
                            </div>
                            <div className="col-7">
                                <input type="text" id="Customer" value={refno} onChange={(e) => setRefno(e.target.value)} className="form-control"/>
                            </div>
                        </div>



                        {/* Transaction Type */}
                        <div className="row mb-3">
                            <div className="col-3">
                                <label htmlFor="transactionType" className="form-label">ประเภทธุรกรรม</label>
                            </div>
                            <div className="col-7">
                                <select
                                    id="transactionType"
                                    value={transactionType}
                                    onChange={(e) => setTransactionType(e.target.value)}
                                    className="form-control"
                                    disabled={transactionTypeReadOnly}
                                    style={{ backgroundColor: transactionTypeReadOnly ? 'grey' : 'white' }}
                                >
                                    <option value="" disabled>เลือกประเภทธุรกรรม</option>
                                    <option value="PREM-IN">PREM-IN</option>
                                    <option value="PREM-OUT">PREM-OUT</option>
                                    <option value="COMM-OUT">COMM-OUT</option>
                                    <option value="COMM-IN">COMM-IN</option>
                                </select>
                            </div>
                        </div>
                        {/* dfrpreferno */}
                        <div className="row mb-3">
                            <div className="col-3">
                                <label htmlFor="Customer" className="form-label">เลขที่ตัดหนี้</label>
                            </div>
                            <div className="col-7">
                                <input type="text" id="dfrpreferno" value={dfrpreferno} onChange={(e) => setDfrpreferno(e.target.value)} className="form-control"/>
                            </div>
                        </div>

                        <div className="row" style={{ marginTop: '20px' }}>
                            <div className="col-12 text-center">
                                <button type="submit" className="btn btn-primary btn-lg" onClick={searchdata} >ค้นหา</button>
                            </div>
                        </div>


                    </form>
                </div>
                <div className="col-lg-12">
                    <div style={{ overflowY: 'auto', overflowX: 'auto', height: '400px' , marginTop:"50px" }}>
                        {tableData.length!=0?<table className="table table-striped table-bordered">
                                <thead className="sticky-header">
                                <tr>
                                    <th>ปุ่มแก้ไข</th>
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
                                        <td>{row.status=="I"?<button onClick={()=>click(row)}>แก้ไข</button>:<></>}</td>
                                        <td>{row.billadvisorno}</td>
                                        <td>{row.dfrprederno ? row.dfrprederno : 'N/A'}</td>
                                        <td>{row.insurercode}</td>
                                        <td>{row.advisorcode}</td>
                                        <td>{row.cashierreceiveno ? row.cashierreceiveno : 'N/A'}</td>
                                        <td>{row.cashierdate ? row.cashierdate : 'N/A'}</td>
                                        {/*<td>{row.ARNO ? row.ARNO : 'N/A'}</td>*/}
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
            </>
    );
};

export default EditCashierReceive;
