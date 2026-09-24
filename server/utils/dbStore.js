const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');
const User = require('../models/User');

const dataFilePath = path.join(__dirname, '../data_fallback.json');

const getAdminPasswordHash = () => {
  return bcrypt.hashSync('admin123', 10);
};

const initialAdmin = {
  _id: 'user_admin_1',
  name: 'Ammu Admin',
  email: 'admin@ammuframestore.com',
  password: getAdminPasswordHash(),
  phone: '9876543210',
  role: 'admin',
  address: {
    doorNo: '100',
    street: 'Gallery Street',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600001'
  }
};

const initialCategories = [
  { _id: 'cat_1', name: 'Mini Memories', slug: 'mini-memories', description: 'Tiny digital memories starting at ₹1', order: 1 },
  { _id: 'cat_2', name: 'Classic Frames', slug: 'classic-frames', description: 'Timeless wooden borders', order: 2 },
  { _id: 'cat_3', name: 'Couple Frames', slug: 'couple-frames', description: 'Romantic moments & anniversaries', order: 3 },
  { _id: 'cat_4', name: 'Family Frames', slug: 'family-frames', description: 'Warm family portraits', order: 4 },
  { _id: 'cat_5', name: 'Parents', slug: 'parents', description: 'Mom & Dad special frames', order: 5 },
  { _id: 'cat_6', name: 'Grandparents', slug: 'grandparents', description: 'Cherished heritage memories', order: 6 },
  { _id: 'cat_7', name: 'Wedding Frames', slug: 'wedding-frames', description: 'Royal wedding albums & filigree gold', order: 7 },
  { _id: 'cat_8', name: 'Birthday', slug: 'birthday', description: 'Celebration frames', order: 8 },
  { _id: 'cat_9', name: 'Baby', slug: 'baby', description: 'Cute baby milestones', order: 9 },
  { _id: 'cat_10', name: 'Friendship', slug: 'friendship', description: 'Squad memories', order: 10 },
  { _id: 'cat_11', name: 'Memories', slug: 'memories', description: 'Travel & highlight moments', order: 11 },
  { _id: 'cat_12', name: 'Custom Collage', slug: 'custom-collage', description: 'Multi-photo grid canvas', order: 12 },
  { _id: 'cat_13', name: 'Premium Frames', slug: 'premium-frames', description: 'Acrylic & glass artwork', order: 13 }
];

const initialProducts = [
  {
    _id: 'prod_1',
    name: 'Mini Memory Frame (₹1 Test Order)',
    category: 'Mini Memories',
    price: 1,
    originalPrice: 49,
    description: 'Create a tiny digital memory frame! Perfect for instant testing of photo upload, live customization, and complete order workflow verification.',
    dimensions: '4 × 6 inch',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    frameType: 'Classic',
    isFeatured: true,
    badge: '⚡ TEST FLOW ₹1',
    availableSizes: [{ label: '4 × 6 inch', priceAdjustment: 0 }, { label: '5 × 7 inch', priceAdjustment: 10 }]
  },
  {
    _id: 'prod_2',
    name: 'Classic Memory Frame',
    category: 'Classic Frames',
    price: 99,
    originalPrice: 199,
    description: 'Elegant minimalist matte frame with protective cover. Turns any snapshot into gallery art.',
    dimensions: '8 × 10 inch',
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
    frameType: 'Classic Oak',
    isFeatured: true,
    badge: 'BESTSELLER',
    availableSizes: [{ label: '8 × 10 inch', priceAdjustment: 0 }, { label: '10 × 12 inch', priceAdjustment: 50 }, { label: '12 × 18 inch', priceAdjustment: 100 }]
  },
  {
    _id: 'prod_3',
    name: 'Love & Togetherness Frame',
    category: 'Couple Frames',
    price: 199,
    originalPrice: 399,
    description: 'Romantic deep mahogany wooden frame with custom warm glow backdrop.',
    dimensions: '10 × 12 inch',
    imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80',
    frameType: 'Deep Mahogany',
    isFeatured: true,
    badge: 'POPULAR',
    availableSizes: [{ label: '10 × 12 inch', priceAdjustment: 0 }, { label: '12 × 18 inch', priceAdjustment: 100 }, { label: '16 × 24 inch', priceAdjustment: 200 }]
  },
  {
    _id: 'prod_4',
    name: 'Family Memories Frame',
    category: 'Family Frames',
    price: 299,
    originalPrice: 599,
    description: 'Spacious wide matting frame designed to showcase family reunions and smiles.',
    dimensions: '12 × 18 inch',
    imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80',
    frameType: 'Rustic Walnut',
    isFeatured: true,
    badge: 'FAMILY CHOICE',
    availableSizes: [{ label: '12 × 18 inch', priceAdjustment: 0 }, { label: '18 × 24 inch', priceAdjustment: 150 }]
  },
  {
    _id: 'prod_5',
    name: 'Golden Memories Royal Frame',
    category: 'Premium Frames',
    price: 399,
    originalPrice: 799,
    description: 'Handcrafted golden ornate border frame featuring museum-grade cover.',
    dimensions: '14 × 20 inch',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
    frameType: 'Royal Gold',
    isFeatured: true,
    badge: 'LUXURY',
    availableSizes: [{ label: '14 × 20 inch', priceAdjustment: 0 }, { label: '18 × 24 inch', priceAdjustment: 180 }]
  },
  {
    _id: 'prod_6',
    name: 'Royal Wedding Story Frame',
    category: 'Wedding Frames',
    price: 599,
    originalPrice: 1199,
    description: 'Grand wedding portrait frame with golden leaf filigree border.',
    dimensions: '20 × 30 inch',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    frameType: 'Golden Filigree',
    isFeatured: true,
    badge: 'WEDDING SPECIAL',
    availableSizes: [{ label: '20 × 30 inch', priceAdjustment: 0 }, { label: '24 × 36 inch', priceAdjustment: 300 }]
  }
];

