import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
  const url = window.globalConfig.BEST_POLICY_V1_BASE_URL;
  const selectInputProvince = useRef();
  const selectInputDistrict = useRef();
  const selectInputSubDistrict = useRef();
  const navigate = useNavigate();
  const [cookies] = useCookies(["jwt"]);
  const headers = {
    headers: { Authorization: `Bearer ${cookies["jwt"]}` }
  };
  const [insurerData, setInsurerData] = useState({
    entityID: null,
    deductTaxRate: 3,
    deductTaxType : "หักภาษี ณ ที่จ่ายค่านายหน้า",
    commovCreditUnit: 'D',
    premCreditUnit : 'D'
  });
  const [entityData, setEntityData] = useState({
    personType: "O",
    ogType: "ประกันภัย",
  });
  const [locationData, setLocationData] = useState({
    entityID: null,
    locationType: "A",
  });
  const [comOvInData, setComOvInData] = useState([]);
  // dropdown
  const [provinceDD, setProvinceDD] = useState([]);
  const [districDD, setDistricDD] = useState([]);
  const [subDistricDD, setSubDistricDD] = useState([]);
  const [zipcodeDD, setZipCodeDD] = useState([]);
  const [titleDD, setTitleDD] = useState([]);
  const [insureTypeDD, setInsureTypeDD] = useState([]);
  const [row, setRow] = useState(0);

  const changeInsurer = (e) => {
    setInsurerData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const changeEntity = (e) => {

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
  const changeProvince = (e) => {
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
    getDistrict(e.value);


  }
  const changeDistrict = (e) => {
    setLocationData((prevState) => ({
      ...prevState,
      districtID: e.value,
    }));
    getSubDistrict(e.value);
  }
  const changeSubDistrict = (e) => {
    setLocationData((prevState) => ({
      ...prevState,
      subDistrictID: e.value,
    }));
    const postcode = subDistricDD.find(el => el.value === e.value).postcode;

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
  }
  const getDistrict = (provinceID) => {
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
        setDistricDD(array);
      })
      .catch((err) => { });
  };

  const getSubDistrict = (districID) => {
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

        setSubDistricDD(arraySub);


      })
      .catch((err) => { });
  };


  useEffect(() => {
    //get province
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
          array.push(
            { label: ele.t_provincename, value: ele.provinceid }
          );
        });
        setProvinceDD(array);
        // get title
        axios
          .get(url + "/static/titles/company/all", headers)
          .then((title) => {
            const array2 = [];
            title.data.forEach((ele) => {
              array2.push(
                { label: ele.TITLETHAIBEGIN, value: ele.TITLEID, label2: ele.TITLETHAIEND || '' }
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
      .then((province) => {
        // let token = res.data.jwt;
        // let decode = jwt_decode(token);
        // navigate("/");
        // window.location.reload();
        // localStorage.setItem("jwt", token);

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
      .catch((err) => { });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(url + "/persons/insurernew", {
        insurer: insurerData,
        entity: entityData,
        location: locationData,
        commOVIn: comOvInData,
      }, headers)
      .then((res) => {
        // let token = res.data.jwt;
        // let decode = jwt_decode(token);
        // navigate("/");
        // window.location.reload();
        // localStorage.setItem("jwt", token);
        console.log(res.data);
        alert("create new insurer success");
       
      })
      .catch((err) => {
        alert("create new insurer fail");
      });
  };

  const newRow = (e) => {
    e.preventDefault();
    setRow(row + 1);
  };
  const removeRow = (e) => {
    e.preventDefault();
    if (row > 0) {
      setRow(row - 1);
    }
  };

  return (
    <div>


      <CenterPage>
        {/* <BackdropBox1> */}
        <form className="container-fluid text-left" onSubmit={handleSubmit}>
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
                onChange={changeInsurer}
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
                className="form-control"
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
                onChange={changeInsurer}
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
                name="commovCreditT"
                onChange={changeInsurer}
              />
            </div>
            <div class="col-1">
              <label class="form-label ">หน่วย<span class="text-danger"> *</span></label>
              <select
                className="form-control"
                name={`commovCreditUnit`}
                onChange={changeInsurer}
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
                formatOptionLabel={(option, { context }) => context === 'value' ? option.label : `${option.label}  ${option.label2}`}
                name={`title`}
                onChange={(e) => setEntityData((prevState) => ({
                  ...prevState,
                  titleID: e.value,
                  suffix: titleDD.find((a) => a.value == e.value).label2
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
                required
                name="t_ogName"
                onChange={changeEntity}
              />
            </div>
            <div class="col-2">
              <label class="form-label ">คำลงท้าย<span class="text-danger"> *</span></label>
              <input type="text" disabled className="form-control" value={entityData.suffix} />

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
                  defaultValue={3}
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
              />
            </div>
            <div class="col-2">
              <label class="form-label ">
                วันที่จดทะเบียน<span class="text-danger"> *</span>
              </label>
              <DatePicker

                showIcon
                selected={entityData.taxActDate}
                onChange={(date) => setEntityData((prevState) => ({
                  ...prevState,
                  "taxActDate": date,
                }))}
                dateFormat="dd/MM/yyyy" // Specify the custom date format here
                className="form-control"
                required
                name="taxActDate"
              />

            </div>
            <div class="col-2">
              <label class="form-label ">
                วันที่หมดอายุ<span class="text-danger"> *</span>
              </label>

              <DatePicker

                showIcon
                selected={entityData.taxExpDate}
                onChange={(date) => setEntityData((prevState) => ({
                  ...prevState,
                  "taxExpDate": date,
                }))}
                dateFormat="dd/MM/yyyy" // Specify the custom date format here
                className="form-control"
                required
                name="taxExpDate"
              />
            </div>

          </div>



          <div class="row">
            <div class="col-1"></div>
            {/* <div class="col-2">
              <label class="form-label ">
                จดทะเบียน vat<span class="text-danger"> *</span>
              </label>
              <input
                type="checkbox"
                name="vatRegis"
                onChange={(e) =>
                  setEntityData({ ...entityData, vatRegis: e.target.checked })
                }
              />
            </div> */}
            <div class="col-2">
              <label class="form-label ">
                อยู่ในระบบ VAT หรือไม่
              </label>
              <select
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
                className="form-control"
                type="text"
                name="branch"
                onChange={changeEntity}
              />
            </div>
          </div>

          {/* location table */}
          <div class="row">
            <h5 className="text-center">Location</h5>
          </div>
          <div class="row">
            <div class="col-1"></div>
            <div class="col-2">
              <label class="form-label ">
                บ้านเลขที่<span class="text-danger"> *</span>
              </label>
              <input
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
                className="form-control"
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
                className="form-control"
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
              <label class="form-label ">
                จังหวัด<span class="text-danger"> *</span>
              </label>
              <Select
                // className="form-control"
                ref={selectInputProvince}
                name={`provinceID`}
                onChange={(e) => changeProvince(e)}
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
                ref={selectInputDistrict}
                name={`districtID`}
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
                ref={selectInputSubDistrict}
                name={`subDistrictID`}
                onChange={(e) => changeSubDistrict(e)}
                options={subDistricDD}
              />
            </div>

            <div class="col-2">
              <label class="form-label ">
                รหัสไปรษณีย์<span class="text-danger"> *</span>
              </label>
              <select className="form-control" name="zipcode" onChange={changeLocation}>
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
                className="form-control"
                type="text"
                name="email"
                onChange={changeEntity}
              />
            </div>
            <div class="col-2">
              <label class="form-label ">
                เบอร์โทรศัพท์<span class="text-danger"> *</span>
              </label>
              <input
                className="form-control"
                type="number"
                name="telNum_1"
                onChange={changeLocation}
              />
            </div>
            <div class="col-2">
              <label class="form-label ">
                เบอร์มือถือ<span class="text-danger"> *</span>
              </label>
              <input
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
                className="form-control"
                type="number"
                name="telNum_3"
                onChange={changeLocation}
              />
            </div>
          </div>

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
                  name={`insureID-${index}`}
                  onChange={changeComOv}
                  class="form-control"
                  key={index}
                >
                  <option disabled selected hidden>
                    class:subclass
                  </option>
                  {insureTypeDD}
                </select>
              </div>

              <div class="col-2">
                <input
                  class="form-control"
                  type="number"
                  step={0.1}
                  name={`rateComIn-${index}`}
                  onChange={changeComOv}
                  key={index}
                />
              </div>

              <div class="col-2">
                <input
                  class="form-control"
                  type="number"
                  step={0.1}
                  name={`rateOVIn_1-${index}`}
                  onChange={changeComOv}
                  key={index}
                />
              </div>
            </div>
          ))}

          <div className="d-flex justify-content-center">
            <LoginBtn type="submit">Submit</LoginBtn>
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
