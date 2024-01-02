import axios from "axios";
import * as XLSX from "xlsx";
import { useEffect, useState } from "react";
import { CenterPage } from "../StylesPages/AdminStyles";
import { Container } from "../StylesPages/PagesLayout";
import { async } from "q";
import Select from 'react-select';
import { useCookies } from "react-cookie";
import { date, number } from "joi";
import { numberWithCommas, numberpercentfixdigit } from '../lib/number';
import { stringToNumber, NumberToString } from '../lib/stringToNumber';
import { BiSearchAlt } from "react-icons/bi";
import Modal from 'react-bootstrap/Modal';
import ModalSearchAgent from "./ModalSearchAgent";
import ModalSearchPolicy from "./ModalSearchPolicy";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {convertDateFormat} from '../lib/convertdateformat'

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
  // let datenow = new Date()
  // datenow = datenow.toISOString().substring(0, 10);

  //style react-select
  const customStyles = {
    // control: (provided) => ({
    //   ...provided,
    //   width: '300px', // Set the desired width for the select control
    // }),
    menu: (provided) => ({
      ...provided,
      width: 'auto',
      zIndex: 2000,
      whiteSpace: 'nowrap', // Prevent line breaks in dropdown options
    }),
  };


  //import excel
  const [formData, setFormData] = useState({
    grossprem: '0',
    cover_amt: '0',
    specdiscamt: 0,
    netgrossprem: 0,
    specdiscrate: 0,
    duty: 0,
    tax: 0,
    totalprem: 0,
    withheld: 0,
    commout1_rate: 0,
    ovout1_rate : 0,
    commout2_rate : 0,
    ovout2_rate : 0,
    agentCode: null,
    agentCode2: null,
    unregisterflag: 'Y',
    actTime: "16:30",
    expTime: "16:30",
    cover_amt: null,
    email:null,
    t_ln : null
  });
  const [alertflag, setAlertflag] = useState(false)
  const [provinceDD, setProvinceDD] = useState([]);
  const [districDD, setDistricDD] = useState([]);
  const [subDistricDD, setSubDistricDD] = useState([]);
  const [zipcodeDD, setZipCodeDD] = useState([]);
  const [titleDD, setTitleDD] = useState([]);
  const [idcardtypeDD, setIdcardtypeDD] = useState([]);
  const [titlePDD, setTitlePDD] = useState([]) // title for person
  const [titleODD, setTitleODD] = useState([]) // title for organization
  const [insureTypeDD, setInsureTypeDD] = useState([]);
  const [insureClassDD, setInsureClassDD] = useState([]);
  const [insureSubClassDD, setInsureSubClassDD] = useState([]);
  const [insurerDD, setInsurerDD] = useState([]);
  const [motorbrandDD, setMotorbrandDD] = useState([]);
  const [motormodelDD, setMotormodelDD] = useState([]);
  const [motorspecDD, setMotorspecDD] = useState([]);
  const [vcDD, setVcDD] = useState([]);
  const [ccDD, setCcDD] = useState([]);
  const [showMotorData, setShowMotorData] = useState(false);
  const [hidecard, setHidecard] = useState([false, 0]); // for agent modal
  const [hidepolicycard, setHidepolicycard] = useState(false); // for agent modal

  //for agent modal
  const editCard = (e, name) => {

    if (formData.class !== undefined && formData.subClass !== undefined && formData.insurerCode !== undefined) {
      setHidecard([true, name])
    } else {
      alert('กรุณาเลือก บริษัทประกัน / Class / Subclass ก่อนผู้แนะนำ ')
    }

  };
  
  const handleChangeCard = (e, data) => {
    console.log(data);
    setFormData((prevState) => ({
      ...prevState,
      ...data,
    }))
    setHidecard([false, 0])


  };
  const handleClose = (e) => {
    setHidecard([false, 0])
  }
  //end agent modal

  // for policy modal
  const getPolicyCard = (e) => {
  
    setHidepolicycard(true)
  
};
const handleChangePolicyCard = (e, data) => {
  console.log(data);
  data.actDate = new Date(data.actDate)
  data.expDate = new Date(data.expDate)
  data.cover_amt = NumberToString(data.cover_amt)
  data.grossprem = NumberToString(data.grossprem)
  if (data.duedateagent !== null) {
    // data.dueDateAgent = new Date(convertDateFormat(data.duedateagent,false))
    data.dueDateAgent = new Date(data.duedateagent)
  }  
 if (data.duedateinsurer !== null) {
  // data.dueDateInsurer = new Date(convertDateFormat(data.duedateinsurer,false) )
  data.dueDateInsurer = new Date(data.duedateinsurer )
 } 
 if (data.personType === 'P') {
  data.t_fn = data.t_firstName
  data.t_ln = data.t_lastName
  data.regisNo = data.idCardNo
 }else{
  data.t_fn = data.t_ogName
  data.t_ln = data.t_branchName
  data.regisNo = data.taxNo
  data.suffix = titleODD.find((a) => a.value == data.titleID).label2
 }
 // set distirctDD
 getDistrict(data.province, 1)
 // set subdistrictDD
 getSubDistrict(data.district, 1)
 // set zipcodeDD
 setZipCodeDD([<option value={data.zipcode}>{data.zipcode}</option>])
 //get compulsorycode
 getCompulsoryCode(data.voluntaryCode)
 // get model DD
 getMotormodel(data.brandname)
 // get spec DD
 getMotorspec(data.modelname)

  setFormData((prevState) => ({
    ...prevState,
    ...data,
  }))

  setHidepolicycard(false)


};
const handlePolicyClose = (e) => {
  setHidepolicycard(false)
}
//end policy modal

  const handleChange = async (e) => {
    e.preventDefault();
    console.log(e.target.value)
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
    }
    //set dropdown title follow to personType
    // else if (e.target.name === "personType") {
    //   setFormData((prevState) => ({
    //     ...prevState,
    //     [e.target.name]: e.target.value,
    //   }));
    //   if (e.target.value === "P") {
    //     axios
    //       .get(url + "/static/titles/person/all", headers)
    //       .then((title) => {
    //         const array2 = [];
    //         title.data.forEach((ele) => {
    //           array2.push(
    //             // <option key={ele.TITLEID} value={ele.TITLETHAIBEGIN}>
    //             //   {ele.TITLETHAIBEGIN}
    //             // </option>
    //             { label: ele.TITLETHAIBEGIN, value: ele.TITLEID, label2: ele.TITLETHAIEND || '' }
    //           );

    //         });
    //         setTitleDD(array2);
    //       })
    //       .catch((err) => { });
    //   } else {
    //     axios
    //       .get(url + "/static/titles/company/all", headers)
    //       .then((title) => {
    //         const array2 = [];
    //         title.data.forEach((ele) => {
    //           array2.push(
    //             // <option key={ele.TITLEID} value={ele.TITLETHAIBEGIN}>
    //             //   {ele.TITLETHAIBEGIN}
    //             // </option>
    //             { label: ele.TITLETHAIBEGIN, value: ele.TITLEID, label2: ele.TITLETHAIEND || '' }
    //           );
    //         });
    //         setTitleDD(array2);

    //       })
    //       .catch((err) => { });
    //   }
    // }

    //set dropdown distric subdistric
    else if (e.target.name === "province") {

      getDistrict(e.target.value);
    } else if (e.target.name === "district") {
      getSubDistrict(e.target.value);
    } else if (e.target.name === "brandname") {
      getMotormodel(e.target.value);
    }
    //set dropdown subclass when class change
    else if (e.target.name === "class") {
      const array = [];
      if (!formData.insurerCode) {
        alert("กรูณาเลือกบริษัทประกัน")
        e.target.value = null
        setFormData((prevState) => ({
          ...prevState,
          class: null,
        }));
        return
      }
      insureTypeDD.forEach((ele, index) => {
        if (e.target.value === ele.class) {
          array.push(
            <option key={ele.id} value={ele.subClass}>
              {ele.subClass}
            </option>
          );

        }
      });
      setInsureSubClassDD(array);
      // setFormData((prevState) => ({
      //           ...prevState,
      //           class: e.target.value,
      //           subClass:null
      //         }))
      // default subclass after select class
      axios
        .post(url + "/insures/getcommovin",
          {
            insurerCode: formData.insurerCode,
            class: e.target.value, subClass: array[0].props.value
          }, headers)
        .then((res) => {
          if (res.data.length > 0) {
            setFormData((prevState) => ({
              ...prevState,
              class: e.target.value,
              subClass: array[0].props.value,
              [`commin_rate`]: res.data[0].rateComIn,
              [`ovin_rate`]: res.data[0].rateOVIn_1,

            }))
          }
        }).catch((err) => {
          alert("Something went wrong, Try Again.");
          // alert("cant get aumphur");
        });

    }
    else if (e.target.name === "subClass") {
      console.log(formData.class);
      axios
        .post(url + "/insures/getcommovin",
          {
            insurerCode: formData.insurerCode,
            class: formData.class,
            subClass: e.target.value
          }, headers)
        .then((res) => {
          console.log(res.data);
          if (res.data.length > 0) {
            setFormData((prevState) => ({
              ...prevState,
              subClass: e.target.value,
              [`commin_rate`]: res.data[0].rateComIn,
              [`ovin_rate`]: res.data[0].rateOVIn_1,

            }))
          }
        }).catch((err) => {
          alert("Something went wrong, Try Again.");
          // alert("cant get aumphur");
        });
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }));
    }

  };

  const handleChangeActdate = (value, name) => {


    const originalDate = new Date(value);
    // const originalDate = new Date(value.split('T'));

    // Add one year (365 days) to the date
    originalDate.setFullYear(originalDate.getFullYear() + 1);

    // Convert the updated Date object back to a string
    // const updatedDateString = originalDate.toISOString().substring(0, 10);
    const updatedDateString = originalDate;
    if (name === 'actDate') {
      setFormData((prevState) => ({
        ...prevState,
        actDate: value,
        expDate: updatedDateString
      }));
    } else if (name === 'actDate') {
      setFormData((prevState) => ({
        ...prevState,
        expDate: value
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value
      }));
    }




  };

  function validateDate(e) {
    e.preventDefault();
    const dayparse = e.target.value.split("/")
    const name = e.target.name
    const value = `${dayparse[1]}/${dayparse[0]}/${dayparse[2]} `
    console.log("value : " + value);
    console.log("name : " + name);
    let mindate = new Date()
    let maxdate = new Date()
    if (name === 'actDate') {
      mindate.setFullYear(mindate.getFullYear() - 3)
      maxdate.setFullYear(maxdate.getFullYear() + 3)
    } else if (name === 'expDate') {
      mindate.setFullYear(mindate.getFullYear() - 4)
      maxdate.setFullYear(maxdate.getFullYear() + 4)
    }


    let inputDate;

    if (new Date(value) != "Invalid Date") {
      inputDate = new Date(value)
    } else {
      return
    }
    console.log("inputDate : " + inputDate);
    // const inputDate = value;
    let actdate = ''
    let expdate = ''

    if (inputDate < mindate) {
      console.log('input < min');
      // actdate = mindate.toISOString().substring(0, 10)
      actdate = mindate
      console.log('actdate : ' + actdate);
      mindate.setFullYear(mindate.getFullYear() + 1)
      // expdate = mindate.toISOString().substring(0, 10)
      expdate = mindate
      console.log('expdate : ' + expdate)
    } else if (inputDate > maxdate) {
      console.log('input > max');
      // actdate = maxdate.toISOString().substring(0, 10)
      actdate = new Date(maxdate)
      expdate = maxdate.setFullYear(maxdate.getFullYear() + 1)
      // expdate = maxdate.toISOString().substring(0, 10)
      // expdate = maxdate
    } else {
      console.log('else');
      actdate = new Date(value)
      inputDate.setFullYear(inputDate.getFullYear() + 1)
      // expdate = inputDate.toISOString().substring(0, 10)
      expdate = inputDate
    }

    if (name === 'actDate') {

      console.log('actDate');
      setFormData((prevState) => ({
        ...prevState,
        actDate: actdate,
        expDate: expdate
      }));
      // document.getElementsByName("actDate")[0].value = actdate
    } else if (name === 'expDate') {

      console.log('expDate');
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
    if (!emailRegex.test(email) && email !== '') {
      alert('Email ไม่ถูกต้อง')
      document.getElementsByName("Email")[0].value = ''
      return
    }
  }
  function isPhoneNumberValid(e) {
    // Regular expression for a Thai phone number format
    const phoneRegex = /^0\d{9}$/;
    console.log(document.getElementsByName("telNum_1")[0].value);
    const phoneNumber = document.getElementsByName("telNum_1")[0].value
    // Use the test method of the regex to check if the phone number matches the pattern
    if (!phoneRegex.test(phoneNumber) && phoneNumber !== '') {
      document.getElementsByName("telNum_1")[0].value = ''
      alert('หมายเลขมือถือผิด')
      return
    }
  }
  const handleChangePrem = async (e) => {
    e.preventDefault();
    console.log(formData.grossprem);
    
    //  set totalprem
    if (e.target.name === 'grossprem') {
      const grossprem = stringToNumber(e.target.value)
      // const grossprem = e.target.value
      // console.log(grossprem);
      const netgrosspremamt = grossprem - formData.specdiscamt
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
      // const specdiscrate =parseFloat( e.target.value)
      const specdiscrate = e.target.value
      // stringToNumber(0)
      const grossprem = stringToNumber(formData.grossprem)
      const specdiscamt = parseFloat((specdiscrate * grossprem / 100).toFixed(2))
      const netgrosspremamt = grossprem - specdiscamt
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
    // }else if (e.target.name === 'commin_rate') {
    //     setFormData((prevState) => ({
    //       ...prevState,
    //       [e.target.name]: e.target.value,
    //       commin_amt: (formData[`commin_rate`] * formData[`grossprem`]) / 100
    //     }));
    //   } else if (e.target.name === 'ovin_rate') {
    //     setFormData((prevState) => ({
    //       ...prevState,
    //       [e.target.name]: e.target.value,
    //       ovin_amt: (formData[`ovin_rate`] * formData[`grossprem`]) / 100
    //     }));
    //   } else if (e.target.name === 'commout_rate') {
    //     setFormData((prevState) => ({
    //       ...prevState,
    //       [e.target.name]: e.target.value,
    //       commout_amt: (formData[`commout_rate`] * formData[`grossprem`]) / 100
    //     }));
    //   } else if (e.target.name === 'ovout_rate') {
    //     setFormData((prevState) => ({
    //       ...prevState,
    //       [e.target.name]: e.target.value,
    //       ovout_amt: (formData[`ovout_rate`] * formData[`grossprem`]) / 100
    //     }));
    //   }
    // setFormData((prevState) => ({
    //   ...prevState,
    //   [e.target.name]: e.target.value,
    // }));

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
  const changeSubDistrict = (e) => {
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
  const changeMotorModel = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      modelname: e.value,
    }));
    getMotorspec(e.value);
  }
  const changeVoluntaryCode = (e) => {
    console.log(e.value);
    setFormData((prevState) => ({
      ...prevState,
      voluntaryCode: e.value,
    }));
    getCompulsoryCode(e.value);
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

  const getCompulsoryCode = (voluntarycode) => {
    //get compulsory code in voluntary code
    axios
      .post(url + "/static/mt_brands/getccbyvc", { voluntarycode: voluntarycode }, headers)
      .then((cc) => {
        const array = [];
        cc.data.forEach((ele) => {
          // array.push(
          //   <option value={ele.MODEL} >
          //     {ele.MODEL}
          //   </option>
          // );
          array.push({ label: ele.compulsorycode + ' : ' + ele.t_description, value: ele.compulsorycode })
        });
        setCcDD(array);
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

          array.push({ label: ele.MODELNAME, value: ele.MODELNAME })
        });
        setMotormodelDD(array);
      })
      .catch((err) => {
        // alert("cant get aumphur");
      });
  };
  const getMotorspec = (modelname) => {
    //get distric in province selected
    axios
      .post(url + "/static/mt_models/showallspecinmodel", { modelname: modelname }, headers)
      .then((model) => {
        const array = [];
        model.data.forEach((ele) => {

          array.push({ label: ele.SPECNAME, value: ele.SPECNAME })
        });
        setMotorspecDD(array);
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

          arraySub.push({ label: ele.t_tambonname, value: ele.t_tambonname, postcode: ele.postcodeall.split("/") })

        });

        setSubDistricDD(arraySub);
      })
      .catch((err) => {
        // alert("cant get tambons");
      });
  };

  const getcommov = (e) => {
    // e.preventDefault();

    //check insurer class subclass 
    if (!formData.class || !formData.subClass || !formData.insurerCode) {
      alert('กรุณากรอกข้อมูล class/subclass/บริษัทประกัน ให้ครบถ้วน')
      e.target.value = null
      setFormData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,

      }));
      return
    }

    //get comm  ov setup
    let i = 1
    if (e.target.name === 'agentCode') {
      i = 1
      console.log(i);
    } else if (e.target.name === 'agentCode2') {
      i = 2
      console.log(i);
    }
    axios
      .post(url + "/insures/getcommov", { ...formData, agentCode: e.target.value }, headers)
      .then((res) => {
        console.log(res.data);
        if (res.data.length > 0) {
          if (i === 1) {
            if (res.data[0].rateComIn < res.data[0].rateComOut + formData.commout2_rate || res.data[0].rateOVIn_1 < res.data[0].rateOVOut_1 + formData.ovout2_rate) {
              alert("ค่า comm/ov out > comm/ov in")
              e.target.value = null
              setFormData((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,

              }));
              return
            } else {
              setFormData((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
                [`commin_rate`]: res.data[0].rateComIn,
                [`ovin_rate`]: res.data[0].rateOVIn_1,
                [`commout${i}_rate`]: res.data[0].rateComOut,
                [`ovout${i}_rate`]: res.data[0].rateOVOut_1,
                // [`commin_amt`]: res.data[0].rateComIn * formData[`grossprem`] / 100,
                // [`ovin_amt`]: res.data[0].rateOVIn_1 * formData[`grossprem`] / 100,
                // [`commout${i}_amt`]: res.data[0].rateComOut * formData[`grossprem`] / 100,
                // [`ovout${i}_amt`]: res.data[0].rateOVOut_1 * formData[`grossprem`] / 100,

              }))
            }
          } else if (i === 2) {
            if (res.data[0].rateComIn < res.data[0].rateComOut + formData.commout1_rate || res.data[0].rateOVIn_1 < res.data[0].rateOVOut_1 + formData.ovout1_rate) {
              alert("ค่า comm/ov out > comm/ov in")
              e.target.value = null
              setFormData((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,

              }));
              return
            } else {
              setFormData((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
                [`commin_rate`]: res.data[0].rateComIn,
                [`ovin_rate`]: res.data[0].rateOVIn_1,
                [`commout${i}_rate`]: res.data[0].rateComOut,
                [`ovout${i}_rate`]: res.data[0].rateOVOut_1,
                // [`commin_amt`]: res.data[0].rateComIn * formData[`grossprem`] / 100,
                // [`ovin_amt`]: res.data[0].rateOVIn_1 * formData[`grossprem`] / 100,
                // [`commout${i}_amt`]: res.data[0].rateComOut * formData[`grossprem`] / 100,
                // [`ovout${i}_amt`]: res.data[0].rateOVOut_1 * formData[`grossprem`] / 100,

              }))
            }
          }






        } else {
          alert('ไม่พบข้อมูล Comm OV ของผู้แนะนำ ตามเงื่อนไข class/subclass/บริษัทประกัน นี้')
          e.target.value = null
          setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
            [`commout${i}_rate`]: 0,
            [`ovout${i}_rate`]: 0,

          }));
        }

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
  const getcommov2 = (name, value) => {
    // e.preventDefault();

    //check insurer class subclass 
    if (!formData.class || !formData.subClass || !formData.insurerCode) {
      alert('กรุณากรอกข้อมูล class/subclass/บริษัทประกัน ให้ครบถ้วน')
      value = null
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,

      }));
      return
    }

    //get comm  ov setup
    let i = 1
    if (name === 'agentCode') {
      i = 1
      console.log(i);
    } else if (name === 'agentCode2') {
      i = 2
      console.log(i);
    }
    axios
      .post(url + "/insures/getcommov", { ...formData, agentCode: value }, headers)
      .then((res) => {
        console.log(res.data);
        if (res.data.length > 0) {
          if (i === 1) {
            if (formData.commin_rate < res.data[0].rateComOut + (formData.commout2_rate || 0) || formData.ovin_rate < res.data[0].rateOVOut_1 + (formData.ovout2_rate || 0)) {
              alert("ค่า comm/ov out > comm/ov in")
              value = null
              setFormData((prevState) => ({
                ...prevState,
                [name]: value,

              }));
              return
            } else {

              const duedateA = new Date()
              const duedateI = new Date()
              if (res.data[0].creditUAgent === "D") {
                duedateA.setDate(duedateA.getDate() + res.data[0].creditTAgent)
              } else if (res.data[0].creditUAgent === "M") {
                duedateA.setMonth(duedateA.getMonth() + res.data[0].creditTAgent)
              }
              if (res.data[0].creditUInsurer === "D") {
                duedateI.setDate(duedateI.getDate() + res.data[0].creditTInsurer)
              } else if (res.data[0].creditUInsurer === "M") {
                duedateI.setMonth(duedateI.getMonth() + res.data[0].creditTInsurer)
              }
              console.log(duedateA);
              console.log(duedateI);


              setFormData((prevState) => ({
                ...prevState,
                [name]: value,
                // [`commin_rate`]: res.data[0].rateComIn,
                // [`ovin_rate`]: res.data[0].rateOVIn_1,
                [`commout${i}_rate`]: res.data[0].rateComOut,
                [`ovout${i}_rate`]: res.data[0].rateOVOut_1,
                ['dueDateAgent']: duedateA,
                ['dueDateInsurer']: duedateI,

              }))
            }
          } else if (i === 2) {
            if (formData.commin_rate < res.data[0].rateComOut + (formData.commout1_rate || 0) || formData.ovin_rate < res.data[0].rateOVOut_1 + (formData.ovout1_rate || 0)) {
              alert("ค่า comm/ov out > comm/ov in")
              value = null
              setFormData((prevState) => ({
                ...prevState,
                [name]: value,

              }));
              return
            } else {
              setFormData((prevState) => ({
                ...prevState,
                [name]: value,
                // [`commin_rate`]: res.data[0].rateComIn,
                // [`ovin_rate`]: res.data[0].rateOVIn_1,
                [`commout${i}_rate`]: res.data[0].rateComOut,
                [`ovout${i}_rate`]: res.data[0].rateOVOut_1,

              }))
            }
          }

        } else {
          alert('ไม่พบข้อมูล Comm OV ของผู้แนะนำ ตามเงื่อนไข class/subclass/บริษัทประกัน นี้')
          value = null
          setFormData((prevState) => ({
            ...prevState,
            [name]: value,
            [`commout${i}_rate`]: 0,
            [`ovout${i}_rate`]: 0,

          }));
        }
        setHidecard([false, 0])
      })
      .catch((err) => {
        alert("Something went wrong, Try Again.");

      });


  }
  const checkCommOV =  (e, type) => {
    e.preventDefault();
    console.log(e.target.name + " : " + e.target.value);
    console.log(`${formData.commin_rate} < ${formData.commout1_rate} + ${formData.commout2_rate}`);
    if (type === 'Comm') {
      // check comm
      if (formData.commin_rate < parseFloat(formData.commout1_rate) + parseFloat(formData.commout2_rate) ) {
        alert(" ผลรวมของ Comm-out ต้องไม่มากกว่า Comm-in")
        if (e.target.name === "commin_rate") {
          console.log("commin_rate");
          e.target.value = (parseFloat(formData.commout1_rate) + parseFloat(formData.commout2_rate) )
          setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
  
          }));
        }else{
          e.target.value = 0
          setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
  
          }));
        }
        
      }
    }
    if (type === 'OV') {
      // check ov
      if (formData.ovin_rate < parseFloat(formData.ovout1_rate) + parseFloat(formData.ovout2_rate) ) {
        alert(" ผลรวมของ OV-out ต้องไม่มากกว่า OV-in")
        if (e.target.name === "ovin_rate") {
          e.target.value = parseFloat(formData.ovout1_rate) + parseFloat(formData.ovout2_rate )
          setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
  
          }));
        }else{
          e.target.value = 0
          setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
  
          }));
        }
        
      }
    }
  }

  const handleSubmit = async (e) => {
    const data = []

    let t_ogName = null
    let t_firstName = null
    let t_lastName = null
    let idCardType = null
    let t_branchName = null
    let idCardNo = null
    let taxNo = null
    if (formData.personType === 'P') {
      idCardType = formData.idCardType
      t_firstName = formData.t_fn
      t_lastName = formData.t_ln
      idCardNo = formData.regisNo.toString()
      data.push({ ...formData, t_firstName: t_firstName, t_lastName: t_lastName, idCardNo: idCardNo, idCardType: idCardType, t_ogName: t_ogName, taxNo: taxNo })
    } else {
      const withheldamt = parseFloat(((formData.netgrossprem + formData.duty) * withheld).toFixed(2))
      t_ogName = formData.t_fn
      t_branchName = formData.t_ln
      taxNo = formData.regisNo.toString()
      data.push({ ...formData, t_ogName: t_ogName, t_branchName: t_branchName, taxNo: taxNo, t_firstName: t_firstName, t_lastName: t_lastName, idCardNo: idCardNo, idCardType: idCardType, withheld: withheldamt })
    }
    // data[0].specdiscamt = document.getElementsByName('specdiscamt')[0].value
    // data[0].netgrossprem = document.getElementsByName('grossprem')[0].value - document.getElementsByName('specdiscamt')[0].value
    // data[0].tax = document.getElementsByName('tax')[0].value
    // data[0].duty = document.getElementsByName('duty')[0].value
    // data[0].totalprem = document.getElementsByName('totalprem')[0].value

    //cast type data
    data[0].grossprem = stringToNumber(formData.grossprem)
    data[0].cover_amt = stringToNumber(document.getElementsByName('cover_amt')[0].value)
    data[0].commin_amt = stringToNumber(document.getElementsByName('commin_amt')[0].value)
    data[0].ovin_amt = stringToNumber(document.getElementsByName('ovin_amt')[0].value)
    data[0].commout1_amt = stringToNumber(document.getElementsByName('commout1_amt')[0].value)
    data[0].ovout1_amt = stringToNumber(document.getElementsByName('ovout1_amt')[0].value)
    if (document.getElementsByName('commout2_amt')[0]) {
      data[0].commout2_amt = stringToNumber(document.getElementsByName('commout2_amt')[0].value)
    }
    if (document.getElementsByName('ovout2_amt')[0]) {

      data[0].ovout2_amt = stringToNumber(document.getElementsByName('ovout2_amt')[0].value)
    }
    data[0].commout_amt = stringToNumber(document.getElementsByName('commout_amt')[0].value)
    data[0].ovout_amt = stringToNumber(document.getElementsByName('ovout_amt')[0].value)

    //set actdate expdate format time 
    data[0].actDate = data[0].actDate.toLocaleDateString()// Adjust to the desired time zone
    data[0].expDate = data[0].expDate.toLocaleDateString()
    data[0].dueDateAgent = data[0].dueDateAgent.toLocaleDateString()
    data[0].dueDateInsurer = data[0].dueDateInsurer.toLocaleDateString()

    ////////////////bypassssssssssssssssssssssssss/////////////////////////
    // data[0].subdistrict = 'ดุสิต'
    // data[0].zipcode = '81120'

    console.log(data);
    e.preventDefault();
    await axios.post(url + "/policies/policydraft/batch", data, headers).then((res) => {
      alert("policy batch Created AppNo : " + res.data.appNo[0]);
      console.log(res.data);
      window.location.reload(false);
    }).catch((err) => { alert("Something went wrong, Try Again." + err.msg); });
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
        // axios
        //   .get(url + "/static/titles/company/all", headers)
        //   .then((title) => {
        //     const array2 = [];
        //     title.data.forEach((ele) => {
        //       array2.push(
        //         <option key={ele.TITLEID} value={ele.TITLETHAIBEGIN}>
        //           {ele.TITLETHAIBEGIN}
        //         </option>
        //       );
        //     });
        //     setTitleDD(array2);
        //   })
        //   .catch((err) => { });
      })
      .catch((err) => { });

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
    
     //get idcardtype
     axios
     .get(url + "/config/showallidcardtype", headers)
     .then((idcardtype) => {

       const array = idcardtype.data.map((ele, index) => (
         <option key={index} value={ele.textvalue}>
           {ele.textvalue}
         </option>
       ));

       
       setIdcardtypeDD(array);
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

    //get voluntary code motor
    axios
      .get(url + "/static/mt_brands/getallvc", headers)
      .then((vcs) => {
        const array = [];
        vcs.data.forEach((ele) => {
          array.push({ label: ele.newvoluntarycode + ' : ' + ele.t_description, value: ele.newvoluntarycode })
        });
        setVcDD(array);
      })
      .catch((err) => { });

      //  get all title person && re-login if token expired
    axios
    .get(url + "/static/titles/person/all", headers)
    .then((title) => {
      const array2 = []
      title.data.forEach(ele => {
        array2.push(
          // <option key={ele.TITLEID} value={ele.TITLEID}>{ele.TITLETHAIBEGIN}</option>
          { label: ele.TITLETHAIBEGIN, value: ele.TITLEID, label2: ele.TITLETHAIEND || '' })
      });


      setTitlePDD(array2)
    }).catch((err) => {

    });


  //  get all title organization
  axios
    .get(url + "/static/titles/company/all", headers)
    .then((title) => {
      const array2 = []
      title.data.forEach(ele => {
        array2.push({ label: ele.TITLETHAIBEGIN, value: ele.TITLEID, label2: ele.TITLETHAIEND || '' })
      });
      setTitleODD(array2)
    })


  }, []);

  return (
    <div>
      <Modal size="l" show={hidecard[0]} onHide={handleClose} >
        <Modal.Header closeButton>
          <Modal.Title >ค้นหาผู้แนะนำ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {<ModalSearchAgent name={hidecard[1]} formData={formData} setFormData={handleChangeCard} getcommov={getcommov2} />}
        </Modal.Body>
      </Modal>
      <Modal size="xl" show={hidepolicycard} onHide={handlePolicyClose} >
        <Modal.Header closeButton>
          <Modal.Title >ค้นหากรมธรรม์</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        
          ทดสอบ policy modal
        {<ModalSearchPolicy name={hidecard[1]} formData={formData} setFormData={handleChangePolicyCard}  />}

        </Modal.Body>
      </Modal>
      <div class="d-flex justify-content-center">
      <h1 className="text-center">สร้างรายการกรมธรรม์</h1>
      <div className="d-flex align-items-center">
      <button class="btn btn-success" type="button" name="btn-agent1" onClick={(e) => getPolicyCard(e)}>
        COPY <BiSearchAlt style={{ fontSize: "30px", color: "white" }} /></button>
        </div >

</div>
      
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
          {/* <input

            className="form-control"
            type="date"
            format="dd/MM/yyyy"
            value={formData.actDate}
            name={`actDate`}
            onChange={handleChangeActdate}
            onBlur={(e) => validateDate(e)}
          /> */}
          <DatePicker
            showIcon
            className="form-control"
            todayButton="Vandaag"
            // isClearable
            name="actDate"
            showYearDropdown
            dateFormat="dd/MM/yyyy"
            dropdownMode="select"
            selected={formData.actDate}
            onChange={(date) => handleChangeActdate(date, 'actDate')}
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
            defaultValue={"16:30"}
            name={`actTime`}
            onChange={handleChange}
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
            onBlur={(e) => validateDate(e)}
          /> */}
          <DatePicker
            showIcon
            className="form-control"
            todayButton="Vandaag"
            // isClearable
            name="expDate"
            showYearDropdown
            dateFormat="dd/MM/yyyy"
            dropdownMode="select"
            selected={formData.expDate}
            onChange={(date) => handleChangeActdate(date, 'expDate')}
          // onBlur={(e) => validateDate(e)}
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
            รหัสผู้แนะนำ 1<span class="text-danger"> *</span>
          </label>
          <div class="input-group mb-3">
            <input
              className="form-control"
              type="text"
              value={formData.agentCode}
              name={`agentCode`}
              onChange={handleChange}
              // onBlur={getcommov}
              onBlur={(e) => getcommov2(e.target.name, e.target.value)}
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
              disabled={formData.agentCode === null ? true : false}
              // onBlur={getcommov}
              onBlur={(e) => getcommov2(e.target.name, e.target.value)}
            />
            <div class="input-group-append">
              <button class="btn btn-primary" type="button" name="btn-agent2" onClick={(e) => editCard(e, "agentCode2")}><BiSearchAlt style={{ fontSize: "30px", color: "white" }} /></button>
            </div>
          </div>

        </div>

        <div class="col-2 form-group ">
          <label class="form-label px-3">
            ทุนประกัน<span class="text-danger"> *</span>
          </label>
          <input
            className="form-control"
            type="text"
            // step={0.1}
            name={`cover_amt`}
            onChange={handleChange}
            value={formData.cover_amt}
            // value={NumberToString(formData.cover_amt)}
            onInput={(e) => numberWithCommas(e.target)}
          />
        </div>
        <div class="col-2">
          <label class="form-label ">
            เบี้ย<span class="text-danger"> *</span>
          </label>
          <input
            className="form-control numbers"
            id="grossprem"
            type="text"
            // step={0.1}
            name={`grossprem`}
            onChange={(e) => handleChangePrem(e)}
            // value={NumberToString(formData.grossprem)}
            value={formData.grossprem}
            onInput={(e) => numberWithCommas(e.target)}
          />
          {/* <NumberInputWithCommas value={formData.grossprem} name={`grossprem`} onChange={handleChange}  /> */}

        </div>
      </div>
      {/* policy table */}

      <div class="row">
        <div className="col-1"></div>


        <div class="col-2">
          <label class="form-label ">
            ส่วนลด walkin %
          </label>
          <input
            className="form-control"
            type="text"
            step={0.1}
            name={`specdiscrate`}
            // value={parseFloat(formData[`specdiscrate`])}
            value={formData[`specdiscrate`]}
            onChange={(e) => handleChangePrem(e)}
            // onInput={(e) => numberWithCommas(e.target)}
            onInput={(e) => numberpercentfixdigit(e.target)}
          />


        </div>
        <div className="col-2">
          <label class="form-label ">
            จำนวนเงินส่วนลด
          </label>

          <input
            className="form-control bg-warning"
            type="text"
            disabled
            // value={parseFloat((formData[`specdiscrate`] * formData[`grossprem`] / 100).toFixed(2)) || 0}
            value={NumberToString(formData.specdiscamt)}
            name={`specdiscamt`}
          // onChange={(e) => handleChange(e)}
          />
        </div>
        <div class="col-2">
          <label class="form-label ">
            เบี้ยสุทธิ
          </label>
          <input
            type="text" // Use an input element for displaying numbers
            className="form-control bg-warning"
            value={NumberToString(formData.netgrossprem)} // Display the totalprem value from the state
            name={`netgrossprem`}
            disabled
          />
        </div>

        <div class="col-2">
          <label class="form-label ">
            อากร
          </label>
          <input
            className="form-control bg-warning"
            type="text"
            disabled
            value={NumberToString(formData.duty)}
            name={`duty`}
          // onChange={handleChange}
          />

        </div>
        <div className="col-2">
          <label class="form-label ">
            ภาษี
          </label>
          <input
            className="form-control bg-warning"
            type="text"
            disabled
            value={NumberToString(formData.tax)}
            name={`tax`}
          // onChange={handleChange}
          />
        </div>
      </div>
      <div class="row">
        <div className="col-1"></div>
        <div class="col-2">
          <label class="form-label ">
            เบี้ยรวม<span class="text-danger "> *</span>
          </label>
          <input
            type="text" // Use an input element for displaying numbers
            className="form-control bg-warning"
            value={NumberToString(formData.totalprem)} // Display the totalprem value from the state
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
          <div className="row">
            <div className="col">
              <label class="form-label ">
                Comm Rate(%)
              </label>
            </div>
            <div className="col-5">
              <label class="form-label ">
                Amt<span class="text-danger"> *</span>
              </label>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <input
                className="form-control"
                type="number"
                step={0.1}
                value={formData[`commin_rate`]}
                name={`commin_rate`}
                onChange={(e) => handleChange(e)}
                onBlur={(e) => checkCommOV(e, 'Comm')}
                
              />

            </div>

            <div className="col-8">
              <input
                className="form-control bg-warning"
                type="text"
                disabled
                value={NumberToString(parseFloat((formData[`commin_rate`] * formData[`netgrossprem`] / 100).toFixed(2))) || ""}
                name={`commin_amt`}
              />
            </div>
          </div>

        </div>


        <div class="col-3">

          <div className="row">
            <div className="col">
              <label class="form-label ">
                OV Rate(%)
              </label>
            </div>
            <div className="col-5">
              <label class="form-label ">
                Amt<span class="text-danger"> *</span>
              </label>
            </div>
          </div>
          <div className="row">
            <div className="col input-group">
              <input
                className="form-control"
                type="number"
                step={0.1}
                value={formData[`ovin_rate`]}
                name={`ovin_rate`}
                onChange={(e) => handleChange(e)}
                onBlur={(e) => checkCommOV(e, 'OV')}
              />

            </div>
            <div className="col-8">
              <input
                className="form-control bg-warning"
                type="text"
                disabled
                name={`ovin_amt`}
                value={NumberToString(parseFloat((formData[`ovin_rate`] * formData[`netgrossprem`] / 100).toFixed(2))) || ""}
              // onChange={handleChange}
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
                className="form-control "
                type="number"
                step={0.1}
                value={formData[`commout1_rate`]}
                name={`commout1_rate`}
                onChange={(e) =>handleChange(e)}
                onBlur={(e) => checkCommOV(e, 'Comm')}
              />

            </div>
            <div className="col-8">
              <input
                className="form-control bg-warning"
                type="text"
                disabled
                value={NumberToString((formData[`commout1_rate`] * formData[`netgrossprem`] / 100).toFixed(2)) || ""}
                name={`commout1_amt`}
              // onChange={handleChange}
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
                onChange={(e) =>handleChange(e)}
                onBlur={(e) => checkCommOV(e, 'OV')}
                
              />

            </div>
            <div className="col-8">
              <input
                className="form-control bg-warning"
                type="text"
                disabled
                name={`ovout1_amt`}
                //value={(formData[`ovout1_rate`] * formData[`grossprem`]) / 100 || ""}
                value={NumberToString(parseFloat((formData[`ovout1_rate`] * formData[`netgrossprem`] / 100).toFixed(2))) || ""}
              // onChange={handleChange}
              />
            </div>

          </div>
        </div>
        {/* <div class="col-2 align-bottom">

          <button type="button" name="btn_comm1" class="btn btn-primary align-bottom form-control" onClick={getcommov} >ค่า comm/ov : ผู้แนะนำคนที่ 1</button>
        </div> */}


      </div>

      {formData.agentCode2 !== null ?
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
                  className="form-control "
                  type="number"
                  step={0.1}
                  value={formData[`commout2_rate`]}
                  name={`commout2_rate`}
                  onChange={(e) => handleChange(e)}
                  onBlur={(e) => checkCommOV(e, 'Comm')}
                />

              </div>
              <div className="col-8">
                <input
                  className="form-control bg-warning"
                  type="text"
                  disabled
                  //value={(formData[`commin2_rate`] * formData[`grossprem`]) / 100 || ""}
                  value={NumberToString(parseFloat((formData[`commout2_rate`] * formData[`netgrossprem`] / 100).toFixed(2))) || ""}
                  name={`commout2_amt`}
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
                  onChange={(e) =>handleChange(e)}
                  onBlur={(e) => checkCommOV(e, 'OV')}
                />

              </div>
              <div className="col-8">
                <input
                  className="form-control bg-warning"
                  type="text"
                  disabled
                  name={`ovout2_amt`}
                  value={NumberToString(parseFloat((formData[`ovout2_rate`] * formData[`netgrossprem`] / 100).toFixed(2))) || ""}

                />
              </div>
            </div>

          </div>
          {/* <div class="col-2 align-bottom">

          <button type="button" name="btn_comm2" class="btn btn-primary align-bottom" onClick={getcommov} >ค่า comm/ov : ผู้แนะนำคนที่ 2</button>
        </div> */}
        </div>
        : null}

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
                disabled
                step={0.1}
                value={parseFloat(formData[`commout1_rate`] || 0) + parseFloat(formData[`commout2_rate`] || 0)}
                name={`commout_rate`}
                onChange={handleChange}
              />

            </div>
            <div className="col-8">
              <input
                className="form-control bg-warning"
                type="text"
                disabled
                value={NumberToString(((parseFloat(formData[`commout1_rate`] || 0) + parseFloat(formData[`commout2_rate`] || 0)) * formData[`netgrossprem`] / 100).toFixed(2)) || ''}
                name={`commout_amt`}
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
                className="form-control "
                type="number"
                disabled
                step={0.1}
                value={parseFloat(formData[`ovout1_rate`] || 0) + parseFloat(formData[`ovout2_rate`] || 0)}
                name={`ovout_rate`}
                onChange={handleChange}
              />

            </div>
            <div className="col-8">
              <input
                className="form-control bg-warning"
                type="text"
                disabled
                name={`ovout_amt`}
                // value={((document.getElementsByName(`ovout_rate`)[0] ? document.getElementsByName(`ovout_rate`)[0].value : 0) * ((100 - formData[`specdiscrate`]) * formData[`grossprem`] / 10000).toFixed(2)) || ''}
                value={NumberToString(((parseFloat(formData[`ovout1_rate`] || 0) + parseFloat(formData[`ovout2_rate`] || 0)) * formData[`netgrossprem`] / 100).toFixed(2)) || ''}

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
              value={titlePDD.filter(({ value }) => value === formData.titleID)}
                styles={customStyles}
                formatOptionLabel={(option, { context }) => context === 'value' ? option.label : `${option.label}  ${option.label2}`}
                name={`titleID`}
                onChange={(e) => setFormData((prevState) => ({
                  ...prevState,
                  titleID: e.value
                }))}
                options={titlePDD}
              />
            </div>

            <div class="col-2">
              <label class="form-label ">ชื่อ<span class="text-danger"> *</span></label>
              <input
                className="form-control"
                type="text"
                name="t_fn"
                defaultValue={formData.t_fn}
                onChange={handleChange}
              />
            </div>
            <div class="col-2">
              <label class="form-label ">นามสกุล<span class="text-danger"> *</span></label>
              <input
                className="form-control"
                type="text"
                name="t_ln"
                defaultValue={formData.t_ln}
                onChange={handleChange}
              />
            </div>
            <div class="col-2">
          <label class="form-label ">
            ประเภทบัตร<span class="text-danger"> *</span>
          </label>
          <select
            className="form-control"
            name={`idCradType`}
            onChange={handleChange}
          >
            <option value={formData.idCardType} disabled selected hidden>
              {formData.idCardType}
            </option>
            {idcardtypeDD}
          </select>
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
                styles={customStyles}
                value={titleODD.filter(({ value }) => value === formData.titleID)}
                formatOptionLabel={(option, { context }) => context === 'value' ? option.label : `${option.label} - ${option.label2}`}
                name={`titleID`}
                onChange={(e) => setFormData((prevState) => ({
                  ...prevState,
                  titleID: e.value,
                  suffix: titleODD.find((a) => a.value == e.value).label2
                }))}
                options={titleODD}
              />
            </div>
            <div class="col-2">
              <label class="form-label ">ชื่อ<span class="text-danger"> *</span></label>
              <input
                className="form-control"
                type="text"
                name="t_fn"
                defaultValue={formData.t_fn}
                onChange={handleChange}
              />
            </div>
            <div class="col-2">
              <label class="form-label ">คำลงท้าย<span class="text-danger"> *</span></label>
              <input type="text" disabled className="form-control" value={formData.suffix} />

            </div>
            <div class="col-2">
              <label class="form-label ">สาขา</label>
              <input
                className="form-control"
                type="text"
                name="t_ln"
                defaultValue={formData.t_ln}
                onChange={handleChange}
              />
            </div>
            <div class="col-2">
              <label class="form-label ">ลำดับสาขา<span class="text-danger"> *</span></label>
              <input
                className="form-control"
                type="text"
                name="branch"
                defaultValue={formData.branch}
                onChange={handleChange}
              />
            </div>
            <div className="row">
              <div className="col-1"></div>
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
            styles={customStyles}
            value={provinceDD.filter(({ value }) => value === formData.province)}
            // className="form-control"
            name={`province`}
            onChange={(e) => changeProvince(e)}
            options={provinceDD}

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
            value={districDD.filter(({ value }) => value === formData.district)}
            styles={customStyles}
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
            value={subDistricDD.filter(({ value }) => value === formData.subdistrict)}
            styles={customStyles}
            name={`subdistrict`}
            onChange={(e) => changeSubDistrict(e)}
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
            defaultValue={formData.email}
            name={`email`}
            onChange={handleChange}
            onBlur={isEmailValid}
          />
        </div>
        <div class="col-2">
          <label class="form-label ">
            Due Date บ.ประกัน<span class="text-danger"> *</span>
          </label>
          <DatePicker
            showIcon
            className="form-control"
            todayButton="Vandaag"
            // isClearable
            name="actDate"
            showYearDropdown
            dateFormat="dd/MM/yyyy"
            dropdownMode="select"
            selected={formData.dueDateInsurer}
            onChange={(date) => handleChangeActdate(date, 'dueDateInsurer')}
          // onBlur={(e) => validateDate(e)}
          />
        </div>
        <div class="col-2">
          <label class="form-label ">
            Due Date ผู้แนะนำ<span class="text-danger"> *</span>
          </label>
          <DatePicker
            showIcon
            className="form-control"
            todayButton="Vandaag"
            // isClearable
            name="actDate"
            showYearDropdown
            dateFormat="dd/MM/yyyy"
            dropdownMode="select"
            selected={formData.dueDateAgent}
            onChange={(date) => handleChangeActdate(date, 'dueDateAgent')}
          // onBlur={(e) => validateDate(e)}
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
              value={vcDD.filter(({ value }) => value === formData.voluntaryCode)}
                // className="form-control"
                styles={customStyles}
                name={`voluntaryCode`}
                onChange={(e) => changeVoluntaryCode(e)}
                options={vcDD}
              // onChange={opt => console.log(opt)}
              />
            </div>
            <div class="col-2">
              <label class="form-label ">
                รหัสรถ (C)<span class="text-danger"> </span>
              </label>
              <Select
                // className="form-control"
                value={ccDD.filter(({ value }) => value === formData.compulsoryCode)}
                styles={customStyles}
                name={`compulsoryCode`}
                onChange={(e) => setFormData((prevState) => ({
                  ...prevState,
                  compulsoryCode: e.value,
                }))}
                options={ccDD}

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
                value={provinceDD.filter(({ value }) => value === formData.motorprovinceID)}
                name={`motorprovinceID`}
                onChange={(e) => setFormData((prevState) => ({
                  ...prevState,
                  motorprovinceID: e.value,
                }))}
                options={provinceDD}
                styles={customStyles}
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
                value={motorbrandDD.filter(({ value }) => value === formData.brandname)}
                name={`brandname`}
                onChange={(e) => changeMotorBrand(e)}
                options={motorbrandDD}
                styles={customStyles}
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
              value={motormodelDD.filter(({ value }) => value === formData.modelname)}
                // className="form-control"
                styles={customStyles}
                name={`modelname`}
                onChange={(e) => changeMotorModel(e)}

                options={motormodelDD}
              />

            </div>
            <div class="col-2">
              <label class="form-label ">
                รุ่นย่อย<span class="text-danger"> *</span>
              </label>
              <Select
                // className="form-control"
                value={motorspecDD.filter(({ value }) => value === formData.specname)}
                styles={customStyles}
                name={`specname`}
                onChange={(e) => setFormData((prevState) => ({
                  ...prevState,
                  specname: e.value,
                }))}
                options={motorspecDD}
              />
              {/* <input
                className="form-control"
                type="text"
                name={`specname`}
                defaultValue={formData.specname}
                onChange={handleChange}
              /> */}
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
