const mongoose = require('mongoose');

const windowSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Window name is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  windowType: {
    type: String,
    enum: ['Single Hung', 'Double Hung', 'Casement', 'Sliding', 'Bay', 'Bow', 'Awning', 'Fixed', 'Skylight'],
    required: [true, 'Window type is required']
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
  image: {
    type: String,
    default: ''
  },
  images: [{
    type: String
  }],
  dimensions: {
    height: { type: Number, default: 0 },
    width: { type: Number, default: 0 }
  },
  finish: {
    type: String,
    default: ''
  },
  glassType: {
    type: String,
    enum: ['Single Pane', 'Double Pane', 'Triple Pane', 'Tempered', 'Laminated', 'Low-E'],
    default: 'Double Pane'
  },
  frameStyle: {
    type: String,
    enum: ['Traditional', 'Modern', 'Colonial', 'Craftsman', 'Victorian', 'Contemporary'],
    default: 'Traditional'
  },
  grillPattern: {
    type: String,
    enum: ['None', 'Colonial', 'Prairie', 'Diamond', 'Custom'],
    default: 'None'
  },
  operationType: {
    type: String,
    enum: ['Fixed', 'Operable', 'Tilt-In', 'Pivot'],
    default: 'Operable'
  },
  energyRating: {
    type: String,
    enum: ['Standard', 'Energy Star', 'High Efficiency'],
    default: 'Standard'
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

module.exports = mongoose.model('Window', windowSchema);
