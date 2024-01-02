import React, { useEffect, useState }  from "react";
import PremInTable from "../PremIn/PremInTable";
import axios from "axios";
import Modal from 'react-bootstrap/Modal';
import { useCookies } from "react-cookie";

const config = require("../../config.json");

export default function CommInCreate() {
  const [cookies] = useCookies(["jwt"]);
  const headers = {
  headers: { Authorization: `Bearer ${cookies["jwt"]}` }
};
  const url = window.globalConfig.BEST_POLICY_V1_BASE_URL;
  const [filterData, setFilterData] = useState(
    {
       
      "dfrpreferno" : null,
        "insurerCode": null,
        "agentCode": null,
        "cashierreceiveno" : null,
        "actualvalue" : null,
        "cashieramt":null,
        "actualvalue": null,
        "diffamt" : null,
        cashieramt : 0,
        actualvalue : 0 ,


    })
    const [policiesData, setPoliciesData] = useState([])
    const [artype, setArtype] = useState('N')
    const [hidecard, setHidecard] = useState(false);
  const colsData = {
    // select : "เลือก",
    insurerCode :"รหัสบริษัทประกัน",
    agentCode: "รหัสผู้แนะนำ",
    dueDate : "Due Date",
    "premout-dfrpreferno" : "เลขที่ตัดจ่าย PREM-OUT",
    policyNo : "เลขที่กรมธรรม์",
    endorseNo : "เลขที่สลักหลัง",
    invoiceNo : "เลขที่ใบแจ้งหนี้",
    taxInvoiceNo : "เลขที่ใบกำกับภาษี",
    seqNo : "งวด",
    // customerid : "id",
    insureename : "ชื่อ ผู้เอาประกัน",
    licenseNo : "เลขทะเบียนรถ",
    chassisNo : "เลขคัชซี",
    grossprem:"เบี้ย",
    specdiscamt : "ส่วนลด",
    netgrossprem : "เบี้ยสุทธิ",
    duty : "อากร",
    tax : "ภาษี",
    totalprem : "เบี้ยรวม",
    withheld : "WHT 1%",
    commin_rate : "Comm In %",
    commin_amt :"จำนวน",
    // commin_taxamt : "Vat Comm In",
    ovin_rate : "OV In %",
    ovin_amt : "จำนวน",
    // ovin_taxamt : "Vat OV In ",
};
  
  
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
        .post(url + "/araps/getarcommin", {...filterData, artype :artype }, headers)
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
                console.log(res.data);
                setFilterData(res.data.billdata[0])
                setPoliciesData(res.data.trans)
                
                alert("get transaction for AR Comm in ")
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
    .post(url + "/araps/getcashierdata", {cashierreceiveno : filterData.cashierreceiveno.trim(), cashierttype:'COMM-IN'}, headers, headers)
    .then((res) => {
        if (res.status === 201) {
            console.log(res.data);
            alert("dont find cashierreceiveno : " + filterData.cashierreceiveno.trim() );

        } else {
          console.log(res.data);
            const data = {...filterData ,cashieramt: res.data[0].amt}
            setFilterData(data)
        }
    })
    .catch((err) => {
      alert("Something went wrong, Try Again.");
        //  alert("dont find cashierreceiveno : " + filterData.cashierreceiveno);

    });
  }else if (e.target.name === 'bill-btn'){
    e.preventDefault();
    console.log(filterData);
    axios
        .post(url + "/araps/getarcommin", {dfrpreferno : filterData.dfrpreferno.trim()
          , artype :artype }, headers)
        .then((res) => {
            if (res.status === 201) {
                console.log(res.data);
                alert("not found policy")

            } else {

                console.log(res.data);
                const resdata = res.data.billdata[0]
                const data = {...filterData , 
                  insurerCode : resdata.insurerCode,
                   agentCode : resdata.agentCode , 
                   actualvalue : resdata.actualvalue,
                  commin :  resdata.commamt,
                  ovin :  resdata.ovamt,
                  whtcommin :  resdata.whtcomm,
                  whtovin :  resdata.whtov,}
                setFilterData(data)
                setPoliciesData(res.data.trans)
                
                alert("get transaction for AR Comm in ")
            }
        })
        .catch((err) => {
          alert("Something went wrong, Try Again.");
            // alert("create snew insuree fail");

        });
    

  }
 
};

