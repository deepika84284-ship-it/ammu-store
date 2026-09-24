const mongoose = require('mongoose');

const albumPhotoSchema = new mongoose.Schema({
  url: { type: String, required: true },
  order: { type: Number, default: 1 },
  caption: { type: String, default: '' },
  filter: { type: String, default: 'Original' }
}, { _id: false });

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  productName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  },
  price: {
    type: Number,
    required: true
  },
  frame: {
    type: String,
    default: 'Classic'
  },
  size: {
    type: String,
    default: '8 × 10 inch'
  },
  filter: {
    type: String,
    default: 'Original'
  },
  originalImageUrl: {
    type: String,
    default: ''
  },
  customizedImageUrl: {
    type: String,
    default: ''
  },
  customText: {
    type: String,
    default: ''
  }
}, { _id: false });

const shippingAddressSchema = new mongoose.Schema({
  doorNo: { type: String, required: true },
  street: { type: String, required: true },
  area: { type: String, default: '' },
  city: { type: String, required: true },
  district: { type: String, default: '' },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  deliveryInstructions: { type: String, default: '' }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  customerName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  albumTitle: {
    type: String,
    default: 'Our Beautiful Memories'
  },
  albumSize: {
    type: String,
    default: '8 × 10 inch'
  },
  albumStyle: {
    type: String,
    default: 'Classic'
  },
  photoCount: {
    type: Number,
    default: 1
  },
  coverPhoto: {
    type: String,
    default: ''
  },
  photos: [albumPhotoSchema],
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true
  },
  shippingAddress: {
    type: shippingAddressSchema,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['Test Order', 'UPI Payment', 'Cash on Delivery'],
    default: 'UPI Payment'
  },
  utrNumber: {
    type: String,
    default: ''
  },
  paymentScreenshotUrl: {
    type: String,
    default: ''
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Verification Pending', 'Paid', 'Payment Rejected', 'Failed'],
    default: 'Verification Pending'
  },
  orderStatus: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
