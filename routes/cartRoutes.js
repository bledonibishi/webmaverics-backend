const express = require('express');
const cartController = require('../controllers/cartController');

const router = express.Router();

router.get('/', cartController.getAllProducts);
router.post('/addToCart', cartController.addToCart);

module.exports = router;
