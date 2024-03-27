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

// router.put('/:id', authenticateJWT, upload.array('images'), async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, price, category, about } = req.body;
//     const newImages = req.files.map((file) => ({ data: file.buffer, contentType: file.mimetype }));

//     const updatedArtwork = await Artwork.findByIdAndUpdate(
//       id,
//       { title, price, category, about },
//       { new: true }
//     );

//     if (!updatedArtwork) {
//       return res.status(404).json({ message: 'Artwork not found' });
//     }

//     res.status(200).json(updatedArtwork);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// router.put('/:id', authenticateJWT, upload.array('images'), async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, price, category, about } = req.body;
//     const newImages = req.files.map((file) => ({ data: file.buffer, contentType: file.mimetype }));

//     let updateObject = { title, price, category, about };

//     if (newImages.length > 0) {
//       updateObject.images = newImages;
//     }

//     const updatedArtwork = await Artwork.findByIdAndUpdate(id, updateObject, { new: true });

//     if (!updatedArtwork) {
//       return res.status(404).json({ message: 'Artwork not found' });
//     }

//     res.status(200).json(updatedArtwork);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// router.put('/:id', authenticateJWT, upload.array('images'), async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, price, category, about } = req.body;

//     // Retrieve existing artwork
//     const existingArtwork = await Artwork.findById(id);
//     const existingImages = existingArtwork.images;

//     // Map new files to an array of objects with data and contentType
//     const newImages = req.files.map((file) => ({ data: file.buffer, contentType: file.mimetype }));

//     // Combine existing and new images
//     const combinedImages = [...existingImages, ...newImages];

//     // Update artwork with new data including combined images
//     const updatedArtwork = await Artwork.findByIdAndUpdate(
//       id,
//       { title, price, category, about, images: combinedImages },
//       { new: true }
//     );

//     if (!updatedArtwork) {
//       return res.status(404).json({ message: 'Artwork not found' });
//     }

//     res.status(200).json(updatedArtwork);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

router.put('/:id', authenticateJWT, upload.array('images'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, price, category, about, removedImages } = req.body;
    const { username } = req.user;

    // Parse the removedImages array from the request body
    const parsedRemovedImages = JSON.parse(removedImages);

    // Fetch the existing artwork
    const existingArtwork = await Artwork.findById(id);

    if (existingArtwork.createdBy !== username) {
      return res
        .status(403)
        .json({ message: 'Forbidden: You are not the creator of this artwork' });
    }

    // Filter out the removed images from the existing artwork's images array
    const existingImages = existingArtwork.images.filter(
      (image, index) => !parsedRemovedImages.includes(index)
    );

    // Prepare the new images from the request
    const newImages = req.files.map((file) => ({
      data: file.buffer, // Convert buffer to base64
      contentType: file.mimetype
    }));

    // Combine the existing and new images
    const combinedImages = [...existingImages, ...newImages];

    // Update the artwork with the new information
    const updatedArtwork = await Artwork.findByIdAndUpdate(
      id,
      { title, price, category, about, images: combinedImages },
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

module.exports = router;
