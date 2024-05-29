const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../database/User');
require('dotenv').config();

function authenticateJWT(req, res, next) {
  const token = req.cookies.token;

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

    const emptyProfile = {
      description: '',
      website: '',
      x: '',
      instagram: '',
      facebook: '',
      avatar: ''
    };

    // Create a new user instance
    const newUser = new User({
      username,
      firstname,
      lastname,
      email,
      password,
      role: 'Regular',
      status: 'Active',
      profile: emptyProfile
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

    if (user.status === 'Inactive') {
      return res.status(403).json({ message: 'User account is inactive' });
    }

    // Check if the password is correct
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT,
      {
        expiresIn: '1h' // Token expires in 1 hour
      }
    );

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 3600000, // 1 hour expiration
      sameSite: 'strict'
      // secure: true,
    });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logout successful' });
});

// router.get('/profile', authenticateJWT, async (req, res) => {
//   try {
//     const { username } = req.user;

//     // Fetch user profile information from the database
//     const userProfile = await User.findOne({ username }, { password: 0 }); // Exclude password field
//     if (!userProfile) {
//       return res.status(404).json({ message: 'User profile not found' });
//     }

//     // Destructure user profile data
//     const { firstname, lastname, profile, created_at } = userProfile;

//     // Extract additional profile information
//     const { description = '', website = '', x = '', instagram = '', facebook = '' } = profile || {};

//     // Return the desired information
//     res.status(200).json({
//       username,
//       firstname,
//       lastname,
//       description,
//       website,
//       x,
//       instagram,
//       facebook,
//       created_at
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

router.get('/get-username', authenticateJWT, async (req, res) => {
  try {
    const { username, role } = req.user; // Extract username from the authenticated user object
    res.status(200).json({ username, role }); // Send the username in the response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/profile/:username', async (req, res) => {
  try {
    const requestedUsername = req.params.username;

    // Fetch user profile information from the database
    const userProfile = await User.findOne({ username: requestedUsername }, { password: 0 }); // Exclude password field
    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    // Destructure user profile data
    const { username, firstname, lastname, profile, created_at } = userProfile;

    // Extract additional profile information
    const {
      description = '',
      website = '',
      x = '',
      instagram = '',
      facebook = '',
      avatar = ''
    } = profile || {};

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
      avatar,
      created_at
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/profile', authenticateJWT, async (req, res) => {
  try {
    const { username } = req.user;
    const { description, website, x, instagram, facebook, firstName, lastName, avatar } = req.body;

    const updatedProfile = await User.findOneAndUpdate(
      { username },
      {
        $set: {
          firstname: firstName,
          lastname: lastName,
          'profile.description': description,
          'profile.website': website,
          'profile.x': x,
          'profile.instagram': instagram,
          'profile.facebook': facebook,
          'profile.avatar': avatar
        }
      },
      { new: true, fields: { password: 0 } }
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    res.status(200).json({ updatedProfile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/', authenticateJWT, async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/user/:id', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      username,
      firstname,
      lastname,
      email,
      role,
      facebook,
      instagram,
      x,
      description,
      website,
      avatar
    } = req.body;

    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's information
    user.username = username;
    user.firstname = firstname;
    user.lastname = lastname;
    user.email = email;
    user.role = role;
    user.profile.facebook = facebook;
    user.profile.instagram = instagram;
    user.profile.x = x;
    user.profile.description = description;
    user.profile.website = website;
    user.profile.avatar = avatar;

    // Save the updated user
    await user.save();

    res.status(200).json({ message: 'User information updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to change user's status in user registry
router.put('/:username/:status', authenticateJWT, async (req, res) => {
  const { username, status } = req.params;

  try {
    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.status = status === 'disable' ? 'Inactive' : 'Active';

    await user.save();

    res.status(200).json({
      message: `User ${status === 'disable' ? 'disabled' : 'enabled'} successfully`,
      user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/:username', async (req, res) => {
  const username = req.params.username;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const result = await User.deleteOne({ username: username });

    if (result.deletedCount === 0) {
      return res.status(500).json({ message: 'Failed to delete user' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
