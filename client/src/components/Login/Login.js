import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useCookies } from "react-cookie";


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
  BackgroundImg1,
} from "../StylesPages/LoginStyles";

const config = require("../../config.json");

const NormalText = {
  color: "white",
  paddingBottom: "10px",
};
/* eslint-disable react-hooks/exhaustive-deps */

const Login = () => {
  const url = window.globalConfig.BEST_POLICY_V1_BASE_URL;
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState("");
  const [cookies, setCookie, removeCookie] = useCookies(["jwt"]);
  const handleChange = (e) => {
    setLoginData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(url + "/auth/login", loginData)
      .then((res) => {
        let token = res.data.jwt;
        let decode = jwt_decode(token);
        navigate("/");
        window.location.reload();
        // localStorage.setItem("jwt", token);
        setCookie("jwt", token)
        localStorage.setItem('navSelect', ['N','N','N','N','N','N','N','N','N','N']);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          alert("Wrong Password");
        } else if (err.response.status === 404) {
          alert("Wrong Username");
        }
        // console.log(err);
      });
  };

  return (
    <BackgroundImg1>
      <BackdropBox1>
        <Header>Welcome Back !</Header>

        <form onSubmit={handleSubmit}>
          <InputBtn
            type="text"
            placeholder="Username"
            name="userName"
            onChange={handleChange}
          />{" "}
          <InputBtn
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleChange}
          />{" "}
          <LoginBtn type="submit">Login</LoginBtn>
        </form>

        <Link to="/signup" style={{color: '#05276B'}}>
          First time here ? Let's sign up
        </Link>
      </BackdropBox1>
    </BackgroundImg1>
  );
};

export default Login;
