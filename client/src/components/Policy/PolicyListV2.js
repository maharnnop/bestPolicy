import axios from "axios";
import * as XLSX from 'xlsx';
import { useEffect, useState } from "react";
import { CenterPage } from "../StylesPages/AdminStyles";
import { Container } from "../StylesPages/PagesLayout";
import PolicyCard from "./PolicyCard";
import Modal from 'react-bootstrap/Modal';
import { async } from "q";
import Pagination from "./Pagination";
import { useCookies } from "react-cookie";

const config = require("../../config.json");

const UserCarList = (props) => {
  const [cookies, setCookie, removeCookie] = useCookies(["jwt"]);
  const headers = {
    headers: { Authorization: `Bearer ${cookies["jwt"]}` }
};
  const url = window.globalConfig.BEST_POLICY_V1_BASE_URL;
  const [row, setRow] = useState(0);
  const [hidecard, setHidecard] = useState([false,0]);
  //import excel
  const [formData, setFormData] = useState([{
    policyNo: null,
    actDate: null,
    expDate: null,
    insurerName: null,
    agentCode: null,
    insureType: null,
    insureName: null,
    grossprem: null,
    duty: null,
    tax: null,
    totalprem: null,
    personType: null,
    title: null,
    t_ogName: null,
    t_firstName: null,
    t_lastName: null,
    idCardType: null,
    idCardNo: null,
    taxNo: null,
    t_location_1: null,
    t_location_2: null,
    t_location_3: null,
    t_location_4: null,
    t_location_5: null,
    province: null,
    distric: null,
    subdistric: null,
    zipcode: null,
    carRegisNo: null,
    brandname: null,
    modelname: null,
    chassisNo: null,
    carRegisYear: null,
    telNum_1: null,
    cover_amt: null
  }]);

  //pagination
  // const [currentPage, setCurrentPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [postsPerPage] = useState(5);
  // Get current posts
  // const indexOfLastPost = currentPage * postsPerPage;
  // const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const [currentForm, setCurrentForm] = useState(formData.slice(0, 5))

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);

  const changePage = (e) => {
    // e.preventDefault();
    const pageNumber = e.target.name
    const indexOfLastPost = pageNumber * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    setCurrentPage(indexOfFirstPost)
    setCurrentForm(formData.slice(indexOfFirstPost, indexOfLastPost ))
    console.log(formData.slice(indexOfFirstPost, indexOfLastPost ));
    
  };

  const handleChange = async (e) => {
    e.preventDefault();
    const name = e.target.name.split('_')[0]
    const index = parseInt(e.target.name.split('_')[1])
  const array =    { ...formData[index], [name]: e.target.value}
  formData[index] = array
  setFormData(formData)
    console.log(formData);
  };

  const handleChangeCard = async (e,index,data) => {
    e.preventDefault();
    setHidecard([false,0])
    if (e.target.name === 'saveChange') {
      const array =    data
      formData[index] = array
      
      setFormData(formData)
      // setCurrentForm(formData.slice(currentPage, currentPage + postsPerPage ))
      console.log(formData);
    }
  };

  const handleDraft = async (e) => {
    const data = []
     for (let i = 0; i < formData.length; i++) {
      let t_ogName =null
      let t_firstName = null
      let t_lastName = null
      let idCardType = "idcard"
      let idCardNo =  null
      let taxNo = null
      if (formData[i].personType === 'P'){
        t_firstName = formData[i].t_fn
        t_lastName = formData[i].t_ln
        idCardNo = formData[i].regisNo.toString()
        data.push({...formData[i], t_firstName:t_firstName, t_lastName :t_lastName, idCardNo:idCardNo, idCardType:idCardType, t_ogName:t_ogName , taxNo:taxNo})
      }else{
        t_ogName = formData[i].t_fn
        
        taxNo = formData[i].regisNo.toString()
        data.push({...formData[i], t_ogName:t_ogName , taxNo:taxNo, t_firstName:t_firstName, t_lastName :t_lastName, idCardNo:idCardNo, idCardType:idCardType})
      }
    }
    console.log(data);
    e.preventDefault();
    await axios.post(url + "/policies/policydraft/batch", data, headers).then((res) => {
      alert("policy batch Created");
      window.location.reload(false);
    }).catch((err)=>{ alert("Something went wrong, Try Again.");});
  };

  const handleSubmit = async (e) => {
    const data = []
     for (let i = 0; i < formData.length; i++) {
      let t_ogName =null
      let t_firstName = null
      let t_lastName = null
      let idCardType = "idcard"
      let idCardNo =  null
      let taxNo = null
      if (formData[i].personType === 'P'){
        t_firstName = formData[i].t_fn
        t_lastName = formData[i].t_ln
        idCardNo = formData[i].regisNo.toString()
        data.push({...formData[i], t_firstName:t_firstName, t_lastName :t_lastName, idCardNo:idCardNo, idCardType:idCardType, t_ogName:t_ogName , taxNo:taxNo})
      }else{
        t_ogName = formData[i].t_fn
        
        taxNo = formData[i].regisNo.toString()
        data.push({...formData[i], t_ogName:t_ogName , taxNo:taxNo, t_firstName:t_firstName, t_lastName :t_lastName, idCardNo:idCardNo, idCardType:idCardType})
      }
    }
    console.log(data);
    e.preventDefault();
    await axios.post(url + "/policies/policydraft/batch", data, headers).then((res) => {
      alert("policy batch Created");
      window.location.reload(false);
    }).catch((err)=>{ alert("Something went wrong, Try Again.");});
  };

  const newRow = (e) => {
    e.preventDefault();
    setRow(row + 1);
    const array = formData
    array.push(formData[0])
    setFormData(array);
    setCurrentForm(formData.slice(0, 5))
    
  };
  const removeRow = (e) => {
    e.preventDefault();
    if (row > 0) {
      setRow(row - 1);
      setFormData(formData.slice(0,row));
      setCurrentForm(formData.slice(0, 5))
     
    }

  };
  const editCard =(e) =>{
    setHidecard([true,e.target.id])
   
  };
