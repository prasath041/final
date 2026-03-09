const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Customer routes
router.post('/', protect, orderController.createOrder);
router.get('/my-orders', protect, orderController.getMyOrders);
router.get('/track/:orderNumber', orderController.trackOrder);

// Admin routes
router.get('/', protect, authorize('admin', 'shopkeeper'), orderController.getAllOrders);
router.get('/:id', protect, orderController.getOrderById);
router.put('/:id/status', protect, authorize('admin', 'shopkeeper'), orderController.updateOrderStatus);
router.put('/:id/assign-agent', protect, authorize('admin', 'shopkeeper'), orderController.assignDeliveryAgent);
router.put('/:id/payment-status', protect, authorize('admin'), orderController.updatePaymentStatus);
router.put('/:id/cancel', protect, orderController.cancelOrder);

module.exports = router;
