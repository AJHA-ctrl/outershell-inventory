const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET all products (with optional branch filter)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.branch && req.query.branch !== 'all') filter.branch = req.query.branch;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) filter.name = { $regex: req.query.search, $options: 'i' };

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: products, count: products.length });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST create product
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ success: true, data: product, message: 'Product added successfully' });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ success: false, error: 'SKU already exists' });
    res.status(400).json({ success: false, error: err.message });
  }
});

// PUT update product
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
    res.json({ success: true, data: product, message: 'Product updated successfully' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// PATCH update stock only
router.patch('/:id/stock', async (req, res) => {
  try {
    const { stock } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
    product.stock = stock;
    await product.save();
    res.json({ success: true, data: product, message: 'Stock updated' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET dashboard stats
router.get('/stats/dashboard', async (req, res) => {
  try {
    const branch = req.query.branch;
    const filter = branch && branch !== 'all' ? { branch } : {};

    const total = await Product.countDocuments(filter);
    const outOfStock = await Product.countDocuments({ ...filter, status: 'Out of Stock' });
    const lowStock = await Product.countDocuments({ ...filter, status: 'Low Stock' });
    const products = await Product.find(filter);
    const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);

    res.json({ success: true, data: { total, outOfStock, lowStock, totalValue, totalStock } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
