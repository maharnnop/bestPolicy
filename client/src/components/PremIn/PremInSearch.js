import React, { useEffect, useState } from "react";
import PremInTable from "./PremInTable";
import axios from 'axios'
import { useCookies } from "react-cookie";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const config = require("../../config.json");
export default function PremInSearch() {
  const [cookies] = useCookies(["jwt"]);
    const headers = {
    headers: { Authorization: `Bearer ${cookies["jwt"]}` }
};
  const url = window.globalConfig.BEST_POLICY_V1_BASE_URL;
  const [filterData, setFilterData] = useState(
    {
      billadvisorno : null,
      insurercode : null,
      advisorcode : null,
      cashierreceiveno : null,
      refno : null,
      arno : null,
      ardatestart : null,
      ardateend : null,
      arcreateusercode : null,
    })
    const [policiesData, setPoliciesData] = useState([])
  const colData = [
    "Billadvisorno",
    "insurercode",
    "advisorcode",
    "CashierReceiptNo",
    "CashierDate",
    "CashierAmt",
    "ARNO",
    "ARDate",
    "ARcreateusercode",
    "ActualValue",
    "DiffAmt",
    "status",
  ];
  const colData2 = {
    billadvisorno: "เลขที่วางบิล",
    insurercode :"รหัสบริษัทประกัย",
    advisorcode:  "รหัสผู้แนะนำ",
    cashierreceiveno:  "เลขที่ใบรับเงิน",
    cashierdate:  "วันที่รับเงิน",
    cashieramt: "จำนวน",
    ARNO : "เลขที่ตัดหนี้",
    ARDate : "วันที่ตัดหนี้",
    ARcreateusercode: "ผู้บันทึกตัดหนี้",
    actualvalue: "จำนวนหนี้",
    diffamt:  "ผลต่าง",
    status : "สถานะ",
  };
  
  const handleChange = (e) => {
    
    setFilterData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
    }));
};
  //apis
  const searchHandler=(e)=>{
    e.preventDefault();
    axios.get().then(res=>{
      
      //do search api logic
    }).catch(()=>{
      alert('error')
    })
  }
  const submitFilter = (e) => {
    e.preventDefault();
    // console.log(filterData);
    axios
        .post(url + "/araps/getarpremindata", filterData, headers)
        .then((res) => {
            if (res.status === 201) {
                console.log(res.data);
                alert("not found policy")

            } else {


                // const array = []
               console.log(res.data);
                setPoliciesData(res.data)
                
                alert("find arno success")
            }
        })
        .catch((err) => {
          alert("Something went wrong, Try Again.")
            // alert("create snew insuree fail");

        });
};
  return (
    <div className="container d-fle justify-content-center ">
      <form onSubmit={(e)=>searchHandler(e)}>
        <h1>ค้นหารายการ</h1>
        {/* BillAdvisorNo */}
        <div className="row my-3">
          <label class="col-sm-2 col-form-label" htmlFor="billadvisorno">
            เลขที่ใบวางบิล
          </label>
          <div className="col-4">
            <input
              className="form-control"
              type="text"
              name="billadvisorno"
              id="billadvisorno"
              onChange={handleChange}
            />
          </div>
        </div>
        {/* Insurercode  */}
        <div className="row my-3">
          <label class="col-sm-2 col-form-label" htmlFor="insurercode">
            รหัสบริษัทประกัน
          </label>
          <div className="col-4 ">
            <input
              className="form-control"
              type="text"
              name="insurercode"
              id="insurercode"
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
        <div className="row my-3">
          <label class="col-sm-2 col-form-label" htmlFor="advisorcode">
            รหัสผู้แนะนำ
          </label>
          <div className="col-4 ">
            <input
              className="form-control"
              type="text"
              name="advisorcode"
              id="advisorcode"
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
        <div className="row my-3">
          <label class="col-sm-2 col-form-label" htmlFor="cashierreceiveno">
            เลขที่ใบรับเงิน
          </label>
          <div className="col-4 ">
            <input
              className="form-control"
              type="text"
              name="cashierreceiveno"
              id="cashierreceiveno"
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
        {/* Refno */}
        <div className="row my-3">
          <label class="col-sm-2 col-form-label" htmlFor="refno">
            เลขที่อ้างอิงการจ่ายเงิน
          </label>
          <div className="col-4 ">
            <input
              className="form-control"
              type="text"
              name="refno"
              id="refno"
              onChange={handleChange}
            />
          </div>
          <div class="col-4 form-check d-flex align-items-center text-center  ">
            <div>
              <input
                class="form-check-input "
                type="checkbox"
                value=""
                id="Refno"
                checked
                name="Refno"
              />
              <label class="form-label" for="Refno">
                All
              </label>
            </div>
          </div>
        </div>
       {/* ARNO  */}
       <div className="row my-3">
          <label class="col-sm-2 col-form-label" htmlFor="arno">
            เลขที่รายการตัดหนี้
          </label>
          <div className="col-4 ">
            <input
              className="form-control"
              type="text"
              name="arno"
              id="arno"
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
                checked
              />
              <label class="form-check-label" for="flexCheckChecked">
                All
              </label>
            </div>
          </div>
        </div>
        {/* ARDATE*/}
        <div className="row my-3">
          <label class="col-sm-2 col-form-label" htmlFor="ardate">
            วันที่ตัดหนี้
          </label>
          <div className="col-5 " id="ardate">
            <label class="col-sm-3 col-form-label" htmlFor="ardatestart">
              จาก วันที่
            </label>
            {/* <input
              className="form-control"
              type="date"
              name="ardatestart"
              id="ardatestart"
              onChange={handleChange}
            /> */}
            <DatePicker
                            showIcon
                            className="form-control"
                            todayButton="Vandaag"
                            // isClearable
                            showYearDropdown
                            dateFormat="dd/MM/yyyy"
                            dropdownMode="select"
                            selected={filterData.ardatestart}
                            onChange={(date) => setFilterData((prevState) => ({
                                ...prevState,
                                ardatestart: date,
                            }))}
                                 />
          </div>

          <div className="col-5 ">
            <label class="col-sm-2 col-form-label" htmlFor="ardateend">
              ถึง วันที่
            </label>
            {/* <input
              className="form-control"
              type="date"
              name="ardateend"
              id="ardateend"
              onChange={handleChange}
            /> */}
            <DatePicker
                            showIcon
                            className="form-control"
                            todayButton="Vandaag"
                            // isClearable
                            showYearDropdown
                            dateFormat="dd/MM/yyyy"
                            dropdownMode="select"
                            selected={filterData.ardateend}
                            onChange={(date) => setFilterData((prevState) => ({
                                ...prevState,
                                ardateend: date,
                            }))}
                                 />
          </div>
        </div>
        
         {/* ARcreateusercode */}
         <div className="row my-3">
          <label class="col-sm-2 col-form-label" htmlFor="arcreateusercode">
            ผู้บันทึกรายการตัดหนี้
          </label>
          <div className="col-4 ">
            <input
              className="form-control"
              type="text"
              name="arcreateusercode"
              id="arcreateusercode"
              onChange={handleChange}
            />
          </div>
          <div class="col-4 form-check d-flex align-items-center text-center  ">
            <div>
              <input
                class="form-check-input "
                type="checkbox"
                value=""
                id="ARcreateusercode"
                checked
                name="ARcreateusercode"
              />
              <label class="form-check-label" for="ARcreateusercode">
                All
              </label>
            </div>
          </div>
        </div>
        <div className="row my-3">
          <button className="btn btn-success" onClick={submitFilter}>ค้นหา</button>
        </div>
      </form>
      <div>
        <PremInTable cols={colData2} rows={policiesData} />
      </div>
    </div>
  );
}
