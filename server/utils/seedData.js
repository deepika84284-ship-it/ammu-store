const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');

const seedData = async () => {
  try {
    // Check if products exist
    const count = await Product.countDocuments();
    if (count > 0) {
      console.log('[Seed] Database already seeded with products.');
      return;
    }

    console.log('[Seed] Seeding initial database categories, products, and admin account...');

    // Categories
    const categoriesData = [
      { name: 'Mini Memories', slug: 'mini-memories', description: 'Tiny digital memories and desk frames starting at ₹1', order: 1 },
      { name: 'Classic Frames', slug: 'classic-frames', description: 'Timeless wooden & sleek borders for everyday moments', order: 2 },
      { name: 'Couple Frames', slug: 'couple-frames', description: 'Romantic moments, anniversaries and togetherness', order: 3 },
      { name: 'Family Frames', slug: 'family-frames', description: 'Warm family portraits and generational memories', order: 4 },
      { name: 'Parents', slug: 'parents', description: 'Special honor frames for Mom & Dad', order: 5 },
      { name: 'Grandparents', slug: 'grandparents', description: 'Cherished heritage & golden years', order: 6 },
      { name: 'Wedding Frames', slug: 'wedding-frames', description: 'Royal wedding albums & metallic gold engraved frames', order: 7 },
      { name: 'Birthday', slug: 'birthday', description: 'Vibrant celebration frames with customizable text', order: 8 },
      { name: 'Baby', slug: 'baby', description: 'Cute baby milestones & monthly memories', order: 9 },
      { name: 'Friendship', slug: 'friendship', description: 'Fun friendship memories and squad photo collages', order: 10 },
      { name: 'Memories', slug: 'memories', description: 'Travel, milestones and special highlight moments', order: 11 },
      { name: 'Custom Collage', slug: 'custom-collage', description: 'Multi-photo grid canvas & floating shadow boxes', order: 12 },
      { name: 'Premium Frames', slug: 'premium-frames', description: 'Luxurious acrylic, glassmorphism & LED framed artwork', order: 13 }
    ];

    await Category.deleteMany({});
    await Category.insertMany(categoriesData);

    // Initial Products
    const productsData = [
      {
        name: 'Mini Memory Frame (₹1 Test Order)',
        category: 'Mini Memories',
        price: 1,
        originalPrice: 49,
        description: 'Create a tiny digital memory frame! Perfect for instant testing of full customization, photo uploading, and complete order workflow verification.',
        dimensions: '4 × 6 inch',
        imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
        frameType: 'Mini Wood',
        isFeatured: true,
        badge: '⚡ TEST FLOW ₹1',
        availableSizes: [
          { label: '4 × 6 inch', priceAdjustment: 0 },
          { label: '5 × 7 inch', priceAdjustment: 10 }
        ]
      },
      {
        name: 'Classic Memory Frame',
        category: 'Classic Frames',
        price: 99,
        originalPrice: 199,
        description: 'Elegant minimalist matte frame with protective acrylic glass. Turns any quick snapshot into a gallery piece.',
        dimensions: '8 × 10 inch',
        imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
        frameType: 'Classic Oak',
        isFeatured: true,
        badge: 'BESTSELLER',
        availableSizes: [
          { label: '8 × 10 inch', priceAdjustment: 0 },
          { label: '10 × 12 inch', priceAdjustment: 50 },
          { label: '12 × 18 inch', priceAdjustment: 100 }
        ]
      },
      {
        name: 'Love & Togetherness Frame',
        category: 'Couple Frames',
        price: 199,
        originalPrice: 399,
        description: 'Romantic deep mahogany wooden frame with custom heart accent corner and soft warm glow backdrop.',
        dimensions: '10 × 12 inch',
        imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80',
        frameType: 'Deep Mahogany',
        isFeatured: true,
        badge: 'POPULAR',
        availableSizes: [
          { label: '10 × 12 inch', priceAdjustment: 0 },
          { label: '12 × 18 inch', priceAdjustment: 100 },
          { label: '16 × 24 inch', priceAdjustment: 200 }
        ]
      },
      {
        name: 'Family Memories Frame',
        category: 'Family Frames',
        price: 299,
        originalPrice: 599,
        description: 'Spacious wide matting frame designed to showcase joyous family reunions, festive gatherings, and smiles.',
        dimensions: '12 × 18 inch',
        imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80',
        frameType: 'Rustic Walnut',
        isFeatured: true,
        badge: 'FAMILY CHOICE',
        availableSizes: [
          { label: '12 × 18 inch', priceAdjustment: 0 },
          { label: '18 × 24 inch', priceAdjustment: 150 },
          { label: '20 × 30 inch', priceAdjustment: 250 }
        ]
      },
      {
        name: 'Golden Memories Royal Frame',
        category: 'Premium Frames',
        price: 399,
        originalPrice: 799,
        description: 'Handcrafted golden ornate border frame featuring museum-grade anti-glare cover and archival print texture.',
        dimensions: '14 × 20 inch',
        imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
        frameType: 'Royal Gold',
        isFeatured: true,
        badge: 'LUXURY',
        availableSizes: [
          { label: '14 × 20 inch', priceAdjustment: 0 },
          { label: '18 × 24 inch', priceAdjustment: 180 },
          { label: '24 × 36 inch', priceAdjustment: 350 }
        ]
      },
      {
        name: 'Premium Couple Romance Frame',
        category: 'Couple Frames',
        price: 499,
        originalPrice: 899,
        description: 'Floating glass twin-border frame with custom engraved date line and velvet backing.',
        dimensions: '16 × 24 inch',
        imageUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80',
        frameType: 'Floating Glass',
        isFeatured: false,
        badge: 'ROMANCE',
        availableSizes: [
          { label: '16 × 24 inch', priceAdjustment: 0 },
          { label: '20 × 30 inch', priceAdjustment: 200 }
        ]
      },
      {
        name: 'Royal Wedding Story Frame',
        category: 'Wedding Frames',
        price: 599,
        originalPrice: 1199,
        description: 'Grand wedding portrait frame with golden leaf filigree border and gold embossed custom typography overlay.',
        dimensions: '20 × 30 inch',
        imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
        frameType: 'Golden Filigree',
        isFeatured: true,
        badge: 'WEDDING SPECIAL',
        availableSizes: [
          { label: '20 × 30 inch', priceAdjustment: 0 },
          { label: '24 × 36 inch', priceAdjustment: 300 }
        ]
      },
      {
        name: 'Parents Tribute Frame',
        category: 'Parents',
        price: 299,
        originalPrice: 499,
        description: 'Heartfelt thank-you frame for Mom & Dad with silver inner lining and warm wooden finish.',
        dimensions: '12 × 18 inch',
        imageUrl: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=800&q=80',
        frameType: 'Warm Rosewood',
        isFeatured: false,
        badge: 'TOUCHING',
        availableSizes: [
          { label: '12 × 18 inch', priceAdjustment: 0 },
          { label: '16 × 24 inch', priceAdjustment: 150 }
        ]
      },
      {
        name: 'Grandparents Heritage Frame',
        category: 'Grandparents',
        price: 399,
        originalPrice: 699,
        description: 'Vintage carved timber frame preserving generational wisdom, blessings, and precious family heirlooms.',
        dimensions: '14 × 20 inch',
        imageUrl: 'https://images.unsplash.com/photo-1473177104440-ffee2f376098?auto=format&fit=crop&w=800&q=80',
        frameType: 'Vintage Carved Timber',
        isFeatured: false,
        badge: 'HERITAGE',
        availableSizes: [
          { label: '14 × 20 inch', priceAdjustment: 0 },
          { label: '18 × 24 inch', priceAdjustment: 160 }
        ]
      },
      {
        name: "Baby's First Milestone Frame",
        category: 'Baby',
        price: 199,
        originalPrice: 399,
        description: 'Soft pastel border with cute teddy & star accents for your baby’s first smile and tiny steps.',
        dimensions: '8 × 10 inch',
        imageUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80',
        frameType: 'Pastel White',
        isFeatured: false,
        badge: 'CUTE',
        availableSizes: [
          { label: '8 × 10 inch', priceAdjustment: 0 },
          { label: '10 × 12 inch', priceAdjustment: 50 }
        ]
      },
      {
        name: 'Best Friends Forever Squad Frame',
        category: 'Friendship',
        price: 299,
        originalPrice: 499,
        description: 'Vibrant modern acrylic frame with neon shadow glow for college memories, trips, and squad photos.',
        dimensions: '12 × 18 inch',
        imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
        frameType: 'Modern Neon Acrylic',
        isFeatured: false,
        badge: 'SQUAD',
        availableSizes: [
          { label: '12 × 18 inch', priceAdjustment: 0 },
          { label: '16 × 24 inch', priceAdjustment: 120 }
        ]
      },
      {
        name: 'Custom Multi-Photo Collage Canvas',
        category: 'Custom Collage',
        price: 599,
        originalPrice: 1099,
        description: 'Combine up to 6 of your favorite photos in a single grid layout wrapped on gallery stretched canvas.',
        dimensions: '20 × 30 inch',
        imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
        frameType: 'Stretched Canvas',
        isFeatured: true,
        badge: 'CREATIVE GRID',
        availableSizes: [
          { label: '20 × 30 inch', priceAdjustment: 0 },
          { label: '24 × 36 inch', priceAdjustment: 250 }
        ]
      }
    ];

    await Product.insertMany(productsData);
    console.log('[Seed] 12 Products seeded successfully.');

    // Seed Admin Account
    const existingAdmin = await User.findOne({ email: 'admin@ammuframestore.com' });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        name: 'Ammu Admin',
        email: 'admin@ammuframestore.com',
        password: hashedPassword,
        phone: '9876543210',
        role: 'admin',
        address: {
          doorNo: '100',
          street: 'Gallery Street',
          city: 'Chennai',
          state: 'Tamil Nadu',
          pincode: '600001'
        }
      });
      console.log('[Seed] Admin account created: admin@ammuframestore.com / admin123');
    }

  } catch (error) {
    console.error('[Seed Error]:', error.message);
  }
};

module.exports = seedData;
