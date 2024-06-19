// artworks.js
const express = require('express');
const router = express.Router();
const artworkController = require('../controllers/artworkController');
const { authenticateJWT } = require('../middleware/authenticateJWT');

// Route to add an artwork
router.post(
  '/add-artwork',
  authenticateJWT,
  artworkController.upload.array('images'),
  artworkController.addArtwork
);

// Route to get user artworks
router.get('/user/:username', artworkController.getUserArtworks);

// Route to get registry
router.get('/registry', artworkController.getRegistry);

// Route to get all artworks
router.get('/', artworkController.getAllArtworks);

// Route to update an artwork
router.put(
  '/:id',
  authenticateJWT,
  artworkController.upload.array('images'),
  artworkController.updateArtwork
);

// Route to delete an artwork
router.delete('/:id', authenticateJWT, artworkController.deleteArtwork);

// Route to verify an artwork
router.put('/:id/verify', authenticateJWT, artworkController.verifyArtwork);

// Route to reject an artwork
router.put('/:id/reject', authenticateJWT, artworkController.rejectArtwork);

module.exports = router;
