const Wood = require('../models/Wood');

// Get all woods
exports.getAllWoods = async (req, res) => {
  try {
    const woods = await Wood.find({ isActive: true });
    res.json({ success: true, count: woods.length, data: woods });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single wood
exports.getWoodById = async (req, res) => {
  try {
    const wood = await Wood.findById(req.params.id);
    
    if (!wood) {
      return res.status(404).json({ success: false, message: 'Wood type not found' });
    }

    res.json({ success: true, data: wood });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create wood (Admin only)
exports.createWood = async (req, res) => {
  try {
    const wood = await Wood.create(req.body);
    res.status(201).json({ success: true, data: wood });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update wood (Admin only)
exports.updateWood = async (req, res) => {
  try {
    const wood = await Wood.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!wood) {
      return res.status(404).json({ success: false, message: 'Wood type not found' });
    }

    res.json({ success: true, data: wood });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete wood (Admin only)
exports.deleteWood = async (req, res) => {
  try {
    const wood = await Wood.findByIdAndDelete(req.params.id);

    if (!wood) {
      return res.status(404).json({ success: false, message: 'Wood type not found' });
    }

    res.json({ success: true, message: 'Wood type deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
