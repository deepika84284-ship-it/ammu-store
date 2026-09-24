const express = require('express');
const router = express.Router();
const dbStore = require('../utils/dbStore');
const { protect, adminOnly } = require('../middleware/auth');

// @route   POST /api/orders
// @desc    Create a new order (customer or guest)
router.post('/', async (req, res) => {
  try {
    const { customerName, phone, email, items, totalAmount, shippingAddress, paymentMethod, userId } = req.body;

    if (!customerName || !phone || !email || !items || items.length === 0 || !shippingAddress) {
      return res.status(400).json({ success: false, message: 'Please provide all required checkout details' });
    }

    const allOrders = await dbStore.getOrders();
    const count = allOrders.length;
    const orderId = `AMMU${1001 + count}`;

    const orderPayload = {
      orderId,
      userId: userId || null,
      customerName,
      phone,
      email,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || 'Test Order',
      paymentStatus: paymentMethod === 'Test Order' ? 'Paid' : 'Pending',
      orderStatus: 'Pending'
    };

    const newOrder = await dbStore.createOrder(orderPayload);
    console.log(`[Order Placed] ID: ${newOrder.orderId}, Customer: ${customerName}, Amount: ₹${totalAmount}`);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order: newOrder
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   GET /api/orders/my-orders
router.get('/my-orders', async (req, res) => {
  try {
    const { phone, userId } = req.query;
    if (!phone && !userId) {
      return res.status(400).json({ success: false, message: 'Please provide phone number or user ID' });
    }

    const orders = await dbStore.getOrders({ phone, userId });
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/orders/:id
router.get('/:id', async (req, res) => {
  try {
    const order = await dbStore.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/admin/orders
router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.query;
    const orders = await dbStore.getOrders({ orderStatus: status });
    const stats = await dbStore.countOrderStats();

    res.json({ success: true, stats, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PATCH /api/admin/orders/:id/status
router.patch('/admin/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid order status' });
    }

    const order = await dbStore.updateOrderStatus(req.params.id, orderStatus);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    console.log(`[Order Status Updated] ${order.orderId} -> ${orderStatus}`);

    res.json({
      success: true,
      message: `Order status updated to ${orderStatus}`,
      order
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
