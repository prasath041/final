const Order = require('../models/Order');
const Furniture = require('../models/Furniture');
const Door = require('../models/Door');
const Window = require('../models/Window');
const Locker = require('../models/Locker');
const Wood = require('../models/Wood');

// Get shopkeeper dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const pendingOrders = await Order.countDocuments({
      orderStatus: { $in: ['placed', 'confirmed'] }
    });

    const processingOrders = await Order.countDocuments({
      orderStatus: 'processing'
    });

    const readyForPickup = await Order.countDocuments({
      orderStatus: 'ready_for_pickup'
    });

    // Low stock alerts
    const lowStockCount = await Furniture.countDocuments({ 
      stock: { $lte: 5 }, 
      isAvailable: true 
    });

    res.json({
      success: true,
      data: {
        pendingOrders,
        processingOrders,
        readyForPickup,
        lowStockCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get orders to process
exports.getOrdersToProcess = async (req, res) => {
  try {
    const orders = await Order.find({
      orderStatus: { $in: ['placed', 'confirmed', 'processing'] }
    })
    .populate('customer', 'name phone email')
    .sort('createdAt');

    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Confirm order
exports.confirmOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.orderStatus !== 'placed') {
      return res.status(400).json({ 
        success: false, 
        message: 'Order cannot be confirmed' 
      });
    }

    order.shopkeeper = req.user._id;
    order.addTrackingUpdate(
      'confirmed',
      'Order has been confirmed by shopkeeper',
      req.user._id
    );

    await order.save();

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Start processing order
exports.startProcessing = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.addTrackingUpdate(
      'processing',
      'Order is being prepared',
      req.user._id
    );

    await order.save();

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mark order ready for pickup
exports.markReadyForPickup = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.addTrackingUpdate(
      'ready_for_pickup',
      'Order is ready for delivery pickup',
      req.user._id
    );

    await order.save();

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update stock
exports.updateStock = async (req, res) => {
  try {
    const { productType, productId, stock } = req.body;

    const models = {
      'Furniture': Furniture,
      'Door': Door,
      'Window': Window,
      'Locker': Locker,
      'Wood': Wood
    };

    const Model = models[productType];
    if (!Model) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid product type' 
      });
    }

    const product = await Model.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product.stock = stock;
    product.isAvailable = stock > 0;
    await product.save();

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all products with stock info
exports.getInventory = async (req, res) => {
  try {
    const [furniture, doors, windows, lockers, woods] = await Promise.all([
      Furniture.find().select('name stock price isAvailable images category'),
      Door.find().select('name stock price isAvailable images'),
      Window.find().select('name stock price isAvailable images'),
      Locker.find().select('name stock price isAvailable images'),
      Wood.find().select('name stock price isAvailable images')
    ]);

    res.json({
      success: true,
      data: {
        furniture: furniture.map(f => ({ ...f.toObject(), productType: 'Furniture' })),
        doors: doors.map(d => ({ ...d.toObject(), productType: 'Door' })),
        windows: windows.map(w => ({ ...w.toObject(), productType: 'Window' })),
        lockers: lockers.map(l => ({ ...l.toObject(), productType: 'Locker' })),
        woods: woods.map(w => ({ ...w.toObject(), productType: 'Wood' }))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get low stock items
exports.getLowStockItems = async (req, res) => {
  try {
    const threshold = parseInt(req.query.threshold) || 5;

    const [furniture, doors, windows, lockers, woods] = await Promise.all([
      Furniture.find({ stock: { $lte: threshold }, isAvailable: true }).select('name stock price'),
      Door.find({ stock: { $lte: threshold }, isAvailable: true }).select('name stock price'),
      Window.find({ stock: { $lte: threshold }, isAvailable: true }).select('name stock price'),
      Locker.find({ stock: { $lte: threshold }, isAvailable: true }).select('name stock price'),
      Wood.find({ stock: { $lte: threshold }, isAvailable: true }).select('name stock price')
    ]);

    const lowStockItems = [
      ...furniture.map(f => ({ ...f.toObject(), productType: 'Furniture' })),
      ...doors.map(d => ({ ...d.toObject(), productType: 'Door' })),
      ...windows.map(w => ({ ...w.toObject(), productType: 'Window' })),
      ...lockers.map(l => ({ ...l.toObject(), productType: 'Locker' })),
      ...woods.map(w => ({ ...w.toObject(), productType: 'Wood' }))
    ];

    res.json({ success: true, count: lowStockItems.length, data: lowStockItems });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
