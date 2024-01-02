import React, { useEffect, useState }  from "react";
import PremInTable from "../PremIn/PremInTable";
import axios from "axios";
import Modal from 'react-bootstrap/Modal';
import Select from 'react-select';
import jwt_decode from "jwt-decode";
import { useCookies } from "react-cookie";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const config = require("../../config.json");

export default function PremOutCreate() {
  const [cookies] = useCookies(["jwt"]);
  const headers = {
  headers: { Authorization: `Bearer ${cookies["jwt"]}` }
};
  const url = window.globalConfig.BEST_POLICY_V1_BASE_URL;
  const wht = config.wht;
  const tax = config.tax;
  const [filterData, setFilterData] = useState(
    {
       
        "insurerCode": null,
        "agentCode": null,
        "dueDate" : null,
        reconcileno : null,
        dfrprefernostart : "",
        dfrprefernoend : "",
        rprefdatestart : null,
        rprefdateend : null,

    })
    const [policiesData, setPoliciesData] = useState([])
    const [hidecard, setHidecard] = useState([false, 0]);
    const [insurerDD, setInsurerDD] = useState([]);
    const [agentDD, setAgentDD] = useState([]);
    const [policiesRender, setPoliciesRender] = useState({
        
      net:{ no: 0, prem: 0, comm_in: 0, withheld:0, whtcom: 0, ov_in: 0, whtov: 0, },
      gross:{ no: 0, prem: 0, withheld:0 },
      total:{ no: 0, prem: 0,  withheld:0, comm_in: 0, whtcom: 0, ov_in: 0, whtov: 0, billprem:0 },
  })
  const cols2Data = {
    select : "เลือก",
    netflag: "[] Net",
    insurerCode:"รหัสบริษัทประกัน",
    agentCode:"รหัสผู้แนะนำ",
    dueDate:"Due Date",
    policyNo:"เลขกรมธรรม์",
    endorseNo: "เลขสลักหลัง",
    invoiceNo: "เลขที่ใบแจ้งหนี้",
    taxInvoiceNo: "เลขที่ใบกำกับภาษี",
    seqNo: "งวด",
    "premin-dfrpreferno" : "เลขที่ตัดหนี้ PREM-IN",
    "premin-rprefdate" : "วันที่ตัดหนี้ PREM-IN",
    // customerid: "id",
    insureename:  "ชื่อ ผู้เอาประกัน",
    licenseNo: "เลขทะเบียนรถ",
    // province: "province", // nodata
    chassisNo: "เลขคัชซี",
    grossprem:"เบี้ย",
    specdiscamt : "ส่วนลด",
    netgrossprem: "เบี้ยสุทธิ",
    duty: "อากร",
    tax: "ภาษี",
    totalprem: "เบี้ยรวม",
    withheld: "WHT 1%",
    commin_rate: "Comm In%",
    commin_amt: "จำนวน",
    // commin_taxamt: "Vat Comm In",
    // commin_total: "Comm In รวม",
    ovin_rate: "OV In%",
    ovin_amt: "จำนวน",
    // ovin_taxamt: "Vat OV In",
    // ovin_total: "Ov In รวม",
    
    // paymentamt: "รวม (บาท)",

};
  const handleClose = (e) => {
      setHidecard([false, 0])
  }
   const editCard = (e) => {
        setHidecard([true, 1])
        //old
        // let totalprem = 0
        // let commin_amt = 0
        // let commin_taxamt = 0
        // let ovin_amt = 0
        // let ovin_taxamt = 0
        // let paymentamt = 0
        
        // for (let i = 0; i < policiesData.length; i++) {
        //     if (policiesData[i].select) {
        //       totalprem = totalprem + policiesData[i].totalprem
        //       commin_amt = commin_amt + policiesData[i].commin_amt
        //       commin_taxamt = commin_taxamt + policiesData[i].commin_taxamt
        //       ovin_amt = ovin_amt + policiesData[i].ovin_amt
        //       ovin_taxamt = ovin_taxamt + policiesData[i].ovin_taxamt
        //       paymentamt = paymentamt + policiesData[i].paymentamt
        //         }

        //     }
            // filterData.netprem = totalprem
            // filterData.commin = commin_amt
            // filterData.vatcommin = commin_taxamt
            // filterData.ovin = ovin_amt
            // filterData.vatovin = ovin_taxamt
            // filterData.whtovin = parseFloat((ovin_amt*wht).toFixed(2))
            // filterData.whtcommin = parseFloat((commin_amt*wht).toFixed(2))
            // filterData.actualvalue = paymentamt
            // new
        const net = { no: 0, prem: 0, comm_in: 0, withheld:0, whtcom: 0, ov_in: 0, whtov: 0, }
        const gross = { no: 0, prem: 0 , withheld:0}
        for (let i = 0; i < policiesData.length; i++) {
          if (policiesData[i].select) {
          if (policiesData[i].netflag === "N") {
              net.no++
              net.prem = net.prem + policiesData[i].totalprem 
              net.comm_in = net.comm_in + policiesData[i].commin_amt
              net.withheld = net.withheld + policiesData[i].withheld
              net.ov_in = net.ov_in + policiesData[i].ovin_amt
              
          } else {
              gross.no++
              gross.prem = gross.prem + policiesData[i].totalprem
              gross.withheld = gross.withheld + policiesData[i].withheld
          }
        }
    
        }
      net.whtcom = parseFloat((net.comm_in * wht).toFixed(2))
      net.whtov = parseFloat((net.ov_in * wht).toFixed(2))
      net.vatcom = parseFloat((net.comm_in * tax).toFixed(2))
      net.vatov = parseFloat((net.ov_in * tax).toFixed(2))

        
        

   
  const total = {
    no: net.no + gross.no,
    prem: parseFloat((net.prem + gross.prem).toFixed(2)),
    withheld : parseFloat((net.withheld + gross.withheld).toFixed(2)),
    comm_in: parseFloat((net.comm_in).toFixed(2)),
    ov_in: parseFloat((net.ov_in).toFixed(2)),
    whtcom: parseFloat((net.whtcom).toFixed(2)),
    whtov: parseFloat((net.whtov).toFixed(2)),
    vatcom: parseFloat((net.vatcom).toFixed(2)),
    vatov: parseFloat((net.vatov).toFixed(2)),
    billprem: parseFloat(( net.prem + gross.prem - net.comm_in + net.whtcom - net.ov_in + net.whtov - net.withheld - gross.withheld).toFixed(2)),
}
            // filterData.netprem = total.prem
            // filterData.commin = total.comm_in
            // filterData.ovin = ovin_amt
            // filterData.vatcommin = commin_taxamt
            // filterData.vatovin = ovin_taxamt
            // filterData.whtcommin = total.whtcom
            // filterData.whtovin = total.whtov
            // filterData.actualvalue = total.billprem
setPoliciesRender({ net: net, gross: gross, total: total })

    };
  
  const handleChange = (e) => {
    
    setFilterData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
    }));
};
  const submitFilter = (e) => {
    e.preventDefault();
    
    let todate = null
    let fromdate = null
    let dueDate = null
    if (filterData.rprefdatestart !== null) {
      fromdate = new Date(filterData.rprefdatestart)
      fromdate = fromdate.toDateString()
    }
    if (filterData.rprefdateend !== null) {
      todate = new Date(filterData.rprefdateend)
      todate.setDate(todate.getDate()+1)
      todate = todate.toDateString()
    }
    if (filterData.dueDate !== null) {
      dueDate = new Date(filterData.dueDate)
      dueDate = dueDate.toDateString()
    }

    const data ={
      "insurerCode": filterData.insurerCode,
      "agentCode": filterData.agentCode,
      "dueDate" : dueDate,
      reconcileno : filterData.reconcileno,
      dfrprefernostart : filterData.dfrprefernostart.trim(),
      dfrprefernoend : filterData.dfrprefernoend.trim(),
      rprefdatestart : fromdate,
      rprefdateend : todate,
    }
    console.log(filterData);
    axios
        .post(url + "/araps/getaptrans", data, headers)
        .then((res) => {
            if (res.status === 201) {
                console.log(res.data);
                alert("ไม่พบกรมธรรม์สำหรับ ส่งค่าเบี้ยประกัน")
                setPoliciesData([])
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
     alert("Something went wrong, Try Again.")
            // alert("create snew insuree fail");

        });
};

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

const savearpremout = async (e) => {
  console.log({master :  filterData, trans : policiesData});
  await axios.post(url + "/araps/saveappremout", {master : filterData, trans : policiesData}, headers).then((res) => {
    alert("save account recive successed!!!");
    // window.location.reload(false);
  }).catch((err)=>{ alert("Something went wrong, Try Again.");});
};

const submitarpremout = async (e) => {
  const array = policiesData.filter((ele) => ele.select)

  const masterdata ={
    "insurerCode": filterData.insurerCode,
    "agentCode": filterData.agentCode,
    actualvalue : policiesRender.total.billprem,
    netprem : policiesRender.total.prem,
    commin : policiesRender.total.comm_in,
    ovin : policiesRender.total.ov_in,
    vatcommin : policiesRender.total.vatcom,
    vatovin : policiesRender.total.vatov,
    whtcommin : policiesRender.total.whtcom,
    whtovin : policiesRender.total.whtov,
    withheld : policiesRender.total.withheld,
   
  }

  console.log({master :  masterdata, trans : array});
  await axios.post(url + "/araps/submitappremout", {master :masterdata, trans : array}, headers).then((res) => {
    alert(res.data.msg);
    window.location.reload(false);
  }).catch((err)=>{ alert("Something went wrong, Try Again.");});
};

  return (
    <div className="container d-fle justify-content-center ">
      <form onSubmit={(e)=>submitFilter(e)}>
        <h1>Statement ค่าเบี้ยส่งบริษัทประกัน</h1>
       
        {/* insurerCode  */}
        <div className="row my-3"><div className="col-1"></div>
          <label class="col-sm-2 col-form-label" htmlFor="insurerCode">
            รหัสบริษัทประกัน<span class="text-danger"> *</span>
          </label>
          <div className="col-3 ">
            {/* <input
              required
              className="form-control"
              type="text"
              name="insurerCode"
              id="insurerCode"
              value={filterData.insurerCode}
              onChange={handleChange}
            /> */}
             <select  required name="insurerCode"  class="form-control" onChange={handleChange} >
                <option value=""   disabled selected hidden>รหัสบริษัทประกัน</option>
                {insurerDD}
            </select>
          </div>
          <div className="col-3 d-flex justify-content-center">
          <input type="submit" className="btn btn-success" value={'ค้นหารายการ'}/>
        </div>
        </div>
        {/* advisorCode  */}
        <div className="row my-3"><div className="col-1"></div>
          <label class="col-sm-2 col-form-label" htmlFor="agentCode">
            รหัสผู้แนะนำ
          </label>
          <div className="col-3">
            {/* <input className="form-control"
              type="text"
              name="agentCode"
              id="agentCode"
              value={filterData.agentCode}
              onChange={handleChange}
            /> */}
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
        </div>
          {/* reconcileno */}
          {/* <div className="row my-3"><div className="col-1"></div>
          <label class="col-sm-2 col-form-label" htmlFor="cashierreceiveno">
            reconcileno
          </label>
          <div className="col-3 ">
            <input
              className="form-control"
              type="text"
              name="reconcileno"
              id="reconcileno"
              disabled
              placeholder="comming soonnnnnn"
              onChange={handleChange}
            />
          </div>
          </div> */}
         {/* duedate  */}
        <div className="row my-3"><div className="col-1"></div>
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
                            showIcon
                            className="form-control"
                            todayButton="Vandaag"
                            // isClearable
                            showYearDropdown
                            dateFormat="dd/MM/yyyy"
                            dropdownMode="select"
                            selected={filterData.dueDate}
                            onChange={(date) => setFilterData((prevState) => ({
                                ...prevState,
                                dueDate: date,
                            }))}
                                 />
          </div>
        </div>
        {/* dfrpreferno-premin*/}
       <div className="row my-3"><div className="col-1"></div>
          <label class="col-sm-2 col-form-label" htmlFor="ARNO">
            เลขที่ที่ตัดหนี้ PREM-IN จาก
          </label>
          <div className="col-3 ">
             <input
              className="form-control"
              type="text"
              name="dfrprefernostart"
              onChange={handleChange}
            />

          </div>
          <label class="col-1 col-form-label" htmlFor="ARNO">
            ถึง
          </label>
          <div className="col-3 ">
          <input
              className="form-control"
              type="text"
              name="dfrprefernoend"
              onChange={handleChange}
            />

          </div>
        </div>
       {/* rprefdate*/}
       <div className="row my-3"><div className="col-1"></div>
          <label class="col-sm-2 col-form-label" htmlFor="ARNO">
            วันที่ตัดหนี้ PREM-IN จาก
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
          <label class="col-1 col-form-label" htmlFor="ARNO">
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
        
       
      </form>
      <Modal size='xl' show={hidecard[0]} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title >สรุปค่าเบี้ยรวมจ่ายบริษัทประกัน</Modal.Title>
                </Modal.Header>
                {/* <Modal.Body>
                    <div class="row">
                        <div class="col-6">
                            <label class="col-form-label">เบี้ยประกันรวม</label>
                            </div>
                        <div class="col-6">
                           <label class="col-form-label">{filterData.netprem}</label></div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <label class="col-form-label">Comm In</label>
                        </div>
                        <div class="col-6"> <label class="col-form-label">{filterData.commin}</label></div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <label class="col-form-label">VAT Comm In</label>
                        </div>
                        <div class="col-6"> <label class="col-form-label">{filterData.vatcommin}</label></div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <label class="col-form-label">Ov In</label>
                        </div>
                        <div class="col-6"> <label class="col-form-label">{filterData.ovin}</label></div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <label class="col-form-label">VAT Ov In</label>
                        </div>
                        <div class="col-6"> <label class="col-form-label">{filterData.vatovin}</label></div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <label class="col-form-label">จำนวนเงินที่จ่าย (บาท)</label>
                        </div>
                        <div class="col-6"> <label class="col-form-label">{filterData.actualvalue}</label></div>
                    </div>
                </Modal.Body> */}
                <Modal.Body>
                    
                    <div class="row">
                        <div class="col-2">
                            <label class="col-form-label">จำนวนเงินสุทธิ</label>
                        </div>
                        <div class="col-2">
                          <label class="col-form-label">{policiesRender.total.billprem.toLocaleString(undefined, { minimumFractionDigits: 2 })}</label>
                        </div>
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
                            <label class="col-form-label">{jwt_decode(cookies["jwt"]).USERNAME}</label>
                        </div>
                    </div>
                    
                    <table class="table table-hover">
                        <thead className="table-success">
                            <tr>

                                <th scope="col">ชำระแบบ</th>
                                <th scope="col">รายการ</th>
                                <th scope="col">ค่าเบี้ยประกันรวม</th>
                                <th scope="col">ภาษีหัก ณ ที่จ่าย (1%)</th>
                                <th scope="col">Comm In</th>
                                <th scope="col"> WHT 3%</th>
                                <th scope="col">OV In</th>
                                <th scope="col"> WHT 3%</th>

                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td >net</td>
                                <td>{policiesRender.net.no}</td>
                                <td>{policiesRender.net.prem.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{policiesRender.net.withheld.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{policiesRender.net.comm_in.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{policiesRender.net.whtcom.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{policiesRender.net.ov_in.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{policiesRender.net.whtov.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                            </tr>
                            <tr>
                                <td  >gross</td>
                                <td>{policiesRender.gross.no}</td>
                                <td>{policiesRender.gross.prem.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{policiesRender.gross.withheld.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                            </tr>
                            <tr className="table-info">
                                <td>รวมทั้งสิ้น</td>
                                <td>{policiesRender.total.no}</td>
                                <td>{policiesRender.total.prem.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{policiesRender.total.withheld.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{policiesRender.total.comm_in.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{policiesRender.total.whtcom.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{policiesRender.total.ov_in.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{policiesRender.total.whtov.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="row">
                        <div class="col-2">
                            <label class="col-form-label">จำนวนเงินตัดหนี้</label>
                        </div>
                        <div class="col-2">
                           <label class="col-form-label">{(policiesRender.total.billprem).toLocaleString(undefined, { minimumFractionDigits: 2 })}</label>
                           </div>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                {/* <button className="btn btn-warning" onClick={(e)=>savearpremout(e)}>save</button> */}
        <button className="btn btn-success" onClick={(e)=>submitarpremout(e)}>submit</button>
        <button type="button" class="btn btn-secondary" data-dismiss="modal" onClick={handleClose}>Close</button>
                </Modal.Footer>
            </Modal>
      <div>
        <PremInTable cols={cols2Data} rows={policiesData} setPoliciesData={setPoliciesData} checknetflag={true}/>
        
       
      </div>
      <div className="d-flex justify-content-center">
      <button className="btn btn-primary">Export To Excel</button>
        <button type="button" class="btn btn-primary " onClick={(e) => editCard(e)} >ยืนยัน</button>
      </div>
    </div>
  );
}
