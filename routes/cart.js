const express = require('express');
const router = express.Router();
const Cart = require('../database/Cart');
const Artwork = require('../database/Artwork');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware to authenticate JWT
function authenticateJWT(req, res, next) {
  const token = req.cookies.token;

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

    const artwork = await Artwork.findById(artwork_id);

    // Check if the artwork is available for purchase
    if (!artwork.isAvailable) {
      return res.status(400).json({ msg: 'Artwork is not available for purchase' });
    }

    // Update the availability status of the artwork
    artwork.isAvailable = false;
    await artwork.save();

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

router.delete('/:id', authenticateJWT, async (req, res) => {
  try {
    const itemId = req.params.id;

    // Check if the cart item exists
    const cartItem = await Cart.findById(itemId);
    if (!cartItem) {
      return res.status(404).json({ msg: 'Cart item not found' });
    }

    console.log('CartItem User ID:', cartItem.user_id);
    console.log('Request User ID:', req.userId);

    // Check if the cart item belongs to the logged-in user
    if (req.userId !== cartItem.user_id.toString()) {
      return res.status(403).json({ msg: 'Forbidden' });
    }

    // Find the artwork associated with the cart item
    const artwork = await Artwork.findById(cartItem.artwork_id);
    if (!artwork) {
      return res.status(404).json({ msg: 'Artwork not found' });
    }

    // Update the availability status of the artwork
    artwork.isAvailable = true;
    await artwork.save();

    // Remove the cart item from the database
    await cartItem.deleteOne();

    res.json({ msg: 'Artwork removed from cart successfully' });
  } catch (error) {
    console.error('Error removing artwork from cart:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
