const Order = require('../models/Order');
const User = require('../models/User');

// Get delivery agent's assigned orders
exports.getMyAssignedOrders = async (req, res) => {
  try {
    const orders = await Order.find({ 
      deliveryAgent: req.user._id,
      orderStatus: { $in: ['ready_for_pickup', 'picked_up', 'in_transit', 'out_for_delivery'] }
    })
    .populate('customer', 'name phone address')
    .sort('-createdAt');

    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get delivery history
exports.getDeliveryHistory = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const orders = await Order.find({ 
      deliveryAgent: req.user._id,
      orderStatus: { $in: ['delivered', 'cancelled', 'returned'] }
    })
    .populate('customer', 'name phone')
    .sort('-actualDelivery')
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

    const total = await Order.countDocuments({
      deliveryAgent: req.user._id,
      orderStatus: { $in: ['delivered', 'cancelled', 'returned'] }
    });

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

// Pick up order
exports.pickUpOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      deliveryAgent: req.user._id
    });

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found or not assigned to you' 
      });
    }

    if (order.orderStatus !== 'ready_for_pickup') {
      return res.status(400).json({ 
        success: false, 
        message: 'Order is not ready for pickup' 
      });
    }

    order.addTrackingUpdate(
      'picked_up',
      'Order has been picked up by delivery agent',
      req.user._id
    );
    
    await order.save();

    // Update delivery agent's delivery count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { totalDeliveries: 0 } // Will increment on delivery
    });

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update delivery status (in transit, out for delivery)
exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { status, location, description } = req.body;
    
    const allowedStatuses = ['in_transit', 'out_for_delivery'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid status. Allowed: in_transit, out_for_delivery' 
      });
    }

    const order = await Order.findOne({
      _id: req.params.id,
      deliveryAgent: req.user._id
    });

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found or not assigned to you' 
      });
    }

    const statusMessages = {
      'in_transit': 'Order is in transit',
      'out_for_delivery': 'Order is out for delivery'
    };

    order.addTrackingUpdate(
      status,
      description || statusMessages[status],
      req.user._id,
      location
    );
    
    await order.save();

    // Update agent's current location
    await User.findByIdAndUpdate(req.user._id, { currentLocation: location });

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Confirm delivery
exports.confirmDelivery = async (req, res) => {
  try {
    const { notes, receivedBy } = req.body;

    const order = await Order.findOne({
      _id: req.params.id,
      deliveryAgent: req.user._id
    });

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found or not assigned to you' 
      });
    }

    if (!['picked_up', 'in_transit', 'out_for_delivery'].includes(order.orderStatus)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Order cannot be marked as delivered' 
      });
    }

    order.addTrackingUpdate(
      'delivered',
      `Order delivered successfully. ${receivedBy ? `Received by: ${receivedBy}` : ''} ${notes || ''}`,
      req.user._id
    );
    
    order.actualDelivery = new Date();
    
    // Mark as paid if COD
    if (order.paymentMethod === 'cod') {
      order.paymentStatus = 'paid';
      order.isPaid = true;
    }

    await order.save();

    // Update delivery agent stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { totalDeliveries: 1 },
      isAvailable: true
    });

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get delivery agent stats
exports.getMyStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalDelivered,
      todayDelivered,
      pendingDeliveries,
      agent
    ] = await Promise.all([
      Order.countDocuments({ 
        deliveryAgent: req.user._id, 
        orderStatus: 'delivered' 
      }),
      Order.countDocuments({ 
        deliveryAgent: req.user._id, 
        orderStatus: 'delivered',
        actualDelivery: { $gte: today }
      }),
      Order.countDocuments({ 
        deliveryAgent: req.user._id, 
        orderStatus: { $in: ['ready_for_pickup', 'picked_up', 'in_transit', 'out_for_delivery'] }
      }),
      User.findById(req.user._id).select('totalDeliveries isAvailable')
    ]);

    res.json({
      success: true,
      data: {
        totalDelivered,
        todayDelivered,
        pendingDeliveries,
        isAvailable: agent.isAvailable
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle availability
exports.toggleAvailability = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.isAvailable = !user.isAvailable;
    await user.save();

    res.json({ 
      success: true, 
      data: { isAvailable: user.isAvailable } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all available delivery agents (Admin/Shopkeeper)
exports.getAvailableAgents = async (req, res) => {
  try {
    const agents = await User.find({ 
      role: 'delivery_agent', 
      isActive: true,
      isAvailable: true 
    }).select('name phone email currentLocation totalDeliveries');

    res.json({ success: true, count: agents.length, data: agents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
