import axios from "axios";
import * as XLSX from "xlsx";
import { useEffect, useState } from "react";
import { CenterPage } from "../StylesPages/AdminStyles";
import { Container } from "../StylesPages/PagesLayout";
import { async } from "q";
import Select from 'react-select';
import { useCookies } from "react-cookie";
import { number } from "joi";
import { numberWithCommas} from '../lib/number';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const config = require("../../config.json");

const EndorseScreen = (props) => {

  const [cookies, setCookie, removeCookie] = useCookies(["jwt"]);
  const headers = {
    headers: { Authorization: `Bearer ${cookies["jwt"]}` }
};
  const url = window.globalConfig.BEST_POLICY_V1_BASE_URL;
  const tax = config.tax;
  const duty = config.duty;

  //import excel
  const [formData, setFormData] = useState({});
  const [provinceDD, setProvinceDD] = useState([]);
  const [districDD, setDistricDD] = useState([]);
  const [subDistricDD, setSubDistricDD] = useState([]);
  const [zipcodeDD, setZipCodeDD] = useState([]);
  const [titleDD, setTitleDD] = useState([]);
  const [insureTypeDD, setInsureTypeDD] = useState([]);
  const [insureClassDD, setInsureClassDD] = useState([]);
  const [insureSubClassDD, setInsureSubClassDD] = useState([]);
  const [insurerDD, setInsurerDD] = useState([]);
  const [motorbrandDD, setMotorbrandDD] = useState([]);
  const [motormodelDD, setMotormodelDD] = useState([]);

  const handleChange = async (e) => {
    e.preventDefault();
    // console.log(e);
    //set dropdown subclass when class change
    if (e.target.name === "class") {
      const array = [];
      insureTypeDD.forEach((ele) => {
        if (e.target.value === ele.class) {
          array.push(
            <option key={ele.id} value={ele.subClass}>
              {ele.subClass}
            </option>
          );
        }
      });
      setInsureSubClassDD(array);
    }
    
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    //set dropdown title follow to personType
    if (e.target.name === "personType") {
      if (e.target.value === "P") {
        axios
          .get(url + "/static/titles/person/all",headers)
          .then((title) => {
            const array2 = [];
            title.data.forEach((ele) => {
              array2.push(
                <option key={ele.TITLEID} value={ele.TITLETHAIBEGIN}>
                  {ele.TITLETHAIBEGIN}
                </option>
              );
            });
            setTitleDD(array2);
          })
          .catch((err) => { });
      } else {
        axios
          .get(url + "/static/titles/company/all",headers)
          .then((title) => {
            const array2 = [];
            title.data.forEach((ele) => {
              array2.push(
                <option key={ele.TITLEID} value={ele.TITLETHAIBEGIN}>
                  {ele.TITLETHAIBEGIN}
                </option>
              );
            });
            setTitleDD(array2);
          })
          .catch((err) => { });
      }
    }

    //set dropdown distric subdistric
    if (e.target.name === "province") {

      getDistrict(e.target.value);
    } else if (e.target.name === "district") {
      getSubDistrict(e.target.value);
    } else if (e.target.name === "brandname") {
      getMotormodel(e.target.value);
    }
    //get com/ov setup

  };
  const handleChangeDate = (date,name) => {
    setFormData((prevState) => ({
        ...prevState,
        [name]: date,
    }));
  }

  const NumberInputWithCommas =  ({ value, name ,onChange, e}) =>{
    // Remove commas when displaying the value
    let displayValue ='';
    
    if (value) {
      displayValue = value.toLocaleString();
    }
  
    const handleChangeN =  (e) => {
      e.preventDefault()
      const inputValue = e.target.value;
      // Remove commas and non-numeric characters
      const numericValue = inputValue.replace(/[^0-9]/g, '');
  
      // Format the numeric value with commas
      const formattedValue = Number(numericValue).toLocaleString();
      e.target.value = Number(numericValue).toLocaleString();
      console.log(e);
      onChange(e);
      // console.log(formData);
    };
  
    return (
      <input
        type="text"
        className="form-control numbers"
        // value={displayValue}
        name={name}
        onBlur={(e)=>handleChangeN(e)}
      />
    );
  }

  const changeProvince = (e) =>{
    setFormData((prevState) => ({
      ...prevState,
      province: e.value,
    }));
      getDistrict(e.value);
    
    
  }
  const changeDistrict = (e) =>{
    setFormData((prevState) => ({
      ...prevState,
      district: e.value,
    }));
      getSubDistrict(e.value);
  }
  const changeMotorBrand = (e) =>{
    setFormData((prevState) => ({
      ...prevState,
      brandname: e.value,
    }));
      getMotormodel(e.value);
  }

  const getDistrict = (provincename) => {
    //get distric in province selected
    axios
      .post(url + "/static/amphurs/search", { provincename: provincename },headers)
      .then((distric) => {
        const array = [];
        distric.data.forEach((ele) => {
          // array.push(
          //   <option id={ele.amphurid} value={ele.t_amphurname} value2={ele.t_amphurname}>
          //     {ele.t_amphurname}
          //   </option>
          // );
          array.push({label: ele.t_amphurname, value: ele.t_amphurname})
        });
        setDistricDD(array);
      })
      .catch((err) => {
        // alert("cant get aumphur");
      });
  };

  const getMotormodel = (brandname) => {
    //get distric in province selected
    axios
      .post(url + "/static/mt_models/search", { brandname: brandname },headers)
      .then((model) => {
        const array = [];
        model.data.forEach((ele) => {
          // array.push(
          //   <option value={ele.MODEL} >
          //     {ele.MODEL}
          //   </option>
          // );
          array.push({label: ele.MODEL, value: ele.MODEL})
        });
        setMotormodelDD(array);
      })
      .catch((err) => {
        // alert("cant get aumphur");
      });
  };
  const getSubDistrict = (amphurname) => {
    //get tambons in distric selected
    axios
      .post(url + "/static/tambons/search", { amphurname: amphurname },headers)
      .then((subdistric) => {
        const arraySub = [];
        const arrayZip = [];
        const zip = [];
        subdistric.data.forEach((ele) => {
          // arraySub.push(
          //   <option id={ele.tambonid} value={ele.t_tambonname}>
          //     {ele.t_tambonname}
          //   </option>
          // );
          arraySub.push({label: ele.t_tambonname, value: ele.t_tambonname})
          zip.push(ele.postcodeall.split("/"));
        });
        const uniqueZip = [...new Set(...zip)];
        console.log(uniqueZip);
        uniqueZip.forEach((zip) => {
          // arrayZip.push(<option value={zip}>{zip}</option>);
          arrayZip.push({label: zip, value: zip})
        });
        setSubDistricDD(arraySub);
        setZipCodeDD(arrayZip);
      })
      .catch((err) => {
        // alert("cant get tambons");
      });
  };

  const getcommov = (e) => {
    e.preventDefault();
    //get comm  ov setup
    let i =1
    if(e.target.name === 'btn_comm1'){
      i =1
    }else if(e.target.name === 'btn_comm2'){
      i =2
    }
    axios
      .post(url + "/insures/getcommov", formData,headers)
      .then((res) => {
        console.log(res.data);
        setFormData((prevState) => ({
          ...prevState,
          [`commin_rate`]: res.data[0].rateComIn,
          [`ovin_rate`]: res.data[0].rateOVIn_1,
          [`commout${i}_rate`]: res.data[0].rateComOut,
          [`ovout${i}_rate`]: res.data[0].rateOVOut_1,
          [`commin_amt`]: res.data[0].rateComIn * formData[`grossprem`] / 100,
          [`ovin_amt`]: res.data[0].rateOVIn_1 * formData[`grossprem`] / 100,
          [`commout${i}_amt`]: res.data[0].rateComOut * formData[`grossprem`] / 100,
          [`ovout${i}_amt`]: res.data[0].rateOVOut_1 * formData[`grossprem`] / 100,

        }));
      })
      .catch((err) => {
        alert("Something went wrong, Try Again.");
        // alert("cant get aumphur");
      });

    // if (formData[`commin_rate`] == null && formData[`ovin_rate`] == null ) {
    //   setFormData((prevState) => ({
    //     ...prevState,
    //     [`commin_rate`]: 10,
    //     [`ovin_rate`]: 15,
    //   }));

    // }
    //  if (formData[`commout_rate`] == null && formData[`ovout_rate`] == null){
    //   setFormData((prevState) => ({
    //     ...prevState,
    //     [`commout_rate`]: 10,
    //     [`ovout_rate`]: 15,
    //   }));
    // }


  }

  const getpolicydata = (e) => {
    e.preventDefault();
    //get comm  ov setup
    axios
      .post(url + "/endorses/getpolicy", formData,headers)
      .then((res) => {
        console.log(res.data);
        setFormData(res.data);
      })
      .catch((err) => {
        alert(err.response.data);
        // alert("cant get aumphur");
      });
   
  }


  const handleSubmit = async (e) => {
    const data = []

    let t_ogName = null
    let t_firstName = null
    let t_lastName = null
    let idCardType = "idcard"
    let idCardNo = null
    let taxNo = null
    if (formData.personType === 'P') {
      t_firstName = formData.t_fn
      t_lastName = formData.t_ln
      idCardNo = formData.regisNo.toString()
      data.push({ ...formData, t_firstName: t_firstName, t_lastName: t_lastName, idCardNo: idCardNo, idCardType: idCardType, t_ogName: t_ogName, taxNo: taxNo })
    } else {
      t_ogName = formData.t_fn

      taxNo = formData.regisNo.toString()
      data.push({ ...formData, t_ogName: t_ogName, taxNo: taxNo, t_firstName: t_firstName, t_lastName: t_lastName, idCardNo: idCardNo, idCardType: idCardType })
    }
    data[0].specdiscamt = document.getElementsByName('specdiscamt')[0].value
    data[0].netgrossprem = document.getElementsByName('grossprem')[0].value - document.getElementsByName('specdiscamt')[0].value
    data[0].tax = document.getElementsByName('tax')[0].value
    data[0].duty = document.getElementsByName('duty')[0].value
    data[0].totalprem = document.getElementsByName('totalprem')[0].value 
    data[0].commin_amt = document.getElementsByName('commin_amt')[0].value 
    data[0].ovin_amt = document.getElementsByName('ovin_amt')[0].value 
    data[0].commout1_amt = document.getElementsByName('commout1_amt')[0].value 
    data[0].ovout1_amt = document.getElementsByName('ovout1_amt')[0].value 
    if (document.getElementsByName('commout2_amt')[0]) {
      data[0].commout2_amt = document.getElementsByName('commout2_amt')[0].value 
    }
    if (document.getElementsByName('ovout2_amt')[0]) {
      
      data[0].ovout2_amt = document.getElementsByName('ovout2_amt')[0].value 
    }
    data[0].commout_amt = document.getElementsByName('commout_amt')[0].value 
    data[0].ovout_amt = document.getElementsByName('ovout_amt')[0].value 
    console.log(data);
    e.preventDefault();
    await axios.post(url + "/policies/policydraft/batch", data,headers).then((res) => {
      alert("policy batch Created");
      window.location.reload(false);
    }).catch((err)=>{ alert("Something went wrong, Try Again.");});
  };


  useEffect(() => {
    
    // get province
    axios
      .get(url + "/static/provinces/all",headers)
      .then((province) => {
        // let token = res.data.jwt;
        // let decode = jwt_decode(token);
        // navigate("/");
        // window.location.reload();
        // localStorage.setItem("jwt", token);

        const array = [];
        province.data.forEach((ele) => {
          // array.push(
          //   <option value={ele.t_provincename} >
          //     {ele.t_provincename}
          //   </option>
          // );

          array.push({label:ele.t_provincename, value:ele.t_provincename})
        });
        setProvinceDD(array);
        // get title
        axios
          .get(url + "/static/titles/company/all",headers)
          .then((title) => {
            const array2 = [];
            title.data.forEach((ele) => {
              array2.push(
                <option key={ele.TITLEID} value={ele.TITLETHAIBEGIN}>
                  {ele.TITLETHAIBEGIN}
                </option>
              );
            });
            setTitleDD(array2);
          })
          .catch((err) => { });
      })
      .catch((err) => { });
    // get title all of company type

    //get insureType
    axios
      .get(url + "/insures/insuretypeall",headers)
      .then((insuretype) => {
        // let token = res.data.jwt;
        // let decode = jwt_decode(token);
        // navigate("/");
        // window.location.reload();
        // localStorage.setItem("jwt", token);

        // const array = [];
        // insuretype.data.forEach((ele) => {
        //   array.push(
        //     <option key={ele.id} value={ele.class}>
        //       {ele.class}
        //     </option>
        //   );
        // });

        const uniqueClasses = [...new Set(insuretype.data.map(ele => ele.class))];

        const array = uniqueClasses.map((className, index) => (
          <option key={index} value={className}>
            {className}
          </option>
        ));

        setInsureTypeDD(insuretype.data);
        setInsureClassDD(array);
      })
      .catch((err) => { });

    //get insurer
    axios
      .get(url + "/persons/insurerall",headers)
      .then((insurer) => {
        // let token = res.data.jwt;
        // let decode = jwt_decode(token);
        // navigate("/");
        // window.location.reload();
        // localStorage.setItem("jwt", token);

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
      .catch((err) => {
        // alert("cant get province");
      });

    //get motor brand
    axios
      .get(url + "/static/mt_brands/all",headers)
      .then((brands) => {
        // let token = res.data.jwt;
        // let decode = jwt_decode(token);
        // navigate("/");
        // window.location.reload();
        // localStorage.setItem("jwt", token);

        const array = [];
        brands.data.forEach((ele) => {
          // array.push(
          //   <option key={ele.id} value={ele.BRANDNAME}>
          //     {ele.BRANDNAME}
          //   </option>
          // );
          array.push({label:ele.BRANDNAME, value:ele.BRANDNAME})
        });
        setMotorbrandDD(array);
      })
      .catch((err) => { });

  }, []);

  return (
    <div>
      <h1 className="text-center">สลักหลังกรมธรรม์</h1>
      {/* policy table */}

      <div className="row my-3 ">
        <div className="col-1"></div>
          
          <label class="col-sm-2 col-form-label" htmlFor="insurerCode">
          เลขที่กรมธรรม์ 
          </label>
          <div class="col-2  ">
          <input
            className="form-control"
            type="text"
            value={formData.policyNo}
            name={`policyNo`}
            onChange={handleChange}
          />
        </div>

        <div class="col-2  ">
        <button type="button" name="btn_comm1" class="btn btn-primary align-bottom form-control" onClick={getpolicydata} >
          ค้นหา</button>
        </div>
        

        <div class="col-3">{/* null */}</div>
      </div>

      <div className="row form-group form-inline ">
        <div className="col-1"></div>
        <div className="col-2 form-group  ">
          <label class="form-label ">
            ประเภทสลักหลัง<span class="text-danger"> *</span>
          </label>
          <select
            className="form-control"
            name={`endorseType`}
            onChange={handleChange}
          >
            <option  selected disabled hidden>
              เลือกประเภทสลักหลัง
            </option>
            <option  value={'cancle'}>ยกเลิกกรมธรรม์</option>
            <option  value={'edit'}>แก้ไขส่วนลด</option>
          </select>
        </div>

        <div class="col-2 form-group ">
          <label class="form-label">
            วันที่เริ่มคุ้มครอง<span class="text-danger"> *</span>
          </label>
          {/* <input
            className="form-control"
            type="date"
            value={formData.actDate}
            name={`actDate`}
            onChange={handleChange}
          /> */}
          <DatePicker
                            style={{textAlign: 'center'}}
                            showIcon
                            className="form-control"
                            todayButton="Vandaag"
                            // isClearable
                            name="effDatestart"
                            showYearDropdown
                            dateFormat="dd/MM/yyyy"
                            dropdownMode="select"
                            id="actDate"
                            selected={formData.actDate}
                            onChange={(date) => handleChangeDate(date,'actDate')}
                                 />
        </div>

        <div class="col-2 form-group ">
          <label class="form-label ">
            วันที่สิ้นสุด<span class="text-danger"> *</span>
          </label>
          {/* <input
            className="form-control"
            type="date"
            value={formData.expDate}
            name={`expDate`}
            onChange={handleChange}
          /> */}
          <DatePicker
                            style={{textAlign: 'center'}}
                            showIcon
                            className="form-control"
                            todayButton="Vandaag"
                            // isClearable
                            name="effDatestart"
                            showYearDropdown
                            dateFormat="dd/MM/yyyy"
                            dropdownMode="select"
                            id="expDate"
                            selected={formData.expDate}
                            onChange={(date) => handleChangeDate(date,'expDate')}
                                 />
        </div>
        <div class="col-2 form-group ">
          <label class="form-label px-3">
            บริษัทรับประกัน<span class="text-danger"> *</span>
          </label>
          <select
            className="form-control"
            name={`insurerCode`}
            onChange={handleChange}
          >
            <option value={formData.insurerCode} selected disabled hidden>
              {formData.insurerCode}
            </option>
            {insurerDD}
          </select>
        </div>

        <div class="col-3">{/* null */}</div>
      </div>

      <div class="row">
        <div className="col-1"></div>
        

        <div class="col-2 form-group ">
          <label class="form-label px-3">
            รหัสผู้แนะนำ 1<span class="text-danger"> *</span>
          </label>
          <input
            className="form-control"
            type="text"
            value={formData.agentCode}
            name={`agentCode`}
            onChange={handleChange}
          />
        </div>

        <div class="col-2 form-group ">
          <label class="form-label px-3">
            รหัสผู้แนะนำ 2<span class="text-danger"> *</span>
          </label>
          <input
            className="form-control"
            type="text"
            value={formData.agentCode2}
            name={`agentCode2`}
            onChange={handleChange}
          />
        </div>
        <div class="col-2 form-group ">
          <div className="row">
            
          <div className="col form-group">
          <label class="form-label ">
            Class<span class="text-danger"> *</span>
          </label>
          <select
            className="form-control"
            name={`class`}
            onChange={handleChange}
          >
            <option value={formData.class} selected disabled hidden>
              {formData.class}
            </option>
            {insureClassDD}
          </select>
          </div>
          <div className="col form-group">
          <label class="form-label ">
            Subclass<span class="text-danger"> *</span>
          </label>
          <select
            className="form-control"
            name={`subClass`}
            onChange={handleChange}
          >
            <option value={formData.subClass} selected disabled hidden>
              {formData.subClass}
            </option>
            {insureSubClassDD}
          </select>
          </div>
          
          </div>
        
        </div>
        <div class="col-2 form-group ">
          <label class="form-label px-3">
            ทุนประกัน<span class="text-danger"> *</span>
          </label>
          <input
            className="form-control"
            type="number"
            step={0.1}
            value={formData.cover_amt}
            name={`cover_amt`}
            onChange={handleChange}
          />
        </div>
       
      </div>
      {/* policy table */}

      <div class="row">
        <div className="col-1"></div>
        <div class="col-2">
          <label class="form-label ">
            ค่าเบี้ย<span class="text-danger"> *</span>
          </label>
          <input
            className="form-control numbers"
            id="grossprem"
            type="number"
            step={0.1}
            value={formData.grossprem}    
            name={`grossprem`}
            onChange={(e) => handleChange(e)}
          />
{/* <NumberInputWithCommas value={formData.grossprem} name={`grossprem`} onChange={handleChange}  /> */}

        </div>

        <div class="col-2">
          <label class="form-label ">
            ส่วนลด % 
          </label>
          <div className="row">
            <div className="col">
              <input
                className="form-control"
                type="number"
                step={0.1}
                value={parseFloat(formData[`specdiscrate`]) }
                name={`specdiscrate`}
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="col">
              <input
                className="form-control"
                type="number"
                disabled
                step={0.1}
                value={parseFloat((formData[`specdiscrate`] * formData[`grossprem`] / 100).toFixed(2)) || 0}
                name={`specdiscamt`}
                onChange={(e) => handleChange(e)}
              />
            </div>
          </div>

        </div>

        <div class="col-2">
          <div className="row">
            <div className="col">
            <label class="form-label ">
            ค่าแสตมอากรณ์
          </label>
          <input
            className="form-control"
            type="number"
            step={0.1}
            disabled
            // netgrossprem * tax 
            value={parseFloat(((100 - formData[`specdiscrate`]) * formData[`grossprem`] / 100 * duty).toFixed(2)) || ""}
            //value={formData.duty}
            name={`duty`}
            onChange={handleChange}
          />
            </div>
            <div className="col">
            <label class="form-label ">
            ภาษี
          </label>
          <input
            className="form-control"
            type="number"
            step={0.1}
            disabled
            // netgrossprem * tax 
            value={parseFloat(((100 - formData[`specdiscrate`]) * formData[`grossprem`] / 100 * tax).toFixed(2)) || ""}
            //value={formData.tax}
            name={`tax`}
            onChange={handleChange}
          />
            </div>
            
          </div>
          
        </div>

        <div class="col-2">
          <label class="form-label ">
            ค่าเบี้ยรวม<span class="text-danger"> *</span>
          </label>
          <input
            type="number" // Use an input element for displaying numbers
            className="form-control"
            // value={formData.totalprem} // Display the totalprem value from the state
            //value={parseFloat(formData.grossprem) - parseFloat(formData.duty) - parseFloat(formData.tax)}
            value={parseFloat(((100 - formData[`specdiscrate`]) * formData[`grossprem`] / 100 * (1 + duty +tax)).toFixed(2)) || ""}
            step={0.1}
            name={`totalprem`}
            readOnly
          />
        </div>
      </div>

      <div class="row">
        <div className="col-1"></div>
        <div class="col-2">
          <label class="form-label ">
            comm_in% <span class="text-danger"> *</span>
          </label>
          <div className="row">
            <div className="col">
              <input
                className="form-control"
                type="number"
                step={0.1}
                value={formData[`commin_rate`]}
                name={`commin_rate`}
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="col">
              <input
                className="form-control"
                type="number"
                disabled
                step={0.1}
                value={parseFloat((formData[`commin_rate`] * (100 - formData[`specdiscrate`]) * formData[`grossprem`] / 10000 ).toFixed(2))|| ""}
                name={`commin_amt`}
                onChange={(e) => handleChange(e)}
              />
            </div>
          </div>

        </div>


        <div class="col-2">
          <label class="form-label ">
            OV_in % <span class="text-danger"> *</span>
          </label>
          <div className="row">
            <div className="col">
              <input
                className="form-control"
                type="number"
                step={0.1}
                value={formData[`ovin_rate`]}
                name={`ovin_rate`}
                onChange={handleChange}
              />
            </div>
            <div className="col">
              <input
                className="form-control"
                type="number"
                disabled
                step={0.1}
                name={`ovin_amt`}
                value={parseFloat((formData[`ovin_rate`]  * (100 - formData[`specdiscrate`]) * formData[`grossprem`] / 10000 ).toFixed(2)) || ""}
                onChange={handleChange}
              />
            </div>
          </div>

        </div>

        <div class="col-2">
          <label class="form-label ">
            comm_out% (1)<span class="text-danger"> *</span>
          </label>
          <div className="row">
            <div className="col">
              <input
                className="form-control"
                type="number"
                step={0.1}
                value={formData[`commout1_rate`]}
                name={`commout1_rate`}
                onChange={handleChange}
              />
            </div>
            <div className="col">
              <input
                className="form-control"
                type="number"
                disabled
                step={0.1}
                value={parseFloat((formData[`commout1_rate`]  * (100 - formData[`specdiscrate`]) * formData[`grossprem`] / 10000 ).toFixed(2)) || ""}
                name={`commout1_amt`}
                onChange={handleChange}
              />
            </div>

          </div>
        </div>
        <div class="col-2">
          <label class="form-label ">
            OV_out % (1)<span class="text-danger"> *</span>
          </label>

          <div className="row">
            <div className="col">
              <input
                className="form-control"
                type="number"
                step={0.1}
                value={formData[`ovout1_rate`]}
                name={`ovout1_rate`}
                onChange={handleChange}
              />
            </div>
            <div className="col">
              <input
                className="form-control"
                type="number"
                disabled
                step={0.1}
                name={`ovout1_amt`}
                //value={(formData[`ovout1_rate`] * formData[`grossprem`]) / 100 || ""}
                value={parseFloat((formData[`ovout1_rate`]  * (100 - formData[`specdiscrate`]) * formData[`grossprem`] / 10000 ).toFixed(2)) || ""}
                onChange={handleChange}
              />
            </div>

          </div>
        </div>
        {/* <div class="col-1 align-bottom">
        
          <button type="button" name="btn_comm1" class="btn btn-primary align-bottom form-control" onClick={getcommov} >ค่า comm/ov : ผู้แนะนำคนที่ 1</button>
        </div> */}


      </div>

      <div class="row">
        <div className="col-1"></div>
        <div class="col-2">
          <label class="form-label ">
            comm_out% (2)<span class="text-danger"> *</span>
          </label>
          <div className="row">
            <div className="col">
              <input
                className="form-control"
                type="number"
                step={0.1}
                value={formData[`commout2_rate`]}
                name={`commout2_rate`}
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="col">
              <input
                className="form-control"
                type="number"
                disabled
                step={0.1}
                //value={(formData[`commin2_rate`] * formData[`grossprem`]) / 100 || ""}
                value={parseFloat((formData[`commout2_rate`]  * (100 - formData[`specdiscrate`]) * formData[`grossprem`] / 10000 ).toFixed(2)) || ""}
                name={`commout2_amt`}
                onChange={(e) => handleChange(e)}
              />
            </div>
          </div>

        </div>


        <div class="col-2">
          <label class="form-label ">
            OV_out % (2)<span class="text-danger"> *</span>
          </label>
          <div className="row">
            <div className="col">
              <input
                className="form-control"
                type="number"
                step={0.1}
                value={formData[`ovout2_rate`]}
                name={`ovout2_rate`}
                onChange={handleChange}
              />
            </div>
            <div className="col">
              <input
                className="form-control"
                type="number"
                disabled
                step={0.1}
                name={`ovout2_amt`}
                //value={(formData[`ovin2_rate`] * formData[`grossprem`]) / 100 || ""}
                value={parseFloat((formData[`ovout2_rate`]  * (100 - formData[`specdiscrate`]) * formData[`grossprem`] / 10000 ).toFixed(2)) || ""}
                onChange={handleChange}
              />
            </div>
          </div>

        </div>

        <div class="col-2">
          <label class="form-label ">
            comm_out% (sum)<span class="text-danger"> *</span>
          </label>
          <div className="row">
            <div className="col">
              <input
                className="form-control"
                type="number"
                step={0.1}
                value={parseFloat(formData[`commout1_rate`] || 0)  + parseFloat(formData[`commout2_rate`] || 0)}
                name={`commout_rate`}
                onChange={handleChange}
              />
            </div>
            <div className="col">
              <input
                className="form-control"
                type="number"
                disabled
                step={0.1}
                // value={parseFloat((formData[`commout_rate`]  * (100 - formData[`specdiscrate`]) * formData[`grossprem`] / 10000 ).toFixed(2)) || ""}
                value={((document.getElementsByName(`commout_rate`)[0] ? document.getElementsByName(`commout_rate`)[0].value: 0) * ((100 - formData[`specdiscrate`]) * formData[`grossprem`] / 10000 ).toFixed(2)) || ''}
                name={`commout_amt`}
                onChange={handleChange}
              />
            </div>

          </div>
        </div>
        <div class="col-2">
          <label class="form-label ">
            OV_out % (sum)<span class="text-danger"> *</span>
          </label>

          <div className="row">
            <div className="col">
              <input
                className="form-control"
                type="number"
                step={0.1} 
                value={parseFloat(formData[`ovout1_rate`] || 0)  + parseFloat(formData[`ovout2_rate`] || 0)}
                name={`ovout_rate`}
                onChange={handleChange}
              />
            </div>
            <div className="col">
              <input
                className="form-control"
                type="number"
                disabled
                step={0.1}
                name={`ovout_amt`}
                //value={(formData[`ovout2_rate`] * formData[`grossprem`]) / 100 || ""}
                value={((document.getElementsByName(`ovout_rate`)[0] ? document.getElementsByName(`ovout_rate`)[0].value: 0) * ((100 - formData[`specdiscrate`]) * formData[`grossprem`] / 10000 ).toFixed(2)) || ''}
                onChange={handleChange}
              />
            </div>

          </div>
        </div>
        {/* <div class="col-1 align-bottom">

          <button type="button" name="btn_comm2" class="btn btn-primary align-bottom" onClick={getcommov} >ค่า comm/ov : ผู้แนะนำคนที่ 2</button>
        </div> */}


      </div>
      {/* entity table */}
      <div class="row">
        <div className="col-1"></div>
        <div class="col-1">
          <label class="form-label ">
            type<span class="text-danger"> *</span>
          </label>
          <select
            className="form-control"
            name={`personType`}
            onChange={handleChange}
          >
            <option value={formData.personType} disabled selected hidden>
              {formData.personType}
            </option>
            <option value="P">บุคคล</option>
            <option value="O">นิติบุคคล</option>
          </select>
        </div>

        <div class="col-1">
          <label class="form-label ">
            คำนำหน้า<span class="text-danger"> </span>
          </label>
          <select
            className="form-control"
            name={`title`}
            onChange={handleChange}
          >
            <option value={formData.title} disabled selected hidden>
              {formData.title}
            </option>
            {titleDD}
          </select>
        </div>

        <div class="col-2">
          <label class="form-label ">
            ชื่อ<span class="text-danger"> *</span>
          </label>
          <input
            className="form-control"
            type="text"
            value={formData.t_fn}
            name={`t_fn`}
            onChange={handleChange}
          />
        </div>
        {formData.personType === "P" ? (
          <div class="col-2">
            <label class="form-label ">
              นามสกุล<span class="text-danger"> *</span>
            </label>
            <input
              className="form-control"
              type="text"
              value={formData.t_ln}
              name={`t_ln`}
              onChange={handleChange}
            />
          </div>
        ) : (
          <div class="col-2">
            <label class="form-label ">
              นามสกุล<span class="text-danger"></span>
            </label>
            <input
              className="form-control"
              type="text"
              readOnly
              value={formData.t_ln}
              name={`t_ln`}
              onChange={handleChange}
            />
          </div>
        )}

        <div class="col-2">
          <label class="form-label ">
            เลขประจำตัว<span class="text-danger"> *</span>
          </label>
          <input
            className="form-control"
            type="text"
            value={formData.regisNo}
            name={`regisNo`}
            onChange={handleChange}
          />
        </div>
      </div>
      {/* location table */}
      <div class="row">
        <div className="col-1"></div>
        <div class="col-2">
          <label class="form-label ">
            บ้านเลขที่<span class="text-danger"> *</span>
          </label>
          <input
            className="form-control"
            type="text"
            name={`t_location_1`}
            value={formData.t_location_1}
            onChange={handleChange}
          />
        </div>
        <div class="col-2">
          <label class="form-label ">
            หมู่บ้าน/อาคาร<span class="text-danger"> *</span>
          </label>
          <input
            className="form-control"
            type="text"
            name={`t_location_2`}
            value={formData.t_location_2}
            onChange={handleChange}
          />
        </div>
        <div class="col-2">
          <label class="form-label ">
            หมู่<span class="text-danger"> *</span>
          </label>
          <input
            type="text"
            className="form-control"
            name={`t_location_3`}
            value={formData.t_location_3}
            onChange={handleChange}
          />
        </div>
        <div class="col-2">
          <label class="form-label ">
            ซอย<span class="text-danger"> *</span>
          </label>
          <input
            className="form-control"
            type="text"
            name={`t_location_4`}
            value={formData.t_location_4}
            onChange={handleChange}
          />
        </div>
        <div class="col-2">
          <label class="form-label ">
            ถนน<span class="text-danger"> *</span>
          </label>
          <input
            className="form-control"
            type="text"
            name={`t_location_5`}
            value={formData.t_location_5}
            onChange={handleChange}
          />
        </div>
      </div>
      <div class="row">
        <div className="col-1"></div>
        <div class="col-2">
          <label class="form-label ">
            จังหวัด<span class="text-danger"> *</span>
          </label>
          {/* <Typeahead
            className="form-control"
            labelKey={`province`}
            onChange={handleChange}
            options={provinceDD}
            search
          /> */}
          <Select
          // className="form-control"
          name={`province`}
          onChange={ (e) =>changeProvince(e)}
          options={provinceDD}
          styles={{zIndex:2000}}
          // onChange={opt => console.log(opt)}
          />
            {/* <option value={formData.province} disabled selected hidden>
              {formData.province}
            </option>
            {provinceDD} */}
          
        </div>
        <div class="col-2">
          <label class="form-label ">
            อำเภอ<span class="text-danger"> *</span>
          </label>
          {/* <select
            className="form-control"
            name={`district`}
            onChange={handleChange}
            search
          >
            <option value={formData.district} disabled selected hidden>
              {formData.district}
            </option>
            {districDD}
          </select> */}

          <Select
          // className="form-control"
          name={`district`}
          onChange={ (e) =>changeDistrict(e)}
          options={districDD}
          />

        </div>
        <div class="col-2">
          <label class="form-label ">
            ตำบล<span class="text-danger"> *</span>
          </label>
          {/* <select
            className="form-control"
            name={`subdistrict`}
            onChange={handleChange}
          >
            <option value={formData.subdistrict} disabled selected hidden>
              {formData.subdistrict}
            </option>
            {subDistricDD}
          </select> */}

          <Select
          // className="form-control"
          name={`subdistrict`}
          onChange={ (e) =>setFormData((prevState) => ({
            ...prevState,
            subdistrict: e.value,
          }))}
          options={subDistricDD}
          />

        </div>
        <div class="col-2">
          <label class="form-label ">
            รหัสไปรษณี<span class="text-danger"> *</span>
          </label>
          {/* <select
            className="form-control"
            name={`zipcode`}
            onChange={handleChange}
          >
            <option value={formData.zipcode} disabled selected hidden>
              {formData.zipcode}
            </option>
            {zipcodeDD}
          </select> */}
        <Select
          // className="form-control"
          name={`zipcode`}
          onChange={ (e) =>setFormData((prevState) => ({
            ...prevState,
            zipcode: e.value,
          }))}
          options={zipcodeDD}
          />

        </div>
      </div>
      {/* motor table */}
      {formData.class === "MO" ? (
        <>
          <div class="row">
            <div className="col-1"></div>
            <div class="col-2">
              <label class="form-label ">
                เลขทะเบียนรถ<span class="text-danger"> *</span>
              </label>
              <input
                className="form-control"
                type="text"
                name={`licenseNo`}
                value={formData.licenseNo}
                onChange={handleChange}
              />
            </div>
            <div class="col-2">
              <label class="form-label ">
                ยี่ห้อรถยนต์<span class="text-danger"> *</span>
              </label>

              {/* <select
                className="form-control"
                name={`brandname`}
                onChange={handleChange}
              >
                <option value={formData.brandname} selected disabled hidden>
                  {formData.brandname}
                </option>
                {motorbrandDD}
              </select> */}

              <Select
          // className="form-control"
          name={`brandname`}
          onChange={ (e) =>changeMotorBrand(e)}
          options={motorbrandDD}
          />

            </div>
            <div class="col-2">
              <label class="form-label ">
                รุ่น<span class="text-danger"> *</span>
              </label>

              {/* <select
                className="form-control"
                name={`modelname`}
                onChange={handleChange}
              >
                <option value={formData.modelname} selected disabled hidden>
                  {formData.modelname}
                </option>
                {motormodelDD}
              </select> */}

              <Select
          // className="form-control"
          name={`modelname`}
          onChange={ (e) =>setFormData((prevState) => ({
            ...prevState,
            modelname: e.value,
          }))}
          options={motormodelDD}
          />

            </div>
            <div class="col-2">
              <label class="form-label ">
                เลขตัวถังรถ<span class="text-danger"> *</span>
              </label>
              <input
                className="form-control"
                type="text"
                name={`chassisNo`}
                value={formData.chassisNo}
                onChange={handleChange}
              />
            </div>
            <div class="col-2">
              <label class="form-label ">
                ปีที่จดทะเบียน<span class="text-danger"> *</span>
              </label>
              <input
                className="form-control"
                type="text"
                name={`modelYear`}
                value={formData.modelYear}
                onChange={handleChange}
              />
            </div>
          </div>
        </>
      ) : null}
      <div class="row">
        <div className="col-1"></div>
        <div class="col-2">
          <label class="form-label ">
            เบอร์โทรศัพท์<span class="text-danger"> *</span>
          </label>
          <input
            className="form-control"
            type="text"
            value={formData.telNum_2}
            name={`telNum_2`}
            onChange={handleChange}
          />
        </div>
        <div class="col-2">
          <label class="form-label ">
            E-mail<span class="text-danger"> *</span>
          </label>
          <input
            className="form-control"
            type="text"
            value={formData.Email}
            name={`Email`}
            onChange={handleChange}
          />
        </div>
      </div>
      <div class="d-flex justify-content-center">

        <button className="p-2 btn btn-primary" name="saveChange" onClick={handleSubmit}>
          บันทึก
        </button>

      </div>
    </div>
  );
};

export default EndorseScreen;
