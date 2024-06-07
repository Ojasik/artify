const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Order = require('../database/Order');
const User = require('../database/User');
const Artwork = require('../database/Artwork');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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

router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'username').populate('artworks');
    const ordersWithBase64Images = await Promise.all(
      orders.map(async (order) => {
        const artworks = await Promise.all(
          order.artworks.map(async (artworkId) => {
            const artwork = await Artwork.findById(artworkId);
            const base64Images = await Promise.all(
              artwork.images.map(async (image) => ({
                data: `data:${image.contentType};base64,${image.data.toString('base64')}`,
                contentType: image.contentType
              }))
            );
            return { ...artwork.toObject(), images: base64Images };
          })
        );
        return { ...order.toObject(), artworks };
      })
    );
    res.json(ordersWithBase64Images);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/create-order', authenticateJWT, async (req, res) => {
  try {
    const { userId } = req.user;

    const {
      artworks,
      totalPrice,
      shippingCost,
      country,
      firstName,
      lastName,
      address,
      apartment,
      city,
      postalCode,
      phone,
      email
    } = req.body;

    console.log(req.body);

    const newOrder = new Order({
      userId,
      artworks,
      totalPrice,
      shippingCost,
      country,
      firstName,
      lastName,
      address,
      apartment,
      city,
      postalCode,
      phone,
      email
    });

    const savedOrder = await newOrder.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

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

// Save bank details and create a Stripe connected account
router.post('/create-connect-account', authenticateJWT, async (req, res) => {
  try {
    const { userId } = req.user; // Assuming you have user ID in req.user

    // Retrieve test data provided by Stripe for Latvia
    const testData = {
      individual: {
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        dob: {
          day: 1,
          month: 1,
          year: 1980
        },
        address: {
          line1: '123 Test St',
          city: 'Test City',
          postal_code: '1234',
          country: 'LV'
        }
      },
      business_type: 'individual',
      tos_acceptance: {
        date: Math.floor(Date.now() / 1000),
        ip: req.ip
      }
    };

    // Create a Stripe Connect account using test data
    const account = await stripe.accounts.create({
      type: 'custom',
      country: 'LV',
      requested_capabilities: ['card_payments', 'transfers'],
      business_type: testData.business_type,
      individual: testData.individual,
      tos_acceptance: testData.tos_acceptance
    });

    // Attach bank account to the Stripe Connect account
    const bankAccountToken = await stripe.tokens.create({
      bank_account: {
        country: 'LV',
        currency: 'eur',
        account_holder_name: 'Test User',
        account_holder_type: 'individual',
        account_number: 'LV80BANK0000435195001' // Test account number provided by Stripe
      }
    });

    await stripe.accounts.createExternalAccount(account.id, {
      external_account: bankAccountToken.id
    });

    // Save the account ID in your database
    const user = await User.findById(userId);
    user.stripeAccountId = account.id;
    await user.save();

    res
      .status(200)
      .json({ message: 'Stripe Connect account created successfully', accountId: account.id });
  } catch (error) {
    console.error('Error creating Stripe Connect account:', error);
    res.status(500).json({ message: 'Error creating Stripe Connect account' });
  }
});

module.exports = router;
