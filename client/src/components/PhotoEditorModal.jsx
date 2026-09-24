import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, RotateCw, ZoomIn, ZoomOut, Sun, Sliders, Type, Check, ShoppingBag, Sparkles, Image as ImageIcon, Heart } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { uploadCustomerPhoto } from '../services/api';
import AmmuAIAssistant from './AmmuAIAssistant';
import { useNavigate } from 'react-router-dom';

const FRAME_OPTIONS = [
  { id: 'Classic Oak', name: 'Classic Oak Wood', borderClass: 'frame-border-classic', matColor: '#f9f7f2', priceExtra: 0 },
  { id: 'Royal Gold', name: 'Royal Gold Filigree', borderClass: 'frame-border-gold', matColor: '#fcfaf2', priceExtra: 100 },
  { id: 'Deep Mahogany', name: 'Deep Mahogany', borderClass: 'frame-border-mahogany', matColor: '#f4efe6', priceExtra: 50 },
  { id: 'Pastel White', name: 'Pastel White', borderClass: 'frame-border-white', matColor: '#ffffff', priceExtra: 20 }
];

const FILTER_PRESETS = [
  { id: 'none', label: 'Original', css: 'none' },
  { id: 'warm', label: 'Warm Sunset 🌅', css: 'sepia(0.35) contrast(1.05) brightness(1.05) saturate(1.2)' },
  { id: 'cool', label: 'Cool Breeze ❄️', css: 'hue-rotate(15deg) contrast(1.05) saturate(1.1)' },
  { id: 'vintage', label: 'Vintage Nostalgia 📜', css: 'sepia(0.6) contrast(1.1) brightness(0.95)' },
  { id: 'bw', label: 'B & W Classic 🖤', css: 'grayscale(1) contrast(1.2)' },
  { id: 'glow', label: 'Soft Glow ✨', css: 'brightness(1.1) saturate(1.15) contrast(0.95)' }
];

