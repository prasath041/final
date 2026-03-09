const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Admin only routes
router.get('/dashboard', protect, authorize('admin'), analyticsController.getDashboardAnalytics);
router.get('/sales', protect, authorize('admin'), analyticsController.getSalesReport);
router.get('/inventory', protect, authorize('admin', 'shopkeeper'), analyticsController.getInventoryReport);

module.exports = router;
