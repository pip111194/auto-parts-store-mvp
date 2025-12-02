const express = require('express');
const router = express.Router();
const {
  getDashboardSummary,
  getLowStockAlerts,
  getInventoryStats
} = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/auth');

// All dashboard routes are admin only
router.use(protect, authorize('admin'));

router.get('/summary', getDashboardSummary);
router.get('/low-stock', getLowStockAlerts);
router.get('/stats', getInventoryStats);

module.exports = router;
