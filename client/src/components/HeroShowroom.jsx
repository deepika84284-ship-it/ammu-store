import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Play, Upload, ShieldCheck, Heart } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const HeroShowroom = ({ onExploreClick }) => {
  const { openFrameDetail } = useShop();

  // Test product for quick trigger
  const testProduct = {
    _id: 'mini_memory_1',
    name: 'Mini Memory Frame (₹1 Test Order)',
    category: 'Mini Memories',
    price: 1,
    originalPrice: 49,
    description: 'Create a tiny digital memory frame! Perfect for instant testing of full photo upload, preview, and complete order workflow.',
    dimensions: '4 × 6 inch',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    frameType: 'Mini Wood',
    availableSizes: [{ label: '4 × 6 inch', priceAdjustment: 0 }]
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-16 px-4">
      {/* Ambient Radial Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-amber-500/10 via-rose-500/10 to-purple-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Floating Gallery Frames Background Accent */}
      <div className="absolute inset-0 max-w-7xl mx-auto pointer-events-none z-0 hidden lg:block">
        
        {/* Floating Frame Left Top */}
        <motion.div 
          className="absolute top-12 left-4 w-48 h-60 rounded-xl frame-border-gold overflow-hidden opacity-75 shadow-2xl animate-float-1 pointer-events-auto cursor-pointer"
          whileHover={{ scale: 1.08, zIndex: 30 }}
          onClick={() => openFrameDetail(testProduct)}
        >
          <img 
            src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80" 
            alt="Love memory" 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-amber-300 font-semibold">
            Love Frame
          </div>
        </motion.div>

        {/* Floating Frame Left Bottom */}
        <motion.div 
          className="absolute bottom-16 left-16 w-52 h-64 rounded-xl frame-border-mahogany overflow-hidden opacity-80 shadow-2xl animate-float-2 pointer-events-auto cursor-pointer"
          whileHover={{ scale: 1.08, zIndex: 30 }}
          onClick={() => onExploreClick()}
        >
          <img 
            src="https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=600&q=80" 
            alt="Family frame" 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-amber-300 font-semibold">
            Family Portrait
          </div>
        </motion.div>

        {/* Floating Frame Right Top */}
        <motion.div 
          className="absolute top-10 right-8 w-52 h-64 rounded-xl frame-border-gold overflow-hidden opacity-80 shadow-2xl animate-float-2 pointer-events-auto cursor-pointer"
          whileHover={{ scale: 1.08, zIndex: 30 }}
          onClick={() => onExploreClick()}
        >
          <img 
            src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80" 
            alt="Wedding frame" 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-amber-300 font-semibold">
            Royal Wedding
          </div>
        </motion.div>

        {/* Floating Frame Right Bottom */}
        <motion.div 
          className="absolute bottom-12 right-20 w-44 h-56 rounded-xl frame-border-classic overflow-hidden opacity-75 shadow-2xl animate-float-1 pointer-events-auto cursor-pointer"
          whileHover={{ scale: 1.08, zIndex: 30 }}
          onClick={() => openFrameDetail(testProduct)}
        >
          <img 
            src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80" 
            alt="Mini memory frame" 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 right-2 bg-amber-400 text-black px-2 py-0.5 rounded text-[10px] font-extrabold">
            ₹1 Test Memory
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
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Premium Digital Frame Showroom</span>
        </motion.div>

        {/* Grand Brand Title */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="space-y-2"
        >
          <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight gold-gradient-text drop-shadow-2xl">
            AMMU
          </h1>
          <p className="text-sm sm:text-base tracking-[0.35em] text-[var(--text-secondary)] font-semibold uppercase">
            FRAME STORE
          </p>
        </motion.div>

        {/* Emotion Tagline */}
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-serif italic text-2xl sm:text-3xl lg:text-4xl text-[#f5f2eb] font-medium max-w-2xl mx-auto leading-relaxed"
        >
          “Your Memories. Our Frames. <br className="hidden sm:block" /> One Beautiful Story.”
        </motion.h2>

        <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-xl mx-auto">
          Turn your favorite photos into handcrafted wooden & gold frames. Upload your memory, customize with our live frame preview, and order instantly!
        </p>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <button 
            onClick={() => openFrameDetail(testProduct)}
            className="btn-primary text-base py-4 px-8 group w-full sm:w-auto justify-center"
          >
            <Upload className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>CREATE YOUR FRAME</span>
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </button>

          <button 
            onClick={onExploreClick}
            className="btn-secondary text-base py-4 px-8 w-full sm:w-auto justify-center"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Explore Memories</span>
          </button>
        </motion.div>

        {/* Quick Test Highlight Banner */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="pt-6"
        >
          <div 
            onClick={() => openFrameDetail(testProduct)}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl glass-panel-gold cursor-pointer hover:border-amber-400 transition-all text-xs text-amber-200 shadow-xl"
          >
            <span className="badge-gold">⚡ FAST TEST</span>
            <span>Try our <strong>₹1 Mini Memory Frame</strong> to test live upload & order flow!</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default HeroShowroom;
