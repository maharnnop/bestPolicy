import React, { useEffect, useState }  from "react";
import PremInTable from "../PremIn/PremInTable";
import axios from "axios";
import Modal from 'react-bootstrap/Modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useCookies } from "react-cookie";

const config = require("../../config.json");

export default function CommOutCreate() {
  const [cookies] = useCookies(["jwt"]);
  const headers = {
  headers: { Authorization: `Bearer ${cookies["jwt"]}` }
};
  const url = window.globalConfig.BEST_POLICY_V1_BASE_URL;
  const wht = config.wht;
  const [filterData, setFilterData] = useState(
    {
       
        // "effDatestart" : '1990-01-01',
        // "effDateend" : '2100-01-01',
        "insurerCode": null,
        "agentCode": null,
        "policyNostart" : null,
        "policyNoend" : null,
        "dueDate" : null,

    })
    const [policiesData, setPoliciesData] = useState([])
    const [hidecard, setHidecard] = useState([false, 0]);
  const colsData = [
    "select",
    "insurerCode",
    "advisorCode",
    "Duedate",
    "Policyno",
    "Endorseno",
    "Invoiceno",
    "seqno",
    "customerid",
    "insuredname",
    "licenseno",
    "province",
    "chassisno",
    "grossprem",
    "duty",
    "tax",
    "totalamt",
    "comm-out%",
    "comm-out-amt",
    "ov-out%",
    "ov-out-amt",
    "[] net",
    "billpremium",
  ];
  const cols2Data = {
    select : "เลือก",
    insurerCode:"รหัสบริษัทประกัน",
    agentCode:"รหัสผู้แนะนำ",
    dueDate:"Duedate",
    policyNo:"เลขกรมธรรม์",
    endorseNo: "เลขสลักหลัง",
    invoiceNo: "เลขใบแจ้งหนี้",
    seqNo: "งวด",
    customerid: "ID",
    insureename:  "ชื่อ ผู้เอาประกัน",
    licenseNo: "เลขทะเบียนรถ",
    // province: "province", // nodata
    chassisNo: "เลขคัชซี",
    netgrossprem: "เบี้ยประกัน",
    duty: "อากร",
    tax: "ภาษี",
    withheld: "WHT 1%",
    totalprem: "เบี้ยประกันรวม",
    commout_rate: "Comm Out %",
    commout_amt: "จำนวน",
    // commout_taxamt: "vat-comm-out",
    // commout_total: "comm-out-total",
    ovout_rate: "Ov Out %",
    ovout_amt: "จำนวน",
    // ovout_taxamt: "vat-ov-out",
    // ovout_total: "ov-out-total",
    'premin-rprefdate': "วันที่รับ Prem In",
    'premin-dfrpreferno': "เลขตัดหนี้ Prem In",

};
  const handleClose = (e) => {
      setHidecard([false, 0])
  }
   const editCard = (e) => {
    console.log(policiesData);
        setHidecard([true, 1])
      
        let commout_amt = 0
       
        let ovout_amt = 0
       
        let paymentamt = 0
        for (let i = 0; i < policiesData.length; i++) {
            if (policiesData[i].select) {
              commout_amt = commout_amt + policiesData[i].commout_amt
              ovout_amt = ovout_amt + policiesData[i].ovout_amt
            }
            }
            filterData.commout = commout_amt
            filterData.ovout = ovout_amt
            filterData.whtcommout = parseFloat((commout_amt* wht).toFixed(2))
            filterData.whtovout = parseFloat((ovout_amt* wht).toFixed(2))
            filterData.actualvalue = (filterData.commout + filterData.ovout - filterData.whtcommout - filterData.whtovout).toFixed(2)
            
        

        // const total = {
        //     no: net.no + gross.no,
        //     prem: net.prem + gross.prem,
        //     comm_out: net.comm_out,
        //     whtcom: net.whtcom,
        //     ov_out: net.ov_out,
        //     whtov: net.whtov,
        //     billprem: net.prem + gross.prem - net.comm_out + net.whtcom - net.ov_out + net.whtov
        // }
        // setPoliciesRender({ net: net, gross: gross, total: total })
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
};
  const submitFilter = (e) => {
    e.preventDefault();
    console.log(filterData);
    axios
        .post(url + "/araps/getapcommout", filterData, headers)
        .then((res) => {
            if (res.status === 201) {
                console.log(res.data);
                alert("not found policy")

            } else {


                // const array = []
                // for (let i = 0; i < res.data.length; i++) {
                //     // console.log(statementtypeData[i].statementtype == null? res.data[i].totalprem -res.data[i].commout_amt-res.data[i].ovout_amt: res.data[i].totalprem);
                //     array.push(res.data[i].totalprem)

                // }
                // console.log(array);
                console.log(res.data);
                setPoliciesData(res.data)
                
                alert("find trans premout success")
            }
        })
        .catch((err) => {
          alert("Something went wrong, Try Again.");
            // alert("create snew insuree fail");

        });
};


const saveapcommout = async (e) => {
  console.log({master :  filterData, trans : policiesData});
  await axios.post(url + "/araps/saveapcommout", {master : filterData, trans : policiesData}, headers).then((res) => {
    alert("save account recive successed!!!")
    .catch((err)=>{ alert("Something went wrong, Try Again.");});
    // window.location.reload(false);
  });
};

const submitapcommout = async (e) => {
  console.log({master :  filterData, trans : policiesData});
  await axios.post(url + "/araps/submitapcommout", {master :filterData, trans : policiesData}, headers).then((res) => {
    alert(res.data.msg)
    
    window.location.reload(false);
  }).catch((err)=>{ alert("Something went wrong, Try Again.");});
};

  return (
    <div className="container d-fle justify-content-center ">
      <form onSubmit={(e)=>submitFilter(e)}>
        <h1>จ่ายเงินค่า Comm/Ov Out ให้กับผู้แนะนำ</h1>
       
       
        {/* insurerCode  */}
        <div className="row my-3"><div class="col-1"></div>
          <label class="col-sm-2 col-form-label" htmlFor="insurerCode">
            รหัสบริษัทประกัน
          </label>
          <div className="col-3 ">
            <input
              className="form-control"
              type="text"
              
              name="insurerCode"
              id="insurerCode"
              value={filterData.insurerCode}
              onChange={handleChange}
            />
          </div>
        </div>
       {/* advisorCode  */}
       <div className="row my-3"><div class="col-1"></div>
          <label class="col-sm-2 col-form-label" htmlFor="agentCode">
            รหัสผู้แนะนำ<span className="text-danger"> *</span>
          </label>
          <div className="col-3 ">
            <input
            required
              className="form-control"
              type="text"
              name="agentCode"
              id="agentCode"
              value={filterData.agentCode}
              onChange={handleChange}
            />
          </div>
        </div>
          {/* PolicyNo*/}
        <div className="row my-3"><div class="col-1"></div>
          <label class="col-sm-2 col-form-label" htmlFor="policyNo">
            เลขที่กรมธรรม์ จาก
          </label>
          <div className="col-3 " id="policyNo">
            <input
              className="form-control"
              type="text"
              name="policyNostart"
              id="policyNostart"
              onChange={handleChange}
            />
          </div>
          <label class="col-sm-1 col-form-label" htmlFor="policyNo">
          ถึง
          </label>
          <div className="col-3 ">
           
            <input
              className="form-control"
              type="text"
              name="policyNoend"
              id="policyNoend"
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Effectivedate*/}
        {/* <div className="row my-3"><div class="col-1"></div>
          <label class="col-sm-2 col-form-label" htmlFor="effDate">
           วันที่ คุ้มครอง จาก
          </label>
          <div className="col-3 " id="effDate">
            
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
                            id="effDatestart"
                            selected={filterData.effDatestart}
                            onChange={(date) => handleChangeDate(date,'effDatestart')}
                                 />
          </div>
          <label class="col-sm-1 col-form-label" htmlFor="effDate">
          ถึง
          </label>
          <div className="col-3 ">
         
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
                            id="effDateend"
                            selected={filterData.effDateend}
                            onChange={(date) => handleChangeDate(date,'effDateend')}
                                 />
          </div>
        </div> */}
         {/* duedate  */}
        <div className="row my-3"><div class="col-1"></div>
          <label class="col-sm-2 col-form-label" htmlFor="cashierreceiveno">
            Due Date
          </label>
          <div className="col-3 ">
            {/* <input
              className="form-control"
              type="date"
              name="dueDate"
              id="dueDate"
              onChange={handleChange}
              /> */}
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
                            id="dueDate"
                            selected={filterData.dueDate}
                            onChange={(date) => handleChangeDate(date,'dueDate')}
                                 />
          </div>
        </div>
       
        
        <div className="d-flex justify-content-center">
          <input type="submit" className="btn btn-success"  value={'ค้นหา'}/>
        </div>
      </form>
      <Modal size='m' show={hidecard[0]} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title >สรุปการจ่ายค่า Comm/Ov ให้กับผู้แนะนำ</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    
                    <div class="row">
                        <div class="col-6">
                            <label class="col-form-label">Comm Out</label>
                        </div>
                        <div class="col-6"> <label class="col-form-label">{filterData.commout}</label></div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <label class="col-form-label">WHT 3% Comm Out</label>
                        </div>
                        <div class="col-6"> <label class="col-form-label">{filterData.whtcommout}</label></div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <label class="col-form-label">Ov Out</label>
                        </div>
                        <div class="col-6"> <label class="col-form-label">{filterData.ovout}</label></div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <label class="col-form-label">WHT 3% Ov Out</label>
                        </div>
                        <div class="col-6"> <label class="col-form-label">{filterData.whtovout}</label></div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <label class="col-form-label">จำนวนเงินที่จ่าย (บาท)</label>
                        </div>
                        <div class="col-6"> <label class="col-form-label">{filterData.actualvalue}</label></div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                {/* <button className="btn btn-warning" onClick={(e)=>saveapcommout(e)}>save</button> */}
        <button className="btn btn-success" onClick={(e)=>submitapcommout(e)}>submit</button>
                </Modal.Footer>
            </Modal>
      <div>
        <PremInTable cols={cols2Data} rows={policiesData} setPoliciesData={setPoliciesData}/>
        
       
      </div>
      <div className="d-flex justify-content-center">
      <button className="btn btn-primary">Export To Excel</button>
        <button type="button" class="btn btn-primary " onClick={(e) => editCard(e)} >ยืนยัน</button>
        </div>

    </div>
  );
}
