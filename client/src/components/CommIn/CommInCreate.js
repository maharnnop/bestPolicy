import React, { useEffect, useState }  from "react";
import PremInTable from "../PremIn/PremInTable";
import axios from "axios";
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

    })
    const [policiesData, setPoliciesData] = useState([])
    const [artype, setArtype] = useState('N')
  const colsData = {
    select : "เลือก",
    insurerCode :"รหัสบริษัทประกัน",
    agentCode: "รหัสผู้แนะนำ",
    dueDate : "Duedate",
    policyNo : "เลขกรมธรรม์",
    endorseNo : "เลขสลักหลัง",
    invoiceNo : "เลขใบแจ้งหนี้",
    seqNo : "งวด",
    customerid : "id",
    insureename : "ชื่อ ผู้เอาประกัน",
    licenseNo : "เลขทะเบียนรถ",
    chassisNo : "เลขคัชซี",
    netgrossprem : "เบี้ยประกัน",
    duty : "อากร",
    tax : "ภาษี",
    withheld : "WHT 1%",
    totalprem : "เบี้ยประกันรวม",
    commin_amt : "Comm In %",
    commin_rate :"จำนวน",
    ovin_amt : "Ov In %",
    ovin_rate : "จำนวน",
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


const saveapcommin = async (e) => {
  console.log({master :  {...filterData, diffamt: document.getElementsByName('DiffAmt')[0].value}, trans : policiesData});
  await axios.post(url + "/araps/savearcommin", {master : filterData, trans : policiesData}, headers)
  .then((res) => {
    alert("save account recive successed!!!")
   
    // window.location.reload(false);
  }) .catch((err)=>{ alert("Something went wrong, Try Again.");});
};

const submitapcommin = async (e) => {
  console.log({master :  {...filterData}, trans : policiesData});
  await axios.post(url + "/araps/submitarcommin", {master :filterData, trans : policiesData}, headers).then((res) => {
    alert(res.data.msg)
    
    window.location.reload(false);
  }).catch((err)=>{ alert("Something went wrong, Try Again.");});
  // window.location.reload(false);;
};

  return (
    <div className="container d-fle justify-content-center">
      <form onSubmit={(e)=>submitFilter(e)}>
        <h1>ตัดหนี้ Comm/ov-in</h1>
       

       {/* artype  */}
       <div className="row my-3">
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
        
        <div className="row my-3">
        {artype === 'N'? 
        <label class="col-sm-2 col-form-label" htmlFor="dfrpreferno">
          เลขที่ตัดจ่าย PREM-OUT ให้ประกัน
        </label>
         :
         <label class="col-sm-2 col-form-label" htmlFor="dfrpreferno">
         เลขที่รายการที่ลูกค้าจ่ายเงินที่ประกัน
       </label>}
        <div className="col-4 ">
          <input
            className="form-control"
            type="text"
            name="dfrpreferno"
            id="dfrpreferno"
            value={filterData.dfrpreferno}
            onChange={handleChange}
          />
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
          {/* cashierReceiveNo */}
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
          </div>
         {/* cashieramt  */}
        <div className="row my-3">
          <label class="col-sm-2 col-form-label" htmlFor="cashieramt">
            จำนวนเงินที่รับ
          </label>
          <div className="col-4 ">
            <input
              className="form-control"
              type="number"
              name="cashieramt"
              id="cashieramt"
              onChange={handleChange}
              />
          </div>
        </div>
        {/* actualvalue  */}
        <div className="row my-3">
          <label class="col-sm-2 col-form-label" htmlFor="actualvalue">
          จำนวนเงินตัดหนี้
          </label>
          <div className="col-4 ">
            <input
              className="form-control"
              type="number"
              name="actualvalue"
              id="actualvalue"
              onChange={handleChange}
              />
          </div>
        </div>
        {/* diff-amt */}
        <div className="row my-3">
          <label class="col-sm-2 col-form-label" htmlFor="diffamt">
          ผลต่าง
          </label>
          <div className="col-4 ">
            <input
              className="form-control"
              type="number"
              name="diffamt"
              id="diffamt"
              disabled
              value={filterData.actualvalue - filterData.cashieramt}
              // onChange={handleChange}
              />
          </div>
        </div>
       
        
        <div className="row my-3">
          <input type="submit"  className="btn btn-success"  value={'ค้นหา'}/>
        </div>
      </form>
      <div>
        <PremInTable cols={colsData} rows={policiesData} handleChange={handleChange}/>
        <button className="btn btn-primary">Export To Excel</button>
        {/* <button className="btn btn-warning" onClick={(e)=>saveapcommin(e)}>save</button> */}
        <button className="btn btn-success" onClick={(e)=>submitapcommin(e)}>submit</button>
      </div>
    </div>
  );
}
