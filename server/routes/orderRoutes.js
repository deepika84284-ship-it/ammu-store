const express = require('express');
const router = express.Router();
const dbStore = require('../utils/dbStore');
const { protect, adminOnly } = require('../middleware/auth');

// @route   POST /api/orders
// @desc    Create a new photo album or frame order
router.post('/', async (req, res) => {
  try {
    const { 
      customerName, phone, email, items, totalAmount, shippingAddress, 
      paymentMethod, utrNumber, paymentScreenshotUrl, userId,
      albumTitle, albumSize, albumStyle, photoCount, coverPhoto, photos 
    } = req.body;

    if (!customerName || !phone || !email || !items || items.length === 0 || !shippingAddress) {
      return res.status(400).json({ success: false, message: 'Please provide all required checkout details' });
    }

    if (paymentMethod === 'UPI Payment' && !utrNumber) {
      return res.status(400).json({ success: false, message: 'Please enter your 12-digit UPI Transaction ID / UTR Number' });
    }

    const allOrders = await dbStore.getOrders();
    const count = allOrders.length;
    const orderId = `AMMU${1001 + count}`;

    // Determine initial payment status
    let paymentStatus = 'Verification Pending';
    if (paymentMethod === 'Test Order') {
      paymentStatus = 'Paid';
    } else if (paymentMethod === 'Cash on Delivery') {
      paymentStatus = 'Pending';
    } else if (paymentMethod === 'UPI Payment') {
      paymentStatus = 'Verification Pending';
    }

    const orderPayload = {
      orderId,
      userId: userId || null,
      customerName,
      phone,
      email,
      albumTitle: albumTitle || items[0]?.productName || 'Custom Photo Album',
      albumSize: albumSize || items[0]?.size || '8 × 10 inch',
      albumStyle: albumStyle || items[0]?.frame || 'Classic',
      photoCount: photoCount || (photos ? photos.length : 1),
      coverPhoto: coverPhoto || (photos && photos.length > 0 ? photos[0].url : items[0]?.customizedImageUrl || ''),
      photos: photos || [],
      items,
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || 'UPI Payment',
      utrNumber: utrNumber || '',
      paymentScreenshotUrl: paymentScreenshotUrl || '',
      paymentStatus,
      orderStatus: paymentMethod === 'Test Order' ? 'Confirmed' : 'Pending'
    };

    const newOrder = await dbStore.createOrder(orderPayload);
    console.log(`[Album Order Placed] ID: ${newOrder.orderId}, Title: ${newOrder.albumTitle}, Photos: ${newOrder.photoCount}, Payment: ${paymentMethod}`);

    res.status(201).json({
      success: true,
      message: 'Album order placed successfully!',
      order: newOrder
    });
  } catch (error) {
    console.error('[Order Controller Error]:', error);
    res.status(400).json({ success: false, message: error.message || 'Failed to place album order' });
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

// @route   PATCH /api/admin/orders/:id/payment-verify
router.patch('/admin/:id/payment-verify', protect, adminOnly, async (req, res) => {
  try {
    const { action } = req.body; // 'confirm' | 'reject'
    let paymentStatus = 'Verification Pending';
    let orderStatus = 'Pending';

    if (action === 'confirm') {
      paymentStatus = 'Paid';
      orderStatus = 'Confirmed';
    } else if (action === 'reject') {
      paymentStatus = 'Payment Rejected';
      orderStatus = 'Cancelled';
    } else {
      return res.status(400).json({ success: false, message: 'Invalid verification action' });
    }

    const order = await dbStore.verifyPayment(req.params.id, paymentStatus, orderStatus);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    console.log(`[Admin Payment Verification] Order ${order.orderId}: Payment -> ${paymentStatus}, Order -> ${orderStatus}`);

    res.json({
      success: true,
      message: `Payment ${action === 'confirm' ? 'Confirmed' : 'Rejected'} successfully`,
      order
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
