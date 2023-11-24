import React, { useEffect, useState }  from "react";
import PremInTable from "./PremInTable";
import axios from "axios";
import { useCookies } from "react-cookie";
import Modal from 'react-bootstrap/Modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const config = require("../../config.json");

export default function PremInCreate() {
  const [cookies] = useCookies(["jwt"]);
    const headers = {
    headers: { Authorization: `Bearer ${cookies["jwt"]}` }
};
  const url = window.globalConfig.BEST_POLICY_V1_BASE_URL;
  const wht = config.wht;
  const [filterData, setFilterData] = useState(
    {
        "billadvisorno": null,
        "insurerCode": null,
        "agentCode": null,
        "cashierreceiveno": null,
        "dueDate" : null,
        "policyNoAll" : true

    })
    const [policiesData, setPoliciesData] = useState([])
    const [policiesRender, setPoliciesRender] = useState({
        
      net:{ no: 0, prem: 0, comm_out: 0, whtcom: 0, ov_out: 0, whtov: 0, },
      gross:{ no: 0, prem: 0 },
      total:{ no: 0, prem: 0, comm_out: 0, whtcom: 0, ov_out: 0, whtov: 0, billprem:0 },
  })
  const [hidecard, setHidecard] = useState([false, 0]);
  const colsData = {
    insurerCode: "รหัสบริษัทประกัน",
    agentCode: "รหัสผู้แนะนำ",
    dueDate:"Duedate",
    policyNo:"เลขกรมธรรม์",
    endorseNo:"เลขสลักหลัง",
    invoiceNo:"เลขใบแจ้งหนี้",
    seqNo: "งวด",
    customerid:"id",
    insureename:"ชื่อผู้เอาประกัน",
    licenseNo:"เลขทะเบียนรถ",
    // "province",
    chassisNo:"เลขคัชซี",
    netgrossprem:"เบี้ยประกัน",
    duty:"อากร",
    tax:"ภาษี",
    // withheldrate:"withheld rate",
    withheld:"withheld amt",
    totalprem:"เบี้ยประกันรวม",
    commout_rate:"Comm Out %",
    commout_amt:"จำนวน",
    ovout_rate:"Ov Out %",
    ovout_amt:"จำนวน",
    netflag:"[] Net",
    remainamt:"รวม (บาท)",

};
  
const editCard = (e) => {
  setHidecard([true, 1])
  const array = []
  const net = { no: 0, prem: 0, comm_out: 0, whtcom: 0, ov_out: 0, whtov: 0, }
  const gross = { no: 0, prem: 0 }
  for (let i = 0; i < policiesData.length; i++) {
      
          if (policiesData[i].netflag === "N") {
              net.no++
              net.prem = net.prem + policiesData[i].totalprem 
              net.comm_out = net.comm_out + policiesData[i].commout_amt
              net.whtcom = net.comm_out * wht
              net.ov_out = net.ov_out + policiesData[i].ovout_amt
              net.whtov = net.ov_out * wht
          } else {
              gross.no++
              gross.prem = gross.prem + policiesData[i].totalprem
          }

      

  }

  const total = {
      no: net.no + gross.no,
      prem: net.prem + gross.prem,
      comm_out: net.comm_out,
      whtcom: net.whtcom,
      ov_out: net.ov_out,
      whtov: net.whtov,
      billprem: net.prem + gross.prem - net.comm_out + net.whtcom - net.ov_out + net.whtov
  }
  setPoliciesRender({ net: net, gross: gross, total: total })
};
const handleClose = (e) => {
  setHidecard([false, 0])
}

  const handleChange = (e) => {
    
    setFilterData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
    }));
};
  const submitFilter = (e) => {
    e.preventDefault();
    console.log(filterData);
    axios
        .post(url + "/payments/findpolicyinDue", filterData, headers)
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
                
                alert("find data success")
            }
        })
        .catch((err) => {
          alert("Something went wrong, Try Again.");
            // alert("create snew insuree fail");

        });
};
const getData = (e) => {
  e.preventDefault();
  if (e.target.name === 'cashier-btn') {
    axios
    .post(url + "/araps/getcashierdata", filterData, headers, headers)
    .then((res) => {
        if (res.status === 201) {
            console.log(res.data);
            alert("dont find cashierreceiveno : " + filterData.cashierreceiveno);

        } else {


          console.log(res.data);
            const data = {...filterData ,amt: res.data[0].amt}
            setFilterData(data)
        }
    })
    .catch((err) => {
      alert("Something went wrong, Try Again.");
        //  alert("dont find cashierreceiveno : " + filterData.cashierreceiveno);

    });
  }else if (e.target.name === 'bill-btn'){
    axios
    .post(url + "/araps/getbilldata", filterData, headers)
    .then((res) => {
        if (res.status === 201) {
            console.log(res.data);
            alert("dont find billadvisorNo : " + filterData.billadvisorno);

        } else {

            const data = {...filterData , agentCode : res.data.billdata[0].agentCode, insurerCode : res.data.billdata[0].insurerCode,  actualvalue  : res.data.billdata[0].amt}
            setFilterData(data)
            console.log(res.data.trans);
            setPoliciesData(res.data.trans)
            
            
        }
    })
    .catch((err) => {
      alert("Something went wrong, Try Again.");
        //  alert("dont find billadvisorNo : " + filterData.billadvisorno);

    });

  }
 
};
    //apis
    const createHandler=(e)=>{
      e.preventDefault();
      axios.get().then(res=>{
        alert("search")
        //do search api logic
      }).catch(()=>{
        alert('error but created in test')
        // alert("Something went wrong, Try Again.");
      })
    }

