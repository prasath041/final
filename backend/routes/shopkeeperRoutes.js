const express = require('express');
const router = express.Router();
const shopkeeperController = require('../controllers/shopkeeperController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Shopkeeper routes
router.get('/dashboard', protect, authorize('shopkeeper', 'admin'), shopkeeperController.getDashboardStats);
router.get('/orders', protect, authorize('shopkeeper', 'admin'), shopkeeperController.getOrdersToProcess);
router.get('/inventory', protect, authorize('shopkeeper', 'admin'), shopkeeperController.getInventory);
router.get('/low-stock', protect, authorize('shopkeeper', 'admin'), shopkeeperController.getLowStockItems);

router.put('/orders/:id/confirm', protect, authorize('shopkeeper', 'admin'), shopkeeperController.confirmOrder);
router.put('/orders/:id/process', protect, authorize('shopkeeper', 'admin'), shopkeeperController.startProcessing);
router.put('/orders/:id/ready', protect, authorize('shopkeeper', 'admin'), shopkeeperController.markReadyForPickup);

router.put('/stock', protect, authorize('shopkeeper', 'admin'), shopkeeperController.updateStock);

module.exports = router;
