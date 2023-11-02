const express = require('express');
const authController = require('../controllers/authController');
const orderController = require('../controllers/OrderController');
const paymentController = require('../controllers/paymentController');
const productController = require('../controllers/productController');

const router = express.Router();

router.get(
  '/',
  paymentController.createPaymentCheckout,
  authController.protect,
  orderController.getOrderWithUserID
);
router.get(
  '/orderCode/:orderCode',
  authController.protect,
  orderController.getWithOrderCode
);
router.get('/user', authController.protect, orderController.getOrderWithUserID);
router.post('/', authController.protect, orderController.createOne);

module.exports = router;
