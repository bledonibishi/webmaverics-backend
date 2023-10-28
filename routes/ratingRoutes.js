const express = require('express');
const authController = require('../controllers/authController');
const ratingController = require('../controllers/ratingController');

const router = express.Router();

router.get('/', authController.protect, ratingController.getAll);
router.get(
  '/:id',
  authController.protect,
  ratingController.getRatingsWithProductId
);
router.get(
  '/user/:id',
  authController.protect,
  ratingController.getRatingsWithUserId
);
router.post('/:id', authController.protect, ratingController.createOne);

module.exports = router;
