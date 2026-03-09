const Window = require('../models/Window');

// Get all windows
exports.getAllWindows = async (req, res) => {
  try {
    const { wood, windowType, minPrice, maxPrice, search } = req.query;
    let query = {};

    if (wood) query.wood = wood;
    if (windowType) query.windowType = windowType;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const windows = await Window.find(query)
      .populate('wood', 'name durability priceMultiplier color image');
    res.json({ success: true, count: windows.length, data: windows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single window
exports.getWindowById = async (req, res) => {
  try {
    const window = await Window.findById(req.params.id)
      .populate('wood', 'name description durability grain color origin priceMultiplier image');
    
    if (!window) {
      return res.status(404).json({ success: false, message: 'Window not found' });
    }

    res.json({ success: true, data: window });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create window (Admin only)
exports.createWindow = async (req, res) => {
  try {
    const window = await Window.create(req.body);
    res.status(201).json({ success: true, data: window });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update window (Admin only)
exports.updateWindow = async (req, res) => {
  try {
    const window = await Window.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!window) {
      return res.status(404).json({ success: false, message: 'Window not found' });
    }

    res.json({ success: true, data: window });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete window (Admin only)
exports.deleteWindow = async (req, res) => {
  try {
    const window = await Window.findByIdAndDelete(req.params.id);

    if (!window) {
      return res.status(404).json({ success: false, message: 'Window not found' });
    }

    res.json({ success: true, message: 'Window deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
