const Furniture = require('../models/Furniture');

// Get all furniture
exports.getAllFurniture = async (req, res) => {
  try {
    const { category, wood, minPrice, maxPrice, search } = req.query;
    let query = {};

    if (category) query.category = category;
    if (wood) query.wood = wood;
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

    const furniture = await Furniture.find(query)
      .populate('category', 'name')
      .populate('wood', 'name durability priceMultiplier');
    res.json({ success: true, count: furniture.length, data: furniture });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single furniture
exports.getFurnitureById = async (req, res) => {
  try {
    const furniture = await Furniture.findById(req.params.id)
      .populate('category', 'name description')
      .populate('wood', 'name description durability grain color origin priceMultiplier image');
    
    if (!furniture) {
      return res.status(404).json({ success: false, message: 'Furniture not found' });
    }

    res.json({ success: true, data: furniture });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create furniture (Admin only)
exports.createFurniture = async (req, res) => {
  try {
    const furniture = await Furniture.create(req.body);
    res.status(201).json({ success: true, data: furniture });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update furniture (Admin only)
exports.updateFurniture = async (req, res) => {
  try {
    const furniture = await Furniture.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!furniture) {
      return res.status(404).json({ success: false, message: 'Furniture not found' });
    }

    res.json({ success: true, data: furniture });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete furniture (Admin only)
exports.deleteFurniture = async (req, res) => {
  try {
    const furniture = await Furniture.findByIdAndDelete(req.params.id);

    if (!furniture) {
      return res.status(404).json({ success: false, message: 'Furniture not found' });
    }

    res.json({ success: true, message: 'Furniture deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
