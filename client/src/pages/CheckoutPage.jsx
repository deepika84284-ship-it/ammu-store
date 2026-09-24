import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Truck, Sparkles, CreditCard, Lock, QrCode, Copy, Upload, AlertCircle, ShoppingBag } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { createOrder, uploadCustomerPhoto } from '../services/api';
import UPIQRCode from '../components/UPIQRCode';
import confetti from 'canvas-confetti';

const CheckoutPage = () => {
  const { cart, getCartTotal, removeFromCart, clearCart, user, showToast } = useShop();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    doorNo: user?.address?.doorNo || '',
    street: user?.address?.street || '',
    area: user?.address?.area || '',
    city: user?.address?.city || 'Chennai',
    district: user?.address?.district || 'Chennai',
    state: user?.address?.state || 'Tamil Nadu',
    pincode: user?.address?.pincode || '600001',
    deliveryInstructions: '',
    paymentMethod: 'UPI Payment', // 'UPI Payment' | 'Test Order' | 'Cash on Delivery'
    utrNumber: '',
    paymentScreenshotUrl: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingScreenshot, setIsUploadingScreenshot] = useState(false);

  const totalAmount = getCartTotal();

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 text-[var(--primary-gold)] flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl text-white font-bold">Your Cart is Empty</h2>
        <p className="text-xs text-gray-400">Please create a photo album or select a frame first.</p>
        <button onClick={() => navigate('/create-album')} className="btn-primary py-3 px-6 text-xs">
          Create Your Album
        </button>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCopyUPI = () => {
    navigator.clipboard.writeText('deepika84284@okhdfcbank');
    showToast('UPI ID copied: deepika84284@okhdfcbank 📋', 'success');
  };

  const handleScreenshotUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploadingScreenshot(true);
    try {
      const res = await uploadCustomerPhoto(file);
      if (res.success) {
        setFormData((prev) => ({ ...prev, paymentScreenshotUrl: res.imageUrl }));
        showToast('Payment screenshot attached! 🖼️', 'success');
      }
    } catch (err) {
      showToast('Uploaded local screenshot preview', 'info');
      setFormData((prev) => ({ ...prev, paymentScreenshotUrl: URL.createObjectURL(file) }));
    } finally {
      setIsUploadingScreenshot(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent double submission
    if (isSubmitting) return;

    if (!formData.customerName.trim() || !formData.phone.trim() || !formData.email.trim() || !formData.doorNo.trim() || !formData.street.trim() || !formData.city.trim() || !formData.pincode.trim()) {
      showToast('Please fill in all required shipping address fields.', 'error');
      return;
    }

    if (formData.paymentMethod === 'UPI Payment' && !formData.utrNumber.trim()) {
      showToast('Please enter your 12-digit UPI Transaction ID / UTR Number.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const firstItem = cart[0] || {};
      const orderPayload = {
        userId: user ? user.id : null,
        customerName: formData.customerName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        albumTitle: firstItem.albumTitle || firstItem.productName || 'Custom Photo Album',
        albumSize: firstItem.albumSize || firstItem.size || '8 × 10 inch',
        albumStyle: firstItem.albumStyle || firstItem.frame || 'Classic',
        photoCount: firstItem.photoCount || (firstItem.photos ? firstItem.photos.length : 1),
        coverPhoto: firstItem.coverPhoto || firstItem.customizedImageUrl || firstItem.originalImageUrl || '',
        photos: firstItem.photos || [],
        items: cart,
        totalAmount,
        shippingAddress: {
          doorNo: formData.doorNo.trim(),
          street: formData.street.trim(),
          area: formData.area.trim(),
          city: formData.city.trim(),
          district: formData.district.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim(),
          deliveryInstructions: formData.deliveryInstructions.trim()
        },
        paymentMethod: formData.paymentMethod,
        utrNumber: formData.utrNumber.trim(),
        paymentScreenshotUrl: formData.paymentScreenshotUrl
      };

      console.log('[Checkout Submit Payload]:', orderPayload);
      const response = await createOrder(orderPayload);

      if (response.success && response.order) {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });

        showToast('🎉 Order Placed Successfully!', 'success');
        clearCart();
        navigate(`/order-success/${response.order.orderId}`, { state: { order: response.order } });
      } else {
        throw new Error(response.message || 'Order creation failed on backend');
      }
    } catch (err) {
      const status = err.response?.status;
      const serverMsg = err.response?.data?.message;

      console.error('[ORDER ERROR]', {
        URL: err.config?.url,
        STATUS: status || 'Network/Connection Failed',
        RESPONSE: err.response?.data,
        MESSAGE: err.message
      });

      if (status === 401) {
        showToast('Please sign in again to complete your order.', 'error');
      } else if (status === 400) {
        showToast(`Please check order details: ${serverMsg || 'Invalid order data'}`, 'error');
      } else if (status === 500) {
        showToast(`Server error: ${serverMsg || 'Failed to create order on server. Please try again.'}`, 'error');
      } else if (!err.response) {
        showToast('Unable to connect to the order server. Please check your network connection.', 'error');
      } else {
        showToast(`Unable to place your order: ${serverMsg || err.message}`, 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6 sm:space-y-8 overflow-x-hidden">
      
      {/* Page Header */}
      <div className="text-center space-y-1.5">
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-white tracking-tight">
          Shipping & Payment Checkout
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-lg mx-auto">
          Complete your delivery details and choose your payment method below.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* LEFT COLUMN: SHIPPING ADDRESS & PAYMENT METHOD (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Shipping Address Section */}
          <div className="glass-panel p-5 sm:p-7 rounded-2xl sm:rounded-3xl space-y-5 border border-white/10">
            <h3 className="font-serif font-bold text-lg sm:text-xl text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <Truck className="w-5 h-5 text-[var(--primary-gold)]" />
              Delivery Destination
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Full Customer Name *</label>
                <input 
                  type="text" name="customerName" required
                  value={formData.customerName} onChange={handleChange}
                  placeholder="e.g., Deepika"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 sm:py-3 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Mobile Phone Number *</label>
                <input 
                  type="tel" name="phone" required
                  value={formData.phone} onChange={handleChange}
                  placeholder="e.g., 9876543210"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 sm:py-3 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-gray-300 font-semibold mb-1">Email Address *</label>
                <input 
                  type="email" name="email" required
                  value={formData.email} onChange={handleChange}
                  placeholder="e.g., deepika@example.com"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 sm:py-3 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Door / House Number *</label>
                <input 
                  type="text" name="doorNo" required
                  value={formData.doorNo} onChange={handleChange}
                  placeholder="e.g., Door #42"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 sm:py-3 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Street / Road Name *</label>
                <input 
                  type="text" name="street" required
                  value={formData.street} onChange={handleChange}
                  placeholder="e.g., Mount Road"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 sm:py-3 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Area / Locality</label>
                <input 
                  type="text" name="area"
                  value={formData.area} onChange={handleChange}
                  placeholder="e.g., T. Nagar"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 sm:py-3 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">City *</label>
                <input 
                  type="text" name="city" required
                  value={formData.city} onChange={handleChange}
                  placeholder="e.g., Chennai"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 sm:py-3 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">State *</label>
                <input 
                  type="text" name="state" required
                  value={formData.state} onChange={handleChange}
                  placeholder="e.g., Tamil Nadu"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 sm:py-3 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Pincode *</label>
                <input 
                  type="text" name="pincode" required
                  value={formData.pincode} onChange={handleChange}
                  placeholder="e.g., 600001"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 sm:py-3 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Selectable Payment Method Cards */}
          <div className="glass-panel p-5 sm:p-7 rounded-2xl sm:rounded-3xl space-y-4 border border-white/10">
            <h3 className="font-serif font-bold text-lg sm:text-xl text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <QrCode className="w-5 h-5 text-[var(--primary-gold)]" />
              Payment Options
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              
              {/* Option 1: UPI */}
              <button
                type="button"
                onClick={() => setFormData({ ...formData, paymentMethod: 'UPI Payment' })}
                className={`p-3.5 sm:p-4 rounded-2xl border text-left flex flex-col items-start gap-1.5 transition-all ${
                  formData.paymentMethod === 'UPI Payment'
                    ? 'bg-amber-400/20 border-amber-400 text-white font-bold shadow-lg ring-1 ring-amber-400'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:border-amber-400/30'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <QrCode className="w-5 h-5 text-amber-400" />
                  {formData.paymentMethod === 'UPI Payment' && (
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                  )}
                </div>
                <span className="text-xs font-semibold text-white">💳 Pay via UPI</span>
                <span className="text-[10px] text-gray-400">Scan QR Code</span>
              </button>

              {/* Option 2: Test Order ₹1 */}
              <button
                type="button"
                onClick={() => setFormData({ ...formData, paymentMethod: 'Test Order' })}
                className={`p-3.5 sm:p-4 rounded-2xl border text-left flex flex-col items-start gap-1.5 transition-all ${
                  formData.paymentMethod === 'Test Order'
                    ? 'bg-amber-400/20 border-amber-400 text-white font-bold shadow-lg ring-1 ring-amber-400'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:border-amber-400/30'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  {formData.paymentMethod === 'Test Order' && (
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                  )}
                </div>
                <span className="text-xs font-semibold text-white">✨ Test Order (₹1)</span>
                <span className="text-[10px] text-gray-400">Instant Flow Test</span>
              </button>

              {/* Option 3: Cash on Delivery */}
              <button
                type="button"
                onClick={() => setFormData({ ...formData, paymentMethod: 'Cash on Delivery' })}
                className={`p-3.5 sm:p-4 rounded-2xl border text-left flex flex-col items-start gap-1.5 transition-all ${
                  formData.paymentMethod === 'Cash on Delivery'
                    ? 'bg-amber-400/20 border-amber-400 text-white font-bold shadow-lg ring-1 ring-amber-400'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:border-amber-400/30'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <Truck className="w-5 h-5 text-amber-400" />
                  {formData.paymentMethod === 'Cash on Delivery' && (
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                  )}
                </div>
                <span className="text-xs font-semibold text-white">🚚 Cash On Delivery</span>
                <span className="text-[10px] text-gray-400">Pay on Delivery</span>
              </button>

            </div>

            {/* EXPANDED MANUAL UPI PAYMENT DETAILS */}
            {formData.paymentMethod === 'UPI Payment' && (
              <div className="p-4 sm:p-6 rounded-2xl glass-panel-gold border border-amber-400/40 space-y-5 mt-3">
                
                <div className="text-center space-y-1">
                  <span className="badge-gold">MANUAL UPI PAYMENT</span>
                  <h4 className="font-serif font-bold text-base sm:text-lg text-white">Scan QR & Pay</h4>
                  <p className="text-xs text-amber-200/90">
                    Use Google Pay, PhonePe, Paytm, or BHIM to pay <strong>₹{totalAmount}</strong>
                  </p>
                </div>

                {/* Display QR Code */}
                <UPIQRCode 
                  upiId="deepika84284@okhdfcbank" 
                  payeeName="AMMU FRAME STORE" 
                  amount={totalAmount} 
                />

                {/* UPI ID Copy Card */}
                <div className="p-3 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between text-xs gap-2">
                  <div className="truncate">
                    <span className="text-[10px] text-gray-400 block font-semibold uppercase">Official UPI ID:</span>
                    <span className="font-mono font-bold text-amber-300 text-xs sm:text-sm truncate">deepika84284@okhdfcbank</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={handleCopyUPI}
                    className="px-3 py-1.5 rounded-lg bg-amber-400 text-black font-bold text-xs flex items-center gap-1 hover:scale-105 transition-all shadow flex-shrink-0"
                  >
                    <Copy className="w-3.5 h-3.5" /> Copy
                  </button>
                </div>

                {/* Transaction ID & Screenshot */}
                <div className="space-y-3.5 pt-2 border-t border-amber-500/20 text-xs">
                  <div>
                    <label className="block font-bold text-amber-300 mb-1">
                      UPI Transaction ID / UTR Number *
                    </label>
                    <input 
                      type="text" 
                      name="utrNumber"
                      required={formData.paymentMethod === 'UPI Payment'}
                      value={formData.utrNumber}
                      onChange={handleChange}
                      placeholder="e.g., 426819024812"
                      className="w-full bg-black/60 border border-amber-400/50 rounded-xl px-3.5 py-2.5 sm:py-3 text-white font-mono text-sm placeholder-gray-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-300 mb-1">
                      Upload Payment Screenshot (Optional)
                    </label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="file" 
                        id="screenshot-upload"
                        onChange={handleScreenshotUpload}
                        accept="image/*" 
                        className="hidden"
                      />
                      <label 
                        htmlFor="screenshot-upload" 
                        className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs text-amber-200 font-semibold cursor-pointer flex items-center gap-2 transition-all"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{formData.paymentScreenshotUrl ? 'Screenshot Attached ✓' : 'Attach Screenshot'}</span>
                      </label>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>Payment Status: <strong>Verification Pending</strong> (verified by Admin manually).</span>
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

        {/* RIGHT COLUMN: CLEAN ORDER SUMMARY CARD (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel-gold p-5 sm:p-7 rounded-2xl sm:rounded-3xl space-y-5 border border-amber-400/30 sticky top-24">
            
            {/* Summary Header */}
            <div className="border-b border-amber-500/20 pb-3 flex items-center justify-between">
              <h3 className="font-serif font-bold text-base sm:text-lg text-white">ORDER SUMMARY</h3>
              <span className="text-xs text-amber-300 font-semibold">{cart.length} item{cart.length > 1 ? 's' : ''}</span>
            </div>

            {/* Product Item Cards */}
            <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
              {cart.map((item, idx) => (
                <div key={item.cartItemId || item.albumId || idx} className="bg-black/50 p-3.5 rounded-2xl border border-amber-400/20 space-y-2.5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Album cover image */}
                      <div className="w-16 h-16 rounded-xl overflow-hidden frame-border-gold flex-shrink-0 bg-black">
                        <img 
                          src={item.coverPhoto || item.customizedImageUrl || item.originalImageUrl} 
                          alt={item.albumTitle || item.productName} 
                          className="w-full h-full object-cover rounded-lg" 
                        />
                      </div>
                      
                      <div className="min-w-0 text-xs space-y-0.5">
                        <p className="font-bold text-white truncate text-xs sm:text-sm">{item.albumTitle || item.productName}</p>
                        <p className="text-amber-300/90 text-[11px] font-semibold">
                          {item.photoCount || item.photos?.length || 1} Photos • {item.albumStyle || item.frame || 'Classic'}
                        </p>
                        <p className="text-gray-400 text-[11px]">{item.albumSize || item.size || '8 × 10 inch'}</p>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="font-serif font-extrabold text-base text-amber-300">
                        ₹{item.price * (item.quantity || 1)}
                      </span>
                    </div>
                  </div>

                  {/* Album Actions: EDIT ALBUM & REMOVE */}
                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => navigate('/create-album', { state: { editAlbumId: item.albumId || item.cartItemId } })}
                      className="text-amber-300 hover:text-white font-bold flex items-center gap-1 transition-colors"
                    >
                      ✏️ EDIT ALBUM
                    </button>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.cartItemId || item.albumId)}
                      className="text-red-400 hover:text-red-300 font-semibold transition-colors"
                    >
                      🗑️ REMOVE
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing Breakdown Divider */}
            <div className="border-t border-amber-500/20 pt-3 space-y-2 text-xs text-gray-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white font-semibold">₹{totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Safe Delivery Packaging</span>
                <span className="text-emerald-400 font-semibold">FREE</span>
              </div>
              <div className="flex justify-between font-extrabold text-base text-white pt-3 border-t border-amber-500/20">
                <span>Total Payable</span>
                <span className="gold-gradient-text text-xl">₹{totalAmount}</span>
              </div>
            </div>

            {/* PLACE ORDER BUTTON */}
            <button 
              type="submit"
              disabled={isSubmitting || isUploadingScreenshot}
              className={`btn-primary w-full py-3.5 sm:py-4 justify-center text-sm font-bold shadow-2xl transition-all ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>{isSubmitting ? 'PLACING ORDER...' : '🔒 PLACE ORDER'}</span>
            </button>

            <div className="text-center text-[11px] text-gray-400 space-y-1 pt-1">
              <p className="flex items-center justify-center gap-1 text-emerald-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> Encrypted & Secure Checkout
              </p>
            </div>

          </div>
        </div>

      </form>

    </div>
  );
};

export default CheckoutPage;
