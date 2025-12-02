const { uploadImage, uploadMultipleImages, deleteImage } = require('../config/cloudinary');
const fs = require('fs').promises;

/**
 * @desc    Upload single image
 * @route   POST /api/v1/upload/image
 * @access  Private/Admin
 */
const uploadSingleImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image'
      });
    }

    // Save buffer to temporary file
    const tempPath = `/tmp/${Date.now()}-${req.file.originalname}`;
    await fs.writeFile(tempPath, req.file.buffer);

    // Upload to Cloudinary
    const result = await uploadImage(tempPath, 'auto-parts');

    // Clean up temp file
    await fs.unlink(tempPath);

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: result
    });
  } catch (error) {
    console.error('Upload image error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while uploading image'
    });
  }
};

/**
 * @desc    Upload multiple images
 * @route   POST /api/v1/upload/multiple
 * @access  Private/Admin
 */
const uploadMultiple = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload at least one image'
      });
    }

    // Save buffers to temporary files
    const tempFiles = [];
    for (const file of req.files) {
      const tempPath = `/tmp/${Date.now()}-${file.originalname}`;
      await fs.writeFile(tempPath, file.buffer);
      tempFiles.push({ path: tempPath });
    }

    // Upload to Cloudinary
    const results = await uploadMultipleImages(tempFiles, 'auto-parts');

    // Clean up temp files
    for (const file of tempFiles) {
      await fs.unlink(file.path);
    }

    res.status(200).json({
      success: true,
      message: 'Images uploaded successfully',
      count: results.length,
      data: results
    });
  } catch (error) {
    console.error('Upload multiple images error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while uploading images'
    });
  }
};

/**
 * @desc    Delete image
 * @route   DELETE /api/v1/upload/:publicId
 * @access  Private/Admin
 */
const deleteUploadedImage = async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'Public ID is required'
      });
    }

    // Decode public ID (it might be URL encoded)
    const decodedPublicId = decodeURIComponent(publicId);

    await deleteImage(decodedPublicId);

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting image'
    });
  }
};

module.exports = {
  uploadSingleImage,
  uploadMultiple,
  deleteUploadedImage
};
