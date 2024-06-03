const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const multer = require('multer');
const Artwork = require('../database/Artwork');
require('dotenv').config();

// Middleware to authenticate JWT
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

const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } }); // Limit file size to 5MB

// Route to add an artwork
router.post('/add-artwork', authenticateJWT, upload.array('images'), async (req, res) => {
  try {
    const { title, price, category, about, commission, netEarnings, weight, size } = req.body;
    const { username } = req.user;

    const images = req.files.map((file) => ({ data: file.buffer, contentType: file.mimetype }));

    // Create a new artwork instance
    const newArtwork = new Artwork({
      title,
      images,
      price,
      category,
      about,
      commission, // Add commission to artwork object
      netEarnings,
      weight,
      size: {
        length: size.length,
        width: size.width,
        height: size.height
      },
      createdBy: username
    });

    // Save the artwork to the database
    await newArtwork.save();

    res.status(201).json({ message: 'Artwork added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/user/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const {
      page = 1,
      limit = 10,
      status,
      sort,
      category,
      search,
      minPrice,
      maxPrice,
      startDate,
      endDate
    } = req.query;

    const parsedPage = parseInt(page, 10);
    const parsedLimit = parseInt(limit, 10);

    // Calculate the number of documents to skip
    const skip = (parsedPage - 1) * parsedLimit;

    // Construct the query object
    const query = { createdBy: username };

    console.log('Statuses received:', status);

    // If status is provided, add it to the query
    if (status) {
      // Split the comma-separated string into an array
      const statusesArray = status.split(',');

      // Add the statuses array to the query using $in operator
      query.status = { $in: statusesArray };
    }

    // If category is provided, add it to the query
    if (category) {
      const categoriesArray = category.split(',');

      query.category = { $in: categoriesArray };
    }

    // If search query is provided, add it to the query
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // If price range is provided, add it to the query
    if (minPrice && maxPrice) {
      query.price = { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) };
    }

    // If date range is provided, add it to the query
    if (startDate && endDate) {
      query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    // Define sort options
    const sortOptions = {};
    if (sort) {
      if (sort === 'asc') {
        sortOptions.price = 1; // Sort by price in ascending order
      } else if (sort === 'desc') {
        sortOptions.price = -1; // Sort by price in descending order
      } else if (sort === 'date_asc') {
        sortOptions.createdAt = 1; // Sort by date in ascending order
      } else if (sort === 'date_desc') {
        sortOptions.createdAt = -1; // Sort by date in descending order
      }
    }

    // Fetch artworks for the given username from the database with pagination and optional status filter
    const artworks = await Artwork.find(query).sort(sortOptions).skip(skip).limit(parsedLimit);

    // Fetch the total count of artworks for the given username and optional status filter
    const totalArtworks = await Artwork.countDocuments(query);

    // Convert image data to data URLs
    const artworksWithImageURLs = artworks.map((artwork) => {
      const imagesWithUrls = artwork.images.map((image) => ({
        data: `data:${image.contentType};base64,${image.data.toString('base64')}`,
        contentType: image.contentType
      }));

      return { ...artwork.toObject(), images: imagesWithUrls };
    });

    res.status(200).json({ artworks: artworksWithImageURLs, total: totalArtworks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const artworks = await Artwork.find({ isAvailable: true });

    const artworksImagesURL = artworks.map((artwork) => {
      const imagesURL = artwork.images.map((image) => ({
        data: `data:${image.contentType};base64,${image.data.toString('base64')}`,
        contentType: image.contentType
      }));

      return { ...artwork.toObject(), images: imagesURL };
    });

    res.status(200).json(artworksImagesURL);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/:id', authenticateJWT, upload.array('images'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, price, category, about, removedImages } = req.body;
    const { username } = req.user;

    // Fetch the existing artwork
    const existingArtwork = await Artwork.findById(id);

    if (existingArtwork.createdBy !== username) {
      return res
        .status(403)
        .json({ message: 'Forbidden: You are not the creator of this artwork' });
    }

    // Filter out the removed images from the existing artwork's images array
    const updatedImages = existingArtwork.images.filter(
      (_, index) => !removedImages.includes(index)
    );

    // Prepare the new images from the request
    const newImages = req.files.map((file) => ({
      data: file.buffer, // Convert buffer to base64
      contentType: file.mimetype
    }));

    // Combine the existing and new images
    const combinedImages = [...updatedImages, ...newImages];

    // Update the artwork with the new information
    const updatedArtwork = await Artwork.findByIdAndUpdate(
      id,
      { title, price, category, about, images: combinedImages, status: 'Uploaded' },
      { new: true }
    );

    if (!updatedArtwork) {
      return res.status(404).json({ message: 'Artwork not found' });
    }

    // Convert image data to data URLs
    const updatedArtworkWithImageURLs = {
      ...updatedArtwork.toObject(),
      images: updatedArtwork.images.map((image) => ({
        data: `data:${image.contentType};base64,${image.data.toString('base64')}`,
        contentType: image.contentType
      }))
    };

    res.status(200).json(updatedArtworkWithImageURLs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/:id', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.user;

    // Find the artwork in the database
    const artwork = await Artwork.findById(id);

    // Check if the artwork exists
    if (!artwork) {
      return res.status(404).json({ message: 'Artwork not found' });
    }

    // Check if the authenticated user is the creator of the artwork
    if (artwork.createdBy !== username) {
      return res
        .status(403)
        .json({ message: 'Forbidden: You are not the creator of this artwork' });
    }

    // Delete the artwork from the database
    const result = await Artwork.deleteOne({ _id: id });

    // Check if the artwork was successfully deleted
    if (result.deletedCount === 0) {
      return res.status(500).json({ message: 'Failed to delete artwork' });
    }

    res.status(200).json({ message: 'Artwork deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/:id/verify', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the artwork by ID
    const artwork = await Artwork.findById(id);

    if (!artwork) {
      return res.status(404).json({ message: 'Artwork not found' });
    }

    // Update the status to 'Verified'
    artwork.status = 'Verified';
    await artwork.save();

    res.status(200).json({ message: 'Artwork verified successfully', artwork });
  } catch (error) {
    console.error('Error verifying artwork:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/:id/reject', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    // Fetch the artwork by ID
    const artwork = await Artwork.findById(id);

    if (!artwork) {
      return res.status(404).json({ message: 'Artwork not found' });
    }

    // Update the artwork's status to 'Rejected' and save the rejection reason
    artwork.status = 'Rejected';
    artwork.rejectionReason = rejectionReason;
    await artwork.save();

    res.status(200).json({ message: 'Artwork rejected successfully', artwork });
  } catch (error) {
    console.error('Error rejecting artwork:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
