import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import PremInTable from "../PremIn/PremInTable";
import axios from "axios";
import { useCookies } from "react-cookie";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import convertDateFormat from "../lib/convertdateformat";
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
      "receiptno": null,
      "rprefdatestart": null,
      "rprefdateend": null,
      "type": null

    })
  const [policiesData, setPoliciesData] = useState([])
  const colData = {
    dfrpreferno : "เลขที่ตัดหนี้",
    transType : "ประเภท",
    rprefdate : "วันที่ตัดหนี้",
    dfrpreferno : "เลขที่ตัดหนี้ PREM-IN",
    'premin-dfrpreferno' : "เลขที่ตัดหนี้ PREM-OUT",
    'premout-dfrpreferno' : "เลขที่ตัดหนี้ PREM-OUT",
    insurerCode: "รหัสบริษัทประกัน",
    agentCode: "รหัสผู้แนะนำ",
    dueDate: "Duedate",
    policyNo: "เลขที่กรมธรรม์",
    endorseNo: "เลขที่สลักหลัง",
    invoiceNo: "เลขที่ใบแจ้งหนี้",
    seqNo: "งวด",
    

  };
  const handleChange = (e) => {
    
    setFilterData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
    }));
};

  //apis 
  const searchHandler = (e) => {

    e.preventDefault();
    let todate = null
    let fromdate = null
    if (filterData.rprefdatestart !== null) {
      fromdate = new Date(filterData.rprefdatestart)
      fromdate = fromdate.toDateString()
    }
    if (filterData.rprefdateend !== null) {
      todate = new Date(filterData.rprefdateend)
      todate.setDate(todate.getDate()+1)
      todate = todate.toDateString()
    }
     
    const data = {
      "billadvisorno": filterData.billadvisorno,
      "insurerCode": filterData.insurerCode,
      "agentCode": filterData.agentCode,
      "receiptno": filterData.receiptno,
      "rprefdatestart": fromdate,
      "rprefdateend": todate,
      "type": filterData.type

    }
    // if (filterData.rprefdatestart !== null) {
    //   data.rprefdatestart = convertDateFormat(filterData.rprefdatestart.toISOString())
    // }
    // data.rprefdateend = convertDateFormat(filterData.rprefdateend.toISOString())
    axios
      .post(url + "/araps/getaraptransall", data, headers)
      .then((res) => {
        console.log(res.data);
        if (res.status === 201) {
          console.log(res.data);
          alert("ไม่พบรายการตัดหนี้");

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
      <form onSubmit={(e) => searchHandler(e)}>
        <h1>แสดงรายการตัดหนี้</h1>
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
              name="insurerCode"
              onChange={handleChange}
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
              name="agentCode"
              onChange={handleChange}
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
              name="receiptno"
              onChange={handleChange}
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
            วันที่ตัดหนี้ จาก
          </label>
          <div className="col-3 ">
            <DatePicker
              showIcon
              className="form-control"
              todayButton="Vandaag"
              // isClearable
              showYearDropdown
              dateFormat="dd/MM/yyyy"
              dropdownMode="select"
              selected={filterData.rprefdatestart}
              onChange={(date) => setFilterData((prevState) => ({
                ...prevState,
                rprefdatestart: date,
              }))}
            />

          </div>
          <label class="col-sm-2 col-form-label" htmlFor="ARNO">
            ถึง
          </label>
          <div className="col-3 ">
            <DatePicker
              showIcon
              className="form-control"
              todayButton="Vandaag"
              // isClearable
              showYearDropdown
              dateFormat="dd/MM/yyyy"
              dropdownMode="select"
              selected={filterData.rprefdateend}
              onChange={(date) => setFilterData((prevState) => ({
                ...prevState,
                rprefdateend: date,
              }))}
            />

          </div>
        </div>

        <div className="row my-3"><div className="col-1"></div>
          <label class="col-sm-2 col-form-label" htmlFor="CashierReceiveNo">
            ประเภทการตัดหนี้
          </label>
          <div className="col-3 ">
            <select type="text" name="type" onChange={handleChange}
              className="form-control"

            >
              <option value="ALL" >ALL</option>
              <option value="prem_in">ตัดรับค่าเบี้ย (PREM-IN)</option>
              <option value="prem_out">ตัดรับค่าเบี้ย (PREM-OUT)</option>

              <option value="comm/ov_in">ตัดรับค่าคอม (Comm/OV-IN)</option>

              <option value="comm/ov_out">ตัดจ่ายค่าคอม (Comm/OV-OUT)</option>
            </select>
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