const savearpremin = async (e) => {
  let commout = 0
  let ovout = 0 
  let netflag = 'G'
  for (let i = 0; i < policiesData.length; i++) {
    if (policiesData[i].netflag === 'N') {
      netflag = 'N'
      commout = commout + policiesData[i].commout_amt
      ovout = ovout + policiesData[i].ovout_amt
    }
    
  }
  const whtcommout = commout * wht
  const whtovout = ovout * wht
  const data = filterData 
  data.diffamt = document.getElementsByName('DiffAmt')[0].value
  data.commout = commout
  data.ovout = ovout
  data.whtcommout = whtcommout
  data.whtovout = whtovout

  console.log({master :  data, trans : policiesData});
  await axios.post(url + "/araps/savearpremin",
   {master : data, 
   trans : policiesData}, headers)
   .then((res) => {
    alert("save account recive successed!!!");
    // window.location.reload(false);
  }).catch((err)=>{ alert("Something went wrong, Try Again.");});
};

const submitarpremin = async (e) => {
  let commout = 0
  let ovout = 0 
  let netflag = 'G'
  for (let i = 0; i < policiesData.length; i++) {
    if (policiesData[i].netflag === 'N') {
      netflag = 'N'
      commout = commout + policiesData[i].commout_amt
      ovout = ovout + policiesData[i].ovout_amt
    }
    
  }
  const whtcommout = commout * wht
  const whtovout = ovout * wht
  const data = filterData 
  data.diffamt = document.getElementsByName('DiffAmt')[0].value
  data.commout = commout
  data.ovout = ovout
  data.whtcommout = whtcommout
  data.whtovout = whtovout

  console.log({master :  data, trans : policiesData});
  await axios.post(url + "/araps/submitarpremin", {master : data, trans : policiesData}, headers)
  .then((res) => {
    alert("save account recive successed!!!")
    .catch((err)=>{ alert("Something went wrong, Try Again.");});
    // window.location.reload(false);
  });
};

  return (
    <div className="container d-fle justify-content-center">
      <form onSubmit={(e)=>createHandler(e)}>
        <h1>สร้างรายการตัดหนี้</h1>
        {/* billadvisorno */}
        <div className="row my-3">
          <label class="col-sm-2 col-form-label" htmlFor="billadvisorno">
            เลขที่ใบวางบิล_
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
          <div className="col-2">
            <button
            name="bill-btn"
              onClick={getData}
            >ค้นหา ข้อมูลใบวางบิล</button>
          </div>
          <div className="col-2">
            <button
              onClick={submitFilter}
            >ค้นหา</button>
          </div>
        </div>
        {/* insurerCode  */}
        <div className="row my-3">
          <label class="col-sm-2 col-form-label" htmlFor="insurerCode">
            รหัสบริษัทประกัน
          </label>
          <div className="col-4 ">
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
        <div className="row my-3">
          <label class="col-sm-2 col-form-label" htmlFor="agentCode">
            รหัสผู้แนะนำ
          </label>
          <div className="col-4 ">
            <input
              className="form-control"
              type="text"
              name="agentCode"
              id="agentCode"
              value={filterData.agentCode}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row my-3">
          <label class="col-sm-2 col-form-label" htmlFor="cashierreceiveno">
            dueDate
          </label>
          <div className="col-4 ">
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
              {/* cashierreceiveno */}
        <div className="row my-3">
          <label class="col-sm-2 col-form-label" htmlFor="cashierreceiveno">
            เลขที่รับเงิน
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
          <div className="col-2">
            <button
            name="cashier-btn"
              onClick={getData}
            >ค้นหา ข้อมูลใบรับเงิน</button>
          </div>
        </div>
        {/* Amt */}
        <div className="row my-3">
          <label class="col-sm-2 col-form-label" htmlFor="amt">
            จำนวนเงินที่รับ
          </label>
          <div className="col-4 ">
            <input className="form-control" type="number" name="amt" id="amt" value={filterData.amt} disabled/>
          </div>
        </div>
        {/* actualvalue */}
        <div className="row my-3">
          <label class="col-sm-2 col-form-label" htmlFor="actualvalue">
            จำนวนเงินใบวางบิล
          </label>
          <div className="col-4 ">
            <input
              className="form-control"
              type="number"
              name="actualvalue"
              value={filterData.actualvalue}
              id="actualvalue"
              disabled
            />
          </div>
          <label class="col-sm-2 col-form-label" htmlFor="actualvalue">
            ผลต่าง
          </label>
          <div className="col-4 ">
            <input
              className="form-control"
              type="number"
              name="DiffAmt"
              id="DiffAmt"
              value={filterData.actualvalue - filterData.amt}
              readOnly
            />
          </div>
        </div>
        <div className="row my-3">
          {/* <button className="btn btn-success">สร้างรายการ</button> */}
          
        </div>
      </form>
      <Modal size='xl' show={hidecard[0]} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title >Confirm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    
                    <div class="row">
                        <div class="col-2">
                            <label class="col-form-label">จำนวนเงินสุทธิ</label>
                        </div>
                        <div class="col-2"> {policiesRender.total.prem.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
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
                            <label class="col-form-label">Kwanmhn</label>
                        </div>
                    </div>
                    
                    <table class="table table-hover">
                        <thead>
                            <tr>

                                <th scope="col">ชำระแบบ</th>
                                <th scope="col">รายการ</th>
                                <th scope="col">จำนวนเงินค่าเบี้ย</th>
                                <th scope="col">comm-out</th>
                                <th scope="col"> WHT 3%</th>
                                <th scope="col">ov-out</th>
                                <th scope="col"> WHT 3%</th>

                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>net</td>
                                <td>{policiesRender.net.no}</td>
                                <td>{policiesRender.net.prem.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{policiesRender.net.comm_out.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{policiesRender.net.whtcom.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{policiesRender.net.ov_out.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{policiesRender.net.whtov.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                            </tr>
                            <tr>
                                <td>gross</td>
                                <td>{policiesRender.gross.no}</td>
                                <td>{policiesRender.gross.prem.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                                <td>-</td>
                            </tr>
                            <tr>
                                <td>รวมทั้งสิ้น</td>
                                <td>{policiesRender.total.no}</td>
                                <td>{policiesRender.total.prem.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{policiesRender.total.comm_out.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{policiesRender.total.whtcom.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{policiesRender.total.ov_out.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td>{policiesRender.total.whtov.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="row">
                        <div class="col-2">
                            <label class="col-form-label">จำนวนเงินตัดหนี้</label>
                        </div>
                        <div class="col-2"> {(policiesRender.total.prem + policiesRender.total.whtov + policiesRender.total.whtcom - policiesRender.total.comm_out -  policiesRender.total.ov_out).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <button type="button" class="btn btn-primary" onClick={submitarpremin}>Save changes</button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal" onClick={handleClose}>Close</button>
                </Modal.Footer>
            </Modal>
      <div>
        <PremInTable cols={colsData} rows={policiesData} />
        {/* <button className="btn btn-primary">Export To Excel</button>
        <button className="btn btn-warning" onClick={(e)=>savearpremin(e)}>save</button>
        <button className="btn btn-success" onClick={(e)=>submitarpremin(e)}>submit</button> */}
        <div className="d-flex justify-content-center">
                    {/* <LoginBtn type="submit">confirm</LoginBtn> */}
                    <button type="button" class="btn btn-primary " onClick={(e) => editCard(e)} >ยืนยัน</button>
                </div>
      </div>
    </div>
  );
}
