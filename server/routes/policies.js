const express = require("express");
const router = express.Router(); //creates a router object
const ctrl = require("../controllers");

// router.get("path", fucntion);
router.post('/policynew', ctrl.policies.newPolicy);
router.post('/policynew/batch', ctrl.policies.newPolicyList);
router.post('/policydraft/batch', ctrl.policies.draftPolicyList);
router.post('/policyedit/batch', ctrl.policies.editPolicyList);
router.post('/findpolicy', ctrl.policies.findPolicy);
router.get('/transectionget/:id', ctrl.policies.getTransactionByid);
router.post('/policygetlist', ctrl.policies.getPolicyList);


// router.post('/', ctrl.cars.postCar);
// router.delete('/:index', ctrl.cars.removeCar);
// router.put('/:index', ctrl.cars.editCar);

module.exports = router;