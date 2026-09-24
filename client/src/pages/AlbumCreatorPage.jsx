import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Plus, Trash2, ArrowLeftRight, Edit3, BookOpen, Sparkles, ChevronLeft, ChevronRight, Check, ShoppingBag, ArrowRight, Sliders, Type, RotateCw, Image as ImageIcon } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { uploadCustomerPhoto } from '../services/api';
import AmmuAIAssistant from '../components/AmmuAIAssistant';

const ALBUM_SIZES = [
  { id: 'test_1', label: 'Test Album (₹1)', dimensions: '4 × 6 inch', price: 1, badge: '⚡ TEST ORDER' },
  { id: 'size_6x8', label: '6 × 8 inch', dimensions: '6 × 8 inch', price: 299, badge: 'POPULAR' },
  { id: 'size_8x10', label: '8 × 10 inch', dimensions: '8 × 10 inch', price: 399, badge: 'BESTSELLER' },
  { id: 'size_10x12', label: '10 × 12 inch', dimensions: '10 × 12 inch', price: 499, badge: 'DELUXE' },
  { id: 'size_12x18', label: '12 × 18 inch', dimensions: '12 × 18 inch', price: 599, badge: 'GRAND' }
];

const ALBUM_STYLES = [
  { id: 'Classic', label: 'Classic Linen 📜', description: 'Timeless elegant borders with warm linen cover' },
  { id: 'Modern', label: 'Modern Minimal 🖤', description: 'Sleek dark matte pages with edge-to-edge prints' },
  { id: 'Minimal', label: 'Pure White Minimal 🕊️', description: 'Clean white gallery space with wide margins' },
  { id: 'Collage', label: 'Creative Grid Collage ✨', description: 'Dynamic multi-photo storytelling layout' }
];

const FILTER_PRESETS = [
  { id: 'none', label: 'Original', css: 'none' },
  { id: 'warm', label: 'Warm Sunset 🌅', css: 'sepia(0.35) contrast(1.05) brightness(1.05)' },
  { id: 'cool', label: 'Cool Breeze ❄️', css: 'hue-rotate(15deg) contrast(1.05)' },
  { id: 'vintage', label: 'Vintage 📜', css: 'sepia(0.6) contrast(1.1) brightness(0.95)' },
  { id: 'bw', label: 'Black & White 🖤', css: 'grayscale(1) contrast(1.2)' }
];

