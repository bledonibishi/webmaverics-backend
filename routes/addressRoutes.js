const express = require('express');
const authController = require('../controllers/authController');
const addressController = require('../controllers/addressController');

const router = express.Router();
router.get('/', authController.protect, addressController.getAll);
router.get('/:id', authController.protect, addressController.getOne);
router.patch('/:id', authController.protect, addressController.updateOne);
router.post('/', authController.protect, addressController.addOne);
router.delete('/:id', authController.protect, addressController.deleteOne);

module.exports = router;
