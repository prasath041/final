const mongoose = require('mongoose');

const lockerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Locker name is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  lockerType: {
    type: String,
    enum: ['Wardrobe', 'Storage Cabinet', 'Filing Cabinet', 'Gym Locker', 'School Locker', 'Industrial Locker', 'Modular', 'Walk-in Closet'],
    required: [true, 'Locker type is required']
  },
  material: {
    type: String,
    enum: ['Wood', 'Metal', 'Plywood', 'MDF', 'Particle Board', 'Steel', 'Aluminum'],
    default: 'Wood'
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  images: [{
    type: String
  }],
  dimensions: {
    height: { type: Number, default: 0 },
    width: { type: Number, default: 0 },
    depth: { type: Number, default: 0 }
  },
  finish: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: ''
  },
  numberOfCompartments: {
    type: Number,
    default: 1
  },
  numberOfShelves: {
    type: Number,
    default: 0
  },
  lockType: {
    type: String,
    enum: ['None', 'Key Lock', 'Combination Lock', 'Digital Lock', 'Padlock Compatible', 'Biometric'],
    default: 'None'
  },
  stock: {
    type: Number,
    default: 0
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

module.exports = mongoose.model('Locker', lockerSchema);
