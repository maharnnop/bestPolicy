import React, { useState } from "react";
import jwt_decode from "jwt-decode";
import { Link, redirect, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import logoamity from './amity_3.webp'
import {
  NavBar,
  NavLogo,
  NavMenu,
  NavList,
  NavLink,
  Bars,
  ImgLogo,
} from "../StylesPages/NavBarStyles";

function Nav() {
  const navigate = useNavigate();
  const [showToggle, setShowToggle] = useState(false);
  const [selected, setSelected] = useState(localStorage.getItem('navSelect') !== null ? localStorage.getItem('navSelect').split(',') : null);
  // localStorage.setItem('navSelect', [false,false,false,false,false,false,false,false,false,false]);
  const [cookies, setCookie, removeCookie] = useCookies(["jwt"]);
  console.log(selected);
  const handleLogOut = (e) => {
    removeCookie("jwt")
    const array = ['N','N','N','N','N','N','N','N','N','N']
    localStorage.setItem('navSelect', array);
  };

  const admin = (
    <NavList>
      <NavLink to="/admin">Admin</NavLink>
    </NavList>
  );
    const handleChangeSelected = (e,i) =>{
      // e.preventDefualt old
      // const array = selected.map((ele)=>false)
      // array[i] = true
      // setSelected(array)

      // new
      const array = ['N','N','N','N','N','N','N','N','N','N']
      array[i] = 'Y'
      localStorage.setItem('navSelect', array);
      setSelected(array)
    }
  
  if (cookies["jwt"] !== undefined) {
    // const decoded = jwt_decode(localStorage.getItem("jwt"));
    return (
      // Use React Fragment
      <>
        {/* Use components from NavBar-Style */}
        <NavBar showToggle={showToggle}>
          <Bars onClick={() => setShowToggle(!showToggle)} />

          <NavLogo to="/">
            <ImgLogo 
              style={{ height: "70px" }}
              src={logoamity}
            />
          </NavLogo>
        
          <NavMenu showToggle={showToggle}>
            {/* {decoded.is_admin ? admin : null} */}
            <div class="dropdown">
            <a class={selected[0] === 'Y' ? "btn btn-warning dropdown-toggle" : "btn btn-primary dropdown-toggle"} href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
              กรมธรรม์
            </a>

            <ul className={selected[0] === 'Y' ? "dropdown-menu" :"dropdown-menu "}aria-labelledby="dropdownMenuLink">
              {/* <li><a class="dropdown-item"  href="/findpolicy" onClick={(e)=>handleChangeSelected(e,0)}>ค้นหากรมธรรม์</a></li>
              <li><a class="dropdown-item"  href="/policyexcel">สร้างรายการใหม่ (Excel)</a></li>
              <li><a class="dropdown-item"  href="/policyscreen">สร้างรายการใหม่ (Screen)</a></li>
              <li><a class="dropdown-item"  href="/policyreconcile">Reconcile</a></li> */}
              <li><NavLink className="dropdown-item bg-light"  to="/findpolicy" style={{color : "black"}} onClick={(e)=>handleChangeSelected(e,0)}>ค้นหากรมธรรม์</NavLink></li>
              <li><NavLink className="dropdown-item bg-light"  to="/policyexcel" style={{color : "black"}} onClick={(e)=>handleChangeSelected(e,0)}>สร้างรายการใหม่ (Excel)</NavLink></li>
              <li><NavLink className="dropdown-item bg-light"  to="/policyscreen" style={{color : "black"}} onClick={(e)=>handleChangeSelected(e,0)}>สร้างรายการใหม่ (Screen)</NavLink></li>
              <li><NavLink className="dropdown-item bg-light"  to="/policyreconcile" style={{color : "black"}} onClick={(e)=>handleChangeSelected(e,0)}>Reconcile</NavLink></li>
            </ul>
          </div>
          
          <div class="dropdown">
            <a class={selected[1] === 'Y'  ? "btn btn-warning dropdown-toggle" : "btn btn-primary dropdown-toggle"} href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
              ใบวางบิล
            </a>

            <ul className={selected[1] === 'Y'  ? "dropdown-menu" :"dropdown-menu "} aria-labelledby="dropdownMenuLink">
              {/* <li><a class="dropdown-item" href="/bill/findbill" onClick={(e)=>handleChangeSelected(e,1)}>ค้นหารายการ</a></li>
              <li><a class="dropdown-item" href="/bill/createbill">สร้างรายการใหม่</a></li> */}
              {/* <li><a class="dropdown-item" href="/policyexcel">แก้ไขรายการ</a></li> */}
              <li><NavLink className="dropdown-item bg-light" to="/bill/findbill" style={{color : "black"}} onClick={(e)=>handleChangeSelected(e,1)}>ค้นหารายการ</NavLink></li>
              <li><NavLink className="dropdown-item bg-light" to="/bill/createbill" style={{color : "black"}} onClick={(e)=>handleChangeSelected(e,1)}>สร้างรายการใหม่</NavLink></li> 
            </ul>
          </div>
          <div class="dropdown">
            <a class={selected[2] === 'Y'  ? "btn btn-warning dropdown-toggle" : "btn btn-primary dropdown-toggle"} href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
              รายการรับเงิน
            </a>

            <ul className={selected[2] === 'Y'  ? "dropdown-menu" :"dropdown-menu "} aria-labelledby="dropdownMenuLink">
              {/* <li><a class="dropdown-item" href="/cashier/findcashier" onClick={(e)=>handleChangeSelected(e,2)}>ค้นหารายการ</a></li>
              <li><a class="dropdown-item" href="/cashier/createcashier/premin">สร้างรายการรับเงิน Premin</a></li>
              <li><a class="dropdown-item" href="/cashier/createcashier/commin">สร้างรายการรับเงิน Commin</a></li>
              <li><a class="dropdown-item" href="/cashier/editcashier">แก้ไขรายการ</a></li> */}
              <li><NavLink className="dropdown-item bg-light" to="/cashier/findcashier" style={{color : "black"}} onClick={(e)=>handleChangeSelected(e,2)}>ค้นหารายการ</NavLink></li>
              <li><NavLink className="dropdown-item bg-light" to="/cashier/createcashier/premin" style={{color : "black"}} onClick={(e)=>handleChangeSelected(e,2)}>สร้างรายการรับเงิน PREM-IN</NavLink></li>
              <li><NavLink className="dropdown-item bg-light" to="/cashier/createcashier/commin" style={{color : "black"}} onClick={(e)=>handleChangeSelected(e,2)}>สร้างรายการรับเงิน COMM-IN</NavLink></li>
              {/* <li><NavLink className="dropdown-item bg-light" to="/cashier/editcashier" style={{color : "black"}} onClick={(e)=>handleChangeSelected(e,2)}>แก้ไขรายการ</NavLink></li> */}
            </ul>
          </div>
          
          <div class="dropdown">
            <a class={selected[3] === 'Y'  ? "btn btn-warning dropdown-toggle" : "btn btn-primary dropdown-toggle"} href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
              Enquiry
            </a>

            <ul className={selected[3] === 'Y'  ? "dropdown-menu" :"dropdown-menu "} aria-labelledby="dropdownMenuLink">
              
              <li><NavLink className="dropdown-item bg-light" to="/premout/find" style={{color : "black"}} onClick={(e)=>handleChangeSelected(e,3)}>ค้นหารายการ ตัดหนี้ทั้งหมด</NavLink></li>
              
              {/* <li><NavLink className="dropdown-item bg-light" to="/premin/find"  style={{color : "black"}} onClick={(e)=>handleChangeSelected(e,3)}>ค้นหารายการ Prem-In</NavLink></li> */}
              <li><NavLink className="dropdown-item bg-light" to="/premin/paid/premout"  style={{color : "black"}} onClick={(e)=>handleChangeSelected(e,3)}>ค้นหารายการ รอส่งเบี้ยบริษัทประกัน</NavLink></li>
              <li><NavLink className="dropdown-item bg-light" to="/premin/paid/commovout"  style={{color : "black"}} onClick={(e)=>handleChangeSelected(e,3)}>ค้นหารายการ รอจ่าย Comm/OV-Out</NavLink></li>
              {/* <li><NavLink className="dropdown-item bg-light" to="/premin/paid/wht3"  style={{color : "black"}} onClick={(e)=>handleChangeSelected(e,3)}>ค้นหารายการ WHT 3%</NavLink></li> */}
            </ul>
          </div>
          <div class="dropdown">
            <a class={selected[9] === 'Y'  ? "btn btn-warning dropdown-toggle" : "btn btn-primary dropdown-toggle"} href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
              ตัดรับค่าเบี้ย
            </a>

            <ul className={selected[9] === 'Y'  ? "dropdown-menu" :"dropdown-menu "} aria-labelledby="dropdownMenuLink">
              <li><NavLink className="dropdown-item bg-light" to="/premin/create" style={{color : "black"}} onClick={(e)=>handleChangeSelected(e,9)}>สร้างรายการใหม่</NavLink></li>
              <li><NavLink className="dropdown-item bg-light" to="/premin/createdirect"  style={{color : "black"}} onClick={(e)=>handleChangeSelected(e,9)}>สร้างรายการใหม่ (จ่ายประกันโดยตรง)</NavLink></li>
            </ul>
          </div>
          <div class="dropdown">
            <a class={selected[4] === 'Y'  ? "btn btn-warning dropdown-toggle" : "btn btn-primary dropdown-toggle"} href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
              ตัดจ่ายค่าเบี้ย
            </a>

            <ul className={selected[4] === 'Y'  ? "dropdown-menu" :"dropdown-menu "} aria-labelledby="dropdownMenuLink">
              {/* <li><a class="dropdown-item" href="/premout/create">stament ค่าเบี้ยส่งบริษัทประกัน</a></li> */}
              <li><NavLink className="dropdown-item bg-light" to="/premout/create" style={{color : "black"}} onClick={(e)=>handleChangeSelected(e,4)}>stament ค่าเบี้ยส่งบริษัทประกัน</NavLink></li>
            </ul>
          </div>
          <div class="dropdown">
            <a class={selected[5] === 'Y'  ? "btn btn-warning dropdown-toggle" : "btn btn-primary dropdown-toggle"} href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
              ตัดรับค่าคอม
            </a>

            <ul className={selected[5] === 'Y'  ? "dropdown-menu" :"dropdown-menu "} aria-labelledby="dropdownMenuLink">
              {/* <li><a class="dropdown-item" href="/commin/create">สร้างรายการใหม่</a></li> */}
              <li><NavLink className="dropdown-item bg-light" to="/commin/create" style={{color : "black"}} onClick={(e)=>handleChangeSelected(e,5)}>สร้างรายการใหม่</NavLink></li>
            </ul>
          </div>

          <div class="dropdown">
            <a class={selected[6] === 'Y'  ? "btn btn-warning dropdown-toggle" : "btn btn-primary dropdown-toggle"} href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
              ตัดจ่ายค่าคอม
            </a>

            <ul className={selected[6] === 'Y'  ? "dropdown-menu" :"dropdown-menu "} aria-labelledby="dropdownMenuLink">
              {/* <li><a class="dropdown-item" href="/commout/create">สร้างรายการใหม่</a></li> */}
              <li><NavLink className="dropdown-item bg-light" to="/commout/create" style={{color : "black"}} onClick={(e)=>handleChangeSelected(e,6)}>สร้างรายการใหม่</NavLink></li>
            </ul>
          </div>
          <div class="dropdown">
            <a class={selected[7] === 'Y'  ? "btn btn-warning dropdown-toggle" : "btn btn-primary dropdown-toggle"} href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
              รายงาน
            </a>

            <ul className={selected[7] === 'Y'  ? "dropdown-menu" :"dropdown-menu "} aria-labelledby="dropdownMenuLink">
              {/* <li><a class="dropdown-item" href="/reports/policy">รายงานบันทึกกรมธรรม์ประจำวัน </a></li>
              <li><a class="dropdown-item" href="/reports/endorse">รายงานบันทึกสลักหลัง </a></li>
              <li><a class="dropdown-item" href="/reports/invoice">รายงานบันทึกใบแจ้งหนี้ </a></li>
              <li><a class="dropdown-item" href="/reports/billadvisor">รายงานใบวางบิล </a></li>
              <li><a class="dropdown-item" href="/reports/cashier">รายงานรับเงิน </a></li>
              <li><a class="dropdown-item" href="/reports/arapadvisor">รายงานตัดหนี้/ตัดจ่าย ตัวแทน  </a></li>
              <li><a class="dropdown-item" href="/reports/arapdirect">รายงานลูกค้าจ่ายเงินที่ประกัน  </a></li>
              <li><a class="dropdown-item" href="/reports/arapinsurer">รายงานตัดหนี้/ตัดจ่าย ประกัน  </a></li>
              <li><a class="dropdown-item" href="/reports/tax">รายงานภาษี  </a></li> */}
              <li><NavLink className="dropdown-item bg-light" to="/reports/policy" style={{color : "black"}} onClick={(e)=>handleChangeSelected(e,7)}>รายงานบันทึกกรมธรรม์ประจำวัน </NavLink></li>
              <li><NavLink className="dropdown-item bg-light" to="/reports/endorse" style={{color : "black"}} onClick={(e)=>handleChangeSelected(e,7)}>รายงานบันทึกสลักหลัง </NavLink></li>
              <li><NavLink className="dropdown-item bg-light" to="/reports/invoice" style={{color : "black"}} onClick={(e)=>handleChangeSelected(e,7)}>รายงานบันทึกใบแจ้งหนี้ </NavLink></li>
              <li><NavLink className="dropdown-item bg-light" to="/reports/billadvisor" style={{color : "black"}} onClick={(e)=>handleChangeSelected(e,7)}>รายงานใบวางบิล </NavLink></li>
              <li><NavLink className="dropdown-item bg-light" to="/reports/cashier" style={{color : "black"}} onClick={(e)=>handleChangeSelected(e,7)}>รายงานรับเงิน </NavLink></li>
              <li><NavLink className="dropdown-item bg-light" to="/reports/arapadvisor" style={{color : "black"}} onClick={(e)=>handleChangeSelected(e,7)}>รายงานตัดหนี้/ตัดจ่าย ตัวแทน  </NavLink></li>
              <li><NavLink className="dropdown-item bg-light" to="/reports/arapdirect" style={{color : "black"}} onClick={(e)=>handleChangeSelected(e,7)}>รายงานลูกค้าจ่ายเงินที่ประกัน  </NavLink></li>
              <li><NavLink className="dropdown-item bg-light" to="/reports/arapinsurer" style={{color : "black"}} onClick={(e)=>handleChangeSelected(e,7)}>รายงานตัดหนี้/ตัดจ่าย ประกัน  </NavLink></li>
              <li><NavLink className="dropdown-item bg-light" to="/reports/tax" style={{color : "black"}} onClick={(e)=>handleChangeSelected(e,7)}>รายงานภาษี  </NavLink></li>
            </ul>
          </div>
          <div class="dropdown">
            <a class={selected[8] === 'Y'  ? "btn btn-warning dropdown-toggle" : "btn btn-primary dropdown-toggle"} href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
              ข้อมูลทั่วไป
            </a>

            <ul className={selected[8] === 'Y'  ? "dropdown-menu" :"dropdown-menu "} aria-labelledby="dropdownMenuLink">
              {/* <li><a class="dropdown-item" href="/findperson">ค้นหาบริษัทประกัน/ผู้แนะนำ</a></li>
              <li><a class="dropdown-item" href="/insurer">สร้างบริษัทรับประกัน</a></li>
              <li><a class="dropdown-item" href="/insureType">สร้างแผนประกัน</a></li>
              <li><a class="dropdown-item" href="/agent">สร้างผู้แนะนำ</a></li>
              <li><a className="dropdown-item" href="/bank">สร้างธนาคาร</a></li> */}
              <li><NavLink className="dropdown-item bg-light" to="/findperson" style={{color : "black"}} onClick={(e)=>handleChangeSelected(e,8)}>ค้นหาบริษัทประกัน/ผู้แนะนำ</NavLink></li>
              <li><NavLink className="dropdown-item bg-light" to="/insurer" style={{color : "black"}} onClick={(e)=>handleChangeSelected(e,8)}>สร้างบริษัทรับประกัน</NavLink></li>
              <li><NavLink className="dropdown-item bg-light" to="/insureType" style={{color : "black"}} onClick={(e)=>handleChangeSelected(e,8)}>สร้างแผนประกัน</NavLink></li>
              <li><NavLink className="dropdown-item bg-light" to="/agent" style={{color : "black"}} onClick={(e)=>handleChangeSelected(e,8)}>สร้างผู้แนะนำ</NavLink></li>
              <li><NavLink className="dropdown-item bg-light" to="/bank" style={{color : "black"}} onClick={(e)=>handleChangeSelected(e,8)}>สร้างธนาคาร</NavLink></li>
            </ul>
          </div>
              {/* <a class="btn btn-danger " href="/payment" role="button">
              ARAP
            </a>
             */}
            <a class="btn btn-danger " href="/" role="button" onClick={handleLogOut}>
              ออกจากระบบ
            </a>
              
             
          
            
          </NavMenu>
        </NavBar>
      </>
    );
  }
  return (
    <>
      {/* Use components from NavBar-Style */}
      <NavBar showToggle={showToggle}>
        <Bars onClick={() => setShowToggle(!showToggle)} />
        <NavLogo to="/">
          <img
            style={{ height: "70px" }}
            src={logoamity}
          />
        </NavLogo>
        <NavMenu showToggle={showToggle}>
          {/* <NavList>
            <NavLink to="/">Packages</NavLink>
          </NavList> */}
          <NavList>
            <NavLink to="/signup">Sign Up</NavLink>
          </NavList>
          <NavList>
            <NavLink to="/login">Login</NavLink>
          </NavList>
        </NavMenu>
      </NavBar>
    </>
  );
}

export default Nav;
