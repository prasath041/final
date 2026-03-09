const express = require('express');
const router = express.Router();
const {
  getAllFurniture,
  getFurnitureById,
  createFurniture,
  updateFurniture,
  deleteFurniture
} = require('../controllers/furnitureController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getAllFurniture);
router.get('/:id', getFurnitureById);
router.post('/', protect, admin, createFurniture);
router.put('/:id', protect, admin, updateFurniture);
router.delete('/:id', protect, admin, deleteFurniture);

module.exports = router;
