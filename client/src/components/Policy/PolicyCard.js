import axios from "axios";
import * as XLSX from "xlsx";
import { useEffect, useState } from "react";
import { CenterPage } from "../StylesPages/AdminStyles";
import { Container } from "../StylesPages/PagesLayout";
import { async } from "q";
import Modal from 'react-bootstrap/Modal';
import jwt_decode from "jwt-decode";
import { useCookies } from "react-cookie";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const config = require("../../config.json");

const PolicyCard = (props) => {
  const index = props.index;
  const url = window.globalConfig.BEST_POLICY_V1_BASE_URL;
  const tax = config.tax
  const duty = config.duty
  const withheld = config.witheld

  //import excel
  const [cookies] = useCookies(["jwt"]);
  const [formData, setFormData] = useState(props.formData);
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
  const [installment, setInstallment] = useState({ insurer: [], advisor: [] })
  const [hidecard, setHidecard] = useState([false, 0]);

  function formatDate(dateString) {
    // Assuming dateString is in the format dd/mm/yyyy
    const parts = dateString.split('/');
    const formattedDate = new Date(parts[2], parts[1] - 1, parts[0]);
    return formattedDate;
}

  const handleChange = async (e) => {
    e.preventDefault();

    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
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
    //  set totalprem
    if (
      formData.duty !== null &&
      formData.tax !== null &&
      formData.grossprem !== null
    ) {
      const newTotalPrem =
        parseFloat(formData.grossprem) -
        parseFloat(formData.duty) -
        parseFloat(formData.tax);
      setFormData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
        totalprem: newTotalPrem,
      }));
    } else {
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
      } else if (e.target.name === 'grossprem')
        setFormData((prevState) => ({
          ...prevState,
          [e.target.name]: e.target.value,
          duty: (duty * formData[`grossprem`]) / 100,
          tax: (tax * formData[`grossprem`]) / 100
        }));
    }

    //set dropdown title follow to personType
    if (e.target.name === "personType") {
      if (e.target.value === "P") {
        axios
          .get(url + "/static/titles/person/all")
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
          .get(url + "/static/titles/company/all")
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

  const getDistrict = (provincename) => {
    //get distric in province selected
    axios
      .post(url + "/static/amphurs/search", { provincename: provincename })
      .then((distric) => {
        const array = [];
        distric.data.forEach((ele) => {
          array.push(
            <option id={ele.amphurid} value={ele.t_amphurname} value2={ele.t_amphurname}>
              {ele.t_amphurname}
            </option>
          );
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
      .post(url + "/static/mt_models/search", { brandname: brandname })
      .then((model) => {
        const array = [];
        model.data.forEach((ele) => {
          array.push(
            <option value={ele.MODEL} >
              {ele.MODEL}
            </option>
          );
        });
        setMotormodelDD(array);
      })
      .catch((err) => {
        // alert("cant get aumphur");
      });
  };
  const getcommov = (e) => {
    e.preventDefault();
    //get comm  ov setup
    axios
      .post(url + "/insures/getcommov", formData)
      .then((res) => {
        console.log(res.data);
        setFormData((prevState) => ({
          ...prevState,
          [`commin_rate`]: res.data[0].rateComIn,
          [`ovin_rate`]: res.data[0].rateOVIn_1,
          [`commout_rate`]: res.data[0].rateComOut,
          [`ovout_rate`]: res.data[0].rateOVOut_1,
          [`commin_amt`]: res.data[0].rateComIn * formData[`grossprem`] / 100,
          [`ovin_amt`]: res.data[0].rateOVIn_1 * formData[`grossprem`] / 100,
          [`commout_amt`]: res.data[0].rateComOut * formData[`grossprem`] / 100,
          [`ovout_amt`]: res.data[0].rateOVOut_1 * formData[`grossprem`] / 100,

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



  const getSubDistrict = (amphurname) => {
    //get tambons in distric selected
    axios
      .post(url + "/static/tambons/search", { amphurname: amphurname })
      .then((subdistric) => {
        const arraySub = [];
        const arrayZip = [];
        const zip = [];
        subdistric.data.forEach((ele) => {
          arraySub.push(
            <option id={ele.tambonid} value={ele.t_tambonname}>
              {ele.t_tambonname}
            </option>
          );
          zip.push(ele.postcodeall.split("/"));
        });
        const uniqueZip = [...new Set(...zip)];
        console.log(uniqueZip);
        uniqueZip.forEach((zip) => {
          arrayZip.push(<option value={zip}>{zip}</option>);
        });
        setSubDistricDD(arraySub);
        setZipCodeDD(arrayZip);
      })
      .catch((err) => {
        // alert("cant get tambons");
      });
  };

  const editInstallment = (e, type, index) => {
    // e.preventDefault();
    //get tambons in distric selected
    const arrI = []
    const arrA = []
    // get old installment
    installment.insurer.map(ele => {
      arrI.push(ele)
    })
    installment.advisor.map(ele => {
      arrA.push(ele)
    })
    if (type === 'insurer') {
      const dueDate = document.getElementsByName(`dueDate-${index}`)[0].value
      const netgrossprem = parseFloat(document.getElementsByName(`netgrossprem-${index}`)[0].value)
      const dutyamt = parseFloat(Math.ceil(netgrossprem * duty))
      const taxamt = parseFloat(((netgrossprem + dutyamt) * tax).toFixed(2))
      const witheldamt = parseFloat(((netgrossprem + dutyamt) * withheld).toFixed(2))
      const commin_amt = parseFloat((formData.commin_rate * netgrossprem / 100).toFixed(2))
      const ovin_amt = parseFloat((formData.ovin_rate * netgrossprem / 100).toFixed(2))


      arrI[index] = {
        netgrossprem: netgrossprem,
        tax: taxamt,
        duty: dutyamt,
        totalprem: parseFloat((netgrossprem + tax + duty).toFixed(2)),
        withheld: witheldamt,
        dueDate: dueDate,
        commin_amt: commin_amt,
        commin_taxamt: parseFloat((commin_amt * tax).toFixed(2)),
        ovin_amt: ovin_amt,
        ovin_taxamt: parseFloat((ovin_amt * tax).toFixed(2))
      }
      console.log(arrI);
      setInstallment()

    } else if (type === 'advisor') {
      const dueDate = document.getElementsByName(`dueDate-${index}`)[0].value
      const netgrossprem = parseFloat(document.getElementsByName(`netgrossprem-${index}`)[0].value)
      const dutyamt = parseFloat(Math.ceil(duty * netgrossprem))
      const taxamt = parseFloat((tax * (netgrossprem + dutyamt)).toFixed(2))
      const witheldamt = parseFloat(((netgrossprem + dutyamt) * withheld).toFixed(2))
      const commin_amt = parseFloat((formData.commin_rate * netgrossprem / 100).toFixed(2))
      const ovin_amt = parseFloat((formData.ovin_rate * netgrossprem / 100).toFixed(2))
      const commout1_amt = parseFloat((formData.commout1_rate * netgrossprem / 100).toFixed(2))
      const ovout1_amt = parseFloat((formData.ovout1_rate * netgrossprem / 100).toFixed(2))

      // get old installment
      arrA[index] = {
        netgrossprem: netgrossprem,
        tax: taxamt,
        duty: dutyamt,
        totalprem: parseFloat((netgrossprem + tax + duty).toFixed(2)),
        withheld: witheldamt,
        dueDate: dueDate,
        commin_amt: commin_amt,
        commin_taxamt: parseFloat((commin_amt * tax).toFixed(2)),
        ovin_amt: ovin_amt,
        ovin_taxamt: parseFloat((ovin_amt * tax).toFixed(2)),
        commout1_amt: commout1_amt,
        ovout1_amt: ovout1_amt
      }

    }
    setInstallment({ insurer: arrI, advisor: arrA })
  };
  const editCard = (e) => {
    console.log(formData);
    setHidecard([true, 1])
    
    setFormData((prevState) => ({
      ...prevState,
      select:true,
      updatedAt: new Date().toLocaleDateString(),
      updateusercode : jwt_decode(cookies["jwt"]).USERNAME
    }));

};
const handleClose = (e) => {
    setHidecard([false, 0])
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
  useEffect(() => {
    //get province
    axios
      .get(url + "/static/provinces/all")
      .then((province) => {
        // let token = res.data.jwt;
        // let decode = jwt_decode(token);
        // navigate("/");
        // window.location.reload();
        // localStorage.setItem("jwt", token);

        const array = [];
        province.data.forEach((ele) => {
          array.push(
            <option value={ele.t_provincename} >
              {ele.t_provincename}
            </option>
          );
        });
        setProvinceDD(array);
        // get title
        axios
          .get(url + "/static/titles/company/all")
          .then((title) => {
            const array2 = [];
            title.data.forEach((ele) => {
              array2.push(
                <option key={ele.TITLEID} value={ele.TITLEID}>
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
      .get(url + "/insures/insuretypeall")
      .then((insuretype) => {
        // let token = res.data.jwt;
        // let decode = jwt_decode(token);
        // navigate("/");
        // window.location.reload();
        // localStorage.setItem("jwt", token);

        const array = [];
        insuretype.data.forEach((ele) => {
          array.push(
            <option key={ele.id} value={ele.class}>
              {ele.class}
            </option>
          );
        });
        setInsureTypeDD(insuretype.data);
        setInsureClassDD(array);
      })
      .catch((err) => { });

    //get insurer
    axios
      .get(url + "/persons/insurerall")
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
      .get(url + "/static/mt_brands/all")
      .then((brands) => {
        // let token = res.data.jwt;
        // let decode = jwt_decode(token);
        // navigate("/");
        // window.location.reload();
        // localStorage.setItem("jwt", token);

        const array = [];
        brands.data.forEach((ele) => {
          array.push(
            <option key={ele.id} value={ele.BRANDNAME}>
              {ele.BRANDNAME}
            </option>
          );
        });
        setMotorbrandDD(array);
      })
      .catch((err) => { });
    //get installment
    if (props.formData.installment) {
      setInstallment(props.formData.installment)
    }
  }, []);

  const calinstallment = (e) => {
    e.preventDefault();
    // set installment data
    const installI = document.getElementsByName("installmentInsurer")[0].checked
    const seqNoins = parseInt(document.getElementsByName("seqNoins")[0].value)
    const seqNoinstime = parseInt(document.getElementsByName("seqNoinstime")[0].value)
    const seqNoinstype = document.getElementsByName("seqNoinstype")[0].value
    const flagallowduty = document.getElementsByName("flagallowduty")[0].checked
    const seqNoinsStart = document.getElementsByName("seqNoinsStart")[0].value

    const installA = document.getElementsByName("installmentAdvisor")[0].checked
    const seqNoagt = parseInt(document.getElementsByName("seqNoagt")[0].value)
    const seqNoagttime = parseInt(document.getElementsByName("seqNoagttime")[0].value)
    const seqNoagttype = document.getElementsByName("seqNoagttype")[0].value
    const seqNoagtStart = document.getElementsByName("seqNoagtStart")[0].value

    const arrI = []
    if (installI) {
      let premperseq = parseFloat((formData.netgrossprem / seqNoins).toFixed(2))
      console.log(formData.netgrossprem - premperseq * (seqNoins - 1));
      
      let dueDate 
      if (seqNoinsStart  === "") {
        dueDate = new Date()
        
      }else {
        dueDate = formatDate(seqNoinsStart)
      }
      console.log('seqNoinsStart : ' + dueDate);
      for (let i = 1; i <= seqNoins; i++) {
        let dutyseq = 0

        // cal prem
        if (i === 1) {
          premperseq = parseFloat((formData.netgrossprem - premperseq * (seqNoins - 1)).toFixed(2))

        }
        else { premperseq = parseFloat((formData.netgrossprem / seqNoins).toFixed(2)) }

        //cal duty
        if (flagallowduty) { dutyseq = Math.ceil(premperseq * duty) }
        else {
          if (i === 1) {
            dutyseq = Math.ceil(formData.netgrossprem * duty)
          } else { dutyseq = 0 }
        }

        //cal tax
        let taxseq = parseFloat((tax * (premperseq + dutyseq)).toFixed(2))

        //cal withheld
        let withheldseq = 0 
         if (formData.witheld > 0) {
          withheldseq = parseFloat((withheld * (premperseq + dutyseq)).toFixed(2))  
        }

        // cal duedate
        let seqDueDate 
        if (seqNoinstype === 'M' && i !== 1 ) {
          seqDueDate =  dueDate.setMonth(dueDate.getMonth() + seqNoinstime)
        } else if (seqNoinstype === 'D' && i !== 1 ){
          seqDueDate = dueDate.setDate(dueDate.getDate() + seqNoinstime) 
        }else if (i === 1 ){
          seqDueDate = dueDate.setMonth(dueDate.getMonth())
        }
        console.log(seqDueDate);
        //cal comm-ov in
        let comminseq = parseFloat((formData.commin_rate * premperseq / 100).toFixed(2))
        let ovinseq = parseFloat((formData.ovin_rate * premperseq / 100).toFixed(2))
        arrI.push({
          netgrossprem: premperseq,
          tax: taxseq,
          duty: dutyseq,
          totalprem: parseFloat((premperseq + taxseq + dutyseq).toFixed(2)),
          // dueDate: dueDate.toISOString().split('T')[0],
          dueDate: new Date(seqDueDate),
          commin_amt: comminseq,
          commin_taxamt: parseFloat((comminseq * tax).toFixed(2)),
          ovin_amt: ovinseq,
          ovin_taxamt: parseFloat((ovinseq * tax).toFixed(2)),
          withheld: withheldseq
        })

      }
      console.log(arrI);
    }

    const arrA = []
    if (installA) {
      let premperseq = parseFloat((formData.netgrossprem / seqNoagt).toFixed(2))
      console.log(formData.netgrossprem - premperseq * (seqNoagt - 1));
      let dueDate 
      if (seqNoagtStart  === "") {
        dueDate = new Date()
        
      }else {
        dueDate = formatDate(seqNoagtStart)
      }
      console.log('seqNoagtStart : ' + dueDate);
      for (let i = 1; i <= seqNoagt; i++) {
        let dutyseq = 0

        // cal prem
        if (i === 1) {
          premperseq = parseFloat((formData.netgrossprem - premperseq * (seqNoagt - 1)).toFixed(2))

        }
        else { premperseq = parseFloat((formData.netgrossprem / seqNoagt).toFixed(2)) }

        //cal duty
        if (flagallowduty) { dutyseq = Math.ceil(premperseq * duty) }
        else {
          if (i === 1) {
            dutyseq = Math.ceil(formData.netgrossprem * duty)
          } else { dutyseq = 0 }
        }

        //cal tax
        let taxseq = parseFloat((tax * (premperseq + dutyseq)).toFixed(2))

        //cal withheld
        let withheldseq = 0 
         if (formData.witheld > 0) {
          withheldseq = parseFloat((withheld * (premperseq + dutyseq)).toFixed(2))  
        }

        // cal duedate
        console.log(seqNoagttype === 'M');
        let seqDueDate 
        if (seqNoagttype === 'M' && i !== 1 ) {
          seqDueDate = dueDate.setMonth(dueDate.getMonth() + seqNoagttime)
        } else if (seqNoagttype === 'D' && i !== 1 ){ seqDueDate = dueDate.setDate(dueDate.getDate() + seqNoagttime) }
        else if (i === 1){
          seqDueDate = dueDate.setMonth(dueDate.getMonth())
        }
        //cal comm-ov in
        let comminseq = parseFloat((formData.commin_rate * premperseq / 100).toFixed(2))
        let ovinseq = parseFloat((formData.ovin_rate * premperseq / 100).toFixed(2))
        //cal comm-ov out
        let commoutseq = parseFloat((formData.commout1_rate * premperseq / 100).toFixed(2))
        let ovoutseq = parseFloat((formData.ovout1_rate * premperseq / 100).toFixed(2))
        arrA.push({
          netgrossprem: premperseq,
          tax: taxseq,
          duty: dutyseq,
          totalprem: premperseq + taxseq + dutyseq,
          // dueDate: dueDate.toISOString().split('T')[0],
          dueDate: new Date(seqDueDate),
          commin_amt: comminseq,
          commin_taxamt: comminseq * tax,
          ovin_amt: ovinseq,
          ovin_taxamt: ovinseq * tax,
          commout1_amt: commoutseq,
          ovout1_amt: ovoutseq,
          withheld: withheldseq

        })

      }
      console.log(arrA);
    }
    setInstallment({ insurer: arrI, advisor: arrA })
  }

  return (
    <div>
      <h1 className="text-center">ใบคำขอเลขที่ {formData.applicationNo}</h1>
      {/* policy table */}

      <div className="table-responsive overflow-scroll"  >
        <table class="table  table-striped " >
          <thead>
            <tr>
              <th scope="col" className="input"> เลขที่กรมธรรม์ </th>
              <th scope="col" > เลขที่ใบแจ้งหนี้ </th>
              <th scope="col" > เลขที่ใบกำกับภาษี </th>
              <th scope="col" className="input">วันที่ทำสัญญา</th>
              <th scope="col">บริษัทรับประกัน</th>
              <th scope="col">เลขที่ใบคำขอ</th>
              <th scope="col">ผู้แนะนำ 1</th>
              <th scope="col">ผู้แนะนำ 2</th>
              <th scope="col">Class</th>
              <th scope="col">Subclass</th>
              <th scope="col">วันที่สร้าง</th>
              <th scope="col">วันที่คุ้มครอง-สิ้นสุด</th>
              <th scope="col">ชื่อผู้เอาประกัน</th>
              <th scope="col">เลขทะเบียนรถ</th>
              <th scope="col">เลขตัวถังรถ</th>
              <th scope="col">เลขที่สลักหลัง</th>
              <th scope="col">seqno</th>
              <th scope="col">เลขที่ใบแจ้งหนี้</th>
              <th scope="col">เลขที่ใบกำกับภาษี</th>
              <th scope="col">เบี้ย</th>
              <th scope="col">อากร</th>
              <th scope="col">ภาษี</th>
              <th scope="col">เบี้ยรวม</th>
              <th scope="col">WHT 1%</th>
              <th scope="col">ค่า Commin (บาท)</th>
              <th scope="col">ค่า Ovin (บาท)</th>
              <th scope="col">ค่า Commout (บาท)</th>
              <th scope="col">ค่า Ovout (บาท)</th>

            </tr>
          </thead>
          <tbody>

            <tr>
              <td><input
                className="form-control"
                type="text"
                defaultValue={formData.policyNo || ''}
                name={`policyNo`}
                onChange={handleChange}
              /></td>
              <td><input
                className="form-control"
                type="text"
                defaultValue={formData.invoiceNo || ''}
                name={`invoiceNo`}
                onChange={handleChange}
              /></td>
              <td><input
                className="form-control"
                type="text"
                defaultValue={formData.taxInvoiceNo || ''}
                name={`taxInvoiceNo`}
                onChange={handleChange}
              /></td>
              <td>
                {/* <input
                className="form-control"
                type="date"
                defaultValue={formData.issueDate || ''}
                name={`issueDate`}
                onChange={handleChange}
              /> */}
              <DatePicker
                            // showIcon
                            className="form-control"
                            todayButton="Vandaag"
                            // isClearable
                            name="effDatestart"
                            showYearDropdown
                            dateFormat="dd/MM/yyyy"
                            dropdownMode="select"
                            selected={formData.issueDate || null}
                            onChange={(date) => handleChangeDate(date,'issueDate')}
                                 />
              </td>
              <td>{formData.insurerCode}</td>
              <td>{formData.applicationNo}</td>
              <td>{formData.agentCode}</td>
              <td>{formData.agentCode2 || '-'}</td>
              <td>{formData.class}</td>
              <td>{formData.subClass}</td>
              <td>{formData.polcreatedAt}</td>
              <td>{formData.actDate} - {formData.expDate}</td>
              <td>{formData.fullName}</td>
              <td>{formData.licenseNo || '-'}</td>
              <td>{formData.chassisNo || '-'}</td>
              <td>{formData.endorseNo || '-'}</td>
              <td>{formData.seqNo || '-'}</td>
              <td>{formData.invoiceNo || '-'}</td>
              <td>{formData.taxInvoiceNo || '-'}</td>
              <td>{formData.netgrossprem.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              <td>{formData.duty.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              <td>{formData.tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              <td>{formData.totalprem.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              <td>{formData.withheld.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              <td>{formData.commin_amt.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              <td>{formData.ovin_amt.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              <td>{formData.commout_amt.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              <td>{formData.ovout_amt.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
            </tr>



          </tbody>
        </table>
      </div>

      {/* <div className="row form-group form-inline ">
        <div className="col-1"></div>
        <div className="col-2 form-group  ">
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
        </div>

        <div class="col-2 form-group ">
          <label class="form-label">
            วันที่เริ่มคุ้มครอง<span class="text-danger"> *</span>
          </label>
          <input
            disabled
            className="form-control"
            type="date"
            defaultValue={formData.actDate}
            name={`actDate`}
            onChange={handleChange}
          />
        </div>

        <div class="col-2 form-group ">
          <label class="form-label ">
            วันที่สิ้นสุด<span class="text-danger"> *</span>
          </label>
          <input
            disabled
            className="form-control"
            type="date"
            defaultValue={formData.expDate}
            name={`expDate`}
            onChange={handleChange}
          />
        </div>
        <div className="col-2 form-group  ">
          <label class="form-label ">
            วันที่ทำสัญญา<span class="text-danger"> *</span>
          </label>
          <input
            className="form-control"
            type="date"
            value={formData.issueDate || ''}
            name={`npm star`}
            onChange={handleChange}
          />
        </div>
        <div class="col-3"></div>
      </div>
      
      <div class="row">
        <div className="col-1"></div>
        <div class="col-2 form-group ">
          <label class="form-label px-3">
            บริษัทรับประกัน<span class="text-danger"> *</span>
          </label>
          <select
            disabled
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

        <div class="col-2 form-group ">
          <label class="form-label px-3">
            รหัสผู้แนะนำ<span class="text-danger"> *</span>
          </label>
          <input
            disabled
            className="form-control"
            type="text"
            defaultValue={formData.agentCode}
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
            disabled
            defaultValue={formData.agentCode2}
            name={`agentCode2`}
            onChange={handleChange}
          />
        </div>
        <div class="col-2 form-group ">
          <div className="row">

            <div className="col form-group">
              <label class="form-label ">
                Class
              </label>
              <select
                disabled
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
                Subclass
              </label>
              <select
                disabled
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

        <div class="col-2">
          <label class="form-label ">
            ทุนประกัน<span class="text-danger"> *</span>
          </label>
          <input
            className="form-control"
            type="number"
            step={0.1}
            value={formData.cover_amt}
            name={`cover_amt`}
            onChange={(e) => handleChange(e)}
          />
        </div>

      </div>

      <div class="row">
        <div className="col-1"></div>
        <div class="col-2">
          <label class="form-label ">
            ค่าเบี้ย<span class="text-danger"> *</span>
          </label>
          <input
            className="form-control"
            type="number"
            step={0.1}
            value={formData.grossprem}
            name={`grossprem`}
            onChange={(e) => handleChange(e)}
          />
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
                value={formData[`specdiscrate`]}
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
                value={parseFloat((formData[`specdiscrate`] * formData[`grossprem`] / 100).toFixed(2)) || ""}
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
                อากร
              </label>
              <input
                className="form-control"
                type="number"
                step={0.1}
                disabled
                // netgrossprem * tax 
                value={parseFloat(Math.ceil((100 - formData[`specdiscrate`]) * formData[`grossprem`] / 100 * duty)) || ""}
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
            // value={parseFloat(formData.grossprem) - parseFloat(formData.duty) - parseFloat(formData.tax)}
            value={parseFloat(((100 - formData[`specdiscrate`]) * formData[`grossprem`] / 100 * (1 + duty + tax)).toFixed(2)) || ""}
            step={0.1}
            name={`totalprem`}
            disabled
          />
        </div>

        <div class="col-2">
          <label class="form-label ">
            ภาษีหัก ณ ที่จ่าย 1 %<span class="text-danger"> *</span>
          </label>
          <input
            type="number" // Use an input element for displaying numbers
            className="form-control"
            // value={formData.totalprem} // Display the totalprem value from the state
            // value={parseFloat(formData.grossprem) - parseFloat(formData.duty) - parseFloat(formData.tax)}
            value={parseFloat(((100 - formData[`specdiscrate`]) * formData[`grossprem`] / 100 * (1 + duty) * withheld).toFixed(2)) || ""}
            disabled
            step={0.1}
            name={`totalprem`}

          />
        </div>
      </div>

      <div class="row">
        <div className="col-1"></div>
        <div class="col-2">
          <label class="form-label ">
            Comm In % <span class="text-danger"> *</span>
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
                value={parseFloat((formData[`commin_rate`] * (100 - formData[`specdiscrate`]) * formData[`grossprem`] / 10000).toFixed(2)) || ""}
                name={`commin_amt`}
                onChange={(e) => handleChange(e)}
              />
            </div>
          </div>

        </div>


        <div class="col-2">
          <label class="form-label ">
            Ov In % <span class="text-danger"> *</span>
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
                value={parseFloat((formData[`ovin_rate`] * (100 - formData[`specdiscrate`]) * formData[`grossprem`] / 10000).toFixed(2)) || ""}
                onChange={handleChange}
              />
            </div>
          </div>

        </div>

        <div class="col-2">
          <label class="form-label ">
            Comm Out % (1)<span class="text-danger"> *</span>
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
                value={(formData[`commout1_rate`] * formData[`grossprem`]) / 100 || ""}
                name={`commout1_amt`}
                onChange={handleChange}
              />
            </div>

          </div>
        </div>
        <div class="col-2">
          <label class="form-label ">
            Ov Out % (1)<span class="text-danger"> *</span>
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
                value={parseFloat((formData[`ovout1_rate`] * (100 - formData[`specdiscrate`]) * formData[`grossprem`] / 10000).toFixed(2)) || ""}
                onChange={handleChange}
              />
            </div>

          </div>
        </div>
        


      </div>

      <div class="row">
        <div className="col-1"></div>


        <div class="col-2">
          <label class="form-label ">
            Comm Out % (2)<span class="text-danger"> *</span>
          </label>
          <div className="row">
            <div className="col">
              <input
                className="form-control"
                type="number"
                step={0.1}
                value={formData[`commout2_rate`]}
                name={`commout2_rate`}
                onChange={handleChange}
              />
            </div>
            <div className="col">
              <input
                className="form-control"
                type="number"
                disabled
                step={0.1}
                value={parseFloat((formData[`commout2_rate`] * (100 - formData[`specdiscrate`]) * formData[`grossprem`] / 10000).toFixed(2)) || ""}
                //value={(formData[`commout2_rate`] * formData[`grossprem`]) / 100 || ""}
                name={`commout2_amt`}
                onChange={handleChange}
              />
            </div>

          </div>
        </div>
        <div class="col-2">
          <label class="form-label ">
            Ov Out % (2)<span class="text-danger"> *</span>
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
                //value={(formData[`ovout2_rate`] * formData[`grossprem`]) / 100 || ""}
                value={parseFloat((formData[`ovout2_rate`] * (100 - formData[`specdiscrate`]) * formData[`grossprem`] / 10000).toFixed(2)) || ""}
                onChange={handleChange}
              />
            </div>

          </div>
        </div>
        <div class="col-2">
          <label class="form-label ">
            Comm Out % (sum)
          </label>
          <div className="row">
            <div className="col">
              <input
                className="form-control"
                type="number"
                step={0.1}
                value={formData[`commout_rate`]}
                name={`commout_rate`}
                onChange={(e) => handleChange(e)}
                disabled
              />
            </div>
            <div className="col">
              <input
                className="form-control"
                type="number"
                disabled
                step={0.1}
                //value={(formData[`commin2_rate`] * formData[`grossprem`]) / 100 || ""}
                value={parseFloat((formData[`commout_rate`] * (100 - formData[`specdiscrate`]) * formData[`grossprem`] / 10000).toFixed(2)) || ""}
                name={`commout_amt`}
                onChange={(e) => handleChange(e)}

              />
            </div>
          </div>

        </div>


        <div class="col-2">
          <label class="form-label ">
            Ov Out % (sum)
          </label>
          <div className="row">
            <div className="col">
              <input
                className="form-control"
                type="number"
                step={0.1}
                value={formData[`ovout_rate`]}
                name={`ovout_rate`}
                onChange={handleChange}
                disabled
              />
            </div>
            <div className="col">
              <input
                className="form-control"
                type="number"
                disabled
                step={0.1}
                name={`ovout_amt`}
                //value={(formData[`ovin2_rate`] * formData[`grossprem`]) / 100 || ""}
                value={parseFloat((formData[`ovout_rate`] * (100 - formData[`specdiscrate`]) * formData[`grossprem`] / 10000).toFixed(2)) || ""}
                onChange={handleChange}

              />
            </div>
          </div>

        </div>
        


      </div> */}

      {/* end policy data */}
      <h3 className="text-center" style={{padding:`20px`}}>แบ่งงวดชำระ</h3>

      <div class="row ">
        <div className="col-1"></div>
        <div className="col-2">
          <div class="form-check">
            <input class="form-check-input" type="checkbox" name="installmentInsurer" id="flexCheckDefault" />
            <label class="form-check-label" for="flexCheckChecked">
            แบ่งงวด บริษัทประกัน
            </label>
          </div>
        </div>
        <div class="col-1">
          <label class="form-label ">
            จำนวน<span class="text-danger"> </span>
          </label>
        </div>
        <div class="col-1">

          <input
            className="form-control"
            type="number"
            defaultValue={formData.seqNoins}
            name={`seqNoins`}
            onChange={handleChange}
            onBlur={(e) =>{setFormData((prevState) => ({
              ...prevState,
              'seqNoagt': e.target.value,
            }));}}
          />
        </div>
        <div class="col-1">
          <label class="form-label ">
            งวด<span class="text-danger"> </span>
          </label>
        </div>
        <div className="col-2 border-left">

          <div class="form-check ">
            <input class="form-check-input" type="checkbox" name="installmentAdvisor" id="flexCheckDefault" />
            <label class="form-check-label" for="flexCheckChecked">
            แบ่งงวด ผู้แนะนำ
            </label>
          </div>

        </div>
        <div class="col-1">
          <label class="form-label ">
            จำนวน<span class="text-danger"> </span>
          </label>
        </div>
        <div class="col-1">

          <input
            className="form-control"
            type="number"
            value={formData.seqNoagt}
            name={`seqNoagt`}
            onChange={handleChange}
          />
        </div>
        <div class="col-1">
          <label class="form-label ">
            งวด<span class="text-danger"> </span>
          </label>
        </div>

      </div>

      <div class="row">
        <div className="col-1"></div>
        <div class="col-2">

          <div class="form-check ">
            <input class="form-check-input" type="checkbox" name="flagallowduty" defaultChecked={true} id="flexCheckDefault" />
            <label class="form-check-label" for="flexCheckChecked">
              แบ่งค่าอากร
            </label>
          </div>

        </div>
        <div class="col-1">

          <label class="form-label ">
            เวลาต่องวด
          </label>
        </div>
        <div class="col-1">
          <input
            className="form-control"
            type="number"
            value={formData.seqNoinstime}
            name={`seqNoinstime`}
            onChange={handleChange}
            onBlur={(e) =>{setFormData((prevState) => ({
              ...prevState,
              'seqNoagttime': e.target.value,
            }));}}
          />
        </div>
        <div className="col-1">

          <select
            className="form-control"
            name={`seqNoinstype`}
            onChange={handleChange}
            onBlur={(e) =>{setFormData((prevState) => ({
              ...prevState,
              'seqNoagttype': e.target.value.trim(),
            }));}}
          >
            <option value={formData.seqNoinstype} disabled selected hidden>
              {formData.seqNoinstype}
            </option>
            <option value="D">วัน</option>
            <option value="M" selected>เดือน</option>
          </select>
        </div>
        <div className="col-2 border-left"></div>
        <div class="col-1">

          <label class="form-label ">
            เวลาต่องวด
          </label>
        </div>
        <div class="col-1">
          <input
            className="form-control"
            type="number"
            value={formData.seqNoagttime}
            name={`seqNoagttime`}
            onChange={handleChange}
          />
        </div>
        <div className="col-1">

          <select
            className="form-control"
            name={`seqNoagttype`}
            onChange={handleChange}
            // value={formData.seqNoagttype }
          >
            <option value={formData.seqNoagttype} disabled selected hidden>
              {formData.seqNoagttype}
            </option>
            <option value="D">วัน</option>
            <option value="M" selected>เดือน</option>
          </select>
        </div>
      </div>

      <div class="row">
        <div className="col-3"></div>
        
        <div class="col-1">

          <label class="form-label ">
            วันที่เริ่มต้น (งวดแรก)
          </label>
        </div>
        <div class="col-2">
        <DatePicker
                            showIcon
                            className="form-control"
                            todayButton="Vandaag"
                            // isClearable
                            name="seqNoinsStart"
                            showYearDropdown
                            placeholder ='dd/mm/yyyy'
                            dateFormat="dd/MM/yyyy"
                            dropdownMode="select"
                            selected={formData.seqNoinsStart || null}
                            onChange={(date) => handleChangeDate(date,'seqNoinsStart')}
                                 />
        </div>
        
        <div className="col-2 border-left"></div>
        <div class="col-1">

        <label class="form-label ">
            วันที่เริ่มต้น (งวดแรก)
          </label>
        </div>
        <div class="col-2">
        <DatePicker
                            showIcon
                            className="form-control"
                            todayButton="Vandaag"
                            // isClearable
                            name="seqNoagtStart"
                            showYearDropdown
                            dateFormat="dd/MM/yyyy"
                            dropdownMode="select"
                            selected={formData.seqNoagtStart || null}
                            onChange={(date) => handleChangeDate(date,'seqNoagtStart')}
                                 />
        </div>
       
      </div>

      <div class="d-flex justify-content-center "  style={{padding:`20px`}}>
        <button type="button" class="btn btn-primary align-bottom text-center" onClick={calinstallment} >คำนวณ แบ่งงวดชำระ</button>
      </div>

      {installment.insurer.length > 0 ?
      <>
          <h4 className="text-left" style={{padding:`20px`}}>แบ่งงวด บริษัทประกัน </h4>
        <div className="table-responsive overflow-scroll"  >
          <table class="table  table-striped">
            <thead>
              <tr>
                <th scope="col-1">ประเภท</th>
                <th scope="col-1">แบ่งงวด</th>
                <th scope="col-2">DueDate</th>
                <th scope="col-2">เบี้ยประกัน</th>
                <th scope="col-1">อากร</th>
                <th scope="col-1">ภาษี</th>
                <th scope="col-1">WHT 1%</th>
                <th scope="col-1">Comm in</th>
                <th scope="col-1">Ov in</th>
                <th scope="col-1">Comm out</th>
                <th scope="col-1">Ov out</th>
                <th scope="col-1">แก้ไข</th>
              </tr>
            </thead>
            <tbody>
              {installment.insurer.map((ele, i) => {
                return (<tr>
                  <th scope="row">บริษัทประกัน</th>
                  <td scope="col-1">{i + 1}</td>
                  <td scope="col-2">
                    {/* <input
                    className="form-control"
                    type="date"
                    defaultValue={ele.dueDate}
                    name={`dueDate-${i}`}
                    onChange={handleChange}
                  /> */}
                  <DatePicker
                            // showIcon
                            className="form-control"
                            todayButton="Vandaag"
                            // isClearable
                            name="effDatestart"
                            showYearDropdown
                            dateFormat="dd/MM/yyyy"
                            dropdownMode="select"
                            selected={ele.dueDate || null}
                            onChange={(date) => handleChangeDate(date,`dueDate-${i}`)}
                                 />
                  </td>
                  <td scope="col-2"><input
                    className="form-control"
                    type="text"
                    defaultValue={ele.netgrossprem.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    name={`netgrossprem-${i}`}
                    onChange={handleChange}
                  /></td>
                  {/* <td scope="col-1"><input type="number" className="w-100" name={`duty-${i}`} step={.01} defaultValue={ele.duty}></input></td>
              <td scope="col-1"><input type="number" className="w-100" name={`tax-${i}`} step={.01} defaultValue={ele.tax}></input></td>
              <td scope="col-1"><input type="number" className="w-100" name={`commin_amt-${i}`} step={.01} defaultValue={ele.commin_amt}></input></td>
              <td scope="col-1"><input type="number" className="w-100" name={`ovin_amt-${i}`} step={.01} defaultValue={ele.ovin_amt}></input></td> */}
                  <td scope="col-1">{ele.duty.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td scope="col-1">{ele.tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td scope="col-1">{ele.withheld.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td scope="col-1">{ele.commin_amt.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td scope="col-1">{ele.ovin_amt.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td scope="col-1"></td>
                  <td scope="col-1"></td>
                  <td scope="col-1"><button onClick={e => editInstallment(e, 'insurer', i)}>แก้ไข</button></td>
                </tr>)
              })}
              {installment.insurer.length > 0 ?
                <tr>
                  <th scope="row">รวม บริษัทประกัน</th>
                  <td></td>
                  <td></td>
                  <td scope="col-1">{installment.insurer.reduce((prev, curr) => prev + parseFloat(curr.netgrossprem.toFixed(2)), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td scope="col-1">{installment.insurer.reduce((prev, curr) => prev + parseFloat(curr.duty.toFixed(2)), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td scope="col-1">{installment.insurer.reduce((prev, curr) => prev + parseFloat(curr.tax.toFixed(2)), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td scope="col-1">{installment.insurer.reduce((prev, curr) => prev + parseFloat(curr.withheld.toFixed(2)), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td scope="col-1">{installment.insurer.reduce((prev, curr) => prev + parseFloat(curr.commin_amt.toFixed(2)), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td scope="col-1">{installment.insurer.reduce((prev, curr) => prev + parseFloat(curr.ovin_amt.toFixed(2)), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td></td>
                  <td></td>
                </tr>
                : null}



            </tbody>
          </table>
        </div>
        </>
        : null}

      {installment.advisor.length > 0 ?
          <>
          <h4 className="text-left" style={{padding:`20px`}} >แบ่งงวด ผู้แนะนำ </h4>
        <div className="table-responsive overflow-scroll"  >
          <table class="table  table-striped">
            <thead>
              <tr>
                <th scope="col-1">ประเภท</th>
                <th scope="col-1">แบ่งงวด</th>
                <th scope="col-2">DueDate</th>
                <th scope="col-2">เบี้ยประกัน</th>
                <th scope="col-1">อากร</th>
                <th scope="col-1">ภาษี</th>
                <th scope="col-1">WHT 1%</th>
                <th scope="col-1">Comm in</th>
                <th scope="col-1">Ov in</th>
                <th scope="col-1">Comm out</th>
                <th scope="col-1">Ov out</th>
                <th scope="col-1">แก้ไข</th>
              </tr>
            </thead>
            <tbody>

              {installment.advisor.map((ele, i) => {
                return (<tr>
                  <th scope="row">ผู้แนะนำ</th>
                  <td>{i + 1}</td>
                  {/* <td scope="col-2"><input
                    className="form-control"
                    type="date"
                    defaultValue={ele.dueDate}
                    name={`dueDate-${i}`}
                    onChange={handleChange}
                  /></td> */}
                  <td>
                   <DatePicker
                            // showIcon
                            className="form-control"
                            todayButton="Vandaag"
                            // isClearable
                            name="effDatestart"
                            showYearDropdown
                            placeholder ='dd/mm/yyyy'
                            dateFormat="dd/MM/yyyy"
                            dropdownMode="select"
                            selected={ele.dueDate || null}
                            onChange={(date) => handleChangeDate(date,`dueDate-${i}`)}
                                 />
                                 </td>
                  <td scope="col-2"><input
                    className="form-control"
                    type="text"
                    defaultValue={ele.netgrossprem.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    name={`netgrossprem-${i}`}
                    onChange={handleChange}
                  /></td>
                  {/* <td scope="col-1"><input type="number" name={`duty-${i}`} step={.01} defaultValue={ele.duty}></input></td>
              <td scope="col-1"><input type="number" name={`tax-${i}`} step={.01} defaultValue={ele.tax}></input></td>
              <td scope="col-1"><input type="number" name={`commin_amt-${i}`} step={.01} defaultValue={ele.commin_amt}></input></td>
              <td scope="col-1"><input type="number" name={`ovin_amt-${i}`} step={.01} defaultValue={ele.ovin_amt}></input></td>
              <td scope="col-1"><input type="number" name={`commout1_amt-${i}`} step={.01} defaultValue={ele.commout1_amt}></input></td>
              <td scope="col-1"><input type="number" name={`ovout1_amt-${i}`} step={.01} defaultValue={ele.ovout1_amt}></input></td> */}
                  <td scope="col-1">{ele.duty}</td>
                  <td scope="col-1">{ele.tax}</td>
                  <td scope="col-1">{ele.withheld}</td>
                  <td scope="col-1">{ele.commin_amt}</td>
                  <td scope="col-1">{ele.ovin_amt}</td>
                  <td scope="col-1">{ele.commout1_amt}</td>
                  <td scope="col-1">{ele.ovout1_amt}</td>
                  <td scope="col-1"><button onClick={e => editInstallment(e, 'advisor', i)}>แก้ไข</button></td>
                </tr>)
              })}

              {installment.advisor.length > 0 ?
                <tr>
                  <th scope="row">รวม ผู้แนะนำ</th>
                  <td></td>
                  <td></td>
                  <td scope="col-1">{installment.advisor.reduce((prev, curr) => prev + parseFloat(curr.netgrossprem.toFixed(2)), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td scope="col-1">{installment.advisor.reduce((prev, curr) => prev + parseFloat(curr.duty.toFixed(2)), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td scope="col-1">{installment.advisor.reduce((prev, curr) => prev + parseFloat(curr.tax.toFixed(2)), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td scope="col-1">{installment.advisor.reduce((prev, curr) => prev + parseFloat(curr.withheld.toFixed(2)), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td scope="col-1">{installment.advisor.reduce((prev, curr) => prev + parseFloat(curr.commin_amt.toFixed(2)), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td scope="col-1">{installment.advisor.reduce((prev, curr) => prev + parseFloat(curr.ovin_amt.toFixed(2)), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td scope="col-1">{installment.advisor.reduce((prev, curr) => prev + parseFloat(curr.commout1_amt.toFixed(2)), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td scope="col-1">{installment.advisor.reduce((prev, curr) => prev + parseFloat(curr.ovout1_amt.toFixed(2)), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                </tr>
                : null}


            </tbody>
          </table>
        </div>
        </>
        : null}
      <h4 className="text-left" style={{padding:`20px`}} >สรุป </h4>
      <div className="table-responsive overflow-scroll"  >
        <table class="table  table-striped">
          <thead>
            <tr>
              <th scope="col-1">ประเภท</th>
              <th scope="col-1">จำนวนงวด</th>
              <th scope="col-2">เบี้ยประกัน</th>
              <th scope="col-1">อากร</th>
              <th scope="col-1">ภาษี</th>
              <th scope="col-1">WHT 1%</th>
              <th scope="col-1">Comm in</th>
              <th scope="col-1">Ov in</th>
              <th scope="col-1">Comm out</th>
              <th scope="col-1">Ov out</th>
            </tr>
          </thead>
          <tbody>

            {installment.insurer.length > 0 ?
              <tr>
                <th scope="row">รวม บริษัทประกัน</th>
                <td>{installment.insurer.length}</td>
                <td scope="col-1">{installment.insurer.reduce((prev, curr) => prev + parseFloat(curr.netgrossprem.toFixed(2)), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td scope="col-1">{installment.insurer.reduce((prev, curr) => prev + parseFloat(curr.duty.toFixed(2)), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td scope="col-1">{installment.insurer.reduce((prev, curr) => prev + parseFloat(curr.tax.toFixed(2)), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td scope="col-1">{installment.advisor.reduce((prev, curr) => prev + parseFloat(curr.withheld.toFixed(2)), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td scope="col-1">{installment.insurer.reduce((prev, curr) => prev + parseFloat(curr.commin_amt.toFixed(2)), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td scope="col-1">{installment.insurer.reduce((prev, curr) => prev + parseFloat(curr.ovin_amt.toFixed(2)), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td></td>
                <td></td>
              </tr>
              : null}

            {installment.advisor.length > 0 ?
              <tr>
                <th scope="row">รวม ผู้แนะนำ</th>
                <td>{installment.advisor.length}</td>
                <td scope="col-1">{installment.advisor.reduce((prev, curr) => prev + parseFloat(curr.netgrossprem.toFixed(2)), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td scope="col-1">{installment.advisor.reduce((prev, curr) => prev + parseFloat(curr.duty.toFixed(2)), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td scope="col-1">{installment.advisor.reduce((prev, curr) => prev + parseFloat(curr.tax.toFixed(2)), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td scope="col-1">{installment.advisor.reduce((prev, curr) => prev + parseFloat(curr.withheld.toFixed(2)), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td scope="col-1">{installment.advisor.reduce((prev, curr) => prev + parseFloat(curr.commin_amt.toFixed(2)), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td scope="col-1">{installment.advisor.reduce((prev, curr) => prev + parseFloat(curr.ovin_amt.toFixed(2)), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td scope="col-1">{installment.advisor.reduce((prev, curr) => prev + parseFloat(curr.commout1_amt.toFixed(2)), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td scope="col-1">{installment.advisor.reduce((prev, curr) => prev + parseFloat(curr.ovout1_amt.toFixed(2)), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              </tr>
              : null}


            <tr>
              <th scope="row">กรมธรรม์</th>
              <td></td>
              <td>{formData.netgrossprem.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              <td>{formData.duty.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              <td>{formData.tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              <td>{formData.withheld.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              <td>{formData.commin_amt.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              <td>{formData.ovin_amt.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              <td>{formData.commout_amt.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              <td>{formData.ovout_amt.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
            </tr>

          </tbody>
        </table>
      </div>

      {/* entity table */}
      {/* <div class="row">
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
            <option value="C">นิติบุคคล</option>
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
        )}

        <div class="col-2">
          <label class="form-label ">
            เลขประจำตัว<span class="text-danger"> *</span>
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
      // location table 
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
          <select
            className="form-control"
            name={`province`}
            onChange={handleChange}
          >
            <option value={formData.province} disabled selected hidden>
              {formData.province}
            </option>
            {provinceDD}
          </select>
        </div>
        <div class="col-2">
          <label class="form-label ">
            อำเภอ<span class="text-danger"> *</span>
          </label>
          <select
            className="form-control"
            name={`district`}
            onChange={handleChange}
          >
            <option value={formData.district} disabled selected hidden>
              {formData.district}
            </option>
            {districDD}
          </select>
        </div>
        <div class="col-2">
          <label class="form-label ">
            ตำบล<span class="text-danger"> *</span>
          </label>
          <select
            className="form-control"
            name={`subdistrict`}
            onChange={handleChange}
          >
            <option value={formData.subdistrict} disabled selected hidden>
              {formData.subdistrict}
            </option>
            {subDistricDD}
          </select>
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
            <option value={formData.zipcode} disabled selected hidden>
              {formData.zipcode}
            </option>
            {zipcodeDD}
          </select>
        </div>
      </div>
      // motor table 
      {formData.class === "Motor" ? (
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
                defaultValue={formData.licenseNo}
                onChange={handleChange}
              />
            </div>
            <div class="col-2">
              <label class="form-label ">
                ยี่ห้อรถยนต์<span class="text-danger"> *</span>
              </label>

              <select
                className="form-control"
                name={`brandname`}
                onChange={handleChange}
              >
                <option value={formData.brandname} selected disabled hidden>
                  {formData.brandname}
                </option>
                {motorbrandDD}
              </select>
            </div>
            <div class="col-2">
              <label class="form-label ">
                รุ่น<span class="text-danger"> *</span>
              </label>
              <select
                className="form-control"
                name={`modelname`}
                onChange={handleChange}
              >
                <option value={formData.modelname} selected disabled hidden>
                  {formData.modelname}
                </option>
                {motormodelDD}
              </select>

            </div>
            <div class="col-2">
              <label class="form-label ">
                เลขตัวถังรถ<span class="text-danger"> *</span>
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
            defaultValue={formData.telNum_1}
            name={`telNum_1`}
            onChange={handleChange}
          />
        </div>
        <div class="col-2">
          <label class="form-label ">
            Email<span class="text-danger"> *</span>
          </label>
          <input
            className="form-control"
            type="text"
            defaultValue={formData.Email}
            name={`Email`}
            onChange={handleChange}
          />
        </div>
      </div> */}
      <Modal size='l' show={hidecard[0]} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title >Confirm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div class="row">
                        <div class="col-4">
                            <label class="col-form-label">ใบคำขอเลขที่</label>
                        </div>
                        <div class="col-4">{formData.applicationNo} </div>
                    </div>
                    <div class="row">
                        <div class="col-4">
                            <label class="col-form-label">กรมธรรม์เลขที่</label>
                        </div>
                        <div class="col-4"> <label class="col-form-label">{formData.policyNo}</label></div>
                    </div>
                    <div class="row">
                        <div class="col-4">
                            <label class="col-form-label">วันที่อัพเดทข้อมูล </label>
                        </div>
                        <div class="col-4">
                            <label class="col-form-label">{formData.updatedAt}</label>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-4">
                            <label class="col-form-label">updateusercode</label>
                        </div>
                        <div class="col-4">
                            <label class="col-form-label">{formData.updateusercode}</label>
                        </div>
                    </div>
                    

                </Modal.Body>
                <Modal.Footer>
                    <button type="button" class="btn btn-primary" name="saveChange" onClick={e => props.setFormData(e, props.index, { ...formData, installment: installment })}>Save changes</button>
                    {/* <button type="button" class="btn btn-primary" onClick={(e) => editCard(e)} >Save changes</button> */}
                    <button type="button" class="btn btn-secondary" data-dismiss="modal" onClick={handleClose}>Close</button>
                </Modal.Footer>
            </Modal>
      <div class="d-flex justify-content-center" >

        <button className="p-2 btn btn-primary" style={{margin:`10px`}} name="saveChange" onClick={(e) => editCard(e)}>
          บันทึก
        </button>
        <button className="p-2 btn btn-secondary " style={{margin:`10px`}}  name="closed" onClick={e => props.setFormData(e)}>
          ปิด
        </button>
      </div>
    </div>
  );
};

export default PolicyCard;
