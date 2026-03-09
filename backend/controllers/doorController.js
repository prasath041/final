const Door = require('../models/Door');

// Get all doors
exports.getAllDoors = async (req, res) => {
  try {
    const { wood, doorType, minPrice, maxPrice, search } = req.query;
    let query = {};

    if (wood) query.wood = wood;
    if (doorType) query.doorType = doorType;
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

    const doors = await Door.find(query)
      .populate('wood', 'name durability priceMultiplier color image')
      .populate('related', 'name doorType price');
    res.json({ success: true, count: doors.length, data: doors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single door
exports.getDoorById = async (req, res) => {
  try {
    const door = await Door.findById(req.params.id)
      .populate('wood', 'name description durability grain color origin priceMultiplier image')
      .populate('related', 'name doorType price style');
    
    if (!door) {
      return res.status(404).json({ success: false, message: 'Door not found' });
    }

    res.json({ success: true, data: door });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create door (Admin only)
exports.createDoor = async (req, res) => {
  try {
    const door = await Door.create(req.body);
    res.status(201).json({ success: true, data: door });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update door (Admin only)
exports.updateDoor = async (req, res) => {
  try {
    const door = await Door.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!door) {
      return res.status(404).json({ success: false, message: 'Door not found' });
    }

    res.json({ success: true, data: door });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete door (Admin only)
exports.deleteDoor = async (req, res) => {
  try {
    const door = await Door.findByIdAndDelete(req.params.id);

    if (!door) {
      return res.status(404).json({ success: false, message: 'Door not found' });
    }

    res.json({ success: true, message: 'Door deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
