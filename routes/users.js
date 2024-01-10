const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../database/User');
require('dotenv').config();

function authenticateJWT(req, res, next) {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    req.user = user;
    next();
  });
}

router.post('/register', async (req, res) => {
  try {
    const { username, firstname, lastname, email, password } = req.body;

    // Check if the username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Create a new user instance
    const newUser = new User({
      username,
      firstname,
      lastname,
      email,
      password,
      role: 'regular'
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Check if the password is correct
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ username: user.username, role: user.role }, process.env.JWT, {
      expiresIn: '1h' // Token expires in 1 hour
    });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/profile', authenticateJWT, async (req, res) => {
  try {
    const { username } = req.user;

    // Fetch user profile information from the database
    const userProfile = await User.findOne({ username }, { password: 0 }); // Exclude password field
    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    // Destructure user profile data
    const { firstname, lastname, profile, created_at } = userProfile;

    // Extract additional profile information
    const { description = '', website = '', x = '', instagram = '', facebook = '' } = profile || {};

    // Return the desired information
    res.status(200).json({
      username,
      firstname,
      lastname,
      description,
      website,
      x,
      instagram,
      facebook,
      created_at
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;