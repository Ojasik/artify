const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String
});

const artworkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  images: [imageSchema], // Array to store multiple images
  price: {
    type: Number,
    required: true
  },
  about: {
    type: String,
    required: true
  },
  status: { type: String, enum: ['Uploaded', 'Verified', 'Sold'], default: 'Uploaded' },
  isAvailable: { type: Boolean, default: true },
  category: {
    type: String,
    enum: ['Painting', 'Sculpture', 'Literature'],
    required: true
  },
  createdBy: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create and export artwork model
module.exports = mongoose.model('Artwork', artworkSchema);
