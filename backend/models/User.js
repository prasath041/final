const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  address: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'shopkeeper', 'delivery_agent'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // For Shopkeeper
  assignedShop: {
    type: String,
    default: ''
  },
  // For Delivery Agent
  isAvailable: {
    type: Boolean,
    default: true
  },
  currentLocation: {
    type: String,
    default: ''
  },
  vehicleNumber: {
    type: String,
    default: ''
  },
  totalDeliveries: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
