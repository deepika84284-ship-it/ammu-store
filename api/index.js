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

// Connect DB at startup & per request middleware
connectDB().then(() => {
  seedData();
}).catch((e) => console.warn('[Seed Startup Warning]:', e.message));

app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (e) {
    console.warn('[DB Middleware Warning]:', e.message);
  }
  next();
});

// Configure CORS to accept requests from Vercel deployed frontend & localhost
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'AMMU FRAME STORE API (Vercel Serverless)',
    tagline: 'Your Memories. Our Frames. One Beautiful Story.',
    timestamp: new Date()
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'AMMU FRAME STORE API (Vercel Serverless)',
    timestamp: new Date()
  });
});

// API Routes mounted on both /api/path and /path for Vercel rewrite compatibility
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/products', productRoutes);
app.use('/products', productRoutes);

app.use('/api/categories', categoryRoutes);
app.use('/categories', categoryRoutes);

app.use('/api/orders', orderRoutes);
app.use('/orders', orderRoutes);

app.use('/api/upload', uploadRoutes);
app.use('/upload', uploadRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Vercel Serverless Error]:', err.stack || err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

module.exports = app;
