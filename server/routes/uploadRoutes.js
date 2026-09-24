const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary if env vars are present
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

// Multer disk storage fallback setup
const uploadsDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadsDir);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `photo_${Date.now()}_${Math.round(Math.random() * 1E9)}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedTypes.test(file.mimetype);

  if (extName && mimeType) {
    return cb(null, true);
  } else {
    cb(new Error('Only JPG, JPEG, PNG, and WebP images are allowed!'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter
});

// @route   POST /api/upload
// @desc    Upload customer image (Cloudinary or local static url fallback)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select an image file to upload' });
    }

    let imageUrl = '';

    // Try uploading to Cloudinary if configured
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'ammu_frame_store',
          transformation: [{ width: 1200, crop: 'limit', quality: 'auto' }]
        });
        imageUrl = result.secure_url;
        // Clean up local temp file
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      } catch (cloudErr) {
        console.warn('[Cloudinary Warning] Upload failed, falling back to static server path:', cloudErr.message);
        imageUrl = `/uploads/${req.file.filename}`;
      }
    } else {
      // Local server fallback URL
      imageUrl = `/uploads/${req.file.filename}`;
    }

    res.json({
      success: true,
      message: 'Photo uploaded successfully!',
      imageUrl
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
