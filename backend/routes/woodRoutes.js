const express = require('express');
const router = express.Router();
const {
  getAllWoods,
  getWoodById,
  createWood,
  updateWood,
  deleteWood
} = require('../controllers/woodController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getAllWoods);
router.get('/:id', getWoodById);
router.post('/', protect, admin, createWood);
router.put('/:id', protect, admin, updateWood);
router.delete('/:id', protect, admin, deleteWood);

module.exports = router;
