const express = require('express');
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', authController.protect, productController.getAllProducts);
router.get('/:id', productController.getProduct);
router.post('/createProduct', productController.createProduct);

module.exports = router;
