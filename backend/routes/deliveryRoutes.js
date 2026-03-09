const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Delivery agent routes
router.get('/my-orders', protect, authorize('delivery_agent'), deliveryController.getMyAssignedOrders);
router.get('/history', protect, authorize('delivery_agent'), deliveryController.getDeliveryHistory);
router.get('/stats', protect, authorize('delivery_agent'), deliveryController.getMyStats);
router.put('/toggle-availability', protect, authorize('delivery_agent'), deliveryController.toggleAvailability);

router.put('/orders/:id/pickup', protect, authorize('delivery_agent'), deliveryController.pickUpOrder);
router.put('/orders/:id/status', protect, authorize('delivery_agent'), deliveryController.updateDeliveryStatus);
router.put('/orders/:id/deliver', protect, authorize('delivery_agent'), deliveryController.confirmDelivery);

// Admin/Shopkeeper routes
router.get('/agents', protect, authorize('admin', 'shopkeeper'), deliveryController.getAvailableAgents);

module.exports = router;
