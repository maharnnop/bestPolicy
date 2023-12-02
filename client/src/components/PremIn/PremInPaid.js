import React, { useEffect, useState}  from "react";

import { useParams} from "react-router-dom";
import PremInTable from "./PremInTable";
import axios from "axios";
import { useCookies } from "react-cookie";

const config = require("../../config.json");

export default function PremInPaid() {
  const [cookies] = useCookies(["jwt"]);
    const headers = {
    headers: { Authorization: `Bearer ${cookies["jwt"]}` }
};
  const url = window.globalConfig.BEST_POLICY_V1_BASE_URL;
  const [filterData, setFilterData] = useState(
    {
        "billadvisorno": null,
        "insurerCode": null,
        "agentCode": null,
        "cashierreceiveno": null,
        "arno" : null 

    })
    const [policiesData, setPoliciesData] = useState([])
    const colData = {
      insurerCode: "รหัสบริษัทประกัน",
      agentCode: "รหัสผู้แนะนำ",
      dueDate:"Duedate",
      policyNo:"เลขที่กรมธรรม์",
      endorseNo:"เลขที่สลักหลัง",
      invoiceNo:"เลขที่ใบวางบิล",
      seqNo: "งวด",
      customerid:"id",
      insureename:"ชื่อ ผู้เอาประกัน",
      licenseNo:"เลขทะเบียนรถ",
      // "province",
      chassisNo:"เลขคัชซี",
      netgrossprem:"เบี้ยประกัน",
      duty:"อากร",
      tax:"ภาษี",
      withheld:"WHT 1%",
      totalprem:"เบี้ยประกันรวม",
      commout_rate:"Comm Out %",
      commout_amt:"จำนวน",
      ovout_rate:"Ov Out %",
      ovout_amt:"จำนวน",
      netflag:"[] Net",
      remainamt:"รวม (บาท)",
  
  };
  
  const { type } = useParams();
  //apis 
  const searchHandler=(e)=>{
    
  e.preventDefault();
    if (type === 'premout') {
      let data = filterData
      data.type = 'prem_out'
      setFilterData(data)
    }else if (type === 'commovout' ) {
      let data = filterData
      data.type = 'comm/ov_out'
      setFilterData(data)
    }else if (type === 'wht3') {
      let data = filterData
      data.type = 'wht_out'
      setFilterData(data)
    }
    axios
    .post(url + "/araps/getartrans", filterData, headers)
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
        <h1>แสดงรายการที่รับชำระหนี้</h1>
        {/* BillAdvisorNo */}
        <div className="row my-3"><div className="col-1"></div>
          
          <label class="col-sm-2 col-form-label" htmlFor="billAdvisorNo">
            เลขที่ใบวางบิล
          </label>
          <div className="col-3">
            <input
              className="form-control"
              type="text"
              name="billAdvisorNo"
              id="billAdvisorNo"
            />
          </div>
        </div>
        {/* Insurercode  */}
        <div className="row my-3"><div className="col-1"></div>
          <label class="col-sm-2 col-form-label" htmlFor="Insurercode">
            รหัสบริษัทประกัน
          </label>
          <div className="col-3 ">
            <input
              className="form-control"
              type="text"
              name="Insurercode"
              id="Insurercode"
            />
          </div>
          <div class="col-4 form-check d-flex align-items-center text-center  ">
            <div>
              <input
                class="form-check-input "
                type="checkbox"
                value=""
                id="Insurercode"
                name="Insurercode"
                checked
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
            <input
              className="form-control"
              type="text"
              name="Advisorcode"
              id="Advisorcode"
            />
          </div>
          <div class="col-4 form-check d-flex align-items-center text-center  ">
            <div>
              <input
                class="form-check-input "
                type="checkbox"
                value=""
                id="Advisorcode"
                checked
                name="Advisorcode"
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
              name="CashierReceiveNo"
              id="CashierReceiveNo"
            />
          </div>
          <div class="col-4 form-check d-flex align-items-center text-center  ">
            <div>
              <input
                class="form-check-input "
                type="checkbox"
                value=""
                id="flexCheckChecked"
                name="CashierReceiveNo"
                checked
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
            <input className="form-control" type="text" name="ARNO" id="ARNO" />
          </div>
          <div class="col-4 form-check d-flex align-items-center text-center  ">
            <div>
              <input
                class="form-check-input "
                type="checkbox"
                value=""
                id="ARNO"
                checked
                name="ARNO"
              />
              <label class="form-label" for="ARNO">
                All
              </label>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-center">
          <button className="btn btn-success">ค้นหา</button>
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
