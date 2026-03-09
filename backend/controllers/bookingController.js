const Booking = require('../models/Booking');
const Furniture = require('../models/Furniture');

// Create booking
exports.createBooking = async (req, res) => {
  try {
    const { furniture, quantity, deliveryDate, deliveryAddress, notes } = req.body;

    // Check if furniture exists and is available
    const furnitureItem = await Furniture.findById(furniture);
    if (!furnitureItem) {
      return res.status(404).json({ success: false, message: 'Furniture not found' });
    }

    if (!furnitureItem.isAvailable || furnitureItem.stock < quantity) {
      return res.status(400).json({ success: false, message: 'Furniture not available in requested quantity' });
    }

    // Calculate total price
    const totalPrice = furnitureItem.price * quantity;

    // Create booking
    const booking = await Booking.create({
      user: req.user._id,
      furniture,
      quantity,
      totalPrice,
      deliveryDate,
      deliveryAddress,
      notes
    });

    // Update furniture stock
    furnitureItem.stock -= quantity;
    if (furnitureItem.stock === 0) {
      furnitureItem.isAvailable = false;
    }
    await furnitureItem.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate('furniture', 'name price images')
      .populate('user', 'name email phone');

    res.status(201).json({ success: true, data: populatedBooking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all bookings (Admin)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('furniture', 'name price images')
      .populate('user', 'name email phone')
      .sort('-createdAt');

    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('furniture', 'name price images')
      .sort('-createdAt');

    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single booking
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('furniture', 'name price images description')
      .populate('user', 'name email phone address');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Check if user is authorized
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update booking status (Admin)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (status) booking.status = status;
    if (paymentStatus) booking.paymentStatus = paymentStatus;

    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate('furniture', 'name price images')
      .populate('user', 'name email phone');

    res.json({ success: true, data: updatedBooking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Check authorization
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (booking.status === 'delivered') {
      return res.status(400).json({ success: false, message: 'Cannot cancel delivered booking' });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Restore furniture stock
    const furniture = await Furniture.findById(booking.furniture);
    if (furniture) {
      furniture.stock += booking.quantity;
      furniture.isAvailable = true;
      await furniture.save();
    }

    res.json({ success: true, message: 'Booking cancelled successfully', data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
