import axios from "axios";
import * as XLSX from "xlsx";
import { useEffect, useState } from "react";
import { CenterPage } from "../StylesPages/AdminStyles";
import { Container } from "../StylesPages/PagesLayout";
import { async } from "q";
import { sort } from "semver";
import { useCookies } from "react-cookie";
import { data } from "jquery";
// import { Type } from 'react-bootstrap-table2-editor';
const config = require("../../config.json");

const PolicyCard = (props) => {
    const [cookies] = useCookies(["jwt"]);
  const name = props.name;
  const url = window.globalConfig.BEST_POLICY_V1_BASE_URL;
  const tax = config.tax
  const duty = config.duty
  const withheld = config.witheld
  const headers = {
    headers: { Authorization: `Bearer ${cookies["jwt"]}` }
};
  
  const [formData, setFormData] = useState(props.formData);
  const [filterData, setFilterData] = useState({
    agentCode : '',
    firstname: '',
    lastname : '',
    insurerCode : props.formData.insurerCode,
    class : props.formData.class,
    subClass : props.formData.subClass,
  });
  const [agentList, setAgentList] = useState([]);


  const handleChange = async (e) => {
    e.preventDefault();
    setFilterData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }));
  };

  const submitFilter = (e) =>{
    e.preventDefault();
    axios.post(url + "/persons/findagent",filterData,headers)
          .then((agents) => {    
            setAgentList(agents.data)
            if (agents.data.length === 0) {
              alert('ไม่พบผู้แนะนำ สำหรับกรมธรรม์ ตามเงื่อนไข class/subclass/บริษัทประกันนี้')
            }
          })
          .catch((err) => { 
            alert(err.data)
          });
  }

  

  const handleSubmit = async (e) => {
    const data = [];
    for (let i = 0; i < formData.length; i++) {
      let t_ogName = null;
      let t_firstName = null;
      let t_lastName = null;
      let idCardType = "idcard";
      let idCardNo = null;
      let taxNo = null;
      const totalprem = parseFloat(formData[i].grossprem) -
        parseFloat(formData[i].duty) -
        parseFloat(formData[i].tax);


      if (formData[i].personType === "P") {
        t_firstName = formData[i].t_fn;
        t_lastName = formData[i].t_ln;
        idCardNo = formData[i].regisNo.toString();
        data.push({
          ...formData[i],
          t_firstName: t_firstName,
          t_lastName: t_lastName,
          totalprem: totalprem,
          idCardNo: idCardNo,
          idCardType: idCardType,
          t_ogName: t_ogName,
          taxNo: taxNo,
        });
      } else {
        t_ogName = formData[i].t_fn;

        taxNo = formData[i].regisNo.toString();
        data.push({
          ...formData[i],
          t_ogName: t_ogName,
          taxNo: taxNo,
          t_firstName: t_firstName,
          t_lastName: t_lastName,
          totalprem: totalprem,
          idCardNo: idCardNo,
          idCardType: idCardType,
        });
      }
    }
    console.log(data);
    e.preventDefault();
    await axios.post(url + "/policies/policynew/batch", data).then((res) => {
      alert("policy batch Created");
      window.location.reload(false);
    });
  };

  

  return (
    <div>
      <div class="row ">
        <div className="col-1"></div>
        
        <div class="col-3">
          <label class="form-label ">
            รหัสผู้แนะนำ<span class="text-danger"> </span>
          </label>
        </div>

        <div class="col-4">
          <input
            className="form-control"
            type="text"
            name={`agentCode`}
            onChange={handleChange}
          />
        </div>

        <div class="col-4">
        <button className="p-2 btn btn-primary"  name="saveChange" onClick={submitFilter}>
          ค้นหา
        </button>
        </div>
      </div>

      <div class="row ">
        <div className="col-1"></div>
        
        <div class="col-3">
          <label class="form-label ">
            ชื่อ<span class="text-danger"> </span>
          </label>
        </div>

        <div class="col-4">
          <input
            className="form-control"
            type="text"
            name={`firstname`}
            onChange={handleChange}
          />
        </div>

      </div>

      <div class="row ">
        <div className="col-1"></div>
        
        <div class="col-3">
          <label class="form-label ">
            นามสกุล<span class="text-danger"> </span>
          </label>
        </div>

        <div class="col-4">
          <input
            className="form-control"
            type="text"
            name={`lastname`}
            onChange={handleChange}
          />
        </div>

      </div>
      
      <div className="table-responsive "  >
        <table class="table  table-striped">
          <thead>
            <tr>
              <th scope="col-1">เลือก</th>
              <th scope="col-1">รหัสผู้แนะนำ</th>
              <th scope="col-1">ชื่อ - นามสกุล</th>
              <th scope="col-2">ประเภท</th>
            </tr>
          </thead>
          <tbody>
    {agentList.map((ele)=>{
       return <tr>
            {name === 'agentCode' ? 
            <td scope="col-1"><button className=" btn btn-primary"  
            onClick={e=>props.setFormData(e,
              {[name]:ele.agentCode, 
                commout1_rate :ele.rateComOut, 
                ovout1_rate : ele.rateOVOut_1,
                commin_rate :ele.rateComIn,
                ovin_rate : ele.rateOVIn_1,})}>เลือก</button></td>
            :<td scope="col-1"><button className=" btn btn-primary"  onClick={e=>props.setFormData(e,{[name]:ele.agentCode, commout2_rate :ele.rateComOut, ovout2_rate : ele.rateOVOut_1})}>เลือก</button></td>}
            <td scope="col-1">{ele.agentCode}</td>
            <td scope="col-1">{ele.fullName}</td>
            <td scope="col-1">{ele.personType.trim() === 'P' ? 'บุคคล' :'นิติบุคคล'}</td>
           
          </tr>
    })}
          


            
          </tbody>
        </table>
      </div>

     

      <div class="d-flex justify-content-center" >

        
        <button className="p-2 btn btn-secondary " style={{margin:`10px`}}  name="closed" onClick={e => props.setFormData(e)}>
          ปิด
        </button>
      </div>
    </div>
  );
};

export default PolicyCard;
