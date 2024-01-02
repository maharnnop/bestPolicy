import React, { useEffect, useState}  from "react";

import { useParams} from "react-router-dom";
import PremInTable from "./PremInTable";
import Select from 'react-select';
import axios from "axios";
import { useCookies } from "react-cookie";

const config = require("../../config.json");

export default function PremInPaid() {
  const [cookies] = useCookies(["jwt"]);
    const headers = {
    headers: { Authorization: `Bearer ${cookies["jwt"]}` }
};
  const url = window.globalConfig.BEST_POLICY_V1_BASE_URL;
  const { type } = useParams();
  const [filterData, setFilterData] = useState(
    {
        "billadvisorno": "",
        "insurerCode": null,
        "agentCode": null,
        "cashierreceiveno": "",
        "arno" : "" 

    })
    const [policiesData, setPoliciesData] = useState([])
    const [insurerDD, setInsurerDD] = useState([]);
    const [agentDD, setAgentDD] = useState([]);
    let colData 
  if (type === 'premout') {
    colData = {
      insurerCode: "รหัสบริษัทประกัน",
      agentCode: "รหัสผู้แนะนำ",
      dueDate:"Duedate",
      policyNo:"เลขที่กรมธรรม์",
      endorseNo:"เลขที่สลักหลัง",
      invoiceNo:"เลขที่ใบแจ้งหนี้",
      taxInvoiceNo:"เลขที่ใบกำกับภาษี",
      seqNo: "งวด",
      insureename:"ชื่อ ผู้เอาประกัน",
      licenseNo:"เลขทะเบียนรถ",
      chassisNo:"เลขคัชซี",
      netgrossprem:"เบี้ยประกัน",
      duty:"อากร",
      tax:"ภาษี",
      totalprem:"เบี้ยประกันรวม",
      withheld:"WHT 1%",
  };
    colData.netflag  = "[] Net"
    colData.commin_rate = "Comm In %"
    colData.commin_amt = "จำนวน"
    colData.ovin_rate = "OV In %"
    colData.ovin_amt = "จำนวน"
    colData.remainamt = "รวม (บาท)"
    // setFilterData(data)
  }else if (type === 'commovout' ) {
    colData = {
      insurerCode: "รหัสบริษัทประกัน",
      agentCode: "รหัสผู้แนะนำ",
      dueDate:"Duedate",
      policyNo:"เลขที่กรมธรรม์",
      endorseNo:"เลขที่สลักหลัง",
      invoiceNo:"เลขที่ใบแจ้งหนี้ (อะมิตี้)",
      seqNo: "งวด",
      billadvisorno: "เลขที่ใบวางบิล",
      cashierreceiveno: "เลขที่รับเงิน",
      "premin-dfrpreferno": "เลขที่ตัดหนี้ PREM-IN",
      commout_amt : "Comm Out",
      ovout_amt : "OV Out",
      remainamt : "รวม (บาท)",
  };
    
    
  }

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
  const handleChange = (e) => {
    
    setFilterData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
    }));
};

 
  //apis 
  const searchHandler=(e)=>{
    
  e.preventDefault();
  let data = {
    billadvisorno : filterData.billadvisorno.trim(),
      insurerCode : filterData.insurerCode,
      agentCode : filterData.agentCode,
      cashierreceiveno : filterData.cashierreceiveno.trim(),
      arno : filterData.arno.trim(),
  }
    if (type === 'premout') {
      
      data.type = 'prem_out'
      // setFilterData(data)
    }else if (type === 'commovout' ) {
      // let data = filterData
      data.type = 'comm/ov_out'
      // setFilterData(data)
    }else if (type === 'wht3') {
      // let data = filterData
      data.type = 'wht_out'
      // setFilterData(data)
    }

    if (document.getElementsByName("insurerCodecb")[0].checked) {
      data.insurerCode = null
  }

  if (document.getElementsByName("agentCodecb")[0].checked) {
    data.agentCode = null
}

if (document.getElementsByName("cashierreceivenocb")[0].checked) {
  data.cashierreceiveno = null
}

if (document.getElementsByName("arnocb")[0].checked) {
  data.arno = null
}

    axios
    .post(url + "/araps/getartrans", data, headers)
    .then((res) => {
      console.log(res.data);
        if (res.status === 201) {
            console.log(res.data);
            alert("dont find policy");

        } else {

            // const data = {...filterData , agentCode : res.data.billdata[0].agentCode, insurerCode : res.data.billdata[0].insurerCode,  actualvalue  : res.data.billdata[0].amt}
            // setFilterData(data)
            setPoliciesData(res.data.trans)
            
            
        }
    })
    .catch((err) => {
 alert("Something went wrong, Try Again.")
      

    });
  }

  
  return (
    <div className="container d-fle justify-content-center ">
      <form onSubmit={(e)=>searchHandler(e)}>
        {type === 'premout' ?
        <h1>แสดงรายการ รอส่งเบี้ยบริษัทประกัน</h1>
        : type === 'commovout' ?
        <h1>แสดงรายการ รอจ่าย Comm/OV Out</h1>
        : null }
        {/* BillAdvisorNo */}
        <div className="row my-3"><div className="col-1"></div>
          
          <label class="col-sm-2 col-form-label" htmlFor="billAdvisorNo">
            เลขที่ใบวางบิล
          </label>
          <div className="col-3">
            <input
              className="form-control"
              type="text"
              name="billadvisorno"
              onChange={handleChange}
            />
          </div>
          <div className="col-3 d-flex justify-content-center">
          <button className="btn btn-success">ค้นหารายการ</button>
        </div>
        </div>
        {/* Insurercode  */}
        <div className="row my-3"><div className="col-1"></div>
          <label class="col-sm-2 col-form-label" htmlFor="Insurercode">
            รหัสบริษัทประกัน
          </label>
          <div className="col-3 ">
            {/* <input className="form-control" type="text" name="insurerCode" onChange={handleChange} /> */}
            <select  name="insurerCode"  class="form-control" onChange={handleChange} >
                <option value=""   disabled selected hidden>รหัสบริษัทประกัน</option>
                {insurerDD}
            </select>
          </div>
          <div class="col-4 form-check d-flex align-items-center text-center  ">
            <div>
              <input
                class="form-check-input "
                type="checkbox"
                name="insurerCodecb"
                // defaultChecked
              />
              <label class="form-check-label" for="Insurercode">
                All
              </label>
            </div>
          </div>
        </div>
        {/* Advisorcode  */}
        <div className="row my-3"><div className="col-1"></div>
          <label class="col-sm-2 col-form-label" htmlFor="Advisorcode">
            รหัสผู้แนะนำ
          </label>
          <div className="col-3 ">
            {/* <input className="form-control" type="text" name="agentCode" onChange={handleChange}  /> */}
            <Select
                                // styles={customStyles}
                                
                                class="form-control"
                                name={`agentCode`}
                                onChange={(e) => setFilterData((prevState) => ({
                                    ...prevState,
                                    agentCode: e.value,
                                  }))}
                                options={agentDD}

                            />
                    
          </div>
          <div class="col-4 form-check d-flex align-items-center text-center  ">
            <div>
              <input
                class="form-check-input "
                type="checkbox"
                name="agentCodecb"
                // defaultChecked
              />
              <label class="form-check-label" for="Advisorcode">
                All
              </label>
            </div>
          </div>
        </div>
        {/* CashierReceiveNo */}
        <div className="row my-3"><div className="col-1"></div>
          <label class="col-sm-2 col-form-label" htmlFor="CashierReceiveNo">
            เลขที่รับเงิน
          </label>
          <div className="col-3 ">
            <input
              className="form-control"
              type="text"
              name="cashierreceiveno"
              onChange={handleChange}
            />
          </div>
          <div class="col-4 form-check d-flex align-items-center text-center  ">
            <div>
              <input
                class="form-check-input "
                type="checkbox"
                name="cashierreceivenocb"
                // defaultChecked
              />
              <label class="form-check-label" for="CashierReceiveNo">
                All
              </label>
            </div>
          </div>
        </div>
        {/* ARNO */}
        <div className="row my-3"><div className="col-1"></div>
          <label class="col-sm-2 col-form-label" htmlFor="ARNO">
            เลขที่ตัดหนี้
          </label>
          <div className="col-3 ">
            <input className="form-control" type="text" name="arno" onChange={handleChange} />
          </div>
          <div class="col-4 form-check d-flex align-items-center text-center  ">
            <div>
              <input
                class="form-check-input "
                type="checkbox"
                name="arnocb"
                // defaultChecked
              />
              <label class="form-label" for="ARNO">
                All
              </label>
            </div>
          </div>
        </div>

        
      </form>
      <div>
        <PremInTable cols={colData} rows={policiesData} />
        
      </div>
      <div className="d-flex justify-content-center">
      <button className="btn btn-primary">Export To Excel</button>
        </div>
    </div>
  );
}
