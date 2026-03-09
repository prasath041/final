const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect, admin } = require('../middleware/authMiddleware');
const path = require('path');
const fs = require('fs');

// Upload single image
router.post('/:category', protect, admin, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    const category = req.params.category;
    const imageUrl = `/uploads/${category}/${req.file.filename}`;
    
    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        filename: req.file.filename,
        path: imageUrl,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Upload multiple images
router.post('/:category/multiple', protect, admin, upload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }
    
    const category = req.params.category;
    const uploadedImages = req.files.map(file => ({
      filename: file.filename,
      path: `/uploads/${category}/${file.filename}`,
      size: file.size,
      mimetype: file.mimetype
    }));
    
    res.json({
      success: true,
      message: `${uploadedImages.length} images uploaded successfully`,
      data: uploadedImages
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete an image
router.delete('/:category/:filename', protect, admin, (req, res) => {
  try {
    const { category, filename } = req.params;
    const filePath = path.join(__dirname, '..', 'uploads', category, filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ success: true, message: 'Image deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Image not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all images in a category
router.get('/:category', (req, res) => {
  try {
    const category = req.params.category;
    const uploadDir = path.join(__dirname, '..', 'uploads', category);
    
    if (!fs.existsSync(uploadDir)) {
      return res.json({ success: true, data: [] });
    }
    
    const files = fs.readdirSync(uploadDir);
    const images = files
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .map(file => ({
        filename: file,
        path: `/uploads/${category}/${file}`
      }));
    
    res.json({ success: true, data: images });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
