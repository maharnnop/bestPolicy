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
import { stringToNumber, NumberToString } from '../lib/stringToNumber';

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
 
  const [installment, setInstallment] = useState({ insurer: [], advisor: [] })
  const [checked , setChecked] = useState({ insurer: false, advisor: false })
  const [hidecard, setHidecard] = useState([false, 0]);

  function formatDate(dateString) {
    // Assuming dateString is in the format dd/mm/yyyy
    const parts = dateString.split('/');
    const formattedDate = new Date(parts[2], parts[1] - 1, parts[0]);
    return formattedDate;
}
function formatNumber(input) {
  console.log(input.value);
  let sanitizedValue = input.value.replace(/[^\d]/g, '').replace(/^0+/, '');
      
      // Add commas for thousands separator
      sanitizedValue = parseInt(sanitizedValue, 10).toLocaleString('en-US');
      
      // Update the input value
      input.value = sanitizedValue;
}
  const handleChange = async (e) => {
    e.preventDefault();
    console.log(document.getElementsByName(`installmentInsurer`)[0].checked)
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    

  };

  const handleChangeDate = (date,name,index) => {
    console.log(name);
    if (index === undefined ) {
      
    
    if (name === 'seqNoinsStart') {
      setFormData((prevState) => ({
        ...prevState,
        seqNoinsStart: date,
        seqNoagtStart: date,
    }));
    }else {

      setFormData((prevState) => ({
        ...prevState,
        [name]: date,
      }));
    }
  }
    else{
      const arrI = []
      const arrA = []
    installment.insurer.map(ele => {
      arrI.push(ele)
    })
    installment.advisor.map(ele => {
      arrA.push(ele)
    })
    if (name === `dueDateI`){
      console.log(date);
      arrI[index] = {
        ...arrI[index],
        dueDate : date
      }
    }else if (name === `dueDateA`){
      arrA[index] = {
        ...arrA[index],
        dueDate : date
      }
    }
    setInstallment({ insurer: arrI, advisor: arrA })
    }
    
  }
  const checkCommOV = async (e, type) => {
    e.preventDefault();
    console.log(e.target.name + " : " + e.target.value);
    if (type === 'Comm') {
      // check comm
      if (formData.commin_rate < formData.commout1_rate + formData.commout2_rate ) {
        alert(" ผลรวมของ Comm-out ต้องไม่มากกว่า Comm-in")
        if (e.target.name === "commin_rate") {
          console.log("commin_rate");
          e.target.value = (formData.commout1_rate + formData.commout2_rate )
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
      if (formData.ovin_rate < formData.ovout1_rate + formData.ovout2_rate ) {
        alert(" ผลรวมของ OV-out ต้องไม่มากกว่า OV-in")
        if (e.target.name === "ovin_rate") {
          e.target.value = formData.ovout1_rate + formData.ovout2_rate 
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
 

  const editInstallment = (e, type, index) => {
    // e.preventDefault();
    console.log(e.target.name);
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
      if (e.target.name === `netgrosspremI-${index}`) {
        const netgrosspremstr = stringToNumber(document.getElementsByName(`netgrosspremI-${index}`)[0].value)
        const netgrossprem = parseFloat(netgrosspremstr)
        const dutyamt = parseFloat(Math.ceil(netgrossprem * duty))
        const taxamt = parseFloat(((netgrossprem + dutyamt) * tax).toFixed(2))
        let  witheldamt =  0 
        if (formData.withheld > 0 ) {
          witheldamt =  parseFloat(((netgrossprem + dutyamt) * withheld).toFixed(2))
        }
        //cal reverse grossprem premperseq = gross(100-distrate)/100 --> grosspremseq = (premperseq *100)/(100-distrate)
        const grosspremseq = parseFloat((netgrossprem *100/(100-formData.specdiscrate)).toFixed(2))
        const specdiscseq = parseFloat((grosspremseq * formData.specdiscrate/100).toFixed(2))

        const commin_amt = parseFloat((formData.commin_rate * netgrossprem / 100).toFixed(2))
        const ovin_amt = parseFloat((formData.ovin_rate * netgrossprem / 100).toFixed(2))
  
        arrI[index] = {
          ...arrI[index],
          grossprem: grosspremseq,
          specdiscamt: specdiscseq,
          netgrossprem: netgrosspremstr,
          tax: taxamt,
          duty: dutyamt,
          totalprem: parseFloat((netgrossprem + tax + duty).toFixed(2)),
          withheld: witheldamt,
          commin_amt: commin_amt,
          commin_taxamt: parseFloat((commin_amt * tax).toFixed(2)),
          ovin_amt: ovin_amt,
          ovin_taxamt: parseFloat((ovin_amt * tax).toFixed(2))
        }
      }else {
        arrI[index] = {
          ...arrI[index],
          [e.target.name.split('-')[0]] : e.target.value
        }
      }
     

    } else if (type === 'advisor') {
     
      if (e.target.name === `netgrosspremA-${index}`) {
        const netgrosspremstr = stringToNumber(document.getElementsByName(`netgrosspremA-${index}`)[0].value)
        const netgrossprem = parseFloat(netgrosspremstr)
        const dutyamt = parseFloat(Math.ceil(duty * netgrossprem))
        const taxamt = parseFloat((tax * (netgrossprem + dutyamt)).toFixed(2))
        let witheldamt = 0
        console.log(formData.withheld );
        if (formData.withheld > 0 ) {
          witheldamt =  parseFloat(((netgrossprem + dutyamt) * withheld).toFixed(2))
        }

        //cal reverse grossprem premperseq = gross(100-distrate)/100 --> grosspremseq = (premperseq *100)/(100-distrate)
        const grosspremseq = parseFloat((netgrossprem *100/(100-formData.specdiscrate)).toFixed(2))
        const specdiscseq = parseFloat((grosspremseq * formData.specdiscrate/100).toFixed(2))

        const commin_amt = parseFloat((formData.commin_rate * netgrossprem / 100).toFixed(2))
        const ovin_amt = parseFloat((formData.ovin_rate * netgrossprem / 100).toFixed(2))
        const commout1_amt = parseFloat((formData.commout1_rate * netgrossprem / 100).toFixed(2))
        const ovout1_amt = parseFloat((formData.ovout1_rate * netgrossprem / 100).toFixed(2))
        const commout2_amt = parseFloat((formData.commout2_rate * netgrossprem / 100).toFixed(2))
        const ovout2_amt = parseFloat((formData.ovout2_rate * netgrossprem / 100).toFixed(2))
        const commout_amt = parseFloat((formData.commout_rate * netgrossprem / 100).toFixed(2))
        const ovout_amt = parseFloat((formData.ovout_rate * netgrossprem / 100).toFixed(2))
  
        // get old installment
        arrA[index] = {
          ...arrA[index],
          grossprem: grosspremseq,
          specdiscamt : specdiscseq,
          netgrossprem: netgrossprem,
          tax: taxamt,
          duty: dutyamt,
          totalprem: parseFloat((netgrossprem + tax + duty).toFixed(2)),
          withheld: witheldamt,
          commin_amt: commin_amt,
          commin_taxamt: parseFloat((commin_amt * tax).toFixed(2)),
          ovin_amt: ovin_amt,
          ovin_taxamt: parseFloat((ovin_amt * tax).toFixed(2)),
          commout1_amt: commout1_amt,
          ovout1_amt: ovout1_amt,
          commout2_amt: commout2_amt,
          ovout2_amt: ovout2_amt,
          commout_amt: commout_amt,
          ovout_amt: ovout_amt,
        }
      }else{
        arrA[index] = {
          ...arrA[index],
          [e.target.name.split('-')[0]] : e.target.value
        }
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
    console.log(formData);

    const data = {...formData}
    const arrI = []
    console.log(formData);
        arrI.push({
          grossprem: formData.grossprem,
          specdiscamt:formData.specdiscamt,
          netgrossprem: formData.netgrossprem,
          tax: formData.tax,
          duty: formData.duty,
          totalprem: formData.totalprem,
          dueDate: new Date(formData.seqNoinsStart),
          commin_amt: formData.commin_amt,
          commin_taxamt: formData.commin_taxamt,
          ovin_amt: formData.ovin_amt,
          ovin_taxamt: formData.ovin_taxamt,
          withheld: formData.withheld,
        })
    const arrA = []
    arrA.push({
      grossprem: formData.grossprem,
      specdiscamt:formData.specdiscamt,
      netgrossprem: formData.netgrossprem,
      tax:  formData.tax,
      duty: formData.duty,
      totalprem: formData.totalprem,
      dueDate: new Date(formData.seqNoagtStart),
      commin_amt: formData.commin_amt,
      commin_taxamt: formData.commin_taxamt,
      ovin_amt: formData.ovin_amt,
      ovin_taxamt: formData.ovin_taxamt,
      commout1_amt: formData.commout1_amt,
      ovout1_amt: formData.ovout1_amt,
      commout2_amt: formData.commout2_amt,
      ovout2_amt: formData.ovout2_amt,
      commout_amt: formData.commout_amt,
      ovout_amt: formData.ovout_amt,
      withheld: formData.withheld,

    })
    if (formData.installment) {
      
    
    if (formData.installment.insurer.length < 1) {
      
      setInstallment({...formData.installment, insurer: arrI })
      setFormData(data)
    } else {
      setInstallment({...formData.installment})
      setFormData(data)
    }
    if (formData.installment.advisor.length < 1) {
   
    
        setInstallment({...formData.installment, advisor: arrA })
        setFormData(data)
      }else {
        setInstallment({...formData.installment})
        setFormData(data)
      }
    } else{
      setInstallment({insurer: arrI, advisor: arrA })
        setFormData(data)
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

        //cal reverse grossprem premperseq = gross(100-distrate)/100 --> grosspremseq = (premperseq *100)/(100-distrate)
        let grosspremseq = parseFloat((premperseq *100/(100-formData.specdiscrate)).toFixed(2))
        let specdiscseq = parseFloat((grosspremseq * formData.specdiscrate/100).toFixed(2))

        //cal withheld
        let withheldseq = 0 
         if (formData.withheld > 0) {
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
          grossprem: grosspremseq,
          specdiscamt : specdiscseq,
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
    }else{
      arrI.push({
        grossprem: formData.grossprem,
        specdiscamt: formData.specdiscamt,
        netgrossprem: formData.netgrossprem,
        tax: formData.tax,
        duty: formData.duty,
        totalprem: formData.totalprem,
        dueDate: new Date(formData.seqNoinsStart),
        commin_amt: formData.commin_amt,
        commin_taxamt: formData.commin_taxamt,
        ovin_amt: formData.ovin_amt,
        ovin_taxamt: formData.ovin_taxamt,
        withheld: formData.withheld,
      })

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

         //cal reverse grossprem premperseq = gross(100-distrate)/100 --> grosspremseq = (premperseq *100)/(100-distrate)
         let grosspremseq = parseFloat((premperseq *100/(100-formData.specdiscrate)).toFixed(2))
         let specdiscseq = parseFloat((grosspremseq * formData.specdiscrate/100).toFixed(2))

        //cal withheld
        let withheldseq = 0 
         if (formData.withheld > 0) {
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
        //cal comm-ov out1
        let commout1seq = parseFloat((formData.commout1_rate * premperseq / 100).toFixed(2))
        let ovout1seq = parseFloat((formData.ovout1_rate * premperseq / 100).toFixed(2))
        //cal comm-ov out2
        let commout2seq = parseFloat((formData.commout2_rate * premperseq / 100).toFixed(2))
        let ovout2seq = parseFloat((formData.ovout2_rate * premperseq / 100).toFixed(2))
        //cal comm-ov out total
        let commoutseq = parseFloat((formData.commout_rate * premperseq / 100).toFixed(2))
        let ovoutseq = parseFloat((formData.ovout_rate * premperseq / 100).toFixed(2))
        arrA.push({
          grossprem: grosspremseq,
          specdiscamt: specdiscseq,
          netgrossprem: premperseq,
          tax: taxseq,
          duty: dutyseq,
          totalprem: premperseq + taxseq + dutyseq,
          // dueDate: dueDate.toISOString().split('T')[0],
          dueDate: new Date(seqDueDate),
          commin_amt: comminseq,
          commin_taxamt: parseFloat((comminseq * tax).toFixed(2)),
          ovin_amt: ovinseq,
          ovin_taxamt: parseFloat((ovinseq * tax).toFixed(2)),
          commout1_amt: commout1seq,
          ovout1_amt: ovout1seq,
          commout2_amt: commout2seq,
          ovout2_amt: ovout2seq,
          commout_amt: commoutseq,
          ovout_amt: ovoutseq,
          withheld: withheldseq

        })

      }
      console.log(arrA);
    }else{
      arrA.push({
        grossprem: formData.grossprem,
        specdiscamt: formData.specdiscamt,
        netgrossprem: formData.netgrossprem,
        tax:  formData.tax,
        duty: formData.duty,
        totalprem: formData.totalprem,
        dueDate: new Date(formData.seqNoagtStart),
        commin_amt: formData.commin_amt,
        commin_taxamt: formData.commin_taxamt,
        ovin_amt: formData.ovin_amt,
        ovin_taxamt: formData.ovin_taxamt,
        commout1_amt: formData.commout1_amt,
        ovout1_amt: formData.ovout1_amt,
        commout2_amt: formData.commout2_amt,
        ovout2_amt: formData.ovout2_amt,
        commout_amt: formData.commout_amt,
        ovout_amt: formData.ovout_amt,
        withheld: formData.withheld,

      })
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
              {/* <th scope="col" > เลขที่ใบแจ้งหนี้ </th>
              <th scope="col" > เลขที่ใบกำกับภาษี </th> */}
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
              {/* <td><input
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
              /></td> */}
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


      {/* end policy data */}
      <h3 className="text-center" style={{padding:`20px`}}>แบ่งงวดชำระ</h3>
{/*  แบ่งงวด*/}
      <div class="row ">
        <div className="col-1"></div>
        <div className="col-2">
          <div class="form-check">
            <input class="form-check-input bg-secondary" type="checkbox" name="installmentInsurer" checked={checked.insurer} 
            onClick={(e)=>{setChecked((prevState) => ({advisor: e.target.checked, insurer: e.target.checked,}))}} 
            id="flexCheckDefault" />
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
            disabled={!checked.insurer}
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
            <input class="form-check-input bg-secondary" type="checkbox" name="installmentAdvisor"  checked={checked.advisor} 
            onClick={(e)=>{setChecked((prevState) => ({...prevState, advisor: e.target.checked}))}}
            id="flexCheckDefault" />
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
            disabled={!checked.advisor}
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
            <input class="form-check-input " type="checkbox" name="flagallowduty" defaultChecked={true} id="flexCheckDefault" />
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
            disabled={!checked.insurer}
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
            disabled={!checked.insurer}
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
            disabled={!checked.advisor}
            onChange={handleChange}
          />
        </div>
        <div className="col-1">

          <select
            className="form-control"
            name={`seqNoagttype`}
            onChange={handleChange}
            disabled={!checked.advisor}
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
                            disabled={!checked.insurer}
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
                            disabled={!checked.advisor}
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
{/*  จบแบ่งงวด*/}

      {installment.insurer.length > 0 ?
      <>
          <h4 className="text-left" style={{padding:`20px`}}>แบ่งงวด บริษัทประกัน </h4>
        <div className="table-responsive overflow-scroll"  >
          <table class="table  table-striped">
            <thead>
              <tr>
                <th >ประเภท</th>
                <th >แบ่งงวด</th>
                <th >วันครบกำหนดชำระ</th>
                <th   >เบี้ยประกัน</th>
                <th >เลขที่ใบแจ้งหนี้ (ประกัน)</th>
                <th >เลขที่ใบกำกับภาษี (ประกัน)</th>
                <th >อากร</th>
                <th >ภาษี</th>
                <th >WHT 1%</th>
                <th >Comm in</th>
                <th >Ov in</th>
                {/* <th >Comm out</th>
                <th >Ov out</th>
                <th >แก้ไข</th> */}
              </tr>
            </thead>
            <tbody>
              {installment.insurer.map((ele, i) => {
                return (<tr>
                  <th>บริษัทประกัน</th>
                  <td >{i + 1}</td>
                  <td >
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
                            name={`dueDateI-${i}`}
                            showYearDropdown
                            dateFormat="dd/MM/yyyy"
                            dropdownMode="select"
                            selected={ele.dueDate || null}
                            onChange={(date) =>  handleChangeDate(date,'dueDateI',i)}
                                 />
                  </td>
                  <td  ><input
                    className="form-control"
                    style={{width: "150px"}}
                    type="text"
                    value={ele.netgrossprem.toLocaleString()}
                    name={`netgrosspremI-${i}`}
                    onChange={e => editInstallment(e, 'insurer', i)}
                    onInput={(e)=>formatNumber(e.target)}
                  /></td>
                  <td ><input
                    className="form-control"
                    type="text"
                    style={{width: "150px"}}
                    name={`invoiceNo-${i}`}
                    value={ele.invoiceNo}
                    onChange={e => editInstallment(e, 'insurer', i)}
                  /></td>
                   <td ><input
                    className="form-control"
                    type="text"
                    style={{width: "150px"}}
                    value={ele.taxInvoiceNo}
                    name={`taxInvoiceNo-${i}`}
                    onChange={e => editInstallment(e, 'insurer', i)}
                  /></td>
                  
                  {/* <td scope="col-1"><input type="number" className="w-100" name={`duty-${i}`} step={.01} defaultValue={ele.duty}></input></td>
              <td scope="col-1"><input type="number" className="w-100" name={`tax-${i}`} step={.01} defaultValue={ele.tax}></input></td>
              <td scope="col-1"><input type="number" className="w-100" name={`commin_amt-${i}`} step={.01} defaultValue={ele.commin_amt}></input></td>
              <td scope="col-1"><input type="number" className="w-100" name={`ovin_amt-${i}`} step={.01} defaultValue={ele.ovin_amt}></input></td> */}
                  <td >{ele.duty.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td >{ele.tax.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td >{ele.withheld.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td >{ele.commin_amt.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td >{ele.ovin_amt.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  {/* <td ></td>
                  <td ></td>
                  <td ><button onClick={e => editInstallment(e, 'insurer', i)}>แก้ไข</button></td> */}
                </tr>)
              })}
              {installment.insurer.length > 0 ?
                <tr>
                  <th scope="row">รวม บริษัทประกัน</th>
                  <td></td>
                  <td></td>
                  <td scope="col-1">{installment.insurer.reduce((prev, curr) => prev + parseFloat(curr.netgrossprem.toFixed(2)), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td></td>
                  <td></td>
                  <td scope="col-1">{installment.insurer.reduce((prev, curr) => prev + parseFloat(curr.duty.toFixed(2)), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td scope="col-1">{installment.insurer.reduce((prev, curr) => prev + parseFloat(curr.tax.toFixed(2)), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td scope="col-1">{installment.insurer.reduce((prev, curr) => prev + parseFloat(curr.withheld.toFixed(2)), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td scope="col-1">{installment.insurer.reduce((prev, curr) => prev + parseFloat(curr.commin_amt.toFixed(2)), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td scope="col-1">{installment.insurer.reduce((prev, curr) => prev + parseFloat(curr.ovin_amt.toFixed(2)), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  {/* <td></td>
                  <td></td> */}
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
                <th >ประเภท</th>
                <th >แบ่งงวด</th>
                <th scope="col">วันครบกำหนดชำระ</th>
                <th >เบี้ยประกัน</th>
                <th >เลขที่ใบแจ้งหนี้ (อะมิตี้)</th>
                <th >อากร</th>
                <th >ภาษี</th>
                <th >WHT 1%</th>
                <th >Comm in</th>
                <th >Ov in</th>
                <th >Comm out 1</th>
                <th >Ov out 1</th>
                <th >Comm out 2</th>
                <th >Ov out 2</th>
                <th >Comm out</th>
                <th >Ov out</th>
                {/* <th >แก้ไข</th> */}
              </tr>
            </thead>
            <tbody>

              {installment.advisor.map((ele, i) => {
                return (<tr>
                  <th scope="row">ผู้แนะนำ </th>
                  <td>{i + 1}</td>
                  {/* <td scope="col-2"><input
                    className="form-control"
                    type="date"
                    defaultValue={ele.dueDate}
                    name={`dueDate-${i}`}
                    onChange={handleChange}
                  /></td> */}
                  <td scope="col-2">
                   <DatePicker
                            // showIcon
                            style={{width: "130px"}}
                            className="form-control"
                            todayButton="Vandaag"
                            // isClearable
                            name={`dueDate-${i}`}
                            showYearDropdown
                            placeholder ='dd/mm/yyyy'
                            dateFormat="dd/MM/yyyy"
                            dropdownMode="select"
                            selected={ele.dueDate || null}
                            onChange={(date) => handleChangeDate(date,'dueDateA',i)}
                                 />
                                 </td>
                  <td ><input
                    className="form-control"
                    style={{width: "150px"}}
                    type="text"
                    value={ele.netgrossprem.toLocaleString()}
                    name={`netgrosspremA-${i}`}
                    onChange={(e) => editInstallment(e, 'advisor', i)}
                  /></td>
                  <td scope="col-2"><input
                    className="form-control  bg-warning"
                    type="text"
                    disabled
                    name={`invoiceNoA-${i}`}
                    onChange={(e) => editInstallment(e, 'advisor', i)}
                  /></td>
                  {/* <td scope="col-1"><input type="number" name={`duty-${i}`} step={.01} defaultValue={ele.duty}></input></td>
              <td scope="col-1"><input type="number" name={`tax-${i}`} step={.01} defaultValue={ele.tax}></input></td>
              <td scope="col-1"><input type="number" name={`commin_amt-${i}`} step={.01} defaultValue={ele.commin_amt}></input></td>
              <td scope="col-1"><input type="number" name={`ovin_amt-${i}`} step={.01} defaultValue={ele.ovin_amt}></input></td>
              <td scope="col-1"><input type="number" name={`commout1_amt-${i}`} step={.01} defaultValue={ele.commout1_amt}></input></td>
              <td scope="col-1"><input type="number" name={`ovout1_amt-${i}`} step={.01} defaultValue={ele.ovout1_amt}></input></td> */}
                  <td scope="col-1">{ele.duty.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td scope="col-1">{ele.tax.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td scope="col-1">{ele.withheld.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td scope="col-1">{ele.commin_amt.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td scope="col-1">{ele.ovin_amt.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td scope="col-1">{ele.commout1_amt.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td scope="col-1">{ele.ovout1_amt.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td scope="col-1">{ele.commout2_amt.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td scope="col-1">{ele.ovout2_amt.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td scope="col-1">{ele.commout_amt.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td scope="col-1">{ele.ovout_amt.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  {/* <td scope="col-1"><button onClick={e => editInstallment(e, 'advisor', i)}>แก้ไข</button></td> */}
                </tr>)
              })}

              {installment.advisor.length > 0 ?
                <tr>
                  <th scope="row">รวม ผู้แนะนำ </th>
                  <td></td>
                  <td></td>
                  <td scope="col-1">{installment.advisor.reduce((prev, curr) => prev + parseFloat(curr.netgrossprem.toFixed(2)), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td></td>
                  <td scope="col-1">{installment.advisor.reduce((prev, curr) => prev + parseFloat(curr.duty.toFixed(2)), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td scope="col-1">{installment.advisor.reduce((prev, curr) => prev + parseFloat(curr.tax.toFixed(2)), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td scope="col-1">{installment.advisor.reduce((prev, curr) => prev + parseFloat(curr.withheld.toFixed(2)), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td scope="col-1">{installment.advisor.reduce((prev, curr) => prev + parseFloat(curr.commin_amt.toFixed(2)), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td scope="col-1">{installment.advisor.reduce((prev, curr) => prev + parseFloat(curr.ovin_amt.toFixed(2)), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td scope="col-1">{installment.advisor.reduce((prev, curr) => prev + parseFloat(curr.commout1_amt.toFixed(2)), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td scope="col-1">{installment.advisor.reduce((prev, curr) => prev + parseFloat(curr.ovout1_amt.toFixed(2)), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td scope="col-1">{installment.advisor.reduce((prev, curr) => prev + parseFloat(curr.commout2_amt.toFixed(2)), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td scope="col-1">{installment.advisor.reduce((prev, curr) => prev + parseFloat(curr.ovout2_amt.toFixed(2)), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td scope="col-1">{installment.advisor.reduce((prev, curr) => prev + parseFloat(curr.commout_amt.toFixed(2)), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td scope="col-1">{installment.advisor.reduce((prev, curr) => prev + parseFloat(curr.ovout_amt.toFixed(2)), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
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
              <th scope="col-1">Comm out 1</th>
              <th scope="col-1">Ov out 1 </th>
              <th scope="col-1">Comm out 2</th>
              <th scope="col-1">Ov out 2 </th>
              <th scope="col-1">Comm out</th>
              <th scope="col-1">Ov out </th>
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
                <td></td>
                <td></td>
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
                <td scope="col-1">{installment.advisor.reduce((prev, curr) => prev + parseFloat(curr.commout2_amt.toFixed(2)), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td scope="col-1">{installment.advisor.reduce((prev, curr) => prev + parseFloat(curr.ovout2_amt.toFixed(2)), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td scope="col-1">{installment.advisor.reduce((prev, curr) => prev + parseFloat(curr.commout_amt.toFixed(2)), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td scope="col-1">{installment.advisor.reduce((prev, curr) => prev + parseFloat(curr.ovout_amt.toFixed(2)), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              </tr>
              : null}
{/* {formData.agentCode2 !== null ?
              <tr>
                <th scope="row">รวม ผู้แนะนำ 2</th>
                <td>1</td>
                <td>{formData.netgrossprem.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              <td>{formData.duty.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              <td>{formData.tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              <td>{formData.withheld.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              <td>{formData.commin_amt.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              <td>{formData.ovin_amt.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              <td>{formData.commout2_amt.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              <td>{formData.ovout2_amt.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
               </tr>
              : null} */}

            <tr>
              <th scope="row">กรมธรรม์</th>
              <td></td>
              <td>{formData.netgrossprem.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              <td>{formData.duty.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              <td>{formData.tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              <td>{formData.withheld.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              <td>{formData.commin_amt.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              <td>{formData.ovin_amt.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              <td>{formData.commout1_amt.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              <td>{formData.ovout1_amt.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              <td>{(formData.commout2_amt || 0).toLocaleString(undefined, { minimumFractionDigits: 2 }) }</td>
              <td>{(formData.ovout2_amt || 0).toLocaleString(undefined, { minimumFractionDigits: 2 }) }</td>
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
