const cron = require('node-cron');
const Cart = require('./database/Cart');
const Artwork = require('./database/Artwork');

// Define the cron job function
const removeOutdatedCartItems = async () => {
  try {
    // Calculate the timestamp 30 minutes ago
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

    // Find outdated cart items
    const outdatedCartItems = await Cart.find({ addedAt: { $lt: thirtyMinutesAgo } });

    // Iterate over each outdated cart item
    for (const cartItem of outdatedCartItems) {
      // Delete the cart item
      await Cart.deleteOne({ _id: cartItem._id });

      // Retrieve the artwork associated with the cart item
      const artwork = await Artwork.findById(cartItem.artwork_id);

      // If artwork is found, toggle its isAvailable field to true
      if (artwork) {
        artwork.isAvailable = true;
        await artwork.save();
      }
    }

    console.log('Outdated cart items removed successfully');
  } catch (error) {
    console.error('Error removing outdated cart items:', error);
  }
};

// Define the cron schedule (run every 30 minutes)
cron.schedule('*/30 * * * *', removeOutdatedCartItems);

// Export the cron job function
module.exports = removeOutdatedCartItems;
