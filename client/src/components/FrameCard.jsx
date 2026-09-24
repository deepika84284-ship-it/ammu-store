import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Eye, Upload, Heart } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const FrameCard = ({ product }) => {
  const { openFrameDetail } = useShop();

  const getFrameStyleClass = (frameType) => {
    switch (frameType) {
      case 'Royal Gold':
      case 'Golden Filigree':
        return 'frame-border-gold';
      case 'Deep Mahogany':
      case 'Warm Rosewood':
        return 'frame-border-mahogany';
      case 'Pastel White':
      case 'Floating Glass':
        return 'frame-border-white';
      default:
        return 'frame-border-classic';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.4 }}
      className="group relative flex flex-col items-center cursor-pointer"
      onClick={() => openFrameDetail(product)}
    >
      {/* Visual Frame Border Wrapper */}
      <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-black shadow-2xl transition-all duration-500 group-hover:shadow-[0_20px_50px_rgba(230,198,117,0.3)]">
        
        {/* Physical Wooden/Gold Frame Border */}
        <div className={`w-full h-full p-3 transition-transform duration-500 ${getFrameStyleClass(product.frameType)}`}>
          
          {/* Inner Photo Matting */}
          <div className="relative w-full h-full bg-[#f9f7f2] p-3 overflow-hidden shadow-inner flex items-center justify-center">
            
            {/* The Photo Image */}
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-[0.97]"
            />

            {/* Subtle Glass Reflection Shine */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 pointer-events-none opacity-60 group-hover:opacity-90 transition-opacity" />

            {/* Hover Action Overlay */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[3px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3 p-4 text-center">
              <span className="w-12 h-12 rounded-full bg-[var(--primary-gold)] text-black flex items-center justify-center shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <Upload className="w-6 h-6" />
              </span>
              <span className="text-white font-semibold text-sm tracking-wide">
                CUSTOMIZE & PREVIEW
              </span>
              <span className="text-xs text-amber-200/80 italic">
                Click to enter memory
              </span>
            </div>

          </div>

        </div>

        {/* Top Badge */}
        {product.badge && (
          <div className="absolute top-4 left-4 z-10">
            <span className="badge-gold shadow-md">
              {product.badge}
            </span>
          </div>
        )}

        {/* Wishlist Icon */}
        <button 
          onClick={(e) => { e.stopPropagation(); }}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-rose-400 hover:scale-110 transition-all"
        >
          <Heart className="w-4 h-4" />
        </button>

      </div>

      {/* Frame Card Info Footer */}
      <div className="w-full mt-4 text-center space-y-1 px-2">
        <span className="text-[11px] font-semibold tracking-wider text-[var(--text-muted)] uppercase">
          {product.category} • {product.dimensions}
        </span>
        <h3 className="font-serif font-semibold text-lg text-white group-hover:text-[var(--primary-gold)] transition-colors line-clamp-1">
          {product.name}
        </h3>
        
        <div className="flex items-center justify-center gap-2 pt-1">
          <span className="font-bold text-xl gold-gradient-text">
            ₹{product.price}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-gray-500 line-through">
              ₹{product.originalPrice}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FrameCard;
