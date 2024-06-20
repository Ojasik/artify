const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authenticateJWT } = require('../middleware/authenticateJWT');

// Route to get all cart items for the logged-in user
router.get('/', authenticateJWT, cartController.getCartItems);

// Route to add artwork to cart
router.post('/add', authenticateJWT, cartController.addArtworkToCart);

// Route to remove artwork from cart
router.delete('/:id', authenticateJWT, cartController.removeArtworkFromCart);

module.exports = router;
