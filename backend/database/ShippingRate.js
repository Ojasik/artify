const mongoose = require('mongoose');

const ShippingRateSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
    unique: true
  },
  baseRate: {
    type: Number,
    required: true
  },
  perKg: {
    type: Number,
    required: true
  },
  perCubicUnit: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('ShippingRate', ShippingRateSchema);
