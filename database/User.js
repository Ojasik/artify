const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const profileSchema = new mongoose.Schema({
  // Fields for user profile
  description: { type: String, default: '' },
  website: { type: String },
  x: { type: String },
  instagram: { type: String },
  facebook: { type: String },
  avatar: { type: String }
});

// Define user schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['Regular', 'Admin', 'Moderator'],
    default: 'Regular'
  },
  created_at: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['Active', 'Inactive']
  },
  profile: profileSchema
});

// Password hash
userSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10); // Add random 10 symbols string to the hashed password
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword; // Original password is replaced by hashed
    next();
  } catch (error) {
    next(error);
  }
});

// Create and export user model
module.exports = mongoose.model('User', userSchema);
