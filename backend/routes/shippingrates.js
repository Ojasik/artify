const express = require('express');
const router = express.Router();
const shippingRateController = require('../controllers/shippingRateController');

// GET all shipping rates
router.get('/', shippingRateController.getAllShippingRates);

// POST calculate shipping cost
router.post('/calculate-shipping', shippingRateController.calculateShippingCost);

module.exports = router;
