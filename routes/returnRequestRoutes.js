const express = require('express');
const authController = require('../controllers/authController');
const returnRequestController = require('../controllers/returnRequestController');

const router = express.Router();

router.get(
  '/',
  authController.protect,
  authController.restrictTo('admin'),
  returnRequestController.findAll
);

router.get(
  '/user',
  authController.protect,
  returnRequestController.findWithUser
);
router.post('/', authController.protect, returnRequestController.createOne);
router.patch(
  '/',
  authController.protect,
  authController.restrictTo('admin'),
  returnRequestController.updateOne
);
router.patch(
  '/updateStatus/:returnRequestId',
  authController.protect,
  authController.restrictTo('admin'),
  returnRequestController.updateStatus
);

module.exports = router;
