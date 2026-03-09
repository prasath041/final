const mongoose = require('mongoose');

const woodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Wood type name is required'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  origin: {
    type: String,
    default: ''
  },
  durability: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Very High'],
    default: 'Medium'
  },
  grain: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: ''
  },
  priceMultiplier: {
    type: Number,
    default: 1.0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Wood', woodSchema);
