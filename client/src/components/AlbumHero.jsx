import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, BookOpen, Upload, Heart, Award } from 'lucide-react';

const AlbumHero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-16 px-4">
      {/* Ambient Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-amber-500/10 via-rose-500/10 to-purple-500/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Floating Photo Album Graphics Background */}
      <div className="absolute inset-0 max-w-7xl mx-auto pointer-events-none z-0 hidden lg:block">
        
        {/* Floating Album Page Left */}
        <motion.div 
          className="absolute top-12 left-8 w-56 h-72 rounded-2xl glass-panel-gold overflow-hidden p-2 shadow-2xl animate-float-1 pointer-events-auto cursor-pointer border border-amber-400/40"
          whileHover={{ scale: 1.08, zIndex: 30 }}
          onClick={() => navigate('/create-album')}
        >
          <div className="w-full h-full bg-[#14101d] rounded-xl p-2 flex flex-col items-center justify-between text-center border border-white/10">
            <img 
              src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80" 
              alt="Love album cover" 
              className="w-full h-44 object-cover rounded-lg"
            />
            <div className="py-1">
              <span className="font-serif italic font-bold text-amber-300 text-xs block">Our Love Story</span>
              <span className="text-[9px] text-gray-400">18 Photos • Hardcover</span>
            </div>
          </div>
        </motion.div>

        {/* Floating Album Page Right */}
        <motion.div 
          className="absolute bottom-12 right-10 w-60 h-76 rounded-2xl glass-panel-gold overflow-hidden p-2 shadow-2xl animate-float-2 pointer-events-auto cursor-pointer border border-amber-400/40"
          whileHover={{ scale: 1.08, zIndex: 30 }}
          onClick={() => navigate('/create-album')}
        >
          <div className="w-full h-full bg-[#14101d] rounded-xl p-2 flex flex-col items-center justify-between text-center border border-white/10">
            <img 
              src="https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=600&q=80" 
              alt="Family album cover" 
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="py-1">
              <span className="font-serif italic font-bold text-amber-300 text-xs block">Family Memories 2026</span>
              <span className="text-[9px] text-gray-400">24 Photos • Classic Linen</span>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Main Center Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        
        {/* Top Tagline Pill */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 backdrop-blur-md text-amber-300 text-xs font-semibold tracking-wider uppercase"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Premium Custom Photo Album Creator</span>
        </motion.div>

        {/* Brand Title */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="space-y-2"
        >
          <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight gold-gradient-text drop-shadow-2xl">
            AMMU
          </h1>
          <p className="text-xs sm:text-sm tracking-[0.35em] text-[var(--text-secondary)] font-semibold uppercase">
            FRAME STORE & PHOTO ALBUMS
          </p>
        </motion.div>

        {/* Heading */}
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#f5f2eb] font-extrabold max-w-3xl mx-auto leading-tight"
        >
          "Turn Your Memories Into a Beautiful Album."
        </motion.h2>

        <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-xl mx-auto leading-relaxed">
          Upload your favourite photos and create a personalized album in just a few steps. Preview every page live before placing your order!
        </p>

        {/* Primary & Secondary Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
        >
          <Link 
            to="/create-album"
            className="btn-primary text-base py-4 px-9 group w-full sm:w-auto justify-center"
          >
            <Upload className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>CREATE YOUR ALBUM</span>
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link 
            to="/my-orders"
            className="btn-secondary text-base py-4 px-8 w-full sm:w-auto justify-center"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>VIEW MY ALBUMS</span>
          </Link>
        </motion.div>

        {/* Quick Test Highlight Banner */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="pt-4"
        >
          <Link 
            to="/create-album"
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl glass-panel-gold hover:border-amber-400 transition-all text-xs text-amber-200 shadow-xl text-decoration-none"
          >
            <span className="badge-gold">⚡ ₹1 TEST ALBUM</span>
            <span>Create a <strong>₹1 Test Photo Album</strong> to test instant multi-photo upload & checkout!</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
};

export default AlbumHero;
