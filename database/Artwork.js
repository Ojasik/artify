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
  status: { type: String, enum: ['uploaded', 'verified', 'sold'], default: 'uploaded' },
  category: {
    type: String,
    enum: ['painting', 'sculpture', 'literature'],
    required: true
  },
  createdBy: { type: String, required: true }
});

// Create and export artwork model
module.exports = mongoose.model('Artwork', artworkSchema);
