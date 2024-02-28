const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const multer = require('multer');
const Artwork = require('../database/Artwork');
require('dotenv').config();

// Middleware to authenticate JWT
function authenticateJWT(req, res, next) {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

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
    const { title, price, category, about } = req.body;
    const { username } = req.user;

    const images = req.files.map((file) => ({ data: file.buffer, contentType: file.mimetype }));

    // Create a new artwork instance
    const newArtwork = new Artwork({
      title,
      images,
      price,
      category,
      about,
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

    // Fetch artworks for the given username from the database
    const artworks = await Artwork.find({ createdBy: username });

    // Convert image data to data URLs
    const artworksWithImageURLs = artworks.map((artwork) => {
      const imagesWithUrls = artwork.images.map((image) => ({
        data: `data:${image.contentType};base64,${image.data.toString('base64')}`,
        contentType: image.contentType
      }));

      return { ...artwork.toObject(), images: imagesWithUrls };
    });

    res.status(200).json(artworksWithImageURLs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to fetch artwork details
router.get('/:artworkId', authenticateJWT, async (req, res) => {
  try {
    const { artworkId } = req.params;

    // Fetch artwork details from the database
    const artwork = await Artwork.findById(artworkId);
    if (!artwork) {
      return res.status(404).json({ message: 'Artwork not found' });
    }

    res.status(200).json(artwork);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to update artwork information
router.put('/:artworkId', authenticateJWT, async (req, res) => {
  try {
    const { artworkId } = req.params;
    const { title, images, price, about } = req.body;

    // Update artwork information in the database
    const updatedArtwork = await Artwork.findByIdAndUpdate(
      artworkId,
      { $set: { title, images, price, about } },
      { new: true }
    );

    if (!updatedArtwork) {
      return res.status(404).json({ message: 'Artwork not found' });
    }

    res.status(200).json(updatedArtwork);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const artworks = await Artwork.find();

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
module.exports = router;
