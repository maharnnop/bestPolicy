import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from 'react-select';
import axios from "axios";
import jwt_decode from "jwt-decode";
import { CenterPage } from "../StylesPages/AdminStyles";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigation,
} from "react-router-dom";
import {
  Header,
  input,
  LoginBtn,
  BackdropBox1,
} from "../StylesPages/LoginStyles";
import { useCookies } from "react-cookie";

const config = require("../../config.json");

const NormalText = {
  color: "white",
  paddingBottom: "10px",
};
/* eslint-disable react-hooks/exhaustive-deps */

const Agent = () => {
  const params = useParams()
  const [cookies, setCookie, removeCookie] = useCookies(["jwt"]);
  const headers = {
    headers: { Authorization: `Bearer ${cookies["jwt"]}` }
  };
  const url = window.globalConfig.BEST_POLICY_V1_BASE_URL;
  const navigate = useNavigate();
  const [agentData, setAgentData] = useState({
    entityID: null,
    commovCreditUnit: 'D',
    deductTaxRate: 3,
    deductTaxType: "หักภาษี ณ ที่จ่ายค่านายหน้า",
    premCreditUnit: 'D',
    stamentType: 'Net'
  });
  const [entityData, setEntityData] = useState({ personType: "P" });
  const [locationData, setLocationData] = useState({ entityID: null, locationType: 'A' });
  const [contactData, setContactData] = useState({
    entityID: null,
    locationType: "A",
    personType: "P"
  });
  const [row, setRow] = useState(0);
  const [comOvOutData, setComOvOutData] = useState([{ insureID: null, insurerCode: null }]);
  // dropdown
  const [provinceDD, setProvinceDD] = useState([])
  const [districDD, setDistricDD] = useState([])
  const [subDistricDD, setSubDistricDD] = useState([])
  const [zipcodeDD, setZipCodeDD] = useState([])
  const [titlePDD, setTitlePDD] = useState([])
  const [titleODD, setTitleODD] = useState([])
  const [insureTypeDD, setInsureTypeDD] = useState([])
  const [insurerDD, setInsurerDD] = useState([]);
  // for contact person

  const [districDD2, setDistricDD2] = useState([])
  const [subDistricDD2, setSubDistricDD2] = useState([])
  const [zipcodeDD2, setZipCodeDD2] = useState([])

  useEffect(() => {

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

        alert("token expired pls login again!!");
        removeCookie('jwt');
        navigate('/login')

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

    //get province
    axios
      .get(url + "/static/provinces/all", headers)
      .then((province) => {
        const array = []
        province.data.forEach(ele => {
          array.push({ label: ele.t_provincename, value: ele.provinceid })
        });
        setProvinceDD(array)

      })


    // get all insuretype
    axios
      .get(url + "/insures/insuretypeall", headers)
      .then((province) => {
        // let token = res.data.jwt;
        // let decode = jwt_decode(token);
        // navigate("/");
        // window.location.reload();
        // localStorage.setItem("jwt", token);

        const array = []
        province.data.forEach(ele => {
          array.push(<option key={ele.id} value={ele.id}>{ele.class} : {ele.subClass}</option>)
        });
        setInsureTypeDD(array)

      })

    // get all insurer
    axios
      .get(url + "/persons/insurerall", headers)
      .then((insurer) => {


        const array = []
        insurer.data.forEach(ele => {
          array.push(<option key={ele.id} value={ele.insurerCode}>{ele.insurerCode} : {ele.fullname}</option>)
        });
        setInsurerDD(array)


      })

    // get defual data agent by agentCode
    console.log(params.agentCode);
    if (params.agentCode) {

      // get agent data
      axios
        .post(url + "/persons/getagentbyagentcode", { agentCode: params.agentCode }, headers)
        .then((data) => {
          const person = data.data
          //update version num
          person.agent.version ++
          person.entity.version ++

          setAgentData(person.agent)
          setEntityData(person.entity)
          setLocationData(person.location)
          setContactData({ ...person.contact, ...contactData, checkLocation: false })
          setComOvOutData(person.commovouts)
          console.log(person);
          // set distirctDD
          getDistrict(person.location.provinceID, 1)
          // set subdistrictDD
          getSubDistrict(person.location.districtID, 1)
          // set zipcodeDD
          setZipCodeDD([<option value={person.location.zipcode}>{person.location.zipcode}</option>])

          //set commov data 
          setRow(person.commovouts.length - 1)


          // set dropdown for contact person
          if (person.contact) {
            // set distirctDD2
            getDistrict(person.contact.provinceID, 2)
            // set subdistrictDD2
            getSubDistrict(person.contact.districtID, 2)
            // set zipcodeDD2
            setZipCodeDD2([<option value={person.contact.zipcode}>{person.contact.zipcode}</option>])
          }

        })
        .catch((err) => {

          alert("internal error");
        });


    }



  }, []);


  const changeAgent = (e) => {
    setAgentData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const changeEntity = (e) => {
    e.preventDefault()
    if (e.target.name === 'branch') {
      const value = e.target.value;
      // Check if the input is a number and has a length of 5 or less
      if (/^\d+$/.test(value)) {
        // Format the value with leading zeros
        let formattedValue = value.padStart(5, "0");
        if (value.length > 5) {
          formattedValue = value.substring(1)
        }
        setEntityData((prevState) => ({
          ...prevState,
          'branch': formattedValue,
        }));
        document.getElementsByName('branch')[0].value = formattedValue
      } else {
        document.getElementsByName('branch')[0].value = value.replace(/[^0-9]/g, '')
      }
    } else {
      setEntityData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }));
    }


  };
  const changeContact = (e) => {
    e.preventDefault()

    setContactData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));



  };
  const changeComOv = (e) => {
    // console.log(entityData);
    const index = e.target.name.split('-')[1];
    const name = e.target.name.split('-')[0];
    const data = { ...comOvOutData[index], [name]: e.target.value }
    comOvOutData[index] = data
    setComOvOutData(comOvOutData);
  };

  const changeLocation = (e) => {
    setLocationData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));

  }

  const changeProvince = (e, i) => {
    if (i === 1) {
      setLocationData((prevState) => ({
        ...prevState,
        provinceID: e.value,
        districtID: null,
        subDistrictID: null,
        zipcode: null
      }));
      setZipCodeDD([])
      setSubDistricDD([])
      setDistricDD([])
    } else if (i === 2) {
      setContactData((prevState) => ({
        ...prevState,
        provinceID: e.value,
        districtID: null,
        subDistrictID: null,
        zipcode: null
      }));
      setZipCodeDD2([])
      setSubDistricDD2([])
      setDistricDD2([])
    }

    getDistrict(e.value, i);


  }
  const changeDistrict = (e, i) => {
    if (i === 1) {
      setLocationData((prevState) => ({
        ...prevState,
        districtID: e.value,
        subDistrictID: null,
        zipcode: null
      }));
      setZipCodeDD([])
    } else if (i == 2) {
      setContactData((prevState) => ({
        ...prevState,
        districtID: e.value,
        subDistrictID: null,
        zipcode: null
      }));
      setZipCodeDD2([])
    }

    getSubDistrict(e.value, i);
  }
  const changeSubDistrict = (e, i) => {
    if (i === 1) {
      setLocationData((prevState) => ({
        ...prevState,
        subDistrictID: e.value,
        zipcode: null
      }));
      getZipCode(e.value, 1)

    } else if (i === 2) {
      setContactData((prevState) => ({
        ...prevState,
        subDistrictID: e.value,
        zipcode: null
      }));
      getZipCode(e.value, 2)

    }

  }
  const getDistrict = (provinceID, i) => {
    //get distric in province selected
    axios
      .get(url + "/static/amphurs/" + provinceID, headers)
      .then((distric) => {
        const array = []
        distric.data.forEach(ele => {
          array.push({ label: ele.t_amphurname, value: ele.amphurid })
        });
        if (i === 1) {
          setDistricDD(array)
        } else if (i === 2) {
          setDistricDD2(array)
        }

      })
      .catch((err) => {

        // alert("cant get aumphur");

      });
  }


  const getSubDistrict = (districID, i) => {
    //get tambons in distric selected
    axios
      .get(url + "/static/tambons/" + districID, headers)
      .then((subdistric) => {
        const arraySub = []
        const zip = []
        subdistric.data.forEach(ele => {
          arraySub.push({ label: ele.t_tambonname, value: ele.tambonid, postcode: ele.postcodeall.split("/") })

        });
        // arrayZip[0].props.selected = true;
        if (i === 1) {
          setSubDistricDD(arraySub)
        } else if (i === 2) {
          setSubDistricDD2(arraySub)
        }


      })
      .catch((err) => {

        // alert("cant get tambons");

      });
  }
  const getZipCode = (subDistrictID, i) => {

    if (i === 1) {

      const postcode = subDistricDD.find(el => el.value === subDistrictID).postcode;

      const arrayZip = postcode.map((zip, index) => (
        <option key={index} value={zip}>
          {zip}
        </option>
      ));
      setZipCodeDD(arrayZip);
      setLocationData((prevState) => ({
        ...prevState,
        zipcode: postcode[0]
      }))
    } else if (i === 2) {
      const postcode = subDistricDD2.find(el => el.value === subDistrictID).postcode;

      const arrayZip = postcode.map((zip, index) => (
        <option key={index} value={zip}>
          {zip}
        </option>
      ));
      setZipCodeDD2(arrayZip);
      setContactData((prevState) => ({
        ...prevState,
        zipcode: postcode[0]
      }))
    }
  }

  const newRow = (e) => {
    e.preventDefault();
    setRow(row + 1);
    const arr = comOvOutData
    arr.push({ insureID: null, insurerCode: null })
    setComOvOutData(arr)

  };
  const removeRow = (e) => {
    e.preventDefault();
    if (row > 0) {
      setRow(row - 1);
      const arr = comOvOutData
      arr.pop()
      setComOvOutData(arr)
    }

  };

  const checkLocation = (e) => {
    // e.preventDefault()
    console.log(e.target.checked);
    setContactData((prevState) => ({
      ...prevState,
      checkLocation: e.target.checked,
    }));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    let contactP = { ...contactData }
    if (contactData.checkLocation) {
      contactP = { ...contactP, 
        t_location_1: locationData.t_location_1,
        t_location_2: locationData.t_location_2,
        t_location_3: locationData.t_location_3,
        t_location_4: locationData.t_location_4,
        t_location_5: locationData.t_location_5,
        provinceID: locationData.provinceID,
        districtID: locationData.districtID,
        subDistrictID: locationData.subDistrictID,
        zipcode: locationData.zipcode,}

    } console.log({
      agent: agentData,
      entity: entityData,
      location: locationData,
      commOVOut: comOvOutData,
      contactPerson: contactP
    });
    axios
      .post(url + "/persons/agentnew", {
        agent: agentData,
        entity: entityData,
        location: locationData,
        commOVOut: comOvOutData,
        contactPerson: contactP
      }, headers)
      .then((res) => {
        // let token = res.data.jwt;
        // let decode = jwt_decode(token);
        // navigate("/");
        // window.location.reload();
        // localStorage.setItem("jwt", token);
        console.log(res.data);
        alert("create new advisor success : " + agentData.agentCode)
      })
      .catch((err) => {

        alert("create new advisor fail");

      });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    let contactP = { ...contactData }
    if (contactData.checkLocation) {
      contactP = {
        ...contactP,
        t_location_1: locationData.t_location_1,
        t_location_2: locationData.t_location_2,
        t_location_3: locationData.t_location_3,
        t_location_4: locationData.t_location_4,
        t_location_5: locationData.t_location_5,
        provinceID: locationData.provinceID,
        districtID: locationData.districtID,
        subDistrictID: locationData.subDistrictID,
        zipcode: locationData.zipcode,
      }
    } console.log({
      agent: agentData,
      entity: entityData,
      location: locationData,
      commOVOut: comOvOutData,
      contactPerson: contactP
    });
    axios
      .post(url + "/persons/agentupdate", {
        agent: agentData,
        entity: entityData,
        location: locationData,
        commOVOut: comOvOutData,
        contactPerson: contactP
      }, headers)
      .then((res) => {
        // let token = res.data.jwt;
        // let decode = jwt_decode(token);
        // navigate("/");
        // window.location.reload();
        // localStorage.setItem("jwt", token);
        console.log(res.data);
        alert(`update agent  ${params.agentCode} success`)
      })
      .catch((err) => {

        alert(`update agent ${params.agentCode} fail`);

      });
  };


  return (
    <CenterPage>
      {/* <BackdropBox1> */}
      <form onSubmit={params.agentCode ? handleUpdate : handleSubmit}>
        {/* insurer table */}
        <h1 className="text-center" >ผู้แนะนำ</h1>
        <div class="row form-group form-inline">
          <div class="col-1 "></div>
          <div class="col-2">
            <label class="form-label ">รหัสผู้แนะนำ<span class="text-danger"> *</span></label>
            <input
              className="form-control"
              type="text"
              required
              // placeholder="InsurerCode"
              defaultValue={agentData.agentCode}
              name="agentCode"
              onChange={changeAgent}
            />
          </div>
          <div class="col-2">
            <label class="form-label ">ประเภทการชำระ<span class="text-danger"> *</span></label>
            <select
              className="form-control"
              name={`stamentType`}
              onChange={changeAgent}
              value={agentData.stamentType}
              required
            >
              <option selected value="Net">Net</option>
              <option value="Gross">Gross</option>
            </select>
          </div>

          <div class="col-2">
            <label class="form-label ">เครดิตเทอมค่าเบี้ย <span class="text-danger"> *</span></label>
            <input
              className="form-control"
              type="number"
              required
              defaultValue={agentData.premCreditT}
              // placeholder="InsurerCode"
              name="premCreditT"
              onChange={changeAgent}
            />
          </div>

          <div class="col-1">
            <label class="form-label ">หน่วย<span class="text-danger"> *</span></label>
            <select
              className="form-control"
              name={`premCreditUnit`}
              required
              onChange={changeAgent}
              value={agentData.premCreditUnit}
            >
              <option selected value="D">วัน</option>
              <option value="M">เดือน</option>
              <option value="Y">ปี</option>
            </select>
          </div>
          <div class="col-2">
            <label class="form-label ">เครดิตเทอมค่าcom <span class="text-danger"> *</span></label>
            <input
              className="form-control"
              type="number"
              required
              defaultValue={agentData.commovCreditT}
              // placeholder="InsurerCode"
              name="commovCreditT"
              onChange={changeAgent}
            />
          </div>
          <div class="col-1">
            <label class="form-label ">หน่วย<span class="text-danger"> *</span></label>
            <select
            required
              className="form-control"
              name={`commovCreditUnit`}
              onChange={changeAgent}
              value={agentData.commovCreditUnit}
            >
              <option selected value="D">วัน</option>
              <option value="M">เดือน</option>
              <option value="Y">ปี</option>
            </select>
          </div>


        </div>

        {/* entity table */}
        <div class="row">
          <div class="col-1 "></div>
          <div class="col-1">
            <label class="form-label ">type<span class="text-danger"> *</span></label>
            <select
              className="form-control "
              name={`personType`}
              required
              onChange={changeEntity}
              value={entityData.personType.trim()}
            >
              <option selected value="P">บุคคล</option>
              <option value="O">นิติบุคคล</option>
            </select>
          </div>
          <div class="col-1"></div>
          {entityData.personType.trim() === 'P' ?
            <>
              <div class="col-2">
                <label class="form-label ">คำนำหน้า<span class="text-danger"> *</span></label>
                <Select
                  value={titlePDD.filter(({ value }) => value === entityData.titleID)}
                  required
                  // defaultValue={{label:`${entityData.TITLETHAIBEGIN}  ${entityData.TITLETHAIEND}`, value: entityData.titleID}}
                  formatOptionLabel={(option, { context }) => context === 'value' ? option.label : `${option.label}  ${option.label2}`}
                  name={`title`}
                  onChange={(e) => setEntityData((prevState) => ({
                    ...prevState,
                    titleID: e.value,
                    suffix: titlePDD.find((a) => a.value == e.value).label2
                  }))}
                  options={titlePDD}
                />
              </div>

              <div class="col-2">
                <label class="form-label ">ชื่อ<span class="text-danger"> *</span></label>
                <input
                required
                  className="form-control"
                  type="text"
                  name="t_firstName"
                  defaultValue={entityData.t_firstName}
                  onChange={changeEntity}
                />
              </div>
              <div class="col-2">
                <label class="form-label ">นามสกุล<span class="text-danger"> *</span></label>
                <input
                required
                  className="form-control"
                  type="text"
                  name="t_lastName"
                  defaultValue={entityData.t_lastName}
                  onChange={changeEntity}
                />
              </div>
              {/* <div class="col-2">
                     <label class="form-label ">คำลงท้าย<span class="text-danger"> *</span></label>
                     <input type="text" disabled   className="form-control" value={entityData.suffix}/>
              
               </div> */}
            </>
            :
            <>
              <div class="col-2">
                <label class="form-label ">คำนำหน้า<span class="text-danger"> *</span></label>
                <Select
                required
                  value={titleODD.filter(({ value }) => value === entityData.titleID)}
                  formatOptionLabel={(option, { context }) => context === 'value' ? option.label : `${option.label} - ${option.label2}`}
                  name={`titleID`}
                  onChange={(e) => setEntityData((prevState) => ({
                    ...prevState,
                    titleID: e.value,
                    TITLETHAIEND: titleODD.find((a) => a.value == e.value).label2
                  }))}
                  options={titleODD}
                />
              </div>
              <div class="col-2">
                <label class="form-label ">ชื่อ<span class="text-danger"> *</span></label>
                <input
                required
                  className="form-control"
                  type="text"
                  name="t_ogName"
                  defaultValue={entityData.t_ogName}
                  onChange={changeEntity}
                />
              </div>
              <div class="col-2">
                <label class="form-label ">คำลงท้าย<span class="text-danger"> *</span></label>
                <input type="text" disabled className="form-control" value={entityData.TITLETHAIEND} />

              </div>
            </>}
          <div class="col-2">
            <label class="form-label ">Licenseno Sub-Broker <span class="text-danger"> *</span></label>
            <input
              className="form-control"
              type="text"
              required
              // placeholder="InsurerCode"
              name="licentNo"
              defaultValue={agentData.licentNo}
              onChange={changeAgent}
            />
          </div>

        </div>

        <div class="row">
          <div class="col-1 "></div>
          <div class="col-2">
            <label class="form-label ">
              ประเภทภาษีหัก ณ ที่จ่าย
            </label>
            <select
            required={entityData.personType === 'O' ? true : false}
              className="form-control" name="deductTaxType" onChange={changeAgent}
              value={agentData.deductTaxType}>
              <option value="" selected disabled hidden></option>
              <option value="" >ภาษีเงินได้หัก ณ ที่จ่าย (เงินเดือน/เบี้ยประชุม/ค่านายหน้า)</option>
              <option value="" >ภาษีหัก ณ ที่จ่่าย นิติบุคคล (ปันผล)</option>
              <option value="" >ภาษีหัก ณ ที่จ่าย บุคคลธรรมดา</option>
              <option value="" >ภาษีหัก ณ ที่จ่าย นิติบุคคล</option>
              <option value="" >ภาษีหัก ณ ที่จ่าย มาตรา70</option>

            </select>
          </div>

          <div class="col-2">
            <label class="form-label ">
              อัตราภาษีหัก ณ ที่จ่าย
            </label>
            <div class="input-group mb-3">
              <input
              required={entityData.personType === 'O' ? true : false}
                defaultValue={agentData.deductTaxRate || 3}
                className="form-control"
                type='number'
                name="deductTaxRate"
                onChange={changeAgent}
              />
              <div class="input-group-append">
                <div class="input-group-text ">
                  <label class="form-check-label" >%</label>

                </div>
              </div>
            </div>
          </div>

          <div class="col-2">
            <label class="form-label ">
              เลขที่จดทะเบียน
            </label>
            <input
            required={entityData.personType === 'O' ? true : false}
              className="form-control"
              type="text"
              name="taxNo"
              defaultValue={entityData.taxNo}
              onChange={changeEntity}
            />
          </div>
          <div class="col-2">
            <label class="form-label ">
              วันที่จดทะเบียน<span class="text-danger"> *</span>
            </label>
            <input

              className="form-control"
              type="date"
              required={entityData.personType === 'O' ? true : false}
              name="taxActDate"
              defaultValue={entityData.taxActDate}
              onChange={changeEntity}
            />
          </div>
          <div class="col-2">
            <label class="form-label ">
              วันที่หมดอายุ<span class="text-danger"> *</span>
            </label>
            <input
              className="form-control"
              type="date"
              required={entityData.personType === 'O' ? true : false}
              name="taxExpDate"
              defaultValue={entityData.taxExpDate}
              onChange={changeEntity}
            />
          </div>

        </div>
        <div className="row">
          <div class="col-1"></div>
          <div class="col-2">
            <label class="form-label ">
              อยู่ในระบบ VAT หรือไม่
            </label>
            <select
            required
              value={entityData.vatRegis}
              className="form-control" name="vatRegis" onChange={changeEntity}>
              <option value="" selected disabled hidden></option>
              <option value={true} >อยู่</option>
              <option value={false} >ไม่อยู่</option>


            </select>

          </div>
          <div class="col-2">
            <label class="form-label ">
              เลขที่ ภพ.20<span class="text-danger"> *</span>
            </label>
            <input
            required={entityData.vatRegis ? true : false}
              defaultValue={entityData.pk20}
              className="form-control"
              type="text"
              name="pk20"
              onChange={changeEntity}
            />
          </div>
          <div class="col-2">
            <label class="form-label ">
              สาขาที่<span class="text-danger"> *</span>
            </label>
            <input
            required={entityData.personType === 'O' ? true : false}
              defaultValue={entityData.branch}
              className="form-control"
              type="text"
              name="branch"
              onChange={changeEntity}
            />
          </div>
        </div>
        {/* location table */}
        <div class="row">
          <h5 className="text-center" >ที่อยู่</h5>
        </div>

        <div class="row">
          <div class="col-1 "></div>
          <div class="col-2">
            <label class="form-label ">บ้านเลขที่<span class="text-danger"> *</span></label>
            <input
            required
              defaultValue={locationData.t_location_1}
              className="form-control"
              type="text"
              name="t_location_1"
              onChange={changeLocation}
            />
          </div>
          <div class="col-2">
            <label class="form-label ">หมู่บ้านอาคาร<span class="text-danger"> *</span></label>
            <input
            required
              defaultValue={locationData.t_location_2}
              className="form-control"
              type="text"
              name="t_location_2"
              onChange={changeLocation}
            />
          </div>
          <div class="col-2">
            <label class="form-label ">หมู่<span class="text-danger"> *</span></label>
            <input
            required
              defaultValue={locationData.t_location_3}
              className="form-control"
              type="text"
              name="t_location_3"
              onChange={changeLocation}
            />
          </div>
          <div class="col-2">
            <label class="form-label ">ซอย<span class="text-danger"> *</span></label>
            <input
            required
              defaultValue={locationData.t_location_4}
              className="form-control"
              type="text"
              name="t_location_4"
              onChange={changeLocation}
            />
          </div>
          <div class="col-2">
            <label class="form-label ">ถนน<span class="text-danger"> *</span></label>
            <input
            required
              defaultValue={locationData.t_location_5}
              className="form-control"
              type="text"
              name="t_location_5"
              onChange={changeLocation}
            />
          </div>
        </div>


        <div class="row">
          <div class="col-1 "></div>

          <div class="col-2">
            <label class="form-label ">จังหวัด<span class="text-danger"> *</span></label>
            <Select
            required
              // className="form-control"
              value={provinceDD.filter(({ value }) => value === locationData.provinceID)}
              name={`provinceID`}
              onChange={(e) => changeProvince(e, 1)}
              options={provinceDD}
              styles={{ zIndex: 2000 }}
            // onChange={opt => console.log(opt)}
            />
          </div>
          <div class="col-2">
            <label class="form-label ">อำเภอ<span class="text-danger"> *</span></label>
            <Select
            required
              // className="form-control"
              value={districDD.filter(({ value }) => value === locationData.districtID)}
              name={`districtID`}
              onChange={(e) => changeDistrict(e, 1)}
              options={districDD}
            />
          </div>
          <div class="col-2">
            <label class="form-label ">ตำบล<span class="text-danger"> *</span></label>
            <Select
            required
              value={subDistricDD.filter(({ value }) => value === locationData.subDistrictID)}
              // className="form-control"
              name={`subDistrictID`}
              onChange={(e) => changeSubDistrict(e, 1)}
              options={subDistricDD}
            />
          </div>
          <div class="col-2">
            <label class="form-label ">รหัสไปรษณีย์<span class="text-danger"> *</span></label>
            <select className="form-control" required name="zipcode" onChange={changeLocation} value={locationData.zipcode}>
              {/* <option value="" selected disabled hidden>เลือกรหัสไปรษณีย์</option> */}
              {zipcodeDD}
            </select>
          </div>
        </div>

        <div class="row">
          <div class="col-1 "></div>

          <div class="col-2">
            <label class="form-label ">Email<span class="text-danger"> *</span></label>
            <input
            required
              defaultValue={entityData.email}
              className="form-control"
              type="text"
              name="email"
              onChange={changeEntity}
            />
          </div>
          <div class="col-2">
            <label class="form-label ">เบอร์มือถือ<span class="text-danger"> *</span></label>
            <input
            required
              defaultValue={locationData.telNum_1}
              className="form-control"
              type="text"
              name="telNum_1"
              onChange={changeLocation}
            />
          </div>

          <div class="col-2">
            <label class="form-label ">เบอร์โทรศัพท์<span class="text-danger"> *</span></label>
            <input
            required
              defaultValue={locationData.telNum_2}
              className="form-control"
              type="text"
              name="telNum_2"
              onChange={changeLocation}
            />
          </div>
          <div class="col-2">
            <label class="form-label ">เบอร์โทรสาร<span class="text-danger"> *</span></label>
            <input
            required
              defaultValue={locationData.telNum_3}
              className="form-control"
              type="text"
              name="telNum_3"
              onChange={changeLocation}
            />
          </div>
        </div>
        {/* contact person */}
        {entityData.personType.trim() === 'O' ?
          <>

            <div class="row">
              <h5 className="text-center" >ผู้ติดต่อ</h5>
            </div>

            <div class="row">
              <div class="col-1 "></div>



              <div class="col-2">
                <label class="form-label ">คำนำหน้า<span class="text-danger"> *</span></label>
                <Select
                required
                  value={titlePDD.filter(({ value }) => value === contactData.titleID)}
                  formatOptionLabel={(option, { context }) => context === 'value' ? option.label : `${option.label}  ${option.label2}`}
                  name={`title`}
                  onChange={(e) => setContactData((prevState) => ({
                    ...prevState,
                    titleID: e.value,
                    // suffix: titleDD2.find((a) => a.value == e.value).label2
                  }))}
                  options={titlePDD}
                />
              </div>

              <div class="col-2">
                <label class="form-label ">ชื่อ<span class="text-danger"> *</span></label>
                <input
                required
                  defaultValue={contactData.t_firstName}
                  className="form-control"
                  type="text"
                  name="t_firstName"
                  onChange={changeContact}
                />
              </div>
              <div class="col-2">
                <label class="form-label ">นามสกุล<span class="text-danger"> *</span></label>
                <input
                required
                  defaultValue={contactData.t_lastName}
                  className="form-control"
                  type="text"
                  name="t_lastName"
                  onChange={changeContact}
                />
              </div>
              <div class="col-2">
                <label class="form-label "></label>
                <div class="form-check  checkbox-xl">
                  <input class="form-check-input" type="checkbox" id="flexSwitchCheckChecked" onClick={e => checkLocation(e)} />
                  <label class="form-check-label" for="flexSwitchCheckChecked" >ที่อยู่ตามนิติบุคคล</label>
                </div>

              </div>


            </div>
            {!contactData.checkLocation ?
              <>
                <div class="row">
                  <div class="col-1 "></div>
                  <div class="col-2">
                    <label class="form-label ">บ้านเลขที่<span class="text-danger"> *</span></label>
                    <input
                    required
                      defaultValue={contactData.t_location_1}
                      className="form-control"
                      type="text"
                      name="t_location_1"
                      onChange={changeContact}
                    />
                  </div>
                  <div class="col-2">
                    <label class="form-label ">หมู่บ้านอาคาร<span class="text-danger"> *</span></label>
                    <input
                    required
                      defaultValue={contactData.t_location_2}
                      className="form-control"
                      type="text"
                      name="t_location_2"
                      onChange={changeContact}
                    />
                  </div>
                  <div class="col-2">
                    <label class="form-label ">หมู่<span class="text-danger"> *</span></label>
                    <input
                    required
                      defaultValue={contactData.t_location_3}
                      className="form-control"
                      type="text"
                      name="t_location_3"
                      onChange={changeContact}
                    />
                  </div>
                  <div class="col-2">
                    <label class="form-label ">ซอย<span class="text-danger"> *</span></label>
                    <input
                    required
                      defaultValue={contactData.t_location_4}
                      className="form-control"
                      type="text"
                      name="t_location_4"
                      onChange={changeContact}
                    />
                  </div>
                  <div class="col-2">
                    <label class="form-label ">ถนน<span class="text-danger"> *</span></label>
                    <input
                    required
                      defaultValue={contactData.t_location_5}
                      className="form-control"
                      type="text"
                      name="t_location_5"
                      onChange={changeContact}
                    />
                  </div>
                </div>


                <div class="row">
                  <div class="col-1 "></div>

                  <div class="col-2">
                    <label class="form-label ">จังหวัด<span class="text-danger"> *</span></label>
                    <Select
                    required
                      value={provinceDD.filter(({ value }) => value === contactData.provinceID)}
                      // className="form-control"
                      name={`provinceID`}
                      onChange={(e) => changeProvince(e, 2)}
                      options={provinceDD}
                      styles={{ zIndex: 2000 }}
                    // onChange={opt => console.log(opt)}
                    />
                  </div>
                  <div class="col-2">
                    <label class="form-label ">อำเภอ<span class="text-danger"> *</span></label>
                    <Select
                    required
                      value={districDD2.filter(({ value }) => value === contactData.districtID)}
                      // className="form-control"
                      name={`districtID`}
                      onChange={(e) => changeDistrict(e, 2)}
                      options={districDD2}
                    />
                  </div>
                  <div class="col-2">
                    <label class="form-label ">ตำบล<span class="text-danger"> *</span></label>
                    <Select
                    required
                      value={subDistricDD2.filter(({ value }) => value === contactData.subDistrictID)}
                      // className="form-control"
                      name={`subDistrictID`}
                      onChange={(e) => changeSubDistrict(e, 2)}
                      options={subDistricDD2}
                    />
                  </div>
                  <div class="col-2">
                    <label class="form-label ">รหัสไปรษณีย์<span class="text-danger"> *</span></label>
                    <select className="form-control" required name="zipcode" onChange={changeContact} value={contactData.zipcode}>
                      {/* <option value="" selected disabled hidden>เลือกรหัสไปรษณีย์</option> */}
                      {zipcodeDD2}
                    </select>
                  </div>
                </div>
              </>
              : null}
            <div class="row">
              <div class="col-1 "></div>

              <div class="col-2">
                <label class="form-label ">Email<span class="text-danger"> *</span></label>
                <input
                required
                  defaultValue={contactData.email}
                  className="form-control"
                  type="text"
                  name="email"
                  onChange={changeContact}
                />
              </div>
              <div class="col-2">
                <label class="form-label ">เบอร์มือถือ<span class="text-danger"> *</span></label>
                <input
                required
                  defaultValue={contactData.telNum_1}
                  className="form-control"
                  type="text"
                  name="telNum_1"
                  onChange={changeContact}
                />
              </div>

              <div class="col-2">
                <label class="form-label ">เบอร์โทรศัพท์<span class="text-danger"> *</span></label>
                <input
                required
                  defaultValue={contactData.telNum_2}
                  className="form-control"
                  type="text"
                  name="telNum_2"
                  onChange={changeContact}
                />
              </div>
              <div class="col-2">
                <label class="form-label ">เบอร์โทรสาร<span class="text-danger"> *</span></label>
                <input
                required
                  defaultValue={contactData.telNum_3}
                  className="form-control"
                  type="text"
                  name="telNum_3"
                  onChange={changeContact}
                />
              </div>
            </div>
          </>
          : null}
        {/* commission-ov-in table */}
        <div class="d-flex  justify-content-center">
          <div class="col-3">
            <h3>commission OV OUT</h3>
          </div>
          <div class="col-2">
            <button onClick={newRow}>add</button>

            <button onClick={removeRow}>Remove</button>
          </div>
        </div>

        <div class="row">
          <div class="col-2"></div>
          <div class="col-2">
            <label class="col-form-label">InsureType</label>
          </div>
          <div class="col-2">
            <label class="col-form-label">บริษัทรับประกัน</label>
          </div>
          <div class="col-2">
            <label class="col-form-label">Comm-out %</label>
          </div>
          <div class="col-2">
            <label class="col-form-label">OV-out %</label>
          </div>
        </div>

        {/* <form
                                method="POST"
                                id={"policyadd"}
                            //   onSubmit={(e) => handleCreate(e)}
                            ></form> */}

        {Array.from({ length: row + 1 }, (_, index) => (
          <div class="row">
            <div class="col-2"></div>
            <div class="col-2">
              <select required class="form-control" name={`insureID-${index}`} onChange={changeComOv} key={index} value={comOvOutData[index].insureID}>
                <option hidden>class:subclass</option>
                {insureTypeDD}
              </select>
            </div>
            <div class="col-2">
              <select required class="form-control" name={`insurerCode-${index}`} onChange={changeComOv} key={index} value={comOvOutData[index].insurerCode}>
                <option hidden>บริษัทรับประกัน</option>
                {insurerDD}
              </select>
            </div>
            <div class="col-2">
              <input required class="form-control" type="text" name={`rateComOut-${index}`} onChange={changeComOv} key={index} defaultValue={comOvOutData[index].rateComOut} />
            </div>
            <div class="col-2">
              <input required class="form-control" type="text" name={`rateOVOut_1-${index}`} onChange={changeComOv} key={index} defaultValue={comOvOutData[index].rateOVOut_1} />
            </div>


          </div>
        ))}

        <div className="d-flex justify-content-center">
          {params.agentCode ? <LoginBtn className="text-center" type="submit">UPDATE</LoginBtn>
            : <LoginBtn className="text-center" type="submit">SUBMIT</LoginBtn>}

        </div>

      </form>

      {/* <Link to="/signup" style={NormalText}>
          First time here ? Let's sign up
        </Link> */}
      {/* </BackdropBox1> */}
    </CenterPage>
  );
};

export default Agent;
