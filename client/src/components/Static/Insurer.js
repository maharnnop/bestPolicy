import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { CenterPage } from "../StylesPages/AdminStyles";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import jwt_decode from "jwt-decode";
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

const Insurer = () => {
  const params = useParams()
  const url = window.globalConfig.BEST_POLICY_V1_BASE_URL;
  const selectInputProvince = useRef();
  const selectInputDistrict = useRef();
  const selectInputSubDistrict = useRef();
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["jwt"]);
  const headers = {
    headers: { Authorization: `Bearer ${cookies["jwt"]}` }
  };
  const [insurerData, setInsurerData] = useState({
    entityID: null,
    deductTaxRate: 3,
    deductTaxType: "หักภาษี ณ ที่จ่ายค่านายหน้า",
    commovCreditUnit: 'D',
    premCreditUnit: 'D',
    stamentType: 'Geoss'
  });
  const [entityData, setEntityData] = useState({
    personType: "O",
    ogType: "ประกันภัย",
  });
  const [locationData, setLocationData] = useState({
    entityID: null,
    locationType: "A",
  });
  const [contactData, setContactData] = useState({
    entityID: null,
    locationType: "A",
    personType: "P"
  });
  const [row, setRow] = useState(0);
  const [comOvInData, setComOvInData] = useState([{ insureID: null }]);
  // dropdown
  const [provinceDD, setProvinceDD] = useState([]);
  const [districDD, setDistricDD] = useState([]);
  const [subDistricDD, setSubDistricDD] = useState([]);
  const [zipcodeDD, setZipCodeDD] = useState([]);
  const [titlePDD, setTitlePDD] = useState([]);
  const [titleODD, setTitleODD] = useState([])
  const [insureTypeDD, setInsureTypeDD] = useState([]);


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
        const array = [];
        province.data.forEach((ele) => {
          array.push(
            { label: ele.t_provincename, value: ele.provinceid }
          );
        });
        setProvinceDD(array);

      })

    //get all insureType
    axios
      .get(url + "/insures/insuretypeall", headers)
      .then((province) => {
        const array = [];
        province.data.forEach((ele) => {
          array.push(
            <option key={ele.id} value={ele.id}>
              {ele.class} : {ele.subClass}
            </option>
          );
        });
        setInsureTypeDD(array);
      })


    // get defualt data insurer by insurerCode
    console.log(params.insurerCode);
    if (params.insurerCode) {

      // get insurer data
      axios
        .post(url + "/persons/getinsurerbyinsurercode", { insurerCode: params.insurerCode }, headers)
        .then((data) => {
          const person = data.data
          //update version num
          person.insurer.version ++
          person.entity.version ++
          
          setInsurerData(person.insurer)
          setEntityData(person.entity)
          setLocationData(person.location)
          setContactData({ ...person.contact, ...contactData, checkLocation: false })
          setComOvInData(person.commovins)
          console.log(person);
          // set distirctDD
          getDistrict(person.location.provinceID, 1)
          // set subdistrictDD
          getSubDistrict(person.location.districtID, 1)
          // set zipcodeDD
          setZipCodeDD([<option value={person.location.zipcode}>{person.location.zipcode}</option>])

          //set commov data 
          setRow(person.commovins.length - 1)


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

  const changeInsurer = (e) => {
    setInsurerData((prevState) => ({
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
    // console.log(e.target.value);
    const index = e.target.name.split("-")[1];
    const name = e.target.name.split("-")[0];
    const data = { ...comOvInData[index], [name]: e.target.value };
    comOvInData[index] = data;
    setComOvInData(comOvInData);
  };

  const changeLocation = (e) => {
    setLocationData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));

  };
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
  const changeSubDistrict = (e,i) => {
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
        const array = [];
        distric.data.forEach((ele) => {
          array.push(
            { label: ele.t_amphurname, value: ele.amphurid }
          );
        });
        if (i === 1) {
          setDistricDD(array)
        } else if (i === 2) {
          setDistricDD2(array)
        }
      })
      .catch((err) => { });
  };

  const getSubDistrict = (districID, i) => {
    //get tambons in distric selected
    axios
      .get(url + "/static/tambons/" + districID, headers)
      .then((subdistric) => {
        const arraySub = [];
        const zip = [];
        subdistric.data.forEach((ele) => {
          arraySub.push(
            { label: ele.t_tambonname, value: ele.tambonid, postcode: ele.postcodeall.split("/") }
          );
          zip.push(...ele.postcodeall.split("/"));
        });
        if (i === 1) {
          setSubDistricDD(arraySub)
        } else if (i === 2) {
          setSubDistricDD2(arraySub)
        }


      })
      .catch((err) => { });
  };

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
    const arr = comOvInData
    arr.push({ insureID: null })
    setComOvInData(arr)
  };
  const removeRow = (e) => {
    e.preventDefault();
    if (row > 0) {
      setRow(row - 1);
      const arr = comOvInData
      arr.pop()
      setComOvInData(arr)
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
    e.preventDefault()
    let contactP = contactData 
    if (contactData.checkLocation) {
      contactP = { ...contactData, 
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
      insurer: insurerData,
      entity: entityData,
      location: locationData,
      commOVIn: comOvInData,
      contactPerson: contactP
    });
    axios
      .post(url + "/persons/insurernew", {
        insurer: insurerData,
        entity: entityData,
        location: locationData,
        commOVIn: comOvInData,
        contactPerson: contactP
      }, headers)
      .then((res) => {
        // let token = res.data.jwt;
        // let decode = jwt_decode(token);
        // navigate("/");
        // window.location.reload();
        // localStorage.setItem("jwt", token);
        console.log(res.data);
        alert("create new insurer success : " + insurerData.insurerCode);

      })
      .catch((err) => {
        alert("create new insurer fail");
      });
  };
  
  const handleUpdate = (e) => {
    e.preventDefault()
    let contactP = contactData 
    if (contactData.checkLocation) {
      contactP = { ...contactData, 
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
      insurer: insurerData,
      entity: entityData,
      location: locationData,
      commOVIn: comOvInData,
      contactPerson: contactP
    });
    console.log(contactP.personType);
    axios
      .post(url + "/persons/insurerupdate", {
        insurer: insurerData,
        entity: entityData,
        location: locationData,
        commOVIn: comOvInData,
        contactPerson: contactP
      }, headers)
      .then((res) => {
        console.log(res.data);
        alert("update insurer success : " + insurerData.insurerCode);

      })
      .catch((err) => {
        alert("update insurer fail");
      });
  };
  return (
    <div>


      <CenterPage>
        {/* <BackdropBox1> */}
        <form className="container-fluid text-left" onSubmit={params.insurerCode ? handleUpdate : handleSubmit}>
          {/* insurer table */}
          <h1 className="text-center">บริษัทรับประกัน</h1>
          <div class="row ">
            <div class="col-1 "></div>
            <div class="col-2 ">
              <label class="form-label ">
                รหัสบริษัทประกัน<span class="text-danger"> *</span>
              </label>
              <input
                className="form-control"
                type="text"
                required
                defaultValue={insurerData.insurerCode}
                // placeholder="InsurerCode"
                name="insurerCode"
                onChange={changeInsurer}
              />
            </div>
            <div class="col-2">
              <label class="form-label ">
                ประเภทการชำระ<span class="text-danger"> *</span>
              </label>
              <select
                className="form-control"
                name={`stamentType`}
                required
                onChange={changeInsurer}
                value={insurerData.stamentType}
              >
                <option value="Net">Net</option>
                <option selected value="Gross">
                  Gross
                </option>
              </select>
            </div>
            <div class="col-2">
              <label class="form-label ">
                เครดิตเทอมเบี้ย<span class="text-danger"> *</span>
              </label>
              <input
                defaultValue={insurerData.premCreditT}
                className="form-control"
                required
                type="number"
                name="premCreditT"
                onChange={changeInsurer}
              />
            </div>
            <div class="col-1">
              <label class="form-label ">หน่วย<span class="text-danger"> *</span></label>
              <select
                className="form-control"
                name={`premCreditUnit`}
                required
                onChange={changeInsurer}
                value={insurerData.premCreditUnit}
              >
                <option selected value="D">วัน</option>
                <option value="M">เดือน</option>
                <option value="Y">ปี</option>
              </select>
            </div>
            <div class="col-2">
              <label class="form-label ">
                เครดิตเทอมCom<span class="text-danger"> *</span>
              </label>
              <input
                className="form-control"
                type="number"
                required
                name="commovCreditT"
                onChange={changeInsurer}
                defaultValue={insurerData.commovCreditT}
              />
            </div>
            <div class="col-1">
              <label class="form-label ">หน่วย<span class="text-danger"> *</span></label>
              <select
                className="form-control"
                name={`commovCreditUnit`}
                required
                onChange={changeInsurer}
                value={insurerData.commovCreditUnit}
              >
                <option selected value="D">วัน</option>
                <option value="M">เดือน</option>
                <option value="Y">ปี</option>
              </select>
            </div>


          </div>

          {/* entity table */}
          <div class="row">
            <div class="col-1"></div>
            <div class="col-2">
              <label class="form-label ">คำนำหน้า<span class="text-danger"> *</span></label>
              <Select
                value={titleODD.filter(({ value }) => value === entityData.titleID)}
                formatOptionLabel={(option, { context }) => context === 'value' ? option.label : `${option.label}  ${option.label2}`}
                name={`title`}
                required
                onChange={(e) => setEntityData((prevState) => ({
                  ...prevState,
                  titleID: e.value,
                  TITLETHAIEND: titleODD.find((a) => a.value == e.value).label2
                }))}
                options={titleODD}
              />
            </div>
            <div class="col-2">
              <label class="form-label ">
                ชื่อ<span class="text-danger"> *</span>
              </label>
              <input
                defaultValue={entityData.t_ogName}
                className="form-control"
                type="text"
                required
                name="t_ogName"
                onChange={changeEntity}
              />
            </div>
            <div class="col-2">
              <label class="form-label ">คำลงท้าย<span class="text-danger"> *</span></label>
              <input type="text" disabled className="form-control" value={entityData.TITLETHAIEND} />

            </div>
            <div class="col-2">
              <label class="form-label ">
                รหัส คปภ.<span class="text-danger"> *</span>
              </label>
              <input
                className="form-control"
                type="text"
                required
                name="KPPCode"
                defaultValue={insurerData.KPPCode}
                onChange={changeInsurer}
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
                className="form-control"
                required
                name={`deductTaxType`}
                onChange={changeInsurer}
                value={insurerData.deductTaxType}
              >
                <option value="หักภาษี ณ ที่จ่าย">หักภาษี ณ ที่จ่าย</option>
                <option selected value="หักภาษี ณ ที่จ่ายค่านายหน้า">
                  หักภาษี ณ ที่จ่ายค่านายหน้า
                </option>
              </select>

            </div>


            <div class="col-2">
              <label class="form-label ">
                อัตราภาษีหัก ณ ที่จ่าย
              </label>
              <div class="input-group mb-3">
                <input
                  className="form-control"
                  defaultValue={insurerData.deductTaxRate || 3}
                  type="number"
                  step={0.1}
                  required
                  name="deductTaxRate"
                  onChange={changeInsurer}
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
                เลขที่จดทะเบียน<span class="text-danger"> *</span>
              </label>
              <input
                className="form-control"
                type="text"
                required
                name="taxNo"
                onChange={changeEntity}
                defaultValue={entityData.taxNo}
              />
            </div>
            <div class="col-2">
              <label class="form-label ">
                วันที่จดทะเบียน<span class="text-danger"> *</span>
              </label>

              <input
                className="form-control"
                type="date"
                required
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
                required
                name="taxExpDate"
                defaultValue={entityData.taxExpDate}
                onChange={changeEntity}
              />
            </div>

          </div>

          <div class="row">
            <div class="col-1"></div>

            <div class="col-2">
              <label class="form-label ">
                อยู่ในระบบ VAT หรือไม่
              </label>
              <select
                value={entityData.vatRegis}
                required
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
                defaultValue={entityData.pk20}
                className="form-control"
                required
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
                defaultValue={entityData.branch}
                className="form-control"
                required
                type="text"
                name="branch"
                onChange={changeEntity}
              />
            </div>
          </div>

          {/* location table */}
          <div class="row">
            <h5 className="text-center">ที่อยู่</h5>
          </div>
          <div class="row">
            <div class="col-1"></div>
            <div class="col-2">
              <label class="form-label ">
                บ้านเลขที่<span class="text-danger"> *</span>
              </label>
              <input
                defaultValue={locationData.t_location_1}
                className="form-control"
                type="text"
                required
                name="t_location_1"
                onChange={changeLocation}
              />
            </div>
            <div class="col-2">
              <label class="form-label ">
                หมู่บ้านอาคาร<span class="text-danger"> *</span>
              </label>
              <input
                defaultValue={locationData.t_location_2}
                className="form-control"
                required
                type="text"
                name="t_location_2"
                onChange={changeLocation}
              />
            </div>
            <div class="col-2">
              <label class="form-label ">
                หมู่<span class="text-danger"> *</span>
              </label>
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
              <label class="form-label ">
                ซอย<span class="text-danger"> *</span>
              </label>
              <input
                defaultValue={locationData.t_location_4}
                className="form-control"
                required
                type="text"
                name="t_location_4"
                onChange={changeLocation}
              />
            </div>
            <div class="col-2">
              <label class="form-label ">
                ถนน<span class="text-danger"> *</span>
              </label>
              <input
                defaultValue={locationData.t_location_5}
                className="form-control"
                required
                type="text"
                name="t_location_5"
                onChange={changeLocation}
              />
            </div>
          </div>

          <div class="row">
            <div class="col-1 "></div>

            <div class="col-2">
              <label class="form-label ">
                จังหวัด<span class="text-danger"> *</span>
              </label>
              <Select
                // className="form-control"
                value={provinceDD.filter(({ value }) => value === locationData.provinceID)}
                name={`provinceID`}
                required
                onChange={(e) => changeProvince(e, 1)}
                options={provinceDD}
                styles={{ zIndex: 2000 }}
              // onChange={opt => console.log(opt)}
              />
            </div>
            <div class="col-2">
              <label class="form-label ">
                อำเภอ<span class="text-danger"> *</span>
              </label>
              <Select
                // className="form-control"
                value={districDD.filter(({ value }) => value === locationData.districtID)}
                ref={selectInputDistrict}
                name={`districtID`}
                required
                onChange={(e) => changeDistrict(e, 1)}
                options={districDD}
              />
            </div>
            <div class="col-2">
              <label class="form-label ">
                ตำบล<span class="text-danger"> *</span>
              </label>
              <Select
                // className="form-control"
                value={subDistricDD.filter(({ value }) => value === locationData.subDistrictID)}
                ref={selectInputSubDistrict}
                name={`subDistrictID`}
                required
                onChange={(e) => changeSubDistrict(e, 1)}
                options={subDistricDD}
              />
            </div>

            <div class="col-2">
              <label class="form-label ">
                รหัสไปรษณีย์<span class="text-danger"> *</span>
              </label>
              <select className="form-control" required name="zipcode" onChange={changeLocation} value={locationData.zipcode}>
                {/* <option value="" selected disabled hidden>เลือกรหัสไปรษณีย์</option> */}
                {zipcodeDD}
              </select>
            </div>

          </div>

          <div class="row">
            <div class="col-1 "></div>

            <div class="col-2">
              <label class="form-label ">
                Email<span class="text-danger"> *</span>
              </label>
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
              <label class="form-label ">
                เบอร์มือถือ<span class="text-danger"> *</span>
              </label>
              <input
                required
                defaultValue={locationData.telNum_1}
                className="form-control"
                type="number"
                name="telNum_1"
                onChange={changeLocation}
              />
            </div>
            <div class="col-2">
              <label class="form-label ">
                เบอร์โทรศัพท์<span class="text-danger"> *</span>
              </label>
              <input
              required
                defaultValue={locationData.telNum_2}
                className="form-control"
                type="number"
                name="telNum_2"
                onChange={changeLocation}
              />
            </div>
            <div class="col-2">
              <label class="form-label ">
                เบอร์โทรสาร<span class="text-danger"> *</span>
              </label>
              <input
              required
                defaultValue={locationData.telNum_3}
                className="form-control"
                type="number"
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
                    value={titlePDD.filter(({ value }) => value === contactData.titleID)}
                    formatOptionLabel={(option, { context }) => context === 'value' ? option.label : `${option.label}  ${option.label2}`}
                    name={`title`}
                    required
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
                    defaultValue={contactData.t_firstName}
                    className="form-control"
                    required
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
                  defaultValue={contactData.email}
                  required
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
            <div class="col-2">
              <h3>commission OV IN</h3>
            </div>
            <div class="col-2">
              <button onClick={newRow}>add</button>

              <button onClick={removeRow}>Remove</button>
            </div>
          </div>

          <div class="row">
            <div class="col-3"></div>
            <div class="col-2">
              <label class="col-form-label">InsureType</label>
            </div>
            <div class="col-2">
              <label class="col-form-label">Comm-in %</label>
            </div>
            <div class="col-2">
              <label class="col-form-label">OV-in %</label>
            </div>
          </div>
          {Array.from({ length: row + 1 }, (_, index) => (
            <div class="row">
              <div class="col-3"></div>
              <div class="col-2">
                <select
                  required
                  name={`insureID-${index}`}
                  onChange={changeComOv}
                  class="form-control"
                  key={index}
                  value={comOvInData[index].insureID}
                >
                  <option value="" selected disabled hidden></option>
                  {insureTypeDD}
                </select>
              </div>

              <div class="col-2">
                <input
                  class="form-control"
                  type="number"
                  required
                  step={0.1}
                  name={`rateComIn-${index}`}
                  onChange={changeComOv}
                  key={index}
                  defaultValue={comOvInData[index].rateComIn} 
                  
                />
              </div>

              <div class="col-2">
                <input
                  class="form-control"
                  required
                  type="number"
                  step={0.1}
                  name={`rateOVIn_1-${index}`}
                  onChange={changeComOv}
                  key={index}
                  defaultValue={comOvInData[index].rateOVIn_1}
                />
              </div>
            </div>
          ))}

          <div className="d-flex justify-content-center">
          {params.insurerCode ? 
          // <button className="text-center" onClick={handleUpdate}>UPDATE</button>
          <LoginBtn className="text-center" type="submit">UPDATE</LoginBtn>
            : <LoginBtn className="text-center" type="submit">SUBMIT</LoginBtn>}
          </div>
        </form>

        {/* <Link to="/signup" style={NormalText}>
          First time here ? Let's sign up
        </Link> */}
        {/* </BackdropBox1> */}
      </CenterPage>
    </div>
  );
};

export default Insurer;
