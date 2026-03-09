const express = require('express');
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  getPaymentDetails,
  paymentFailure,
  getRazorpayKey
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// Get Razorpay key (public)
router.get('/key', getRazorpayKey);

// Create Razorpay order (protected)
router.post('/create-order', protect, createOrder);

// Verify Razorpay payment (protected)
router.post('/verify', protect, verifyPayment);

// Handle payment failure (protected)
router.post('/failure', protect, paymentFailure);

// Get payment details (protected)
router.get('/:paymentId', protect, getPaymentDetails);

module.exports = router;
