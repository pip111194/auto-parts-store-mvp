const express = require('express');
const router = express.Router();
const {
  uploadSingleImage,
  uploadMultiple,
  deleteUploadedImage
} = require('../controllers/uploadController');
const { protect, authorize } = require('../middleware/auth');
const { upload, handleMulterError } = require('../middleware/upload');

// All upload routes are admin only
router.use(protect, authorize('admin'));

router.post('/image', upload.single('image'), handleMulterError, uploadSingleImage);
router.post('/multiple', upload.array('images', 5), handleMulterError, uploadMultiple);
router.delete('/:publicId', deleteUploadedImage);

module.exports = router;
