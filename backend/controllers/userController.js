const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../database/User');
const Address = require('../database/Address');
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'meshkis.mark@gmail.com',
    pass: 'iyxb qpsf igjq ujmw'
  }
});

exports.register = async (req, res) => {
  try {
    const { username, firstname, lastname, email, phone, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ username }, { email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email or phone already exists' });
    }

    const emailVerificationToken = jwt.sign(
      { username, firstname, lastname, email, phone, password },
      process.env.EMAIL_VERIFICATION_SECRET,
      { expiresIn: '1h' }
    );

    const verificationLink = `https://artify-backend-0eef31091a04.herokuapp.com/api/users/verify-email?token=${emailVerificationToken}&fromEmail=true`;

    const mailOptions = {
      from: 'meshkis.mark@gmail.com',
      to: email,
      subject: 'Email Verification',
      html: `Click <a href="${verificationLink}">here</a> to verify your email address.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Failed to send verification email' });
      }
      console.log('Email sent:', info.response);

      const token = jwt.sign(
        {
          userId: newUser._id,
          username: newUser.username,
          role: newUser.role,
          firstname: newUser.firstname,
          lastname: newUser.lastname,
          phone: newUser.phone,
          email: newUser.email
        },
        process.env.JWT,
        { expiresIn: '1h' }
      );
      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 3600000, // 1 hour expiration
        sameSite: 'strict'
        // secure: true,
      });
      res.status(200).json({
        message: 'Verification email sent. Please check your email to complete registration.',
        token,
        user: {
          username: newUser.username,
          role: newUser.role,
          userId: newUser._id,
          firstname: newUser.firstname,
          lastname: newUser.lastname,
          phone: newUser.phone,
          email: newUser.email
        }
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const decodedToken = jwt.verify(token, process.env.EMAIL_VERIFICATION_SECRET);
    const { username, firstname, lastname, email, phone, password } = decodedToken;

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      firstname,
      lastname,
      email,
      phone,
      password: hashedPassword,
      role: 'Regular',
      status: 'Active'
    });

    await newUser.save();

    const authToken = jwt.sign(
      {
        userId: newUser._id,
        username: newUser.username,
        role: newUser.role,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        phone: newUser.phone,
        email: newUser.email
      },
      process.env.JWT,
      { expiresIn: '1h' }
    );

    res.cookie('token', authToken, {
      httpOnly: true,
      maxAge: 3600000,
      sameSite: 'strict'
    });

    res.redirect('https://master--artifyyy.netlify.app/');
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    if (user.status === 'Inactive') {
      return res.status(403).json({ message: 'User account is inactive' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
        firstname: user.firstname,
        lastname: user.lastname,
        phone: user.phone,
        email: user.email
      },
      process.env.JWT,
      { expiresIn: '1h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 3600000,
      sameSite: 'strict'
    });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logout successful' });
};

exports.getUsername = (req, res) => {
  try {
    const { username, role, userId, firstname, lastname, phone, email } = req.user;
    res.status(200).json({ username, role, userId, firstname, lastname, phone, email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const requestedUsername = req.params.username;
    const userProfile = await User.findOne({ username: requestedUsername }, { password: 0 });
    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    const { username, firstname, lastname, profile, created_at } = userProfile;
    const {
      description = '',
      website = '',
      x = '',
      instagram = '',
      facebook = '',
      avatar = ''
    } = profile || {};

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
};

exports.updateProfile = async (req, res) => {
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
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      username,
      firstname,
      lastname,
      email,
      phone,
      role,
      facebook,
      instagram,
      x,
      description,
      website,
      avatar
    } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.username = username;
    user.firstname = firstname;
    user.lastname = lastname;
    user.email = email;
    user.phone = phone;
    user.role = role;

    if (!user.profile) {
      user.profile = {};
    }

    user.profile.facebook = facebook;
    user.profile.instagram = instagram;
    user.profile.x = x;
    user.profile.description = description;
    user.profile.website = website;
    user.profile.avatar = avatar;

    await user.save();

    res.status(200).json({ message: 'User information updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.changeUserStatus = async (req, res) => {
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
};

exports.deleteUser = async (req, res) => {
  const username = req.params.username;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.deleteOne({ username });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.addAddress = async (req, res) => {
  try {
    const { username, address1, address2, city, state, zip, country } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newAddress = new Address({
      userId: user._id,
      address1,
      address2,
      city,
      state,
      zip,
      country
    });

    await newAddress.save();

    res.status(201).json({ message: 'Address added successfully', address: newAddress });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAddress = async (req, res) => {
  const userId = req.params.userId;

  try {
    const addresses = await Address.find({ userId });

    res.status(200).json(addresses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.changePassword = async (req, res) => {
  const { username } = req.user;
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;

    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Backend - userController.js
exports.getStripeAccountId = async (req, res) => {
  try {
    const userId = req.user.userId; // Assuming req.user contains authenticated user info
    const user = await User.findById(userId); // Fetch user from database
    if (user) {
      res.status(200).json({ stripeAccountId: user.stripeAccountId });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