const handleClose = (e) =>{
  setHidecard([false,0])
}
  //import excel
  const handleFileChange = (e) => {

    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = event.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });

        // Assuming the first sheet is the one containing data
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert the worksheet data to JSON format
        const excelData = XLSX.utils.sheet_to_json(worksheet);

        // Assuming the first row in the Excel sheet contains the field names (header row)
        // Update the state to populate the form data with the Excel data
        const element = []
        for (let i = 2; i < excelData.length; i++) {
          //excelData[i].policyNo = excelData[i].policyNo.toString()
          if ('chassisNo' in excelData[i]) {excelData[i].chassisNo = excelData[i].chassisNo.toString()}
          if ('licenseNo' in excelData[i]) {excelData[i].licenseNo = excelData[i].licenseNo.toString()}
          element.push(excelData[i])
        }
        
        console.log(excelData.slice(2));
        if (excelData.length > 2) {
          setFormData(excelData.slice(2));
          setCurrentForm(excelData.slice(2, 7))
          setRow(excelData.length-3)
        }
      };
      reader.readAsBinaryString(file);
    }

  };

  return (
    <CenterPage>
      <div className="d-flex justify-content-center">

      {/* <button type="button" class="btn btn-primary " onClick={newRow} >add</button>
      <button type="button" class="btn btn-danger " onClick={removeRow} >Remove</button> */}

      <input type="file" class="btn btn-secondary " id="fileInput" onChange={(e) => handleFileChange(e)} />
      </div>
     
      
      {/* <form className="container-fluid form-group text-left" */}
      <form
       method="POST"
        id="policyList">
       
        {/* loop new row */}
        {/* {Array.from({ length: row+1 }, (_, index) => ( */}
          
       
       
<div className="d-flex justify-content-center">

        {/* <button type="button" class="btn btn-primary " onClick={(e)=>handleSubmit(e)} >Create</button> */}
        <button type="button" class="btn btn-primary " onClick={(e)=>handleDraft(e)} >บันทึกคำขอ</button>
        <button type="button" class="btn btn-primary " onClick={(e)=>handleSubmit(e)} >บันทึกกรมธรรม์</button>
</div>
      </form>
      
    </CenterPage>
  );
};

export default UserCarList;
