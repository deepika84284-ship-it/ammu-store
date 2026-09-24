const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Mini Memories',
      'Classic Frames',
      'Couple Frames',
      'Family Frames',
      'Parents',
      'Grandparents',
      'Wedding Frames',
      'Birthday',
      'Baby',
      'Friendship',
      'Memories',
      'Custom Collage',
      'Premium Frames'
    ]
  },
  price: {
    type: Number,
    required: true
  },
  originalPrice: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    required: true
  },
  dimensions: {
    type: String,
    default: '12 × 18 inch'
  },
  availableSizes: [{
    label: String,
    priceAdjustment: Number
  }],
  imageUrl: {
    type: String,
    required: true
  },
  frameType: {
    type: String,
    default: 'Classic'
  },
  availableFrames: [{
    id: String,
    name: String,
    borderStyle: String,
    color: String,
    texture: String,
    priceExtra: Number
  }],
  isFeatured: {
    type: Boolean,
    default: false
  },
  inStock: {
    type: Boolean,
    default: true
  },
  badge: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
