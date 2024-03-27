const express = require('express');
const router = express.Router();
const Cart = require('../database/Cart');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware to authenticate JWT
function authenticateJWT(req, res, next) {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, process.env.JWT, (err, decodedToken) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Extract the user ID from the decoded token
    const userId = decodedToken.userId;

    // Attach the user ID to the request object
    req.userId = userId;
    next();
  });
}

router.get('/', authenticateJWT, async (req, res) => {
  try {
    // Fetch cart items for the logged-in user
    const cartItems = await Cart.find({ user_id: req.userId }).populate('artwork_id');

    // Convert image data to URLs
    const cartItemsWithUrls = cartItems.map((cartItem) => {
      const artwork = cartItem.artwork_id;
      const imagesWithUrls = artwork.images.map((image) => ({
        data: `data:${image.contentType};base64,${image.data.toString('base64')}`,
        contentType: image.contentType
      }));

      return {
        ...cartItem.toObject(),
        artwork_id: { ...artwork.toObject(), images: imagesWithUrls }
      };
    });

    res.status(200).json(cartItemsWithUrls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/add', authenticateJWT, async (req, res) => {
  try {
    // Extract user ID from authenticated user
    const userId = req.userId;

    // Extract artwork ID from request body
    const { artwork_id } = req.body;

    // Check if the artwork is already in the user's cart
    const existingCartItem = await Cart.findOne({ user_id: userId, artwork_id });

    if (existingCartItem) {
      return res.status(400).json({ msg: 'Artwork already exists in cart' });
    }

    // Create a new cart item
    const cartItem = new Cart({
      user_id: userId,
      artwork_id
    });

    // Save the cart item to the database
    await cartItem.save();

    res.json({ msg: 'Artwork added to cart successfully' });
  } catch (error) {
    console.error('Error adding artwork to cart:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