// Initial demo photos if user hasn't uploaded yet
const DEMO_PHOTOS = [
  { id: 'p1', url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80', order: 1, filter: 'Original' },
  { id: 'p2', url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80', order: 2, filter: 'Original' },
  { id: 'p3', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80', order: 3, filter: 'Original' },
  { id: 'p4', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80', order: 4, filter: 'Original' }
];

const AlbumCreatorPage = () => {
  const { addToCart, showToast } = useShop();
  const navigate = useNavigate();

  // Album State
  const [photos, setPhotos] = useState(DEMO_PHOTOS);
  const [albumTitle, setAlbumTitle] = useState('Our Beautiful Memories');
  const [selectedSize, setSelectedSize] = useState(ALBUM_SIZES[1]); // Default 6x8
  const [selectedStyle, setSelectedStyle] = useState(ALBUM_STYLES[0]);
  const [coverPhotoIndex, setCoverPhotoIndex] = useState(0);

  // Active page flip preview state
  const [previewPage, setPreviewPage] = useState(0); // 0 = Cover, 1 = Pages 1-2, 2 = Pages 3-4, etc.

  // Editing single photo state
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [photoFilter, setPhotoFilter] = useState(FILTER_PRESETS[0]);
  const [photoRotation, setPhotoRotation] = useState(0);

  const fileInputRef = useRef(null);

  // Handle Multi-photo Upload
  const handleMultipleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    if (photos.length + files.length > 50) {
      showToast('Maximum 50 photos allowed per album', 'error');
      return;
    }

    showToast(`Uploading ${files.length} photo(s)... 📸`, 'info');

    const newUploadedPhotos = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const localUrl = URL.createObjectURL(file);
      const photoObj = {
        id: `photo_${Date.now()}_${i}`,
        url: localUrl,
        order: photos.length + i + 1,
        filter: 'Original'
      };

      newUploadedPhotos.push(photoObj);

      // Async upload to server in background
      try {
        const res = await uploadCustomerPhoto(file);
        if (res.success) {
          photoObj.url = res.imageUrl;
        }
      } catch (err) {
        console.warn('Background upload notice:', err);
      }
    }

    setPhotos((prev) => [...prev, ...newUploadedPhotos]);
    showToast(`Added ${files.length} photo(s) to album! ✨`, 'success');
  };

  // Remove photo
  const handleRemovePhoto = (id) => {
    if (photos.length <= 1) {
      showToast('Album must have at least 1 photo', 'error');
      return;
    }
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    showToast('Photo removed from album', 'info');
  };

  // Move photo left/up
  const handleMoveLeft = (index) => {
    if (index === 0) return;
    const newPhotos = [...photos];
    const temp = newPhotos[index - 1];
    newPhotos[index - 1] = newPhotos[index];
    newPhotos[index] = temp;
    setPhotos(newPhotos);
  };

  // Move photo right/down
  const handleMoveRight = (index) => {
    if (index === photos.length - 1) return;
    const newPhotos = [...photos];
    const temp = newPhotos[index + 1];
    newPhotos[index + 1] = newPhotos[index];
    newPhotos[index] = temp;
    setPhotos(newPhotos);
  };

  // Add to cart
  const handleAddToCart = () => {
    const coverUrl = photos[coverPhotoIndex]?.url || photos[0]?.url;

    addToCart({
      productId: `album_${selectedSize.id}`,
      productName: `${albumTitle} (${selectedSize.label})`,
      quantity: 1,
      price: selectedSize.price,
      frame: selectedStyle.id,
      size: selectedSize.dimensions,
      filter: 'Original',
      originalImageUrl: coverUrl,
      customizedImageUrl: coverUrl,
      customText: albumTitle,
      albumTitle,
      albumSize: selectedSize.dimensions,
      albumStyle: selectedStyle.id,
      photoCount: photos.length,
      coverPhoto: coverUrl,
      photos: photos.map((p, idx) => ({ url: p.url, order: idx + 1 }))
    });
  };

  const handleDirectCheckout = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const totalPages = Math.ceil((photos.length - 1) / 2) + 1; // 0 = Cover, 1... pages, last = Back

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Top Section Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Interactive Photo Album Creator</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
          Create Your Personalized Photo Album
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-xl mx-auto">
          Upload 5 to 50 of your favourite memories, customize your title, arrange pages, and preview your handcrafted album live!
        </p>
      </div>

      {/* STEP 1: MULTI-PHOTO UPLOAD DROP ZONE */}
      <div className="glass-panel-gold p-6 sm:p-8 rounded-3xl border border-amber-400/40 text-center space-y-4 relative overflow-hidden shadow-2xl">
        <div className="max-w-md mx-auto space-y-3">
          <div className="w-16 h-16 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 flex items-center justify-center mx-auto shadow-lg">
            <Upload className="w-8 h-8" />
          </div>

          <h3 className="font-serif font-bold text-xl text-white">Upload Your Memory Photos</h3>
          <p className="text-xs text-amber-200/80">
            Select multiple photos at once (JPG, PNG, WEBP). Photos will be organized into your custom album.
          </p>

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleMultipleUpload} 
            multiple 
            accept="image/jpeg,image/png,image/webp,image/jpg" 
            className="hidden" 
          />

          <button 
            onClick={() => fileInputRef.current?.click()}
            className="btn-primary py-3.5 px-8 text-sm font-bold shadow-xl"
          >
            <Plus className="w-5 h-5" />
            <span>+ ADD PHOTOS (Select Multiple)</span>
          </button>

          <div className="text-xs font-bold text-amber-400 pt-1">
            Current Album Photos: <span>{photos.length} / 50 photos</span>
          </div>
        </div>
      </div>

      {/* STEP 2: PHOTO GRID & REARRANGE ORDER */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border-glass)] pb-3">
          <div>
            <h3 className="font-serif font-bold text-xl text-white">Arranged Photo Sequence</h3>
            <p className="text-xs text-gray-400">Use arrow controls to reorder or remove photos from your album</p>
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="btn-secondary py-2 px-4 text-xs"
          >
            <Plus className="w-4 h-4 text-amber-400" /> Add More
          </button>
        </div>

        {/* Photos Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {photos.map((photo, index) => (
            <motion.div 
              key={photo.id}
              layout
              className={`relative rounded-2xl overflow-hidden glass-panel p-2 border transition-all ${
                coverPhotoIndex === index ? 'border-amber-400 ring-2 ring-amber-400/50' : 'border-white/10'
              }`}
            >
              {/* Photo Image Card */}
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-black shadow">
                <img 
                  src={photo.url} 
                  alt={`Photo ${index + 1}`} 
                  className="w-full h-full object-cover transition-transform duration-300"
                  style={{ filter: photo.filter !== 'Original' ? FILTER_PRESETS.find(f => f.label.includes(photo.filter))?.css : 'none' }}
                />

                {/* Photo Number Badge */}
                <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-amber-300 font-bold border border-amber-400/30">
                  #{index + 1}
                </div>

                {/* Cover Tag */}
                {coverPhotoIndex === index && (
                  <div className="absolute top-2 right-2 bg-amber-400 text-black px-1.5 py-0.5 rounded text-[9px] font-extrabold shadow">
                    COVER
                  </div>
                )}
              </div>

              {/* Photo Action Controls */}
              <div className="mt-2 flex items-center justify-between gap-1 text-xs">
                
                {/* Reorder Left */}
                <button 
                  onClick={() => handleMoveLeft(index)}
                  disabled={index === 0}
                  className="p-1 rounded bg-white/10 text-gray-300 hover:text-white disabled:opacity-30"
                  title="Move Photo Earlier"
                >
                  ◀
                </button>

                {/* Make Cover Button */}
                <button 
                  onClick={() => setCoverPhotoIndex(index)}
                  className={`text-[9px] font-bold px-2 py-1 rounded transition-colors ${
                    coverPhotoIndex === index ? 'bg-amber-400 text-black' : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {coverPhotoIndex === index ? 'Cover ✓' : 'Make Cover'}
                </button>

                {/* Reorder Right */}
                <button 
                  onClick={() => handleMoveRight(index)}
                  disabled={index === photos.length - 1}
                  className="p-1 rounded bg-white/10 text-gray-300 hover:text-white disabled:opacity-30"
                  title="Move Photo Later"
                >
                  ▶
                </button>

                {/* Remove */}
                <button 
                  onClick={() => handleRemovePhoto(photo.id)}
                  className="p-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/40"
                  title="Remove photo"
                >
                  <Trash2 className="w-3 h-3" />
                </button>

              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* STEP 3: REALISTIC INTERACTIVE ALBUM PREVIEW */}
      <div className="glass-panel-gold p-6 sm:p-10 rounded-3xl border border-amber-400/40 space-y-6 shadow-2xl">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-amber-500/20 pb-4 gap-4">
          <div>
            <span className="badge-gold">REALTIME ALBUM PREVIEW</span>
            <h3 className="font-serif font-bold text-2xl text-white mt-1">Interactive Photo Album</h3>
          </div>

          {/* Page Navigation */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setPreviewPage((p) => Math.max(0, p - 1))}
              disabled={previewPage === 0}
              className="btn-secondary py-2 px-3 text-xs disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            <span className="text-xs font-bold text-amber-300">
              {previewPage === 0 ? 'Cover Page' : `Page ${previewPage * 2 - 1} - ${previewPage * 2}`}
            </span>

            <button 
              onClick={() => setPreviewPage((p) => Math.min(totalPages, p + 1))}
              disabled={previewPage >= totalPages}
              className="btn-secondary py-2 px-3 text-xs disabled:opacity-30"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Album Book Display */}
        <div className="max-w-3xl mx-auto min-h-[380px] flex items-center justify-center p-4">
          <AnimatePresence mode="wait">
            
            {/* COVER PAGE VIEW */}
            {previewPage === 0 ? (
              <motion.div 
                key="cover"
                initial={{ opacity: 0, rotateY: -30 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: 30 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md aspect-[3/4] bg-[#1a1424] rounded-2xl border-4 border-amber-400/60 p-6 flex flex-col items-center justify-between text-center shadow-[0_25px_60px_rgba(0,0,0,0.9)] relative overflow-hidden"
              >
                {/* Album Cover Photo */}
                <div className="w-full h-64 rounded-xl overflow-hidden frame-border-gold shadow-lg">
                  <img 
                    src={photos[coverPhotoIndex]?.url || photos[0]?.url} 
                    alt="Album Cover"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Editable Title */}
                <div className="w-full space-y-2 pt-2">
                  <span className="text-[10px] uppercase tracking-widest text-amber-400 font-bold block">
                    {selectedStyle.label} • {selectedSize.dimensions}
                  </span>
                  
                  <input 
                    type="text" 
                    value={albumTitle}
                    onChange={(e) => setAlbumTitle(e.target.value)}
                    placeholder="Enter Album Title..."
                    className="w-full bg-black/50 border border-amber-400/40 rounded-xl px-4 py-2 text-center font-serif text-lg font-bold text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </motion.div>
            ) : (
              /* INSIDE PAGES VIEW */
              <motion.div 
                key={`pages_${previewPage}`}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35 }}
                className="w-full max-w-3xl aspect-[16/9] bg-[#fcfaf5] text-black rounded-2xl p-6 shadow-[0_25px_60px_rgba(0,0,0,0.9)] grid grid-cols-2 gap-6 border-4 border-amber-600/30 relative"
              >
                {/* Center Book Spine */}
                <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-r from-black/20 via-black/5 to-black/20 pointer-events-none" />

                {/* Left Page Photo */}
                <div className="flex flex-col items-center justify-center p-2 space-y-2 border-r border-gray-200 pr-4">
                  {photos[(previewPage - 1) * 2] ? (
                    <>
                      <div className="w-full h-56 rounded-lg overflow-hidden border border-gray-300 shadow">
                        <img 
                          src={photos[(previewPage - 1) * 2].url} 
                          alt="Left Page" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[10px] font-mono text-gray-500">Page {(previewPage - 1) * 2 + 1}</span>
                    </>
                  ) : (
                    <span className="text-xs text-gray-400 italic">End of album</span>
                  )}
                </div>

                {/* Right Page Photo */}
                <div className="flex flex-col items-center justify-center p-2 space-y-2 pl-4">
                  {photos[(previewPage - 1) * 2 + 1] ? (
                    <>
                      <div className="w-full h-56 rounded-lg overflow-hidden border border-gray-300 shadow">
                        <img 
                          src={photos[(previewPage - 1) * 2 + 1].url} 
                          alt="Right Page" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[10px] font-mono text-gray-500">Page {(previewPage - 1) * 2 + 2}</span>
                    </>
                  ) : (
                    <span className="text-xs text-gray-400 italic">End of album</span>
                  )}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* STEP 4: ALBUM CONFIGURATION & OPTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Album Sizes */}
        <div className="glass-panel p-6 rounded-3xl space-y-4 border border-white/10">
          <h3 className="font-serif font-bold text-xl text-white">Select Album Size</h3>
          <div className="space-y-3">
            {ALBUM_SIZES.map((sz) => (
              <div 
                key={sz.id}
                onClick={() => setSelectedSize(sz)}
                className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                  selectedSize.id === sz.id
                    ? 'bg-amber-400/20 border-amber-400 text-white font-bold shadow-lg ring-1 ring-amber-400'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:border-amber-400/30'
                }`}
              >
                <div>
                  <span className="text-sm font-semibold text-white">{sz.label}</span>
                  <span className="text-xs text-gray-400 block">{sz.dimensions}</span>
                </div>

                <div className="text-right">
                  <span className="font-serif font-extrabold text-lg text-amber-300">₹{sz.price}</span>
                  {sz.badge && <span className="badge-gold block text-[9px] mt-1">{sz.badge}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Album Layout Styles */}
        <div className="glass-panel p-6 rounded-3xl space-y-4 border border-white/10">
          <h3 className="font-serif font-bold text-xl text-white">Select Album Layout Style</h3>
          <div className="space-y-3">
            {ALBUM_STYLES.map((st) => (
              <div 
                key={st.id}
                onClick={() => setSelectedStyle(st)}
                className={`p-4 rounded-2xl border cursor-pointer space-y-1 transition-all ${
                  selectedStyle.id === st.id
                    ? 'bg-amber-400/20 border-amber-400 text-white font-bold shadow-lg ring-1 ring-amber-400'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:border-amber-400/30'
                }`}
              >
                <div className="text-sm font-semibold text-white">{st.label}</div>
                <div className="text-xs text-gray-400 leading-relaxed">{st.description}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Embedded Ammu AI Assistant */}
      <AmmuAIAssistant 
        onUploadClick={() => fileInputRef.current?.click()}
        onOrderClick={handleDirectCheckout}
      />

      {/* STEP 5: FINAL SUMMARY & CHECKOUT BAR */}
      <div className="glass-panel-gold p-6 sm:p-8 rounded-3xl border border-amber-400/40 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Selected Album Summary</span>
          <h3 className="font-serif font-bold text-2xl text-white">
            "{albumTitle}" ({photos.length} Photos)
          </h3>
          <p className="text-xs text-gray-300">
            Style: <strong>{selectedStyle.id}</strong> • Size: <strong>{selectedSize.dimensions}</strong>
          </p>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="text-right hidden sm:block">
            <span className="text-xs text-gray-400 block">Total Album Price</span>
            <span className="font-serif font-extrabold text-3xl gold-gradient-text">₹{selectedSize.price}</span>
          </div>

          <button 
            onClick={handleDirectCheckout}
            className="btn-primary py-4 px-8 text-sm font-bold w-full sm:w-auto justify-center shadow-2xl"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>PROCEED TO CHECKOUT (₹{selectedSize.price})</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>

    </div>
  );
};

export default AlbumCreatorPage;
