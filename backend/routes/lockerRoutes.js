const express = require('express');
const router = express.Router();
const {
  getAllLockers,
  getLockerById,
  createLocker,
  updateLocker,
  deleteLocker
} = require('../controllers/lockerController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getAllLockers)
  .post(protect, admin, createLocker);

router.route('/:id')
  .get(getLockerById)
  .put(protect, admin, updateLocker)
  .delete(protect, admin, deleteLocker);

module.exports = router;
