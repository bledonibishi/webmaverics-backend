const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.get('/refreshToken', authController.handleRefreshToken);

router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updateMyPassword
);

router.patch('/updateMe', authController.protect, userController.updateMe);

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);

module.exports = router;
