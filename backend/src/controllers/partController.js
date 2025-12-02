const Part = require('../models/Part');
const Category = require('../models/Category');

/**
 * @desc    Get all parts with pagination and filters
 * @route   GET /api/v1/parts
 * @access  Public
 */
const getParts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      brand,
      minPrice,
      maxPrice,
      search,
      stockStatus,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = { isActive: true };

    // Category filter
    if (category) {
      query.category = category;
    }

    // Brand filter
    if (brand) {
      query.brand = new RegExp(brand, 'i');
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.sellingPrice = {};
      if (minPrice) query.sellingPrice.$gte = Number(minPrice);
      if (maxPrice) query.sellingPrice.$lte = Number(maxPrice);
    }

    // Search filter
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { partNumber: new RegExp(search, 'i') },
        { brand: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }

    // Stock status filter
    if (stockStatus) {
      if (stockStatus === 'in_stock') {
        query.quantity = { $gt: 0 };
      } else if (stockStatus === 'out_of_stock') {
        query.quantity = 0;
      } else if (stockStatus === 'low_stock') {
        query.$expr = { $lte: ['$quantity', '$minStockLevel'] };
      }
    }

    // Pagination
    const skip = (page - 1) * limit;
    const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    // Execute query
    const parts = await Part.find(query)
      .populate('category', 'name slug')
      .sort(sortOptions)
      .limit(Number(limit))
      .skip(skip);

    // Get total count
    const total = await Part.countDocuments(query);

    res.status(200).json({
      success: true,
      count: parts.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      data: parts
    });
  } catch (error) {
    console.error('Get parts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching parts'
    });
  }
};

/**
 * @desc    Get single part by ID
 * @route   GET /api/v1/parts/:id
 * @access  Public
 */
const getPart = async (req, res) => {
  try {
    const part = await Part.findById(req.params.id)
      .populate('category', 'name slug description')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!part) {
      return res.status(404).json({
        success: false,
        message: 'Part not found'
      });
    }

    // Increment views
    part.views += 1;
    await part.save();

    res.status(200).json({
      success: true,
      data: part
    });
  } catch (error) {
    console.error('Get part error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching part'
    });
  }
};

/**
 * @desc    Create new part
 * @route   POST /api/v1/parts
 * @access  Private/Admin
 */
const createPart = async (req, res) => {
  try {
    // Add created by user
    req.body.createdBy = req.user._id;
    req.body.updatedBy = req.user._id;

    // Verify category exists
    if (req.body.category) {
      const categoryExists = await Category.findById(req.body.category);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: 'Invalid category'
        });
      }
    }

    const part = await Part.create(req.body);

    // Populate category
    await part.populate('category', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Part created successfully',
      data: part
    });
  } catch (error) {
    console.error('Create part error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Part number already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating part'
    });
  }
};

/**
 * @desc    Update part
 * @route   PUT /api/v1/parts/:id
 * @access  Private/Admin
 */
const updatePart = async (req, res) => {
  try {
    let part = await Part.findById(req.params.id);

    if (!part) {
      return res.status(404).json({
        success: false,
        message: 'Part not found'
      });
    }

    // Verify category if being updated
    if (req.body.category) {
      const categoryExists = await Category.findById(req.body.category);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: 'Invalid category'
        });
      }
    }

    // Add updated by user
    req.body.updatedBy = req.user._id;

    part = await Part.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('category', 'name slug');

    res.status(200).json({
      success: true,
      message: 'Part updated successfully',
      data: part
    });
  } catch (error) {
    console.error('Update part error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating part'
    });
  }
};

/**
 * @desc    Delete part
 * @route   DELETE /api/v1/parts/:id
 * @access  Private/Admin
 */
const deletePart = async (req, res) => {
  try {
    const part = await Part.findById(req.params.id);

    if (!part) {
      return res.status(404).json({
        success: false,
        message: 'Part not found'
      });
    }

    // Soft delete - just mark as inactive
    part.isActive = false;
    await part.save();

    res.status(200).json({
      success: true,
      message: 'Part deleted successfully'
    });
  } catch (error) {
    console.error('Delete part error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting part'
    });
  }
};

/**
 * @desc    Search parts
 * @route   GET /api/v1/parts/search/:query
 * @access  Public
 */
const searchParts = async (req, res) => {
  try {
    const { query } = req.params;
    const { limit = 20 } = req.query;

    const parts = await Part.find({
      isActive: true,
      $or: [
        { name: new RegExp(query, 'i') },
        { partNumber: new RegExp(query, 'i') },
        { brand: new RegExp(query, 'i') },
        { description: new RegExp(query, 'i') },
        { tags: new RegExp(query, 'i') }
      ]
    })
      .populate('category', 'name slug')
      .limit(Number(limit))
      .sort({ views: -1, salesCount: -1 });

    res.status(200).json({
      success: true,
      count: parts.length,
      data: parts
    });
  } catch (error) {
    console.error('Search parts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while searching parts'
    });
  }
};

/**
 * @desc    Update part stock
 * @route   PATCH /api/v1/parts/:id/stock
 * @access  Private/Admin
 */
const updateStock = async (req, res) => {
  try {
    const { quantity, operation = 'set' } = req.body;

    if (quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Quantity is required'
      });
    }

    const part = await Part.findById(req.params.id);

    if (!part) {
      return res.status(404).json({
        success: false,
        message: 'Part not found'
      });
    }

    // Update stock based on operation
    if (operation === 'add') {
      part.quantity += Number(quantity);
    } else if (operation === 'subtract') {
      part.quantity = Math.max(0, part.quantity - Number(quantity));
    } else {
      part.quantity = Number(quantity);
    }

    part.updatedBy = req.user._id;
    await part.save();

    res.status(200).json({
      success: true,
      message: 'Stock updated successfully',
      data: {
        partNumber: part.partNumber,
        name: part.name,
        quantity: part.quantity,
        stockStatus: part.stockStatus
      }
    });
  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating stock'
    });
  }
};

module.exports = {
  getParts,
  getPart,
  createPart,
  updatePart,
  deletePart,
  searchParts,
  updateStock
};
