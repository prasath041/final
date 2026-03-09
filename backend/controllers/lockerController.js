const Locker = require('../models/Locker');

// @desc    Get all lockers
// @route   GET /api/lockers
// @access  Public
exports.getAllLockers = async (req, res) => {
  try {
    const { lockerType, material, minPrice, maxPrice, search } = req.query;
    
    let query = {};
    
    if (lockerType) query.lockerType = lockerType;
    if (material) query.material = material;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const lockers = await Locker.find(query).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: lockers.length,
      data: lockers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get single locker
// @route   GET /api/lockers/:id
// @access  Public
exports.getLockerById = async (req, res) => {
  try {
    const locker = await Locker.findById(req.params.id);
    
    if (!locker) {
      return res.status(404).json({
        success: false,
        message: 'Locker not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: locker
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Create locker
// @route   POST /api/lockers
// @access  Private/Admin
exports.createLocker = async (req, res) => {
  try {
    const locker = await Locker.create(req.body);
    
    res.status(201).json({
      success: true,
      data: locker
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Invalid data',
      error: error.message
    });
  }
};

// @desc    Update locker
// @route   PUT /api/lockers/:id
// @access  Private/Admin
exports.updateLocker = async (req, res) => {
  try {
    const locker = await Locker.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!locker) {
      return res.status(404).json({
        success: false,
        message: 'Locker not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: locker
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Invalid data',
      error: error.message
    });
  }
};

// @desc    Delete locker
// @route   DELETE /api/lockers/:id
// @access  Private/Admin
exports.deleteLocker = async (req, res) => {
  try {
    const locker = await Locker.findByIdAndDelete(req.params.id);
    
    if (!locker) {
      return res.status(404).json({
        success: false,
        message: 'Locker not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Locker deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};
