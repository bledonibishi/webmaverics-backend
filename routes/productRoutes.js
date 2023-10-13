const express = require('express');
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProduct);
router.post('/createProduct', productController.createProduct);
router.post('/createProductCategory', productController.createProductCategory);

// router.patch(
//   '/:id',
//   authController.protect,
//   authController.restrictTo('admin', 'lead-guide'),
//   productController.uploadProductImages,
//   productController.resizeProductImages,
//   productController.updateTour
// );

module.exports = router;
