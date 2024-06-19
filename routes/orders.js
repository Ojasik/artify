const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateJWT } = require('../middleware/authenticateJWT');

// GET all orders
router.get('/', authenticateJWT, orderController.getAllOrders);

// GET orders for user profile
router.get('/orders-profile/', authenticateJWT, orderController.getOrdersByUserProfile);

// POST create a new order
router.post('/create-order', authenticateJWT, orderController.createOrder);

// POST create a payment intent
router.post('/create-payment-intent', orderController.createPaymentIntent);

// POST create a Stripe Connect account
router.post('/create-connect-account', authenticateJWT, orderController.createConnectAccount);

// PUT update order status
router.put('/update-order-status/:orderId', authenticateJWT, orderController.updateOrderStatus);

// POST send money for an artwork
router.post('/send-money/:artworkId', authenticateJWT, orderController.sendMoney);

module.exports = router;
