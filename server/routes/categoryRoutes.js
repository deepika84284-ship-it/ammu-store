const express = require('express');
const router = express.Router();
const dbStore = require('../utils/dbStore');

// @route   GET /api/categories
router.get('/', async (req, res) => {
  try {
    const categories = await dbStore.getCategories();
    res.json({ success: true, count: categories.length, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
