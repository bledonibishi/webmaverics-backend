const express = require('express');
const authController = require('../controllers/authController');
const orderController = require('../controllers/OrderController');

const router = express.Router();

router.get('/user', authController.protect, orderController.getOrderWithUserID);
router.post('/', authController.protect, orderController.createOne);

module.exports = router;
