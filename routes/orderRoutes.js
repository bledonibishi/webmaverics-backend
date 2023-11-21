const express = require('express');
const authController = require('../controllers/authController');
const orderController = require('../controllers/OrderController');
const paymentController = require('../controllers/paymentController');
const productController = require('../controllers/productController');

const router = express.Router();

router.get(
  '/getAll',
  authController.protect,
  authController.restrictTo('admin'),
  orderController.getAllOrders
);
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
router.patch(
  '/updateStatus/:orderID',
  authController.protect,
  authController.restrictTo('admin'),
  orderController.updateOrderStatus
);

module.exports = router;
