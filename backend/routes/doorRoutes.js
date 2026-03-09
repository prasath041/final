const express = require('express');
const router = express.Router();
const {
  getAllDoors,
  getDoorById,
  createDoor,
  updateDoor,
  deleteDoor
} = require('../controllers/doorController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getAllDoors);
router.get('/:id', getDoorById);
router.post('/', protect, admin, createDoor);
router.put('/:id', protect, admin, updateDoor);
router.delete('/:id', protect, admin, deleteDoor);

module.exports = router;
