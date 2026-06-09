const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

// GET all orders
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.branch && req.query.branch !== 'all') filter.branch = req.query.branch;
    if (req.query.status) filter.status = req.query.status;

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: orders, count: orders.length });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST create order (auto-deducts stock)
router.post('/', async (req, res) => {
  try {
    const { product: productId, quantity, branch, customerName, customerPhone, notes } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
    if (product.stock < quantity) return res.status(400).json({ success: false, error: `Only ${product.stock} units available` });

    // Deduct stock
    product.stock -= quantity;
    await product.save();

    const order = new Order({
      product: productId,
      productName: product.name,
      quantity,
      amount: product.price * quantity,
      branch,
      customerName: customerName || 'Walk-in Customer',
      customerPhone: customerPhone || '',
      notes: notes || ''
    });

    await order.save();
    res.status(201).json({ success: true, data: order, message: 'Order placed successfully' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// PATCH update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!order) return res.status(404).json({ success: false, error: 'Order not found' });
    res.json({ success: true, data: order, message: 'Status updated' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// GET revenue stats
router.get('/stats/revenue', async (req, res) => {
  try {
    const filter = {};
    if (req.query.branch && req.query.branch !== 'all') filter.branch = req.query.branch;

    const today = new Date(); today.setHours(0, 0, 0, 0);
    const todayOrders = await Order.find({ ...filter, createdAt: { $gte: today } });
    const todayRevenue = todayOrders.reduce((s, o) => s + o.amount, 0);
    const totalOrders = await Order.countDocuments(filter);
    const totalRevenue = (await Order.find(filter)).reduce((s, o) => s + o.amount, 0);

    res.json({ success: true, data: { todayRevenue, todayOrders: todayOrders.length, totalOrders, totalRevenue } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
