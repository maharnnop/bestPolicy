import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
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
  InputBtn,
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

const InsureType = () => {
  const params = useParams()
  const url = window.globalConfig.BEST_POLICY_V1_BASE_URL;
  const navigate = useNavigate();
  const [insureData, setInsureData] = useState({});
  // const [locationData, setLocationData] = useState({entityID : null});
  const [cookies] = useCookies(["jwt"]);
  const headers = {
    headers: { Authorization: `Bearer ${cookies["jwt"]}` }
};
  const changeInsurer = (e) => {
    setInsureData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    console.log(insureData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(url + "/insures/insuretypenew", { insure: insureData }, headers)
      .then((res) => {
        // let token = res.data.jwt;
        // let decode = jwt_decode(token);
        // navigate("/");
        // window.location.reload();
        // localStorage.setItem("jwt", token);
        console.log(res.data);
        alert("create new insure success");
      })
      .catch((err) => {
        alert("create new insure fail");
      });
  };
  
  useEffect(() =>{
  
      //get defualt insureType detail
      if (params.id) {
          axios
          .get(url + "/insures/insuretypeget/" +  params.id , headers)
          .then((data) => {
              console.log(data.data);
              const insureType = data.data
              setInsureData(insureType)
            
            })
  
            .catch((err) => {
              
              alert("internal error");
            });
         
  
      }
  },[])
  return (
    <div>
      {/* <BackdropBox1> */}
      <form className="container-fluid text-left" onSubmit={handleSubmit}>
        {/* insurer table */}
        <h1 className="text-center">แผนประกัน</h1>
        <div class="row">
          <div class="col-3"></div>
          <div class="col-1">
            <div class="input-group mb-3">
              <label class="col-form-label">Class</label>
            </div>

          </div>
          <div class="col-2 ">
          <input
              type="text"
              required
              value={insureData.class}
              class="form-control"
              name="class"
              onChange={changeInsurer}
            />
          </div>
          <div class="col-1">
            <label class="col-form-label">subclass</label>
          </div>
          <div class="col-2 ">
            <input
              type="text"
              required
              value={insureData.subClass}
              class="form-control"
              name="subClass"
              onChange={changeInsurer}
            />
          </div>
        </div>



        <div class="row">
          <div class="col-3"></div>
          <div class="col-1">
            <label class="col-form-label">plancode</label>
          </div>
          <div class="col-2">
            <input
              type="text"
              defaultValue={insureData.plancode}
              class="form-control"
              name="planCode"
              onChange={changeInsurer}
            />
          </div>
          <div class="col-1">
            <label class="col-form-label">ชื่อประกัน</label>
          </div>
          <div class="col-2">
            <input
              type="text"
              required
              defaultValue={insureData.insureName}
              class="form-control"
              name="insureName"
              onChange={changeInsurer}
            />
          </div>
        </div>
        <div className="d-flex justify-content-center">
          <LoginBtn type="submit">Submit</LoginBtn>
        </div>
      </form>

      {/* <Link to="/signup" style={NormalText}>
          First time here ? Let's sign up
        </Link> */}
      {/* </BackdropBox1> */}
    </div>
  );
};

export default InsureType;