const PhotoEditorModal = () => {
  const { selectedProduct, isDetailOpen, closeFrameDetail, addToCart, showToast } = useShop();
  const navigate = useNavigate();

  // Photo state
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [serverImageUrl, setServerImageUrl] = useState('');

  // Editing controls
  const [selectedSize, setSelectedSize] = useState('12 × 18 inch');
  const [selectedFrame, setSelectedFrame] = useState(FRAME_OPTIONS[0]);
  const [activeFilter, setActiveFilter] = useState(FILTER_PRESETS[0]);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [customCaption, setCustomCaption] = useState('');

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (selectedProduct) {
      setSelectedSize(selectedProduct.dimensions || '12 × 18 inch');
      // Set default frame option
      const matchingFrame = FRAME_OPTIONS.find(f => f.id === selectedProduct.frameType) || FRAME_OPTIONS[0];
      setSelectedFrame(matchingFrame);
    }
  }, [selectedProduct]);

  if (!isDetailOpen || !selectedProduct) return null;

  const calculateFinalPrice = () => {
    let sizeExtra = 0;
    if (selectedProduct.availableSizes) {
      const match = selectedProduct.availableSizes.find(s => s.label === selectedSize);
      if (match) sizeExtra = match.priceAdjustment || 0;
    }
    return selectedProduct.price + (selectedFrame.priceExtra || 0) + sizeExtra;
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check size limit (10MB)
    if (file.size > 10 * 1024 * 1024) {
      showToast('Image file must be smaller than 10MB', 'error');
      return;
    }

    // Local instant preview
    const localUrl = URL.createObjectURL(file);
    setUploadedImage(localUrl);

    // Upload to server/cloudinary
    setIsUploading(true);
    try {
      const res = await uploadCustomerPhoto(file);
      if (res.success) {
        setServerImageUrl(res.imageUrl);
        showToast('Photo uploaded successfully! 📸', 'success');
      }
    } catch (err) {
      console.warn('Upload error:', err);
      showToast('Uploaded local photo for editor preview', 'info');
      setServerImageUrl(localUrl);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddToCart = () => {
    const finalPrice = calculateFinalPrice();

    addToCart({
      productId: selectedProduct._id,
      productName: selectedProduct.name,
      quantity: 1,
      price: finalPrice,
      frame: selectedFrame.name,
      size: selectedSize,
      filter: activeFilter.label,
      originalImageUrl: serverImageUrl || uploadedImage || selectedProduct.imageUrl,
      customizedImageUrl: serverImageUrl || uploadedImage || selectedProduct.imageUrl,
      customText: customCaption
    });

    closeFrameDetail();
  };

  const handleDirectCheckout = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6">
        
        {/* Magic Glowing Backdrop */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.35 }}
          className="relative w-full max-w-6xl glass-panel-gold rounded-3xl overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.9)] my-8 border border-amber-400/40"
        >
          {/* Close Button */}
          <button 
            onClick={closeFrameDetail}
            className="absolute top-5 right-5 z-30 p-2.5 rounded-full bg-black/60 text-white/80 hover:text-white hover:bg-black/90 transition-all border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Grid: Left Preview, Right Editor & AI Assistant */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            
            {/* LEFT COLUMN: LIVE FRAME PREVIEW SHOWCASE (7 cols) */}
            <div className="lg:col-span-7 p-6 sm:p-10 bg-[#07060b] flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-[var(--border-glass)] relative min-h-[480px]">
              
              <div className="absolute top-4 left-4 z-10">
                <span className="badge-gold">LIVE FRAME PREVIEW</span>
              </div>

              {/* Physical Frame Box Container */}
              <div className="relative w-full max-w-md aspect-[4/5] my-auto">
                <div 
                  className={`w-full h-full p-4 rounded-xl transition-all duration-500 ${selectedFrame.borderClass}`}
                >
                  {/* Photo Matting */}
                  <div 
                    className="relative w-full h-full p-4 flex flex-col items-center justify-center overflow-hidden shadow-inner"
                    style={{ backgroundColor: selectedFrame.matColor }}
                  >
                    {/* Uploaded or Demo Photo with CSS Filters & Transforms */}
                    <div className="relative w-full h-full overflow-hidden flex items-center justify-center rounded">
                      <img 
                        src={uploadedImage || selectedProduct.imageUrl} 
                        alt="Frame Preview"
                        className="w-full h-full object-cover transition-all duration-300"
                        style={{
                          filter: `${activeFilter.css} brightness(${brightness}%) contrast(${contrast}%)`,
                          transform: `scale(${zoom}) rotate(${rotation}deg)`
                        }}
                      />

                      {/* Custom Caption Overlay on Photo */}
                      {customCaption && (
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/75 backdrop-blur-md px-4 py-1.5 rounded-full text-white font-serif italic text-xs tracking-wider text-center border border-amber-400/40 max-w-[90%] shadow-lg">
                          "{customCaption}"
                        </div>
                      )}

                      {/* Protective Glass Shine Effect */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Upload Action Button */}
              <div className="mt-6 flex items-center gap-3">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  accept="image/jpeg,image/png,image/webp,image/jpg" 
                  className="hidden" 
                />
                
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="btn-primary py-3 px-6 text-sm"
                >
                  <Upload className="w-4 h-4" />
                  <span>{uploadedImage ? 'Change Photo 📸' : '+ Upload Your Photo ❤️'}</span>
                </button>

                {uploadedImage && (
                  <button 
                    onClick={() => { setUploadedImage(null); setServerImageUrl(''); }}
                    className="btn-secondary py-3 px-4 text-xs"
                  >
                    Reset
                  </button>
                )}
              </div>

            </div>

            {/* RIGHT COLUMN: FRAME OPTIONS, EDITOR & AI ASSISTANT (5 cols) */}
            <div className="lg:col-span-5 p-6 sm:p-8 space-y-6 overflow-y-auto max-h-[85vh]">
              
              {/* Product Info */}
              <div>
                <span className="text-xs font-bold text-[var(--primary-gold)] tracking-widest uppercase">
                  {selectedProduct.category}
                </span>
                <h2 className="font-serif text-2xl font-bold text-white mt-1">
                  {selectedProduct.name}
                </h2>
                <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
                  {selectedProduct.description}
                </p>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 mt-3">
                  <span className="font-serif font-extrabold text-3xl gold-gradient-text">
                    ₹{calculateFinalPrice()}
                  </span>
                  {selectedProduct.originalPrice > calculateFinalPrice() && (
                    <span className="text-sm text-gray-500 line-through">
                      ₹{selectedProduct.originalPrice}
                    </span>
                  )}
                  <span className="text-[11px] text-emerald-400 font-semibold">
                    (Free Custom Preview)
                  </span>
                </div>
              </div>

              {/* 1. Size Selection */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white tracking-wide uppercase flex justify-between">
                  <span>Choose Frame Size:</span>
                  <span className="text-[var(--primary-gold)]">{selectedSize}</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(selectedProduct.availableSizes || [
                    { label: '4 × 6 inch', priceAdjustment: 0 },
                    { label: '8 × 10 inch', priceAdjustment: 20 },
                    { label: '12 × 18 inch', priceAdjustment: 50 },
                    { label: '16 × 24 inch', priceAdjustment: 100 },
                    { label: '20 × 30 inch', priceAdjustment: 200 }
                  ]).map((sz) => (
                    <button
                      key={sz.label}
                      onClick={() => setSelectedSize(sz.label)}
                      className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                        selectedSize === sz.label
                          ? 'bg-amber-400 text-black border-amber-300 font-bold shadow'
                          : 'bg-white/5 border-white/10 text-gray-300 hover:border-amber-400/40'
                      }`}
                    >
                      {sz.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Frame Border Material */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white tracking-wide uppercase">
                  Select Frame Border:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {FRAME_OPTIONS.map((frm) => (
                    <button
                      key={frm.id}
                      onClick={() => setSelectedFrame(frm)}
                      className={`p-2.5 rounded-xl text-xs text-left border flex items-center gap-2 transition-all ${
                        selectedFrame.id === frm.id
                          ? 'bg-amber-500/20 border-amber-400 text-white font-semibold'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:border-amber-400/30'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full border ${frm.borderClass}`} />
                      <span className="truncate">{frm.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Filter Presets */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white tracking-wide uppercase">
                  Memory Lighting Filter:
                </label>
                <div className="flex flex-wrap gap-2">
                  {FILTER_PRESETS.map((flt) => (
                    <button
                      key={flt.id}
                      onClick={() => setActiveFilter(flt)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        activeFilter.id === flt.id
                          ? 'bg-amber-400 text-black font-bold shadow'
                          : 'bg-white/5 border border-white/10 text-gray-300 hover:text-white'
                      }`}
                    >
                      {flt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Photo Editor Adjustments */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-gray-200">
                  <span className="flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-amber-400" />
                    Photo Adjustments
                  </span>
                  <button 
                    onClick={() => { setZoom(1); setRotation(0); setBrightness(100); setContrast(100); setCustomCaption(''); }}
                    className="text-[10px] text-amber-400 hover:underline"
                  >
                    Reset Controls
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs text-gray-300">
                  {/* Zoom Slider */}
                  <div>
                    <span className="block text-[10px] mb-1">Zoom ({zoom.toFixed(1)}x)</span>
                    <input 
                      type="range" min="0.8" max="2" step="0.1" value={zoom}
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="w-full accent-amber-400 h-1 rounded"
                    />
                  </div>
                  {/* Rotate */}
                  <div>
                    <span className="block text-[10px] mb-1">Rotate ({rotation}°)</span>
                    <button 
                      onClick={() => setRotation((r) => (r + 90) % 360)}
                      className="w-full py-1 px-2 rounded bg-white/10 text-xs flex items-center justify-center gap-1 hover:bg-white/20"
                    >
                      <RotateCw className="w-3 h-3" /> Rotate 90°
                    </button>
                  </div>
                  {/* Brightness */}
                  <div>
                    <span className="block text-[10px] mb-1">Brightness ({brightness}%)</span>
                    <input 
                      type="range" min="50" max="150" value={brightness}
                      onChange={(e) => setBrightness(parseInt(e.target.value))}
                      className="w-full accent-amber-400 h-1 rounded"
                    />
                  </div>
                  {/* Contrast */}
                  <div>
                    <span className="block text-[10px] mb-1">Contrast ({contrast}%)</span>
                    <input 
                      type="range" min="50" max="150" value={contrast}
                      onChange={(e) => setContrast(parseInt(e.target.value))}
                      className="w-full accent-amber-400 h-1 rounded"
                    />
                  </div>
                </div>

                {/* Custom Caption input */}
                <div>
                  <label className="block text-[10px] text-gray-300 mb-1 font-semibold flex items-center gap-1">
                    <Type className="w-3 h-3 text-amber-400" />
                    Custom Frame Caption Overlay:
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g., Happy 1st Anniversary ❤️"
                    value={customCaption}
                    onChange={(e) => setCustomCaption(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Embedded Ammu AI Assistant */}
              <AmmuAIAssistant 
                onUploadClick={() => fileInputRef.current?.click()}
                onOrderClick={handleDirectCheckout}
                currentProduct={selectedProduct}
              />

              {/* Checkout Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <button 
                  onClick={handleAddToCart}
                  className="btn-secondary flex-1 justify-center py-3 text-xs"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add To Cart
                </button>

                <button 
                  onClick={handleDirectCheckout}
                  className="btn-primary flex-1 justify-center py-3 text-xs"
                >
                  <Sparkles className="w-4 h-4" />
                  Order Now (₹{calculateFinalPrice()})
                </button>
              </div>

            </div>

          </div>
        </motion.div>

      </div>
    </AnimatePresence>
  );
};

export default PhotoEditorModal;
