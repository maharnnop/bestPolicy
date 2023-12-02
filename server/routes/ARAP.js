const express = require("express");
const router = express.Router(); //creates a router object
const ctrl = require("../controllers");

// router.get("path", fucntion);
router.post('/getbilldata', ctrl.arap.getbilldata);
router.post('/getcashierdata', ctrl.arap.getcashierdata);
router.post('/savearpremin', ctrl.arap.saveARPremin);
router.post('/submitarpremin', ctrl.arap.submitARPremin);
router.post('/getartrans', ctrl.arap.getARtrans);
router.post('/getartransdirect', ctrl.arap.findARPremInDirect);
router.post('/savearpremindirect', ctrl.arap.saveARPreminDirect);
router.post('/submitarpremindirect', ctrl.arap.submitARPreminDirect);
router.post('/getaptrans', ctrl.arap.findAPPremOut);
router.post('/saveappremout', ctrl.arap.saveAPPremOut);
router.post('/submitappremout', ctrl.arap.submitAPPremOut);
router.post('/getarpremindata', ctrl.arap.getARPremindata);

router.post('/getarcommin', ctrl.arap.findARCommIn);
router.post('/savearcommin', ctrl.arap.saveARCommIn);
router.post('/submitarcommin', ctrl.arap.submitARCommIn);
router.post('/getapcommout', ctrl.arap.findAPCommOut);
router.post('/saveapcommout', ctrl.arap.saveAPCommOut);
router.post('/submitapcommout', ctrl.arap.submitAPCommOut);
router.post('/getaraptransall', ctrl.arap.getARAPtransAll);





module.exports = router;