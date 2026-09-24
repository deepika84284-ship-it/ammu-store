const express = require('express');
const router = express.Router();
const dbStore = require('../utils/dbStore');
const { protect, adminOnly } = require('../middleware/auth');

// @route   GET /api/products
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    const products = await dbStore.getProducts({ category, search });
    res.json({ success: true, count: products.length, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await dbStore.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product frame not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/products
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const product = await dbStore.createProduct(req.body);
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/products/:id
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await dbStore.updateProduct(req.params.id, req.body);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/products/:id
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await dbStore.deleteProduct(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
