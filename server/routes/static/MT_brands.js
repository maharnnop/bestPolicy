const express = require("express");
const router = express.Router(); //creates a router object
const ctrl = require("../../controllers");

// router.get("path", fucntion);
router.get('/all', ctrl.MT_Brands.showAll);
router.get('/search/:para/:value', ctrl.MT_Brands.searchByinBrand);
router.get('/getallvc', ctrl.MT_Brands.getallVC);
router.post('/getccbyvc', ctrl.MT_Brands.getCCbyVC);
// router.get('/:index', ctrl.amphurs.showAllinProvince);
// router.post('/', ctrl.cars.postCar);
// router.delete('/:index', ctrl.cars.removeCar);
// router.put('/:index', ctrl.cars.editCar);

module.exports = router;