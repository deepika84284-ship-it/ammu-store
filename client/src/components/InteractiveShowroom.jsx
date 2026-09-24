import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Grid, Filter, Search, RefreshCw } from 'lucide-react';
import FrameCard from './FrameCard';
import { getProducts, getCategories } from '../services/api';

const InteractiveShowroom = ({ showroomRef }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        getProducts(),
        getCategories()
      ]);

      if (prodRes.success) setProducts(prodRes.products);
      if (catRes.success) setCategories(catRes.categories);
    } catch (err) {
      console.error('Failed to load showroom products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = async (catName) => {
    setSelectedCategory(catName);
    setLoading(true);
    try {
      const res = await getProducts({ category: catName, search: searchQuery });
      if (res.success) setProducts(res.products);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await getProducts({ category: selectedCategory, search: searchQuery });
      if (res.success) setProducts(res.products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section ref={showroomRef} id="showroom-grid" className="max-w-7xl mx-auto px-4 py-16 scroll-mt-24">
      
      {/* Section Header */}
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-[var(--border-gold)] text-amber-300 text-xs font-semibold uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Photo Frame Showroom</span>
        </div>
        
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
          Select Your Beautiful Frame
        </h2>
        
        <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-xl mx-auto">
          Choose from our curated memory frames. Touch any frame to preview your photo inside with our AI assistant!
        </p>
      </div>

      {/* Category Pills & Search */}
      <div className="space-y-6 mb-12">
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto relative">
          <input 
            type="text" 
            placeholder="Search frame by name or occasion..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-24 py-3 rounded-full bg-white/5 border border-[var(--border-glass)] focus:border-[var(--primary-gold)] focus:outline-none text-sm text-white placeholder-gray-500 transition-all backdrop-blur-md"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <button 
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 btn-primary text-xs py-2 px-4"
          >
            Search
          </button>
        </form>

        {/* Category Horizontal Filter Pills */}
        <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
          <button
            onClick={() => handleCategorySelect('All')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              selectedCategory === 'All'
                ? 'bg-gradient-to-r from-[#f7e6a7] to-[#b8923a] text-black shadow-lg scale-105'
                : 'bg-white/5 border border-[var(--border-glass)] text-[var(--text-secondary)] hover:border-amber-400/40 hover:text-white'
            }`}
          >
            All Frames ✨
          </button>

          {/* Test ₹1 Mini Memory Button Highlight */}
          <button
            onClick={() => handleCategorySelect('Mini Memories')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedCategory === 'Mini Memories'
                ? 'bg-amber-400 text-black shadow-lg scale-105'
                : 'bg-amber-500/10 border border-amber-500/40 text-amber-300 hover:bg-amber-500/20'
            }`}
          >
            ⚡ Mini Memories (₹1)
          </button>

          {categories.map((cat) => (
            <button
              key={cat._id || cat.name}
              onClick={() => handleCategorySelect(cat.name)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat.name
                  ? 'bg-gradient-to-r from-[#f7e6a7] to-[#b8923a] text-black shadow-lg scale-105'
                  : 'bg-white/5 border border-[var(--border-glass)] text-[var(--text-secondary)] hover:border-amber-400/40 hover:text-white'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Showroom Frames Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-4">
          <RefreshCw className="w-8 h-8 text-[var(--primary-gold)] animate-spin mx-auto" />
          <p className="text-sm text-[var(--text-muted)]">Loading showroom frames...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="glass-panel p-12 text-center space-y-4 max-w-lg mx-auto">
          <p className="text-lg font-semibold text-white">No frames found</p>
          <p className="text-xs text-[var(--text-muted)]">Try selecting a different category or clearing search.</p>
          <button onClick={() => handleCategorySelect('All')} className="btn-secondary text-xs">
            Reset Filters
          </button>
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
        >
          <AnimatePresence>
            {products.map((product) => (
              <FrameCard key={product._id} product={product} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

    </section>
  );
};

export default InteractiveShowroom;
