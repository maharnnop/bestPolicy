const express = require("express");
const router = express.Router(); //creates a router object
const ctrl = require("../../controllers");

// router.get("path", fucntion);
router.get('/showallidcardtype', ctrl.config.showAllidcardtype);
// router.post('/', ctrl.cars.postCar);
// router.delete('/:index', ctrl.cars.removeCar);
// router.put('/:index', ctrl.cars.editCar);

module.exports = router;