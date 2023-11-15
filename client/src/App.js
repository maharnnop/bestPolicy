import "./App.css";
import { Route, Routes, Link, Navigate } from "react-router-dom";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import Nav from "./components/NavBar/Nav";
import Index from "./components/Index/Index";
import Login from "./components/Login/Login";
import React from "react";
import Admin from "./components/Admin/Admin";
import SignUp from "./components/SignUp/SignUp";

import PolicyExcel from "./components/Policy/PolicyExcel";
import PolicyScreen from "./components/Policy/PolicyScreen";
import Footer from "./components/Footer/Footer";
import Static from "./components/Static/Static";
import Payment from "./components/Static/Payment";
import Insurer from "./components/Static/Insurer";
import InsureType from "./components/Static/insureType";
import Agent from "./components/Static/Agent";
import FindPolicy from "./components/Policy/FindPolicy";
import FindBillAdvisor from "./components/BillAdvisor/FindBillAdvisor";
import CreateBillAdvisor from "./components/BillAdvisor/CreateBillAdvisor";
import EditBillAdvisor from "./components/BillAdvisor/EditBillAdvisor";
import FindCashierReceive from "./components/CashierReceive/FindCashierReceive";
import CreateCashierReceive from "./components/CashierReceive/CreateCashierReceive";
import EditCashierReceive from "./components/CashierReceive/EditCashierReceive";
import Bank from "./components/Static/Bank";
import PremInCreate from "./components/PremIn/PremInCreate";
import PremInCreateDirect from "./components/PremIn/PremInCreateDirect";
import PremInPaid from "./components/PremIn/PremInPaid";
import PremInSreach from "./components/PremIn/PremInSearch";
import PolicyReconcile from "./components/Policy/PolicyReconcile";
import PremOutCreate from "./components/PremOut/PremOutCreate";
import CommInCreate from "./components/CommIn/CommInCreate";
import CommOutCreate from "./components/CommOut/CommOutCreate";
import ReportPolicy from "./components/Reports/ReportPolicy";
import ReportEndorse from "./components/Reports/ReportEndorse";
import ReportInvoice from "./components/Reports/ReportInvoice";
import ReportฺBilladvisor from "./components/Reports/ReportฺBilladvisor";
import ReportฺCashier from "./components/Reports/ReportฺCashier";
import ReportฺARAPAdvisor from "./components/Reports/ReportฺARAPAdvisor";
import ReportฺARAPDirect from "./components/Reports/ReportฺARAPDirect";
import ReportฺARAPInsurer from "./components/Reports/ReportฺARAPInsurer";
import ReportฺTax from "./components/Reports/ReportฺTax";
import EndorseScreen from "./components/Policy/EndorseScreen";
import FindPerson from "./components/Static/FindPerson";
import { type } from "@testing-library/user-event/dist/type";


function App() {
  return (
    <div className="App">
      <header>
        <Nav />
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/admin" element={<Admin />} /> */}
          {/* <Route path="/signup" element={<SignUp />} /> */}
          {/* <Route path="/payment" element={<Payment />} /> */}
          <Route path="/insurer" element={<Insurer />} />
          <Route path="/insuretype" element={<InsureType />} />
          <Route path="/agent" element={<Agent />} />
          <Route path="/findperson" element={<FindPerson />} />
          <Route path="/editagent/:agentCode" element={<Agent />} />
          <Route path="/editinsurer/:insurerCode" element={<Insurer />} />
          {/* <Route path="/static" element={<Static />} /> */}
          <Route path="/bank" element={<Bank />} />
          {/* <Route path="/static/:name" element={<Static />} /> */}
          <Route path="/findpolicy" element={<FindPolicy />} />
          <Route path="/policyexcel" element={<PolicyExcel />} />
          <Route path="/policyscreen" element={<PolicyScreen />} />
          <Route path="/endorse" element={<EndorseScreen />} />
          <Route path="bill/findbill" element={<FindBillAdvisor />} />
          <Route path="bill/createbill" element={<CreateBillAdvisor />} />
          <Route path="bill/editbill/:billno" element={<EditBillAdvisor />} />
          <Route path="cashier/findcashier" element={<FindCashierReceive />} />
          <Route path="cashier/createcashier/:txtype" element={<CreateCashierReceive />} />
          <Route path="cashier/editcashier" element={<EditCashierReceive />} />
          <Route path="premin/find" element={<PremInSreach/>} />
          <Route path="premin/create" element={<PremInCreate />} />
          <Route path="premin/createdirect" element={<PremInCreateDirect />} />
          <Route path="premin/paid/:type" element={<PremInPaid />} />
          <Route path="/policyreconcile" element={<PolicyReconcile />} />
          <Route path="premout/create" element={<PremOutCreate />} />
          <Route path="commin/create" element={<CommInCreate />} />
          <Route path="commout/create" element={<CommOutCreate />} />
          {/* w8 api report */}
          <Route path="reports/policy" element={<ReportPolicy />} />
          <Route path="reports/endorse" element={<ReportEndorse />} />
          <Route path="reports/invoice" element={<ReportInvoice />} />
          <Route path="reports/billadvisor" element={<ReportฺBilladvisor />} />
          <Route path="reports/cashier" element={<ReportฺCashier />} />
          <Route path="reports/arapadvisor" element={<ReportฺARAPAdvisor />} />
          <Route path="reports/arapdirect" element={<ReportฺARAPDirect />} />
          <Route path="reports/arapinsurer" element={<ReportฺARAPInsurer />} />
          <Route path="reports/tax" element={<ReportฺTax />} />
        </Routes>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default App;