const saveapcommin = async (e) => {
  console.log({master :  {...filterData, diffamt: document.getElementsByName('DiffAmt')[0].value}, trans : policiesData});
  await axios.post(url + "/araps/savearcommin", {master : filterData, trans : policiesData}, headers)
  .then((res) => {
    alert("save account recive successed!!!")
   
    // window.location.reload(false);
  }) .catch((err)=>{ alert("Something went wrong, Try Again.");});
};

const submitapcommin = async (e) => {
  const array = policiesData.filter((ele) => ele.select)
  const data = {
    "cashierreceiveno": filterData.cashierreceiveno.trim(),
    cashieramt :  filterData.cashieramt,
    "insurerCode": filterData.insurerCode,
    "agentCode": null,
    actualvalue : filterData.actualvalue,
    diffamt : parseFloat(document.getElementsByName('DiffAmt')[0].value.replace(/,/g, '')),
    // "billadvisorno":filterData.billadvisorno.trim(),
    commin :  filterData.commin,
    ovin :  filterData.ovin,
    whtcommin :  filterData.whtcommin,
    whtovin :  filterData.whtovin
}

  console.log({master :  data, trans : array });
  await axios.post(url + "/araps/submitarcommin", {master :data, trans : array}, headers).then((res) => {
    alert(res.data.msg)
    
    window.location.reload(false);
  }).catch((err)=>{ alert("Something went wrong, Try Again.");});
 
};

  return (
    <div className="container d-fle justify-content-center">
      <form onSubmit={(e)=>submitFilter(e)}>
        <h1>ตัดหนี้ Comm/ov-in</h1>
       

       {/* artype  */}
       <div className="row my-3">
       <div class="col-1"></div>
          <label class="col-sm-2 col-form-label" htmlFor="insurerCode">
            รูปแบบการตัดหนี้ 
          </label>
          
          <div class="form-check col-2">
  <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" defaultChecked onChange={(e)=>setArtype('N')}/>
  <label class="form-check-label" for="flexRadioDefault1">
    จ่ายเงินที่ amity
  </label>
</div>
<div class="form-check col-3">
  <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" onChange={(e)=>setArtype('D')}/>
  <label class="form-check-label" for="flexRadioDefault2">
    จ่ายเงินที่ บริษัทประกัน
  </label>
</div>
        </div>

        {/* change by premin type  dfrpreferno*/}
        
        <div className="row my-3"><div class="col-1"></div>
        {artype === 'N'? 
        <label class="col-sm-3 col-form-label" htmlFor="dfrpreferno">
          เลขที่ตัดจ่าย PREM-OUT ให้ประกัน
        </label>
         :
         <label class="col-sm-3 col-form-label" htmlFor="dfrpreferno">
         เลขที่รายการที่ลูกค้าจ่ายเงินที่ประกัน
       </label>}
        <div className="col-3 ">
          <input
            className="form-control"
            type="text"
            name="dfrpreferno"
            id="dfrpreferno"
            value={filterData.dfrpreferno}
            onChange={handleChange}
          />
        </div>
        {/* <div className="col-3 d-flex justify-content-center">
          <input type="submit"  className="btn btn-success"  value={'ค้นหารายการ'}/>
        </div> */}
        <div className="col-2">
            <button
            name="bill-btn"
              onClick={getData}
            >ค้นหา ข้อมูลเลขที่ตัดจ่าย</button>
          </div>
      </div>
     
      

        {/* insurerCode  */}
        <div className="row my-3"><div class="col-1"></div>
          <label class="col-sm-3 col-form-label" htmlFor="insurerCode">
            รหัสบริษัทประกัน
          </label>
          <div className="col-3 ">
            <input
            disabled
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
        {/* <div className="row my-3"><div class="col-1"></div>
          <label class="col-sm-3 col-form-label" htmlFor="agentCode">
            รหัสผู้แนะนำ
          </label>
          <div className="col-3 ">
            <input
              className="form-control"
              type="text"
              name="agentCode"
              id="agentCode"
              value={filterData.agentCode}
              onChange={handleChange}
            />
          </div>
        </div> */}
          {/* cashierReceiveNo */}
          <div className="row my-3"><div class="col-1"></div>
          <label class="col-sm-3 col-form-label" htmlFor="cashierreceiveno">
          เลขที่รับเงิน
          </label>
          <div className="col-3 ">
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
         {/* cashieramt  */}
        <div className="row my-3"><div class="col-1"></div>
          <label class="col-sm-3 col-form-label" htmlFor="cashieramt">
            จำนวนเงินที่รับ
          </label>
          <div className="col-3 ">
            <input
              className="form-control"
              type="text"
              name="cashieramt"
              id="cashieramt"
              disabled
              value={(filterData.cashieramt ? filterData.cashieramt: 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              onChange={handleChange}
              />
          </div>
        </div>
        {/* actualvalue  */}
        <div className="row my-3"><div class="col-1"></div>
          <label class="col-sm-3 col-form-label" htmlFor="actualvalue">
          จำนวนเงินตัดหนี้
          </label>
          <div className="col-3 ">
            <input
              className="form-control"
              type="text"
              name="actualvalue"
              id="actualvalue"
              disabled
              value={filterData.actualvalue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              onChange={handleChange}
              />
          </div>
          <label class="col-sm-1 col-form-label" htmlFor="DiffAmt">
          ผลต่าง
          </label>
          <div className="col-3 ">
            <input
              className="form-control"
              type="text"
              name="DiffAmt"
              disabled
              value={(filterData.actualvalue - filterData.cashieramt).toLocaleString(undefined, { minimumFractionDigits: 2 })|| 0}
              // onChange={handleChange}
              />
          </div>
        </div>
        
       
        
        
      </form>
      <Modal size='l' show={hidecard} onHide={(e)=>setHidecard(false)}>
                <Modal.Header closeButton>
                    <Modal.Title >สรุปรวมค่า COMM/OV-IN</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <table></table>
                    <div class="row">
                        <div class="col-6">
                            <label class="col-form-label">Comm In</label>
                        </div>
                        <div class="col-6"> <label class="col-form-label">{filterData.commin ? filterData.commin.toLocaleString(undefined, { minimumFractionDigits: 2 }) : 0}</label></div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <label class="col-form-label">WHT3% Comm In</label>
                        </div>
                        <div class="col-6"> <label class="col-form-label">{filterData.whtcommin ? filterData.whtcommin.toLocaleString(undefined, { minimumFractionDigits: 2 }) : 0}</label></div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <label class="col-form-label">Ov In</label>
                        </div>
                        <div class="col-6"> <label class="col-form-label">{filterData.ovin ? filterData.ovin.toLocaleString(undefined, { minimumFractionDigits: 2 }) : 0}</label></div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <label class="col-form-label">WHT3% Ov In</label>
                        </div>
                        <div class="col-6"> <label class="col-form-label">{filterData.whtovin ? filterData.whtovin.toLocaleString(undefined, { minimumFractionDigits: 2 }): 0}</label></div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <label class="col-form-label">จำนวนเงินที่ได้รับ (บาท)</label>
                        </div>
                        <div class="col-6"> <label class="col-form-label">{filterData.actualvalue ? filterData.actualvalue.toLocaleString(undefined, { minimumFractionDigits: 2 }) : 0}</label></div>
                    </div>
                </Modal.Body>
               
                <Modal.Footer>
                {/* <button className="btn btn-warning" onClick={(e)=>savearpremout(e)}>save</button> */}
        <button className="btn btn-success" onClick={(e)=>submitapcommin(e)}>submit</button>
        <button type="button" class="btn btn-secondary" data-dismiss="modal" onClick={(e) => setHidecard(false)}>Close</button>
                </Modal.Footer>
            </Modal>

      <div>
        <PremInTable cols={colsData} rows={policiesData} handleChange={handleChange}/>
      
      </div>
      <div className="d-flex justify-content-center">
      <button className="btn btn-primary">Export To Excel</button>
        {/* <button className="btn btn-warning" onClick={(e)=>saveapcommin(e)}>save</button> */}
        <button className="btn btn-success" onClick={(e)=>setHidecard(true)}>ยืนยัน</button>
        </div>
    </div>
  );
}
