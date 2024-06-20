const multer = require('multer');
const Artwork = require('../database/Artwork');
require('dotenv').config();

const storage = multer.memoryStorage(); // Store files in memory
exports.upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } }); // Limit file size to 5MB

// Controller functions
exports.addArtwork = async (req, res) => {
  try {
    const { title, price, category, about, commission, netEarnings, weight, size } = req.body;
    const { username } = req.user;

    const images = req.files.map((file) => ({ data: file.buffer, contentType: file.mimetype }));

    const newArtwork = new Artwork({
      title,
      images,
      price,
      category,
      about,
      commission,
      netEarnings,
      weight,
      size: {
        length: size.length,
        width: size.width,
        height: size.height
      },
      createdBy: username
    });

    await newArtwork.save();
    res.status(201).json({ message: 'Artwork added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getUserArtworks = async (req, res) => {
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

    const skip = (parsedPage - 1) * parsedLimit;

    const query = { createdBy: username };

    if (status) {
      const statusesArray = status.split(',');
      query.status = { $in: statusesArray };
    }

    if (category) {
      const categoriesArray = category.split(',');
      query.category = { $in: categoriesArray };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (minPrice && maxPrice) {
      query.price = { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) };
    }

    if (startDate && endDate) {
      query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const sortOptions = {};
    if (sort) {
      if (sort === 'asc') {
        sortOptions.price = 1;
      } else if (sort === 'desc') {
        sortOptions.price = -1;
      } else if (sort === 'date_asc') {
        sortOptions.createdAt = 1;
      } else if (sort === 'date_desc') {
        sortOptions.createdAt = -1;
      }
    }

    const artworks = await Artwork.find(query).sort(sortOptions).skip(skip).limit(parsedLimit);

    const totalArtworks = await Artwork.countDocuments(query);

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
};

exports.getRegistry = async (req, res) => {
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
};

exports.getAllArtworks = async (req, res) => {
  const { page = 1, limit = 10, minPrice, maxPrice, sortOrder } = req.query;

  let sortCriteria = { createdAt: -1 };

  if (sortOrder === 'asc') {
    sortCriteria = { price: 1 };
  } else if (sortOrder === 'desc') {
    sortCriteria = { price: -1 };
  }

  try {
    let query = Artwork.find({ isAvailable: true });

    if (minPrice !== undefined && !isNaN(Number(minPrice))) {
      query = query.where('price').gte(Number(minPrice));
    }

    if (maxPrice !== undefined && !isNaN(Number(maxPrice))) {
      query = query.where('price').lte(Number(maxPrice));
    }

    const artworks = await query
      .sort(sortCriteria)
      .skip((page - 1) * limit)
      .limit(Number(limit));

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
};

exports.updateArtwork = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, price, category, about, removedImages } = req.body;
    const { username } = req.user;

    const existingArtwork = await Artwork.findById(id);

    if (existingArtwork.createdBy !== username) {
      return res
        .status(403)
        .json({ message: 'Forbidden: You are not the creator of this artwork' });
    }

    const updatedImages = existingArtwork.images.filter(
      (_, index) => !removedImages.includes(index)
    );

    const newImages = req.files.map((file) => ({
      data: file.buffer,
      contentType: file.mimetype
    }));

    const combinedImages = [...updatedImages, ...newImages];

    const updatedArtwork = await Artwork.findByIdAndUpdate(
      id,
      { title, price, category, about, images: combinedImages, status: 'Uploaded' },
      { new: true }
    );

    if (!updatedArtwork) {
      return res.status(404).json({ message: 'Artwork not found' });
    }

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
};

exports.deleteArtwork = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, role } = req.user;

    const artwork = await Artwork.findById(id);

    if (!artwork) {
      return res.status(404).json({ message: 'Artwork not found' });
    }

    if (artwork.createdBy !== username && (role !== 'Moderator' || role !== 'Admin')) {
      return res
        .status(403)
        .json({ message: 'Forbidden: You are not the creator of this artwork' });
    }

    const result = await Artwork.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res.status(500).json({ message: 'Failed to delete artwork' });
    }

    res.status(200).json({ message: 'Artwork deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.verifyArtwork = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedArtwork = await Artwork.findByIdAndUpdate(
      id,
      { status: 'Verified' },
      { new: true }
    );

    if (!updatedArtwork) {
      return res.status(404).json({ message: 'Artwork not found' });
    }

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
};

exports.rejectArtwork = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedArtwork = await Artwork.findByIdAndUpdate(
      id,
      { status: 'Rejected' },
      { new: true }
    );

    if (!updatedArtwork) {
      return res.status(404).json({ message: 'Artwork not found' });
    }

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
};