class DBStore {
  constructor() {
    this.isMongoConnected = false;
    this.data = {
      users: [{ ...initialAdmin, password: getAdminPasswordHash() }],
      categories: initialCategories,
      products: initialProducts,
      orders: []
    };
    this.loadFallbackData();
  }

  loadFallbackData() {
    try {
      if (fs.existsSync(dataFilePath)) {
        const raw = fs.readFileSync(dataFilePath, 'utf8');
        const parsed = JSON.parse(raw);
        this.data = { ...this.data, ...parsed };
      }
      const adminIdx = this.data.users.findIndex(u => u.email === 'admin@ammuframestore.com');
      if (adminIdx !== -1) {
        this.data.users[adminIdx].password = getAdminPasswordHash();
      } else {
        this.data.users.push({ ...initialAdmin, password: getAdminPasswordHash() });
      }
      this.saveFallbackData();
    } catch (e) {
      console.warn('Fallback data load warning:', e.message);
    }
  }

  saveFallbackData() {
    try {
      fs.writeFileSync(dataFilePath, JSON.stringify(this.data, null, 2));
    } catch (e) {
      console.error('Fallback data save error:', e.message);
    }
  }

  setMongoConnected(connected) {
    this.isMongoConnected = connected;
    console.log(`[DBStore Mode]: ${connected ? 'MongoDB Atlas / Local Mongo' : 'In-Memory / File Fallback Mode (Instant Active)'}`);
  }

  // --- USERS ---
  async getUserByEmail(email) {
    if (this.isMongoConnected) {
      try {
        const u = await User.findOne({ email });
        if (u) return u;
      } catch (e) {}
    }
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  async getUserById(id) {
    if (this.isMongoConnected) {
      try {
        const u = await User.findById(id);
        if (u) return u;
      } catch (e) {}
    }
    return this.data.users.find(u => u._id === id || u.id === id);
  }

  async createUser(userData) {
    if (this.isMongoConnected) {
      try {
        return await User.create(userData);
      } catch (e) {}
    }
    const newUser = { _id: `user_${Date.now()}`, ...userData, createdAt: new Date() };
    this.data.users.push(newUser);
    this.saveFallbackData();
    return newUser;
  }

  // --- PRODUCTS ---
  async getProducts(filter = {}) {
    if (this.isMongoConnected) {
      try {
        let query = {};
        if (filter.category && filter.category !== 'All') query.category = filter.category;
        if (filter.search) query.name = { $regex: filter.search, $options: 'i' };
        return await Product.find(query).sort({ createdAt: -1 });
      } catch (e) {}
    }

    let prods = [...this.data.products];
    if (filter.category && filter.category !== 'All') {
      prods = prods.filter(p => p.category === filter.category);
    }
    if (filter.search) {
      const s = filter.search.toLowerCase();
      prods = prods.filter(p => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s));
    }
    return prods;
  }

  async getProductById(id) {
    if (this.isMongoConnected) {
      try {
        const p = await Product.findById(id);
        if (p) return p;
      } catch (e) {}
    }
    return this.data.products.find(p => p._id === id || p.id === id);
  }

  async createProduct(productData) {
    if (this.isMongoConnected) {
      try {
        return await Product.create(productData);
      } catch (e) {}
    }
    const newProd = { _id: `prod_${Date.now()}`, ...productData, createdAt: new Date() };
    this.data.products.unshift(newProd);
    this.saveFallbackData();
    return newProd;
  }

