const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'items.productType',
    required: true
  },
  productType: {
    type: String,
    enum: ['Furniture', 'Door', 'Window', 'Locker', 'Pipe', 'Wood'],
    required: true
  },
  name: String,
  price: Number,
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  image: String
});

const orderTrackingSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true
  },
  description: String,
  timestamp: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  location: String
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    phone: String
  },
  billingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'card', 'upi', 'netbanking'],
    default: 'cod'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['placed', 'confirmed', 'processing', 'ready_for_pickup', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled', 'returned'],
    default: 'placed'
  },
  shopkeeper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  deliveryAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  tracking: [orderTrackingSchema],
  estimatedDelivery: Date,
  actualDelivery: Date,
  notes: String,
  cancellationReason: String,
  // For analytics
  isPaid: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `FH${Date.now().toString().slice(-6)}${(count + 1).toString().padStart(4, '0')}`;
    
    // Add initial tracking
    this.tracking.push({
      status: 'placed',
      description: 'Order has been placed successfully',
      timestamp: new Date()
    });
  }
  next();
});

// Method to add tracking update
orderSchema.methods.addTrackingUpdate = function(status, description, updatedBy, location) {
  this.tracking.push({
    status,
    description,
    updatedBy,
    location,
    timestamp: new Date()
  });
  this.orderStatus = status;
};

module.exports = mongoose.model('Order', orderSchema);
