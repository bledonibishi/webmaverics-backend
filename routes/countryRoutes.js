const express = require('express');
const countryController = require('../controllers/countryController');

const router = express.Router();

router.get('/', countryController.getAll);

router.post('/addCountry', countryController.addCountry);
router.post('/addCity', countryController.addCity);

module.exports = router;
