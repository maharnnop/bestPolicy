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
  
  const [formDataList, setFormDataList] = useState([]);
  const [filterData, setFilterData] = useState({
    policyNo : '',
    applicationNo: '',
    
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
    axios.post(url + "/policies/findpolicy",filterData,headers)
          .then((pols) => {  
            // data =   agents.data.map(ele =>{
            //   let duedateA = new Date()
            //   let duedateI = new Date()
            //   if (ele.creditUAgent === "D") {
            //     duedateA.setDate(duedateA.getDate + 30)
            //   }else if (ele.creditUAgent === "M") {
            //     duedateA.setMonth(duedateA.getMonth + ele.creditTAgent)
            //   }
            //   ele.dueDateAgent = duedateA
            //   ele.dueDateInsurer = duedateI
            //   return ele 
            // })
            setFormDataList(pols.data)
            if (pols.data.length === 0) {
              alert('ไม่กรมธรรม์นี้')
            }
            console.log(data);
          })
          .catch((err) => { 
            alert(err.data)
          });
  }

  

  

  

  return (
    <div>
      <div class="row ">
        <div className="col-1"></div>
        
        <div class="col-3">
          <label class="form-label ">
            เลขที่กรมธรรม์<span class="text-danger"> </span>
          </label>
        </div>

        <div class="col-4">
          <input
            className="form-control"
            type="text"
            name={`policyNo`}
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
            เลขที่ใบคำขอ<span class="text-danger"> </span>
          </label>
        </div>

        <div class="col-4">
          <input
            className="form-control"
            type="text"
            name={`applicationNo`}
            onChange={handleChange}
          />
        </div>

      </div>

      
      <div className="table-responsive "  >
        <table class="table  table-striped">
          <thead>
            <tr>
              <th scope="col-1">เลือก</th>
              <th scope="col-1">เลขที่กรมธรรม์</th>
              <th scope="col-1">เลขที่ใบคำขอ</th>
              <th scope="col-2">Class/Subclass</th>
              <th scope="col-2">บริษัทประกัน</th>
              <th scope="col-2">ผู้แนะนำ</th>
            </tr>
          </thead>
          <tbody>
    {formDataList.map((ele,index)=>{
       return <tr>
            {/* {name === 'agentCode' ? 
            <td scope="col-1"><button className=" btn btn-primary"  onClick={e=>props.setFormData(e,
              {[name]:ele.agentCode, 
                commout1_rate :ele.rateComOut, 
                ovout1_rate : ele.rateOVOut_1,
                commin_rate :ele.rateComIn,
                ovin_rate : ele.rateOVIn_1,})}>เลือก</button></td>
             <td scope="col-1"><button className=" btn btn-primary"  onClick={e=>props.getcommov(name,ele.agentCode)}>เลือก</button></td>
            :
            <td scope="col-1"><button className=" btn btn-primary"  onClick={e=>props.setFormData(e,{[name]:ele.agentCode, commout2_rate :ele.rateComOut, ovout2_rate : ele.rateOVOut_1})}>เลือก</button></td>
            } */}
             <td scope="col-1"><button className=" btn btn-primary"  onClick={e=>props.setFormData(e,formDataList[index])}>เลือก</button></td>
            <td scope="col-1">{ele.policyNo}</td>
            <td scope="col-1">{ele.applicationNo}</td>
            <td scope="col-1">{ele.classsubclass}</td>
            <td scope="col-1">{ele.insurerCode}</td>
            <td scope="col-1">{ele.agentCode}</td>
           
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
