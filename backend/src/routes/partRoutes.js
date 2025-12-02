const express = require('express');
const router = express.Router();
const {
  getParts,
  getPart,
  createPart,
  updatePart,
  deletePart,
  searchParts,
  updateStock
} = require('../controllers/partController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getParts);
router.get('/search/:query', searchParts);
router.get('/:id', getPart);

// Protected routes (Admin only)
router.post('/', protect, authorize('admin'), createPart);
router.put('/:id', protect, authorize('admin'), updatePart);
router.delete('/:id', protect, authorize('admin'), deletePart);
router.patch('/:id/stock', protect, authorize('admin'), updateStock);

module.exports = router;
