const express = require("express");
const router = express.Router(); //creates a router object
const ctrl = require("../controllers");

router.get('/test', ctrl.bill.test);
// router.post("/createCasheir",ctrl.bill.createCashier);
router.post("/findDataByBillAdvisoryNo",ctrl.bill.findDataByBillAdvisoryNo);
router.post("/findatabycashierno",ctrl.bill.findDataByCashierNo);
router.post("/findbill",ctrl.bill.findbill);
router.post("/saveCasheir",ctrl.bill.saveCashier);
router.post("/submitCasheir",ctrl.bill.submitCashier);
router.post("/editCasheir",ctrl.bill.editCashier);
router.post("/editsaveCasheir",ctrl.bill.editSaveBill);
router.post("/editsubmitCasheir",ctrl.bill.editSubmitBill);
router.get("/getbankbrand/all", ctrl.bill.getBrandall)
router.post("/getbankbranchinbrand", ctrl.bill.getBankBranchInBrand)


module.exports = router;