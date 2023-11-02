const express = require('express');
const cartController = require('../controllers/cartController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', authController.protect, cartController.getCartProducts);
// router.get('/', authController.protect, cartController.getAllProducts);
router.post('/addToCart', authController.protect, cartController.addToCart);
router.delete(
  '/:productId',
  authController.protect,
  cartController.removeProduct
);
router.patch(
  '/:productId',
  authController.protect,
  cartController.decreaseProductQuantity
);
router.delete('/clear/cart', authController.protect, cartController.clearCart);

module.exports = router;
