const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String
});

const sizeSchema = new mongoose.Schema({
  length: {
    type: Number,
    required: true,
    min: 0
  },
  width: {
    type: Number,
    required: true,
    min: 0
  },
  height: {
    type: Number,
    required: true,
    min: 0
  }
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
  status: {
    type: String,
    enum: ['Uploaded', 'Verified', 'Sold', 'Rejected', 'In Order'],
    default: 'Uploaded'
  },
  isAvailable: { type: Boolean, default: true },
  category: {
    type: String,
    enum: ['Painting', 'Sculpture', 'Literature'],
    required: true
  },
  commission: {
    type: Number,
    default: 0
  },
  netEarnings: {
    type: Number,
    default: 0
  },
  rejectionReason: {
    type: String
  },
  weight: {
    type: Number,
    required: true,
    min: 0
  },
  size: {
    type: sizeSchema,
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
