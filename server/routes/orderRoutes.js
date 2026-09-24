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

    console.log('[API Order Request Received]:', {
      customerName,
      phone,
      email,
      paymentMethod,
      totalAmount,
      itemsCount: items ? items.length : 0,
      albumTitle: albumTitle || (items && items[0] ? items[0].albumTitle : undefined)
    });

    if (!customerName || !phone || !email || !items || items.length === 0 || !shippingAddress) {
      console.warn('[Order Validation Failed]: Missing required fields');
      return res.status(400).json({ success: false, message: 'Please provide customer name, contact details, shipping address, and at least 1 cart item' });
    }

    if (paymentMethod === 'UPI Payment' && !utrNumber) {
      console.warn('[Order Validation Failed]: Missing UTR number for UPI Payment');
      return res.status(400).json({ success: false, message: 'Please enter your 12-digit UPI Transaction ID / UTR Number' });
    }

    const generateUniqueOrderId = async () => {
      try {
        const allOrders = await dbStore.getOrders();
        let baseCount = allOrders.length;
        let candidate = `AMMU${1001 + baseCount}`;
        let attempt = 0;

        while (attempt < 50) {
          const existing = await dbStore.getOrderById(candidate);
          if (!existing) {
            return candidate;
          }
          attempt++;
          candidate = `AMMU${1001 + baseCount + attempt}`;
        }
      } catch (e) {
        console.warn('[OrderId Generation Notice]:', e.message);
      }
      return `AMMU${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 90 + 10)}`;
    };

    const orderId = await generateUniqueOrderId();

    // Determine initial payment status
    let paymentStatus = 'Verification Pending';
    if (paymentMethod === 'Test Order') {
      paymentStatus = 'Paid';
    } else if (paymentMethod === 'Cash on Delivery') {
      paymentStatus = 'Pending';
    } else if (paymentMethod === 'UPI Payment') {
      paymentStatus = 'Verification Pending';
    }

    const firstItem = items[0] || {};
    const orderPayload = {
      orderId,
      userId: userId || null,
      customerName,
      phone,
      email,
      albumTitle: albumTitle || firstItem.albumTitle || firstItem.productName || 'Custom Photo Album',
      albumSize: albumSize || firstItem.albumSize || firstItem.size || '8 × 10 inch',
      albumStyle: albumStyle || firstItem.albumStyle || firstItem.frame || 'Classic',
      photoCount: photoCount || (photos ? photos.length : (firstItem.photos ? firstItem.photos.length : 1)),
      coverPhoto: coverPhoto || (photos && photos.length > 0 ? photos[0].url : (firstItem.coverPhoto || firstItem.customizedImageUrl || '')),
      photos: photos && photos.length > 0 ? photos : (firstItem.photos || []),
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
    console.log(`[Album Order Placed Successfully] Order ID: ${newOrder.orderId}, Title: "${newOrder.albumTitle}", Total: ₹${newOrder.totalAmount}, Payment: ${paymentMethod}`);

    res.status(201).json({
      success: true,
      message: 'Album order placed successfully!',
      order: newOrder
    });
  } catch (error) {
    console.error('[Order Controller Error Exception]:', error);
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
