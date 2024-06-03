const express = require('express');
const router = express.Router();
const Order = require('../database/Order');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Route to create a payment intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency, payment_method_id } = req.body;

    // Create a payment intent with the given amount, currency, and payment method
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method: payment_method_id // Attach the payment method ID here
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
