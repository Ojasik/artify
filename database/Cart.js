const mongoose = require('mongoose');

// Define schema for cart items
const cartSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  artwork_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artwork',
    required: true,
    unique: true
  }
});

// Create and export cart model
module.exports = mongoose.model('Cart', cartSchema);