  async updateProduct(id, productData) {
    if (this.isMongoConnected) {
      try {
        return await Product.findByIdAndUpdate(id, productData, { new: true });
      } catch (e) {}
    }
    const idx = this.data.products.findIndex(p => p._id === id);
    if (idx !== -1) {
      this.data.products[idx] = { ...this.data.products[idx], ...productData, updatedAt: new Date() };
      this.saveFallbackData();
      return this.data.products[idx];
    }
    return null;
  }

  async deleteProduct(id) {
    if (this.isMongoConnected) {
      try {
        return await Product.findByIdAndDelete(id);
      } catch (e) {}
    }
    const idx = this.data.products.findIndex(p => p._id === id);
    if (idx !== -1) {
      const deleted = this.data.products.splice(idx, 1);
      this.saveFallbackData();
      return deleted[0];
    }
    return null;
  }

  // --- CATEGORIES ---
  async getCategories() {
    if (this.isMongoConnected) {
      try {
        const cats = await Category.find().sort({ order: 1 });
        if (cats.length > 0) return cats;
      } catch (e) {}
    }
    return this.data.categories;
  }

  // --- ORDERS ---
  async createOrder(orderPayload) {
    if (this.isMongoConnected) {
      try {
        return await Order.create(orderPayload);
      } catch (e) {}
    }
    const newOrder = {
      _id: `ord_${Date.now()}`,
      ...orderPayload,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.data.orders.unshift(newOrder);
    this.saveFallbackData();
    return newOrder;
  }

  async getOrders(filter = {}) {
    if (this.isMongoConnected) {
      try {
        let query = {};
        if (filter.orderStatus && filter.orderStatus !== 'All') query.orderStatus = filter.orderStatus;
        if (filter.phone) query.phone = filter.phone;
        if (filter.userId) query.userId = filter.userId;
        return await Order.find(query).sort({ createdAt: -1 });
      } catch (e) {}
    }

    let ords = [...this.data.orders];
    if (filter.orderStatus && filter.orderStatus !== 'All') {
      ords = ords.filter(o => o.orderStatus === filter.orderStatus);
    }
    if (filter.phone) {
      ords = ords.filter(o => o.phone === filter.phone);
    }
    if (filter.userId) {
      ords = ords.filter(o => o.userId === filter.userId);
    }
    return ords;
  }

  async getOrderById(idOrOrderId) {
    if (this.isMongoConnected) {
      try {
        let ord;
        if (idOrOrderId.startsWith('AMMU')) {
          ord = await Order.findOne({ orderId: idOrOrderId });
        } else {
          ord = await Order.findById(idOrOrderId);
        }
        if (ord) return ord;
      } catch (e) {}
    }

    return this.data.orders.find(o => o._id === idOrOrderId || o.orderId === idOrOrderId);
  }

  async updateOrderStatus(id, orderStatus) {
    if (this.isMongoConnected) {
      try {
        const ord = await Order.findByIdAndUpdate(id, { orderStatus, updatedAt: new Date() }, { new: true });
        if (ord) return ord;
      } catch (e) {}
    }

    const ord = this.data.orders.find(o => o._id === id || o.orderId === id);
    if (ord) {
      ord.orderStatus = orderStatus;
      ord.updatedAt = new Date();
      this.saveFallbackData();
      return ord;
    }
    return null;
  }

  async verifyPayment(id, paymentStatus, orderStatus) {
    if (this.isMongoConnected) {
      try {
        const ord = await Order.findByIdAndUpdate(id, { paymentStatus, orderStatus, updatedAt: new Date() }, { new: true });
        if (ord) return ord;
      } catch (e) {}
    }

    const ord = this.data.orders.find(o => o._id === id || o.orderId === id);
    if (ord) {
      ord.paymentStatus = paymentStatus;
      ord.orderStatus = orderStatus;
      ord.updatedAt = new Date();
      this.saveFallbackData();
      return ord;
    }
    return null;
  }

  async countOrderStats() {
    const all = await this.getOrders();
    return {
      total: all.length,
      pending: all.filter(o => o.orderStatus === 'Pending').length,
      confirmed: all.filter(o => o.orderStatus === 'Confirmed').length,
      processing: all.filter(o => o.orderStatus === 'Processing').length,
      shipped: all.filter(o => o.orderStatus === 'Shipped' || o.orderStatus === 'Out for Delivery').length,
      delivered: all.filter(o => o.orderStatus === 'Delivered').length
    };
  }
}

const dbStore = new DBStore();
module.exports = dbStore;
