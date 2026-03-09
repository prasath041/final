const express = require('express');
const router = express.Router();
const {
  getAllWindows,
  getWindowById,
  createWindow,
  updateWindow,
  deleteWindow
} = require('../controllers/windowController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getAllWindows);
router.get('/:id', getWindowById);
router.post('/', protect, admin, createWindow);
router.put('/:id', protect, admin, updateWindow);
router.delete('/:id', protect, admin, deleteWindow);

module.exports = router;
