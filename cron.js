// const cron = require('node-cron');
// const Cart = require('./database/Cart');

// // Define the cron job function
// const removeOutdatedCartItems = async () => {
//   try {
//     // Calculate the timestamp 30 minutes ago
//     const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

//     // Remove outdated cart items
//     await Cart.deleteMany({ addedAt: { $lt: thirtyMinutesAgo } });
//     console.log('Outdated cart items removed successfully');
//   } catch (error) {
//     console.error('Error removing outdated cart items:', error);
//   }
// };

// // Define the cron schedule
// cron.schedule('* * * * *', removeOutdatedCartItems);

// // Export the cron job function
// module.exports = removeOutdatedCartItems;

const cron = require('node-cron');
const Cart = require('./database/Cart');
const Artwork = require('./database/Artwork');

// Define the cron job function
const removeOutdatedCartItems = async () => {
  try {
    // Calculate the timestamp 1 minute ago
    const oneMinuteAgo = new Date(Date.now() - 1 * 60 * 1000);

    // Find outdated cart items
    const outdatedCartItems = await Cart.find({ addedAt: { $lt: oneMinuteAgo } });

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

// Define the cron schedule (run every minute)
cron.schedule('* * * * *', removeOutdatedCartItems);

// Export the cron job function
module.exports = removeOutdatedCartItems;
