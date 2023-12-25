const mongoose = require('mongoose');

// Define user schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['regular', 'admin', 'moderator'],
    default: 'regular'
  },
  created_at: { type: Date, default: Date.now }
});

// Create and export user model
module.exports = mongoose.model('User', userSchema);
