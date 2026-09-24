const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../server/.env') });
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const connectDB = require('../server/config/db');
const seedData = require('../server/utils/seedData');

const authRoutes = require('../server/routes/authRoutes');
const productRoutes = require('../server/routes/productRoutes');
const categoryRoutes = require('../server/routes/categoryRoutes');
const orderRoutes = require('../server/routes/orderRoutes');
const uploadRoutes = require('../server/routes/uploadRoutes');

const app = express();

// Connect DB
connectDB().then(() => {
  seedData();
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'AMMU FRAME STORE API (Vercel Serverless)',
    tagline: 'Your Memories. Our Frames. One Beautiful Story.',
    timestamp: new Date()
  });
});

module.exports = app;
