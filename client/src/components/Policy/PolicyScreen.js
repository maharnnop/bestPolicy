import axios from "axios";
import * as XLSX from "xlsx";
import { useEffect, useState } from "react";
import { CenterPage } from "../StylesPages/AdminStyles";
import { Container } from "../StylesPages/PagesLayout";
import { async } from "q";
import Select from 'react-select';
import { useCookies } from "react-cookie";
import { date, number } from "joi";
import { numberWithCommas } from '../lib/number';
import { BiSearchAlt } from "react-icons/bi";
import Modal from 'react-bootstrap/Modal';
import ModalSearchAgent from "./ModalSearchAgent";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const config = require("../../config.json");

const PolicyScreen = (props) => {

  const [cookies, setCookie, removeCookie] = useCookies(["jwt"]);
  const headers = {
    headers: { Authorization: `Bearer ${cookies["jwt"]}` }
  };
  const url = window.globalConfig.BEST_POLICY_V1_BASE_URL;
  const tax = config.tax;
  const duty = config.duty;
  const withheld = config.witheld;
  const motorcode = config.motorcode;
  let datenow = new Date()
  datenow = datenow.toISOString().substring(0, 10);

  //import excel
  const [formData, setFormData] = useState({
    grossprem: 0,
    specdiscamt: 0,
    netgrossprem: 0,
    specdiscrate: 0,
    duty: 0,
    tax: 0,
    totalprem: 0,
    withheld: 0,
    agentCode: '',
    agentCode2: '',
    unregisterflag: 'Y',
    actTime: "16:30",
    expTime: "16:30",
  });
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
  const [hidecard, setHidecard] = useState([false, 0]);
  const [showMotorData, setShowMotorData] = useState(false);

  //for modal
  const editCard = (e, name) => {
    // console.log(policiesData[e.target.id]);

    setHidecard([true, name])

  };
  const handleChangeCard = (e, name, data) => {
    console.log(data);
    setFormData((prevState) => ({
      ...prevState,
      [name]: data,
    }))
    setHidecard([false, 0])


  };
  const handleClose = (e) => {
    setHidecard([false, 0])
  }
  //end modal

  const handleChange = async (e) => {
    e.preventDefault();
    // console.log(e);
    if (e.target.name === 'branch') {
      const value = e.target.value;
      // Check if the input is a number and has a length of 5 or less
      if (/^\d+$/.test(value)) {
        // Format the value with leading zeros
        let formattedValue = value.padStart(5, "0");
        if (value.length > 5) {
          formattedValue = value.substring(1)
        }
        setFormData((prevState) => ({
          ...prevState,
          'branch': formattedValue,
        }));
        document.getElementsByName('branch')[0].value = formattedValue
      } else {
        document.getElementsByName('branch')[0].value = value.replace(/[^0-9]/g, '')
      }
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }));
    }
    //set dropdown title follow to personType
    if (e.target.name === "personType") {
      if (e.target.value === "P") {
        axios
          .get(url + "/static/titles/person/all", headers)
          .then((title) => {
            const array2 = [];
            title.data.forEach((ele) => {
              array2.push(
                // <option key={ele.TITLEID} value={ele.TITLETHAIBEGIN}>
                //   {ele.TITLETHAIBEGIN}
                // </option>
                { label: ele.TITLETHAIBEGIN, value: ele.TITLEID, label2: ele.TITLETHAIEND || '' }
              );

            });
            setTitleDD(array2);
          })
          .catch((err) => { });
      } else {
        axios
          .get(url + "/static/titles/company/all", headers)
          .then((title) => {
            const array2 = [];
            title.data.forEach((ele) => {
              array2.push(
                // <option key={ele.TITLEID} value={ele.TITLETHAIBEGIN}>
                //   {ele.TITLETHAIBEGIN}
                // </option>
                { label: ele.TITLETHAIBEGIN, value: ele.TITLEID, label2: ele.TITLETHAIEND || '' }
              );
            });
            setTitleDD(array2);
            const withheldamt = parseFloat(((formData.netgrossprem + formData.duty) * withheld).toFixed(2))
            setFormData((prevState) => ({
              ...prevState,
              withheld: withheldamt,
            }));
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

  };

  const handleChangeActdate = (e) => {
    e.preventDefault();
    console.log(e.target.value);
    console.log(typeof (e.target.value));
    const originalDate = new Date(e.target.value);

    // Add one year (365 days) to the date
    originalDate.setFullYear(originalDate.getFullYear() + 1);

    // Convert the updated Date object back to a string
    const updatedDateString = originalDate.toISOString().substring(0, 10);


    setFormData((prevState) => ({
      ...prevState,
      actDate: e.target.value,
      expDate: updatedDateString
    }));


  };

  function validateDate(e) {
    e.preventDefault();
    let mindate = new Date()
    let maxdate = new Date()
    if (e.target.name === 'actDate') {
      mindate.setFullYear(mindate.getFullYear() - 3)
      maxdate.setFullYear(maxdate.getFullYear() + 3)
    } else if (e.target.name === 'expDate') {
      mindate.setFullYear(mindate.getFullYear() - 4)
      maxdate.setFullYear(maxdate.getFullYear() + 4)
    }

    const inputDate = new Date(e.target.value);
    let actdate = ''
    let expdate = ''

    if (inputDate < mindate) {
      actdate = mindate.toISOString().substring(0, 10)
      mindate.setFullYear(mindate.getFullYear() + 1)
      expdate = mindate.toISOString().substring(0, 10)
    } else if (inputDate > maxdate) {
      actdate = maxdate.toISOString().substring(0, 10)
      maxdate.setFullYear(maxdate.getFullYear() + 1)
      expdate = maxdate.toISOString().substring(0, 10)
    } else {
      actdate = e.target.value
      inputDate.setFullYear(inputDate.getFullYear() + 1)
      expdate = inputDate.toISOString().substring(0, 10)
    }

    if (e.target.name === 'actDate') {
      setFormData((prevState) => ({
        ...prevState,
        actDate: actdate,
        expDate: expdate
      }));
      // document.getElementsByName("actDate")[0].value = actdate
    } else if (e.target.name === 'expDate') {
      setFormData((prevState) => ({
        ...prevState,
        expDate: actdate
      }));
      // document.getElementsByName("expDate")[0].value = actdate
    }
  }

  function validateCitizenID(e) {
    // Remove any non-numeric characters
    const citizenID = document.getElementsByName("regisNo")[0].value
    const m = citizenID.match(/(\d{12})(\d)/)
    if (!m) {
      console.warn('Bad input from user, invalid thaiId=', citizenID)
      alert('เลขบัตรประชาชนไม่ครบ 13 หลัก')
      document.getElementsByName("regisNo")[0].value = ''
      return
    }
    const digits = m[1].split('');
    const sum = digits.reduce((total, digit, i) => {
      return total + (13 - i) * +digit;
    }, 0)
    const lastDigit = `${(11 - sum % 11) % 10}`
    const inputLastDigit = m[2]
    if (lastDigit !== inputLastDigit) {
      alert('เลขบัตรประชาชนไม่ถูกต้อง')
      document.getElementsByName("regisNo")[0].value = ''
      return
    }


    // You can add more specific validation rules here, like checking for a valid checksum or pattern.

    // If all checks pass, the citizen ID is considered valid

  }
  function isEmailValid(e) {
    // Regular expression for a basic email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const email = document.getElementsByName("Email")[0].value
    // Use the test method of the regex to check if the email matches the pattern
    if (!emailRegex.test(email)) {
      alert('Email ไม่ถูกต้อง')
      document.getElementsByName("Email")[0].value = ''
    }
  }
  function isPhoneNumberValid(e) {
    // Regular expression for a Thai phone number format
    const phoneRegex = /^0\d{9}$/;
    const phoneNumber = document.getElementsByName("telNum_1")[0].value
    // Use the test method of the regex to check if the phone number matches the pattern
    if (!phoneRegex.test(phoneNumber)) {
      document.getElementsByName("telNum_1")[0].value = ''
      alert('หมายเลขมือถือผิด')
    }
  }
  const handleChangePrem = async (e) => {
    e.preventDefault();
    // console.log(e);

    //  set totalprem
    if (e.target.name === 'grossprem') {
      const netgrosspremamt = e.target.value - formData.specdiscamt
      const dutyamt = Math.ceil(netgrosspremamt * duty)
      const taxamt = parseFloat(((netgrosspremamt + dutyamt) * tax).toFixed(2))
      const totalpremamt = netgrosspremamt + dutyamt + taxamt
      setFormData((prevState) => ({
        ...prevState,
        grossprem: e.target.value,
        netgrossprem: netgrosspremamt,
        duty: dutyamt,
        tax: taxamt,
        totalprem: totalpremamt,
      }));
    } else if (e.target.name === 'specdiscrate') {
      const specdiscamt = parseFloat((e.target.value * formData.grossprem / 100).toFixed(2))
      const netgrosspremamt = formData.grossprem - specdiscamt
      const dutyamt = Math.ceil(netgrosspremamt * duty)
      const taxamt = parseFloat(((netgrosspremamt + dutyamt) * tax).toFixed(2))
      const totalpremamt = netgrosspremamt + dutyamt + taxamt
      setFormData((prevState) => ({
        ...prevState,
        specdiscrate: e.target.value,
        specdiscamt: specdiscamt,
        netgrossprem: netgrosspremamt,
        duty: dutyamt,
        tax: taxamt,
        totalprem: totalpremamt,
      }));
    }
    else {
      if (e.target.name === 'commin_rate') {
        setFormData((prevState) => ({
          ...prevState,
          [e.target.name]: e.target.value,
          commin_amt: (formData[`commin_rate`] * formData[`grossprem`]) / 100
        }));
      } else if (e.target.name === 'ovin_rate') {
        setFormData((prevState) => ({
          ...prevState,
          [e.target.name]: e.target.value,
          ovin_amt: (formData[`ovin_rate`] * formData[`grossprem`]) / 100
        }));
      } else if (e.target.name === 'commout_rate') {
        setFormData((prevState) => ({
          ...prevState,
          [e.target.name]: e.target.value,
          commout_amt: (formData[`commout_rate`] * formData[`grossprem`]) / 100
        }));
      } else if (e.target.name === 'ovout_rate') {
        setFormData((prevState) => ({
          ...prevState,
          [e.target.name]: e.target.value,
          ovout_amt: (formData[`ovout_rate`] * formData[`grossprem`]) / 100
        }));
      }
      setFormData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }));
    }
  };




  const changeProvince = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      province: e.value,
    }));
    getDistrict(e.value);


  }
  const changeDistrict = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      district: e.value,
    }));
    getSubDistrict(e.value);
  }
  const changeSubDistrict = (e) =>{
    setFormData((prevState) => ({
      ...prevState,
      subdistrict: e.value,
    }));
    const postcode = subDistricDD.find(el => el.value === e.value).postcode;
    
    const arrayZip = postcode.map((zip, index) => (
      <option key={index} value={zip}>
        {zip}
      </option>
    ));
    setZipCodeDD(arrayZip);
        setFormData((prevState) => ({
          ...prevState,
          zipcode: postcode[0]
        }))
  }
  const changeMotorBrand = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      brandname: e.value,
    }));
    getMotormodel(e.value);
  }

  const getDistrict = (provincename) => {
    //get distric in province selected
    axios
      .post(url + "/static/amphurs/search", { provincename: provincename }, headers)
      .then((distric) => {
        const array = [];
        distric.data.forEach((ele) => {
          // array.push(
          //   <option id={ele.amphurid} value={ele.t_amphurname} value2={ele.t_amphurname}>
          //     {ele.t_amphurname}
          //   </option>
          // );
          array.push({ label: ele.t_amphurname, value: ele.t_amphurname })
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
      .post(url + "/static/mt_models/search", { brandname: brandname }, headers)
      .then((model) => {
        const array = [];
        model.data.forEach((ele) => {
          // array.push(
          //   <option value={ele.MODEL} >
          //     {ele.MODEL}
          //   </option>
          // );
          array.push({ label: ele.MODEL, value: ele.MODEL })
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
      .post(url + "/static/tambons/search", { amphurname: amphurname }, headers)
      .then((subdistric) => {
        const arraySub = [];
        const arrayZip = [];
        const zip = [];
        subdistric.data.forEach((ele) => {
          
          arraySub.push({ label: ele.t_tambonname, value: ele.t_tambonname,  postcode: ele.postcodeall.split("/")  })
        
        });
       
        setSubDistricDD(arraySub);
      })
      .catch((err) => {
        // alert("cant get tambons");
      });
  };

  const getcommov = (e) => {
    e.preventDefault();
    //get comm  ov setup
    let i = 1
    if (e.target.name === 'btn_comm1') {
      i = 1
    } else if (e.target.name === 'btn_comm2') {
      i = 2
    }
    axios
      .post(url + "/insures/getcommov", formData, headers)
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
    await axios.post(url + "/policies/policydraft/batch", data, headers).then((res) => {
      alert("policy batch Created");
      window.location.reload(false);
    }).catch((err) => { alert("Something went wrong, Try Again."); });
  };


  useEffect(() => {

    // get province
    axios
      .get(url + "/static/provinces/all", headers)
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

          array.push({ label: ele.t_provincename, value: ele.t_provincename })
        });
        setProvinceDD(array);
        // get title
        axios
          .get(url + "/static/titles/company/all", headers)
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
      .get(url + "/insures/insuretypeall", headers)
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
      .get(url + "/persons/insurerall", headers)
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
      .get(url + "/static/mt_brands/all", headers)
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
          array.push({ label: ele.BRANDNAME, value: ele.BRANDNAME })
        });
        setMotorbrandDD(array);
      })
      .catch((err) => { });

  }, []);

  return (
    <div>
      <Modal size="l" show={hidecard[0]} onHide={handleClose} >
        <Modal.Header closeButton>
          <Modal.Title >ค้นหาผู้แนะนำ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {<ModalSearchAgent name={hidecard[1]} formData={formData} setFormData={handleChangeCard} />}
        </Modal.Body>

      </Modal>

      <h1 className="text-center">สร้างรายการกรมธรรม์</h1>
      {/* policy table */}

      <div className="row form-group form-inline ">
        <div className="col-1"></div>
        {/* <div className="col-2 form-group  ">
          <label class="form-label ">
            เลขที่กรมธรรม์<span class="text-danger"> *</span>
          </label>
          <input
            className="form-control"
            type="text"
            value={formData.policyNo || ''}
            name={`policyNo`}
            onChange={handleChange}
          />
        </div> */}

        <div class="col-2 form-group ">
          <label class="form-label">
            วันที่เริ่มคุ้มครอง<span class="text-danger"> *</span>
          </label>
          <input

            className="form-control"
            type="date"
            format="dd/MM/yyyy"
            value={formData.actDate}
            name={`actDate`}
            onChange={handleChangeActdate}
            onBlur={(e) => validateDate(e)}
          />

        </div>
        <div class="col-2 form-group ">
          <label class="form-label">
            เวลาเริ่มคุ้มครอง<span class="text-danger"> *</span>
          </label>
          <input

            className="form-control"
            type="time"
            format="dd/MM/yyyy"
            defaultValue={"16:30"}
            name={`actTime`}
            onChange={handleChangeActdate}
            onBlur={(e) => validateDate(e)}
          />

        </div>
        <div class="col-2 form-group ">
          <label class="form-label ">
            วันที่สิ้นสุด<span class="text-danger"> *</span>
          </label>
          <input
            className="form-control"
            type="date"

            value={formData.expDate}
            name={`expDate`}
            onChange={handleChange}
            onBlur={(e) => validateDate(e)}
          />
        </div>
        <div class="col-2 form-group ">
          <label class="form-label ">
            เวลาสิ้นสุด<span class="text-danger"> *</span>
          </label>
          <input
            className="form-control"
            type="time"
            defaultValue={"16:30"}
            name={`expTime`}
            onChange={handleChange}
            onBlur={(e) => validateDate(e)}
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
          <div class="input-group mb-3">
            <input
              className="form-control"
              type="text"
              value={formData.agentCode}
              name={`agentCode`}
              onChange={handleChange}
            />
            <div class="input-group-append">
              <button class="btn btn-primary" type="button" name="btn-agent1" onClick={(e) => editCard(e, 'agentCode')}><BiSearchAlt style={{ fontSize: "30px", color: "white" }} /></button>
            </div>
          </div>
        </div>

        <div class="col-2 form-group ">
          <label class="form-label px-3">
            รหัสผู้แนะนำ 2
          </label>
          <div class="input-group mb-3">
            <input
              className="form-control"
              type="text"
              value={formData.agentCode2}
              name={`agentCode2`}
              onChange={handleChange}
            />
            <div class="input-group-append">
              <button class="btn btn-primary" type="button" name="btn-agent2" onClick={(e) => editCard(e, "agentCode2")}><BiSearchAlt style={{ fontSize: "30px", color: "white" }} /></button>
            </div>
          </div>

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
            defaultValue={formData.cover_amt}
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
            เบี้ย<span class="text-danger"> *</span>
          </label>
          <input
            className="form-control numbers"
            id="grossprem"
            type="number"
            step={0.1}
            value={formData.grossprem}
            name={`grossprem`}
            onChange={(e) => handleChangePrem(e)}
          />
          {/* <NumberInputWithCommas value={formData.grossprem} name={`grossprem`} onChange={handleChange}  /> */}

        </div>

        <div class="col-2">
          <label class="form-label ">
            ส่วนลด walkin
          </label>
          <div className="row">
            <div className="col">
              <input
                className="form-control"
                type="number"
                step={0.1}
                value={parseFloat(formData[`specdiscrate`])}
                name={`specdiscrate`}
                onChange={(e) => handleChangePrem(e)}
              />
            </div>
            <div className="col">
              <input
                className="form-control"
                type="number"
                disabled
                step={0.1}
                // value={parseFloat((formData[`specdiscrate`] * formData[`grossprem`] / 100).toFixed(2)) || 0}
                value={formData.specdiscamt}
                name={`specdiscamt`}
                onChange={(e) => handleChange(e)}
              />
            </div>
          </div>

        </div>

        <div class="col-2">
          <label class="form-label ">
            เบี้ยสุทธิ
          </label>
          <input
            type="number" // Use an input element for displaying numbers
            className="form-control"
            //value={parseFloat(formData.grossprem) - parseFloat(formData.duty) - parseFloat(formData.tax)}
            // value={parseFloat(((100 - formData[`specdiscrate`]) * formData[`grossprem`] / 100 * (1 + duty +tax)).toFixed(2)) || ""}
            value={formData.netgrossprem} // Display the totalprem value from the state
            step={0.1}
            name={`withheld`}
            disabled
          />
        </div>

        <div class="col-2">
          <div className="row">
            <div className="col">
              <label class="form-label ">
                อากร
              </label>
              <input
                className="form-control"
                type="number"
                step={0.1}
                disabled
                // netgrossprem * tax 
                // value={parseFloat(((100 - formData[`specdiscrate`]) * formData[`grossprem`] / 100 * duty).toFixed(2)) || 0}
                value={formData.duty}
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

                // value={parseFloat((((100 - formData[`specdiscrate`]) * formData[`grossprem`] / 100 )* tax).toFixed(2)) || ""}
                value={formData.tax}
                name={`tax`}
                onChange={handleChange}
              />
            </div>

          </div>

        </div>

        <div class="col-2">
          <label class="form-label ">
            เบี้ยรวม<span class="text-danger"> *</span>
          </label>
          <input
            type="number" // Use an input element for displaying numbers
            className="form-control"
            //value={parseFloat(formData.grossprem) - parseFloat(formData.duty) - parseFloat(formData.tax)}
            // value={parseFloat(((100 - formData[`specdiscrate`]) * formData[`grossprem`] / 100 * (1 + duty +tax)).toFixed(2)) || ""}
            value={formData.totalprem} // Display the totalprem value from the state
            step={0.1}
            name={`totalprem`}
            disabled
          />
        </div>



      </div>

      <div class="row">
        <div className="col-1"></div>
        <div class="col-2">

          <label class="form-label">
            Comm/OV IN
          </label>
        </div>
        <div class="col-3">
          <label class="form-label ">
            Comm Rate/Amt<span class="text-danger"> *</span>
          </label>
          <div className="row">
            <div className="input-group  col">
              <input
                className="form-control"
                type="number"
                step={0.1}
                value={formData[`commin_rate`]}
                name={`commin_rate`}
                onChange={(e) => handleChange(e)}
              />
              <div class="input-group-append">
                <div class="input-group-text ">
                  <label class="form-check-label" >%</label>

                </div>
              </div>
            </div> 
            
            <div className="col">
              <input
                className="form-control"
                type="number"
                disabled
                step={0.1}
                value={parseFloat((formData[`commin_rate`] * (100 - formData[`specdiscrate`]) * formData[`grossprem`] / 10000).toFixed(2)) || ""}
                name={`commin_amt`}
                onChange={(e) => handleChange(e)}
              />
            </div>
          </div>

        </div>


        <div class="col-3">
          <label class="form-label ">
            OV Rate/Amt<span class="text-danger"> *</span>
          </label>
          <div className="row">
            <div className="col input-group">
              <input
                className="form-control"
                type="number"
                step={0.1}
                value={formData[`ovin_rate`]}
                name={`ovin_rate`}
                onChange={handleChange}
              />
              <div class="input-group-append">
                <div class="input-group-text ">
                  <label class="form-check-label" >%</label>

                </div>
              </div>
            </div>
            <div className="col">
              <input
                className="form-control"
                type="number"
                disabled
                step={0.1}
                name={`ovin_amt`}
                value={parseFloat((formData[`ovin_rate`] * (100 - formData[`specdiscrate`]) * formData[`grossprem`] / 10000).toFixed(2)) || ""}
                onChange={handleChange}
              />
            </div>
          </div>

        </div>
      </div>
      <div class="row">
        <div className="col-1"></div>
        <div class="col-2">

          <label class="form-label">
            Comm/OV OUT <br /> ผู้แนะนำ 1
          </label>
        </div>
        <div class="col-3">
          <label class="form-label ">
            {/* Comm Out% (1)<span class="text-danger"> *</span> */}
          </label>
          <div className="row">
            <div className="col input-group">
              <input
                className="form-control"
                type="number"
                step={0.1}
                value={formData[`commout1_rate`]}
                name={`commout1_rate`}
                onChange={handleChange}
              />
              <div class="input-group-append">
                <div class="input-group-text ">
                  <label class="form-check-label" >%</label>

                </div>
              </div>
            </div>
            <div className="col">
              <input
                className="form-control"
                type="number"
                disabled
                step={0.1}
                value={parseFloat((formData[`commout1_rate`] * (100 - formData[`specdiscrate`]) * formData[`grossprem`] / 10000).toFixed(2)) || ""}
                name={`commout1_amt`}
                onChange={handleChange}
              />
            </div>

          </div>
        </div>
        <div class="col-3">
          <label class="form-label ">
            {/* Ov Out% (1)<span class="text-danger"> *</span> */}
          </label>

          <div className="row">
            <div className="col input-group">
              <input
                className="form-control"
                type="number"
                step={0.1}
                value={formData[`ovout1_rate`]}
                name={`ovout1_rate`}
                onChange={handleChange}
              />
              <div class="input-group-append">
                <div class="input-group-text ">
                  <label class="form-check-label" >%</label>

                </div>
              </div>
            </div>
            <div className="col">
              <input
                className="form-control"
                type="number"
                disabled
                step={0.1}
                name={`ovout1_amt`}
                //value={(formData[`ovout1_rate`] * formData[`grossprem`]) / 100 || ""}
                value={parseFloat((formData[`ovout1_rate`] * (100 - formData[`specdiscrate`]) * formData[`grossprem`] / 10000).toFixed(2)) || ""}
                onChange={handleChange}
              />
            </div>

          </div>
        </div>
        <div class="col-2 align-bottom">

          <button type="button" name="btn_comm1" class="btn btn-primary align-bottom form-control" onClick={getcommov} >ค่า comm/ov : ผู้แนะนำคนที่ 1</button>
        </div>


      </div>

        {formData.agentCode2 !== '' ? 
        <div class="row">
        <div className="col-1"></div>
        <div class="col-2">

          <label class="form-label">
            Comm/OV OUT <br /> ผู้แนะนำ 2
          </label>
        </div>
        <div class="col-3">
          <label class="form-label ">
            {/* Comm Out% (2) */}
          </label>
          <div className="row">
            <div className="col input-group">
              <input
                className="form-control"
                type="number"
                step={0.1}
                value={formData[`commout2_rate`]}
                name={`commout2_rate`}
                onChange={(e) => handleChange(e)}
              />
              <div class="input-group-append">
                <div class="input-group-text ">
                  <label class="form-check-label" >%</label>

                </div>
              </div>
            </div>
            <div className="col">
              <input
                className="form-control"
                type="number"
                disabled
                step={0.1}
                //value={(formData[`commin2_rate`] * formData[`grossprem`]) / 100 || ""}
                value={parseFloat((formData[`commout2_rate`] * (100 - formData[`specdiscrate`]) * formData[`grossprem`] / 10000).toFixed(2)) || ""}
                name={`commout2_amt`}
                onChange={(e) => handleChange(e)}
              />
            </div>
          </div>

        </div>


        <div class="col-3">
          <label class="form-label ">
            {/* Ov Out% (2) */}
          </label>
          <div className="row">
            <div className="col input-group">
              <input
                className="form-control"
                type="number"
                step={0.1}
                value={formData[`ovout2_rate`]}
                name={`ovout2_rate`}
                onChange={handleChange}
              />
              <div class="input-group-append">
                <div class="input-group-text ">
                  <label class="form-check-label" >%</label>

                </div>
              </div>
            </div>
            <div className="col">
              <input
                className="form-control"
                type="number"
                disabled
                step={0.1}
                name={`ovout2_amt`}
                //value={(formData[`ovin2_rate`] * formData[`grossprem`]) / 100 || ""}
                value={parseFloat((formData[`ovout2_rate`] * (100 - formData[`specdiscrate`]) * formData[`grossprem`] / 10000).toFixed(2)) || ""}
                onChange={handleChange}
              />
            </div>
          </div>

        </div>
        <div class="col-2 align-bottom">

          <button type="button" name="btn_comm2" class="btn btn-primary align-bottom" onClick={getcommov} >ค่า comm/ov : ผู้แนะนำคนที่ 2</button>
        </div>
      </div>
      :null}
      
      <div class="row">
        <div className="col-1"></div>
        <div class="col-2">

          <label class="form-label">
            Comm/OV OUT <br /> TOTAL
          </label>
        </div>
        <div class="col-3">
          <label class="form-label ">
            {/* Comm Out% (sum) */}
          </label>
          <div className="row">
            <div className="col input-group">
              <input
                className="form-control"
                type="number"
                step={0.1}
                value={parseFloat(formData[`commout1_rate`] || 0) + parseFloat(formData[`commout2_rate`] || 0)}
                name={`commout_rate`}
                onChange={handleChange}
              />
              <div class="input-group-append">
                <div class="input-group-text ">
                  <label class="form-check-label" >%</label>

                </div>
              </div>
            </div>
            <div className="col">
              <input
                className="form-control"
                type="number"
                disabled
                step={0.1}
              // value={((document.getElementsByName(`commout_rate`)[0] ? document.getElementsByName(`commout_rate`)[0].value : 0) * ((100 - formData[`specdiscrate`]) * formData[`grossprem`] / 10000).toFixed(2)) || ''}
              value={ ((parseFloat(formData[`commout1_rate`] || 0) + parseFloat(formData[`commout2_rate`] || 0))* ((100 - formData[`specdiscrate`]) * formData[`grossprem`] / 10000).toFixed(2)) || ''}  
              name={`commout_amt`}
                onChange={handleChange}
              />
            </div>

          </div>
        </div>
        <div class="col-3">
          <label class="form-label ">
            {/* Ov Out% (sum) */}
          </label>

          <div className="row">
            <div className="col input-group">
              <input
                className="form-control"
                type="number"
                step={0.1}
                value={parseFloat(formData[`ovout1_rate`] || 0) + parseFloat(formData[`ovout2_rate`] || 0)}
                name={`ovout_rate`}
                onChange={handleChange}
              />
              <div class="input-group-append">
                <div class="input-group-text ">
                  <label class="form-check-label" >%</label>

                </div>
              </div>
            </div>
            <div className="col">
              <input
                className="form-control"
                type="number"
                disabled
                step={0.1}
                name={`ovout_amt`}
                // value={((document.getElementsByName(`ovout_rate`)[0] ? document.getElementsByName(`ovout_rate`)[0].value : 0) * ((100 - formData[`specdiscrate`]) * formData[`grossprem`] / 10000).toFixed(2)) || ''}
                value={((parseFloat(formData[`ovout1_rate`] || 0) + parseFloat(formData[`ovout2_rate`] || 0))* ((100 - formData[`specdiscrate`]) * formData[`grossprem`] / 10000).toFixed(2)) || ''}
                onChange={handleChange}
              />
            </div>

          </div>
        </div>



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

        {/* <div class="col-1">
          <label class="form-label ">
            คำนำหน้า<span class="text-danger"> </span>
          </label>

          <Select
          // className="form-control"
          name={`title`}
          onChange={ (e) =>setFormData((prevState) => ({
            ...prevState,
            title: e.value,
          }))}
          options={titleDD}
          />
        </div>

        <div class="col-2">
          <label class="form-label ">
            ชื่อ<span class="text-danger"> *</span>
          </label>
          <input
            className="form-control"
            type="text"
            defaultValue={formData.t_fn}
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
              defaultValue={formData.t_ln}
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
              defaultValue={formData.t_ln}
              name={`t_ln`}
              onChange={handleChange}
            />
          </div>
        )} */}
        {formData.personType === 'P' ?
          <>
            <div class="col-1">
              <label class="form-label ">คำนำหน้า<span class="text-danger"> *</span></label>
              <Select
                formatOptionLabel={(option, { context }) => context === 'value' ? option.label : `${option.label}  ${option.label2}`}
                name={`title`}
                onChange={(e) => setFormData((prevState) => ({
                  ...prevState,
                  titleID: e.value
                }))}
                options={titleDD}
              />
            </div>

            <div class="col-2">
              <label class="form-label ">ชื่อ<span class="text-danger"> *</span></label>
              <input
                className="form-control"
                type="text"
                name="t_fn"
                onChange={handleChange}
              />
            </div>
            <div class="col-2">
              <label class="form-label ">นามสกุล<span class="text-danger"> *</span></label>
              <input
                className="form-control"
                type="text"
                name="t_ln"
                onChange={handleChange}
              />
            </div>
            <div class="col-2">
              <label class="form-label ">
                เลขที่บัตรประชาชน<span class="text-danger"> *</span>
              </label>
              <input
                className="form-control"
                type="text"
                defaultValue={formData.regisNo}
                name={`regisNo`}
                onBlur={validateCitizenID}
                onChange={handleChange}
              />
            </div>
          </>
          :
          <>
            <div class="col-1">
              <label class="form-label ">คำนำหน้า<span class="text-danger"> *</span></label>
              <Select
                formatOptionLabel={(option, { context }) => context === 'value' ? option.label : `${option.label} - ${option.label2}`}
                name={`title`}
                onChange={(e) => setFormData((prevState) => ({
                  ...prevState,
                  titleID: e.value,
                  suffix: titleDD.find((a) => a.value == e.value).label2
                }))}
                options={titleDD}
              />
            </div>
            <div class="col-2">
              <label class="form-label ">ชื่อ<span class="text-danger"> *</span></label>
              <input
                className="form-control"
                type="text"
                name="t_fn"
                onChange={handleChange}
              />
            </div>
            <div class="col-2">
              <label class="form-label ">ลำดับสาขา<span class="text-danger"> *</span></label>
              <input
                className="form-control"
                type="text"
                name="branch"
                onChange={handleChange}
              />
            </div>
            <div class="col-2">
              <label class="form-label ">คำลงท้าย<span class="text-danger"> *</span></label>
              <input type="text" disabled className="form-control" value={formData.suffix} />

            </div>
            <div class="col-2">
              <label class="form-label ">
                เลขที่จดทะเบียน<span class="text-danger"> *</span>
              </label>
              <input
                className="form-control"
                type="text"
                defaultValue={formData.regisNo}
                name={`regisNo`}
                onChange={handleChange}
              />
            </div>
          </>}

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
            defaultValue={formData.t_location_1}
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
            defaultValue={formData.t_location_2}
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
            defaultValue={formData.t_location_3}
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
            defaultValue={formData.t_location_4}
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
            defaultValue={formData.t_location_5}
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
            onChange={(e) => changeProvince(e)}
            options={provinceDD}
            styles={{ zIndex: 2000 }}
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
            onChange={(e) => changeDistrict(e)}
            options={districDD}
          />

        </div>
        <div class="col-2">
          <label class="form-label ">
            ตำบล<span class="text-danger"> *</span>
          </label>
        

          <Select
            // className="form-control"
            name={`subdistrict`}
            onChange={ (e) =>changeSubDistrict(e)}
            options={subDistricDD}
          />

        </div>
        <div class="col-2">
          <label class="form-label ">
            รหัสไปรษณี<span class="text-danger"> *</span>
          </label>
          <select
            className="form-control"
            name={`zipcode`}
            onChange={handleChange}
          >
            
            {zipcodeDD}
          </select>
          {/* <Select
            // className="form-control"
            name={`zipcode`}
            onChange={(e) => setFormData((prevState) => ({
              ...prevState,
              zipcode: e.value,
            }))}
            options={zipcodeDD}
          /> */}
          

        </div>
      </div>
      <div class="row">
        <div className="col-1"></div>
        <div class="col-2">
          <label class="form-label ">
            เบอร์มือถือ<span class="text-danger"> *</span>
          </label>
          <input
            className="form-control"
            type="text"
            defaultValue={formData.telNum_1}
            name={`telNum_1`}
            onChange={handleChange}
            onBlur={isPhoneNumberValid}
          />
        </div>
        <div class="col-2">
          <label class="form-label ">
            E-mail<span class="text-danger"> *</span>
          </label>
          <input
            className="form-control"
            type="text"
            defaultValue={formData.Email}
            name={`Email`}
            onChange={handleChange}
            onBlur={isEmailValid}
          />
        </div>
      </div>
      {formData.class === "MO" ?
        <div class="row">
          <div className="col-3"></div>
          <div className="col-3"><h4>รายละเอียดรถ (ทรัพย์สินที่เอาประกัน) </h4></div>
          <div className="col-3">
            <button className="p-2 btn btn-danger" name="showMotor" onClick={(e) => { setShowMotorData(!showMotorData) }}>
              hide/unhide
            </button>
          </div>
        </div>
        : null}
      {/* motor table formData.class === "MO"*/}
      {showMotorData ? (
        <>
          <div class="row">
            <div className="col-1"></div>

            <div class="col-2">
              <label class="form-label ">
                รหัสรถ (V)<span class="text-danger"> </span>
              </label>
              <Select
                // className="form-control"
                name={`voluntaryCode`}
                onChange={(e) => setFormData((prevState) => ({
                  ...prevState,
                  voluntaryCode: e.value,
                }))}
                options={motorcode}
                styles={{ zIndex: 2000 }}
              // onChange={opt => console.log(opt)}
              />
            </div>
            <div class="col-2">
              <label class="form-label ">
                รหัสรถ (C)<span class="text-danger"> </span>
              </label>
              <Select
                // className="form-control"
                name={`compulsoryCode`}
                onChange={(e) => setFormData((prevState) => ({
                  ...prevState,
                  compulsoryCode: e.value,
                }))}
                options={motorcode}
                styles={{ zIndex: 2000 }}
              // onChange={opt => console.log(opt)}
              />
            </div>
            <div class="col-1">
              <label class="form-label ">
                ป้ายแดง<span class="text-danger"> *</span>
              </label>


              <select required name={`unregisterflag`} class="form-control" onChange={handleChange} >
                <option value="Y" selected >ไม่ใช่</option>
                <option value="N" >ใช่</option>
              </select>

            </div>
          </div>
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
                defaultValue={formData.licenseNo}
                onChange={handleChange}
              />
            </div>
            <div class="col-2">
              <label class="form-label ">
                จังหวัด<span class="text-danger"> *</span>
              </label>

              <Select
                // className="form-control"
                name={`motorprovinceID`}
                onChange={(e) => setFormData((prevState) => ({
                  ...prevState,
                  motorprovinceID: e.value,
                }))}
                options={provinceDD}
                styles={{ zIndex: 2000 }}
              // onChange={opt => console.log(opt)}
              />
              {/* <option value={formData.province} disabled selected hidden>
              {formData.province}
            </option>
            {provinceDD} */}

            </div>
            <div class="col-2">
              <label class="form-label ">
                เลขคัสซี<span class="text-danger"> *</span>
              </label>
              <input
                className="form-control"
                type="text"
                name={`chassisNo`}
                defaultValue={formData.chassisNo}
                onChange={handleChange}
              />
            </div>
            <div class="col-2">
              <label class="form-label ">
                เลขเครื่อง<span class="text-danger"> *</span>
              </label>
              <input
                className="form-control"
                type="text"
                name={`engineNo`}
                defaultValue={formData.engineNo}
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
                defaultValue={formData.modelYear}
                onChange={handleChange}
              />
            </div>



          </div>

          <div class="row">
            <div className="col-1"></div>
            <div class="col-2">
              <label class="form-label ">
                ยี่ห้อรถยนต์<span class="text-danger"> *</span>
              </label>



              <Select
                // className="form-control"
                name={`brandname`}
                onChange={(e) => changeMotorBrand(e)}
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
                onChange={(e) => setFormData((prevState) => ({
                  ...prevState,
                  modelname: e.value,
                }))}
                options={motormodelDD}
              />

            </div>
            <div class="col-2">
              <label class="form-label ">
                รุ่นย่อย<span class="text-danger"> </span>
              </label>
              <input
                className="form-control"
                type="text"
                name={`specname`}
                defaultValue={formData.specname}
                onChange={handleChange}
              />
            </div>


          </div>
          <div class="row">
            <div className="col-1"></div>
            <div class="col-2">
              <label class="form-label ">
                ซีซี<span class="text-danger"> *</span>
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

              <input
                className="form-control"
                type="number"
                name={`cc`}
                defaultValue={formData.cc}
                onChange={handleChange}
              />

            </div>
            <div class="col-2">
              <label class="form-label ">
                ที่นั่ง<span class="text-danger"> *</span>
              </label>

              <input
                className="form-control"
                type="number"
                name={`seat`}
                defaultValue={formData.seat}
                onChange={handleChange}
              />

            </div>
            <div class="col-2">
              <label class="form-label ">
                น้ำหนัก<span class="text-danger"> </span>
              </label>
              <input
                className="form-control"
                type="number"
                name={`gvw`}
                defaultValue={formData.gvw}
                onChange={handleChange}
              />
            </div>


          </div>
        </>
      ) : null}

      <div class="d-flex justify-content-center">

        <button className="p-2 btn btn-primary" name="saveChange" onClick={handleSubmit}>
          บันทึก
        </button>

      </div>
    </div>
  );
};

export default PolicyScreen;
