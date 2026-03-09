const mongoose = require('mongoose');

const doorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Door name is required'],
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
  doorType: {
    type: String,
    enum: ['Interior', 'Exterior', 'Sliding', 'French', 'Barn', 'Pocket', 'Bifold', 'Dutch'],
    required: [true, 'Door type is required']
  },
  wood: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wood',
    required: [true, 'Wood type is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  related: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Door'
  }],
  dimensions: {
    height: { type: Number, default: 0 },
    width: { type: Number, default: 0 },
    thickness: { type: Number, default: 0 }
  },
  finish: {
    type: String,
    default: ''
  },
  style: {
    type: String,
    enum: ['Panel', 'Flush', 'Glass', 'Louver', 'Carved', 'Modern', 'Traditional', 'Rustic'],
    default: 'Panel'
  },
  glassType: {
    type: String,
    enum: ['None', 'Clear', 'Frosted', 'Tinted', 'Decorative', 'Tempered'],
    default: 'None'
  },
  hardware: {
    type: String,
    default: ''
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  features: [{
    type: String
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Door', doorSchema);
