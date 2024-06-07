const express = require('express');
const router = express.Router();
const ShippingRate = require('../database/ShippingRate');
require('dotenv').config();

router.get('/', async (req, res) => {
  try {
    const shippingRates = await ShippingRate.find();
    res.json(shippingRates);
  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/calculate-shipping', async (req, res) => {
  try {
    const { country, weight, height, width, length } = req.body;

    // Convert dimensions to meters
    const volume = height * 0.01 * (width * 0.01) * (length * 0.01);

    const shippingRate = await ShippingRate.findOne({ country });
    if (!shippingRate) {
      return res.status(404).json({ message: 'Shipping rate not found for this country' });
    }

    let shippingCost = shippingRate.baseRate + shippingRate.perKg * weight;
    shippingCost += shippingRate.perCubicUnit * volume;

    res.json({ shippingCost });
  } catch (error) {
    console.error('Error calculating shipping cost:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
