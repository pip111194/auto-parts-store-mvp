const Part = require('../models/Part');
const Category = require('../models/Category');

/**
 * @desc    Get dashboard summary
 * @route   GET /api/v1/dashboard/summary
 * @access  Private/Admin
 */
const getDashboardSummary = async (req, res) => {
  try {
    // Total parts count
    const totalParts = await Part.countDocuments({ isActive: true });

    // Out of stock count
    const outOfStock = await Part.countDocuments({ 
      isActive: true, 
      quantity: 0 
    });

    // Low stock count
    const lowStock = await Part.countDocuments({
      isActive: true,
      $expr: { $and: [
        { $lte: ['$quantity', '$minStockLevel'] },
        { $gt: ['$quantity', 0] }
      ]}
    });

    // Total inventory value
    const inventoryValue = await Part.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalCost: { $sum: { $multiply: ['$costPrice', '$quantity'] } },
          totalSelling: { $sum: { $multiply: ['$sellingPrice', '$quantity'] } }
        }
      }
    ]);

    // Category distribution
    const categoryDistribution = await Part.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalValue: { $sum: { $multiply: ['$sellingPrice', '$quantity'] } }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: '$category' },
      {
        $project: {
          name: '$category.name',
          count: 1,
          totalValue: 1
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Top selling parts
    const topSellingParts = await Part.find({ isActive: true })
      .sort({ salesCount: -1 })
      .limit(5)
      .select('name partNumber brand salesCount sellingPrice')
      .populate('category', 'name');

    // Recently added parts
    const recentParts = await Part.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name partNumber brand createdAt')
      .populate('category', 'name');

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalParts,
          outOfStock,
          lowStock,
          inStock: totalParts - outOfStock - lowStock,
          inventoryValue: inventoryValue[0] || { totalCost: 0, totalSelling: 0 }
        },
        categoryDistribution,
        topSellingParts,
        recentParts
      }
    });
  } catch (error) {
    console.error('Dashboard summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard data'
    });
  }
};

/**
 * @desc    Get low stock alerts
 * @route   GET /api/v1/dashboard/low-stock
 * @access  Private/Admin
 */
const getLowStockAlerts = async (req, res) => {
  try {
    const lowStockParts = await Part.find({
      isActive: true,
      $expr: { $lte: ['$quantity', '$minStockLevel'] }
    })
      .populate('category', 'name')
      .select('name partNumber brand quantity minStockLevel reorderQuantity')
      .sort({ quantity: 1 });

    res.status(200).json({
      success: true,
      count: lowStockParts.length,
      data: lowStockParts
    });
  } catch (error) {
    console.error('Low stock alerts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching low stock alerts'
    });
  }
};

/**
 * @desc    Get inventory statistics
 * @route   GET /api/v1/dashboard/stats
 * @access  Private/Admin
 */
const getInventoryStats = async (req, res) => {
  try {
    const stats = await Part.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalParts: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' },
          avgPrice: { $avg: '$sellingPrice' },
          maxPrice: { $max: '$sellingPrice' },
          minPrice: { $min: '$sellingPrice' },
          totalViews: { $sum: '$views' },
          totalSales: { $sum: '$salesCount' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: stats[0] || {}
    });
  } catch (error) {
    console.error('Inventory stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching inventory stats'
    });
  }
};

module.exports = {
  getDashboardSummary,
  getLowStockAlerts,
  getInventoryStats
};
