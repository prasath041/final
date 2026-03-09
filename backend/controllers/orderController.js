const Order = require('../models/Order');
const User = require('../models/User');
const Furniture = require('../models/Furniture');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, billingAddress, paymentMethod, notes } = req.body;

    // Calculate total and validate items
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      let product;
      const Model = require(`../models/${item.productType}`);
      product = await Model.findById(item.product);
      
      if (!product) {
        return res.status(404).json({ 
          success: false, 
          message: `Product not found: ${item.product}` 
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          success: false, 
          message: `Insufficient stock for ${product.name}` 
        });
      }

      totalAmount += product.price * item.quantity;
      orderItems.push({
        product: item.product,
        productType: item.productType,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images?.[0] || product.image || ''
      });

      // Update stock
      product.stock -= item.quantity;
      if (product.stock === 0) {
        product.isAvailable = false;
      }
      await product.save();
    }

    // Create order
    const order = new Order({
      customer: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentMethod,
      notes,
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    });

    await order.save();

    const populatedOrder = await Order.findById(order._id)
      .populate('customer', 'name email phone');

    res.status(201).json({ success: true, data: populatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all orders (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const { status, paymentStatus, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (status) query.orderStatus = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const orders = await Order.find(query)
      .populate('customer', 'name email phone')
      .populate('shopkeeper', 'name email')
      .populate('deliveryAgent', 'name phone')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    res.json({ 
      success: true, 
      count: orders.length,
      total,
      pages: Math.ceil(total / limit),
      data: orders 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get customer's orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .populate('deliveryAgent', 'name phone')
      .sort('-createdAt');

    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email phone address')
      .populate('shopkeeper', 'name email phone')
      .populate('deliveryAgent', 'name phone vehicleNumber')
      .populate('tracking.updatedBy', 'name role');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check authorization
    if (
      req.user.role === 'user' && 
      order.customer._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Track order by order number (public)
exports.trackOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber })
      .select('orderNumber orderStatus tracking estimatedDelivery items totalAmount shippingAddress')
      .populate('deliveryAgent', 'name phone');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update order status (Admin/Shopkeeper)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, description, location } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.addTrackingUpdate(status, description, req.user._id, location);
    
    if (status === 'delivered') {
      order.actualDelivery = new Date();
      order.paymentStatus = 'paid';
      order.isPaid = true;
    }

    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate('customer', 'name email phone')
      .populate('deliveryAgent', 'name phone');

    res.json({ success: true, data: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Assign delivery agent (Admin/Shopkeeper)
exports.assignDeliveryAgent = async (req, res) => {
  try {
    const { deliveryAgentId } = req.body;

    const deliveryAgent = await User.findOne({ 
      _id: deliveryAgentId, 
      role: 'delivery_agent',
      isActive: true 
    });

    if (!deliveryAgent) {
      return res.status(404).json({ 
        success: false, 
        message: 'Delivery agent not found or not active' 
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.deliveryAgent = deliveryAgentId;
    order.addTrackingUpdate(
      'ready_for_pickup', 
      `Delivery agent ${deliveryAgent.name} has been assigned`,
      req.user._id
    );

    await order.save();

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check if order can be cancelled
    if (['delivered', 'cancelled'].includes(order.orderStatus)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Order cannot be cancelled' 
      });
    }

    // Restore stock
    for (const item of order.items) {
      try {
        const Model = require(`../models/${item.productType}`);
        const product = await Model.findById(item.product);
        if (product) {
          product.stock += item.quantity;
          product.isAvailable = true;
          await product.save();
        }
      } catch (e) {
        console.error('Error restoring stock:', e);
      }
    }

    order.orderStatus = 'cancelled';
    order.cancellationReason = reason;
    order.addTrackingUpdate('cancelled', reason || 'Order cancelled', req.user._id);

    await order.save();

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update payment status
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.paymentStatus = paymentStatus;
    if (paymentStatus === 'paid') {
      order.isPaid = true;
    }

    await order.save();

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
