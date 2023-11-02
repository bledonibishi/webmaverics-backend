const express = require('express');
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/relatedProducts/:id', productController.findRelatedProducts);
router.get('/', productController.getAllProducts);
router.get('/categories', productController.getAllProductCategories);
router.get('/:id', productController.getProduct);
router.post(
  '/createProduct',
  productController.uploadProductImages,
  productController.resizeProductImages,
  productController.createProduct
);
router.post(
  '/test/test',
  productController.uploadProductImages,
  productController.resizeProductImages,
  productController.test
);
router.post('/createProductCategory', productController.createProductCategory);

router.patch(
  '/:id',
  //   authController.protect,
  //   authController.restrictTo('admin', 'lead-guide'),
  productController.uploadProductImages,
  productController.resizeProductImages,
  productController.updateProduct
);

module.exports = router;
