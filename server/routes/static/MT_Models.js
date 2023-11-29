const express = require("express");
const router = express.Router(); //creates a router object
const ctrl = require("../../controllers");

// router.get("path", fucntion);
router.get('/all', ctrl.MT_Models.showAll);
router.post('/search', ctrl.MT_Models.showAllinBrand);
router.get('/brand/:index', ctrl.MT_Models.searchByinModel);
router.post('/showallspecinmodel', ctrl.MT_Models.showAllSpecinModel);


// router.get('/:index', ctrl.amphurs.showAllinProvince);
// router.post('/', ctrl.cars.postCar);
// router.delete('/:index', ctrl.cars.removeCar);
// router.put('/:index', ctrl.cars.editCar);

module.exports = router;