const express = require('express');
const wishlistController = require('../controllers/wishlistController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', authController.protect, wishlistController.getAllProducts);
router.post('/create', authController.protect, wishlistController.createOne);
router.delete('/delete', authController.protect, wishlistController.deleteOne);
router.delete(
  '/deleteAll',
  authController.protect,
  wishlistController.deleteAll
);

module.exports = router;
