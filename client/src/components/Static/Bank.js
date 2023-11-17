// import UserDetails from "./UserDetail";
// import CarsDetails from "./CarsDetails";
import React, { useState,useEffect } from "react";
import { useParams, useNavigate, Link, redirect } from "react-router-dom";
// import PackagesDetails from "./PackagesDetails";
import jwt_decode from "jwt-decode";
// import "./Admin.css";
import Select from 'react-select';
import InsureType from "./insureType";
import Agent from "./Agent";
import CommOv from "./CommOv"
import Policy from "./Policy";
import ExportFile from "./ExportFile"
import Payment from "./Payment";
import axios from "axios";
import { useCookies } from "react-cookie";


const Bank = () => {
    const [cookies] = useCookies(["jwt"]);
    const headers = {
      headers: { 'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${cookies["jwt"]}` }
  };
    const [bankBrand, setBankBrand] = useState('')
    const [bankBrandDD, setBankBrandDD] = useState([])
    const [bankBranch, setBankBranch] = useState('')
    const [bankBranchDD, setBankBranchDD] = useState([])
    const [bankNo, setBankNo] = useState('')
    const [bankOf, setBankOf] = useState('M')
    const [bankOfCode, setBankOfCode] = useState('Amity')
    const url = window.globalConfig.BEST_POLICY_V1_BASE_URL;

    useEffect(() =>{
      //get brankbrand
      axios
        .get(url + "/bills/getbankbrand/all", headers)
        .then((brand) => {
          const array = [];
          brand.data.forEach((ele) => {
            array.push(
              { label: ele.bankName, value: ele.bankCode }
            );
          });
        //   console.log(array);
          setBankBrandDD(array);
        })
    },[])

    const changeBankBrand = (e) =>{
        setBankBrand(e.value)
        axios
        .post(url + "/bills/getbankbranchinbrand",{bankCode:e.value}, headers)
        .then((branch) => {
            // console.log(branch);
          const array = [];
          branch.data.forEach((ele) => {
            array.push(
              { label: ele.branchName, value: ele.branchCode }
            );
          });
        //   console.log(array);
          setBankBranchDD(array);
        })
    } 

    const handleSubmit=(e)=>{
        e.preventDefault()

        let data = JSON.stringify({
            "bankBrand": bankBrand,
            "bankBranch":bankBranch,
            "bankNo":bankNo,
            "type":bankOf,
            "code":bankOfCode
        });
        axios.post(url +"/static/bank/Bank", data, headers)
            .then((response) => {
                console.log(JSON.stringify(response.data));
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return(
        <div className="container" style={{paddingTop: "30px", paddingBottom: "30px" }}>
            <h1 className="text-center">ธนาคาร</h1>
            <div className="row justify-content-center">
                <div className="col-lg-6">
                    <form>
                        {/* Bank Brand */}
                        <div className="row mb-3">
                            <div className="col-4">
                                <label htmlFor="bankBrand" className="form-label">ธนาคาร</label>
                            </div>
                            <div className="col-7">
                                {/* <input type="text" id="bankBrand"  onChange={(e) => setBankBrand(e.target.value)} className="form-control"/> */}
                                <Select
                                id="bankBrand"
                                className="form-control"
                                name={`bankBrand`}
                                value={bankBrandDD.filter(({ value }) => value === bankBrand)}
                                onChange={(e) => changeBankBrand(e)}
                                options={bankBrandDD}
                                styles={{ zIndex: 2000 }}
                      />
                            </div>
                        </div>

                        {/* Bank Branch */}
                        <div className="row mb-3">
                            <div className="col-4">
                                <label htmlFor="bankBranch" className="form-label">สาขา</label>
                            </div>
                            <div className="col-7">
                                {/* <input type="text" id="bankBranch" value={bankBranch} onChange={(e) => setBankBranch(e.target.value)} className="form-control"/> */}
                                <Select
                                id="bankBranch"
                                className="form-control"
                                value={bankBranchDD.filter(({ value }) => value === bankBranch)}
                                name={`bankBranch`}
                                onChange={(e) => setBankBranch(e.value)}
                                options={bankBranchDD}
                                styles={{ zIndex: 2000 }}
                      />
                            </div>
                        </div>

                        {/* Bank No */}
                        <div className="row mb-3">
                            <div className="col-4">
                                <label htmlFor="bankNo" className="form-label">เลขที่บัญชี</label>
                            </div>
                            <div className="col-7">
                                <input type="text" id="bankNo" value={bankNo} onChange={(e) => setBankNo(e.target.value)} className="form-control"/>
                            </div>
                        </div>

                        {/* Bank Of */}
                        <div className="row mb-3">
                            <div className="col-4">
                                <label htmlFor="bankOf" className="form-label">Bank Of</label>
                            </div>
                            <div className="col-7">
                                <select id="bankOf" value={bankOf} onChange={(e) => setBankOf(e.target.value)} className="form-control">
                                    <option value="M">Amity</option>
                                    <option value="I">Insurer</option>
                                    <option value="A">Advisor</option>
                                    {/*amity ="M" insurer = "I"  advisor = "A" customer = "C"';*/}
                                </select>
                            </div>
                        </div>
                        {/* Bank Of Code */}
                        <div className="row mb-3">
                            <div className="col-4">
                                <label htmlFor="bankOfCode" className="form-label">Bank Of Code</label>
                            </div>
                            <div className="col-7">
                                <input type="text" id="bankOfCode" value={bankOfCode} disabled={bankOf === 'M'} onChange={(e) => setBankOfCode(e.target.value)} className="form-control"/>
                            </div>
                        </div>
                        <div className="row" style={{ marginTop: '20px' }}>
                            <div className="col-12 text-center">
                                <button type="submit" className="btn btn-primary btn-lg" onClick={handleSubmit}>Submit</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
};

export default Bank;
