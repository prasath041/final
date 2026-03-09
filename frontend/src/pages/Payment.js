import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { paymentAPI, bookingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FaLock, FaCreditCard, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import './Payment.css';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [razorpayKey, setRazorpayKey] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, success, failed

  // Get payment data from location state
  const paymentData = location.state;

  useEffect(() => {
    // Load Razorpay script
    loadRazorpayScript();

    // Fetch Razorpay key
    fetchRazorpayKey();

    // Redirect if no payment data
    if (!paymentData || !paymentData.amount || !paymentData.bookingIds) {
      navigate('/checkout');
    }
  }, []);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const fetchRazorpayKey = async () => {
    try {
      const response = await paymentAPI.getRazorpayKey();
      setRazorpayKey(response.data.key);
    } catch (err) {
      console.error('Error fetching Razorpay key:', err);
      setError('Failed to initialize payment gateway');
    }
  };

  const handlePayment = async () => {
    if (!razorpayKey) {
      setError('Payment gateway not initialized. Please try again.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create Razorpay order
      const orderResponse = await paymentAPI.createOrder({
        amount: paymentData.amount,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        bookingIds: paymentData.bookingIds
      });

      const order = orderResponse.data.order;

      // Razorpay payment options
      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency,
        name: 'Furniture Hub',
        description: 'Payment for furniture booking',
        order_id: order.id,
        handler: async function (response) {
          // Payment successful - verify payment
          await verifyPayment(response);
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || ''
        },
        notes: {
          address: paymentData.shippingAddress || ''
        },
        theme: {
          color: '#8B4513'
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
            setError('Payment cancelled by user');
          }
        }
      };

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);

      razorpay.on('payment.failed', async function (response) {
        // Payment failed
        await handlePaymentFailure(response.error);
      });

      razorpay.open();
    } catch (err) {
      console.error('Error creating payment order:', err);
      setError(err.response?.data?.message || 'Failed to initiate payment');
      setLoading(false);
    }
  };

  const verifyPayment = async (paymentResponse) => {
    try {
      setLoading(true);

      // Verify payment with backend
      const response = await paymentAPI.verifyPayment({
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
        bookingIds: paymentData.bookingIds
      });

      if (response.data.success) {
        setPaymentStatus('success');

        // Clear cart if cart clearing function is provided
        if (paymentData.clearCart) {
          paymentData.clearCart();
        }

        // Redirect to success page after 2 seconds
        setTimeout(() => {
          navigate('/order-success', {
            state: {
              paymentId: paymentResponse.razorpay_payment_id,
              orderId: paymentResponse.razorpay_order_id,
              amount: paymentData.amount
            }
          });
        }, 2000);
      } else {
        throw new Error('Payment verification failed');
      }
    } catch (err) {
      console.error('Error verifying payment:', err);
      setPaymentStatus('failed');
      setError(err.response?.data?.message || 'Payment verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentFailure = async (error) => {
    try {
      setLoading(true);
      setPaymentStatus('failed');

      await paymentAPI.paymentFailure({
        bookingIds: paymentData.bookingIds,
        error: error
      });

      setError(`Payment failed: ${error.description || 'Unknown error'}`);
    } catch (err) {
      console.error('Error handling payment failure:', err);
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setPaymentStatus('pending');
    setError('');
    handlePayment();
  };

  if (!paymentData) {
    return null;
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="payment-header">
          <h1>
            <FaLock /> Secure Payment
          </h1>
          <p>Complete your payment to confirm your booking</p>
        </div>

        {/* Payment Summary */}
        <div className="payment-summary">
          <h2>Payment Details</h2>
          <div className="summary-row">
            <span>Order Amount:</span>
            <span className="amount">₹{paymentData.amount?.toLocaleString()}</span>
          </div>
          {paymentData.items && (
            <div className="order-items">
              <h3>Items ({paymentData.items.length})</h3>
              {paymentData.items.map((item, index) => (
                <div key={index} className="item-row">
                  <span>{item.name} × {item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payment Status */}
        {paymentStatus === 'success' && (
          <div className="payment-status success">
            <FaCheckCircle className="status-icon" />
            <h3>Payment Successful!</h3>
            <p>Redirecting to order confirmation...</p>
          </div>
        )}

        {paymentStatus === 'failed' && (
          <div className="payment-status failed">
            <FaTimesCircle className="status-icon" />
            <h3>Payment Failed</h3>
            <p>{error}</p>
          </div>
        )}

        {/* Error Message */}
        {error && paymentStatus === 'pending' && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Payment Actions */}
        <div className="payment-actions">
          {paymentStatus === 'pending' && (
            <>
              <button
                className="btn-pay"
                onClick={handlePayment}
                disabled={loading || !razorpayKey}
              >
                <FaCreditCard />
                {loading ? 'Processing...' : `Pay ₹${paymentData.amount?.toLocaleString()}`}
              </button>
              <button
                className="btn-cancel"
                onClick={() => navigate('/checkout')}
                disabled={loading}
              >
                Cancel
              </button>
            </>
          )}

          {paymentStatus === 'failed' && (
            <>
              <button className="btn-retry" onClick={handleRetry}>
                Retry Payment
              </button>
              <button className="btn-cancel" onClick={() => navigate('/checkout')}>
                Back to Checkout
              </button>
            </>
          )}
        </div>

        {/* Security Badge */}
        <div className="security-badge">
          <FaLock />
          <p>Your payment is secure and encrypted</p>
          <p className="powered-by">Powered by Razorpay</p>
        </div>
      </div>
    </div>
  );
};

export default Payment;
