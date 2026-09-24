import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Truck, Sparkles, CreditCard, CheckCircle2, Lock } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { createOrder } from '../services/api';
import confetti from 'canvas-confetti';

const CheckoutPage = () => {
  const { cart, getCartTotal, clearCart, user, showToast } = useShop();
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
    paymentMethod: 'Test Order' // 'Test Order' | 'Cash on Delivery' | 'UPI'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalAmount = getCartTotal();

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="font-serif text-2xl text-white font-bold">No Items to Checkout</h2>
        <p className="text-xs text-gray-400">Please select a photo frame from the showroom first.</p>
        <button onClick={() => navigate('/')} className="btn-primary py-3 px-6 text-xs">
          Return to Showroom
        </button>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.customerName || !formData.phone || !formData.email || !formData.doorNo || !formData.street || !formData.city || !formData.pincode) {
      showToast('Please fill in all required shipping address fields', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        userId: user ? user.id : null,
        customerName: formData.customerName,
        phone: formData.phone,
        email: formData.email,
        items: cart,
        totalAmount,
        shippingAddress: {
          doorNo: formData.doorNo,
          street: formData.street,
          area: formData.area,
          city: formData.city,
          district: formData.district,
          state: formData.state,
          pincode: formData.pincode,
          deliveryInstructions: formData.deliveryInstructions
        },
        paymentMethod: formData.paymentMethod
      };

      const response = await createOrder(orderPayload);

      if (response.success) {
        // Trigger festive celebratory confetti
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });

        showToast('🎉 Order Placed Successfully!', 'success');
        clearCart();
        navigate(`/order-success/${response.order.orderId}`, { state: { order: response.order } });
      }
    } catch (err) {
      console.error('Order creation error:', err);
      showToast(err.response?.data?.message || 'Failed to place order. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
      
      {/* Page Header */}
      <div className="text-center space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">Shipping & Checkout</h1>
        <p className="text-xs text-[var(--text-muted)]">
          Provide your address so we can safely pack and ship your customized frame.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Shipping Form Inputs (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl space-y-6 border border-white/10">
          
          <h3 className="font-serif font-bold text-xl text-white flex items-center gap-2 border-b border-white/10 pb-4">
            <Truck className="w-5 h-5 text-[var(--primary-gold)]" />
            Delivery Address
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Name */}
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Full Customer Name *</label>
              <input 
                type="text" name="customerName" required
                value={formData.customerName} onChange={handleChange}
                placeholder="e.g., Deepika"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Mobile Phone Number *</label>
              <input 
                type="tel" name="phone" required
                value={formData.phone} onChange={handleChange}
                placeholder="e.g., 9876543210"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Email */}
            <div className="sm:col-span-2">
              <label className="block text-gray-300 font-semibold mb-1">Email Address *</label>
              <input 
                type="email" name="email" required
                value={formData.email} onChange={handleChange}
                placeholder="e.g., deepika@example.com"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Door No */}
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Door / House Number *</label>
              <input 
                type="text" name="doorNo" required
                value={formData.doorNo} onChange={handleChange}
                placeholder="e.g., Door #42 / Flat 3B"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Street */}
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Street / Road Name *</label>
              <input 
                type="text" name="street" required
                value={formData.street} onChange={handleChange}
                placeholder="e.g., Mount Road"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Area */}
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Area / Locality</label>
              <input 
                type="text" name="area"
                value={formData.area} onChange={handleChange}
                placeholder="e.g., T. Nagar"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-gray-300 font-semibold mb-1">City *</label>
              <input 
                type="text" name="city" required
                value={formData.city} onChange={handleChange}
                placeholder="e.g., Chennai"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* District */}
            <div>
              <label className="block text-gray-300 font-semibold mb-1">District</label>
              <input 
                type="text" name="district"
                value={formData.district} onChange={handleChange}
                placeholder="e.g., Chennai"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-gray-300 font-semibold mb-1">State *</label>
              <input 
                type="text" name="state" required
                value={formData.state} onChange={handleChange}
                placeholder="e.g., Tamil Nadu"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Pincode */}
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Pincode *</label>
              <input 
                type="text" name="pincode" required
                value={formData.pincode} onChange={handleChange}
                placeholder="e.g., 600001"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Delivery Instructions */}
            <div className="sm:col-span-2">
              <label className="block text-gray-300 font-semibold mb-1">Delivery Instructions (Optional)</label>
              <textarea 
                name="deliveryInstructions" rows={2}
                value={formData.deliveryInstructions} onChange={handleChange}
                placeholder="e.g., Please call before arrival or leave with security."
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="pt-4 border-t border-white/10 space-y-3">
            <label className="block text-xs font-semibold text-white uppercase tracking-wider">
              Payment Method:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <label className={`p-3 rounded-xl border cursor-pointer flex flex-col items-center justify-center gap-1 transition-all ${
                formData.paymentMethod === 'Test Order'
                  ? 'bg-amber-400/20 border-amber-400 text-amber-200 font-bold'
                  : 'bg-white/5 border-white/10 text-gray-400'
              }`}>
                <input type="radio" name="paymentMethod" value="Test Order" checked={formData.paymentMethod === 'Test Order'} onChange={handleChange} className="hidden" />
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>⚡ Test Order / Manual</span>
              </label>

              <label className={`p-3 rounded-xl border cursor-pointer flex flex-col items-center justify-center gap-1 transition-all ${
                formData.paymentMethod === 'Cash on Delivery'
                  ? 'bg-amber-400/20 border-amber-400 text-amber-200 font-bold'
                  : 'bg-white/5 border-white/10 text-gray-400'
              }`}>
                <input type="radio" name="paymentMethod" value="Cash on Delivery" checked={formData.paymentMethod === 'Cash on Delivery'} onChange={handleChange} className="hidden" />
                <Truck className="w-4 h-4 text-amber-400" />
                <span>Cash On Delivery</span>
              </label>

              <label className={`p-3 rounded-xl border cursor-pointer flex flex-col items-center justify-center gap-1 transition-all ${
                formData.paymentMethod === 'UPI'
                  ? 'bg-amber-400/20 border-amber-400 text-amber-200 font-bold'
                  : 'bg-white/5 border-white/10 text-gray-400'
              }`}>
                <input type="radio" name="paymentMethod" value="UPI" checked={formData.paymentMethod === 'UPI'} onChange={handleChange} className="hidden" />
                <CreditCard className="w-4 h-4 text-amber-400" />
                <span>UPI / GPay / QR</span>
              </label>
            </div>
          </div>

        </div>

        {/* Right Summary Sidebar (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel-gold p-6 sm:p-8 rounded-3xl space-y-6 border border-amber-400/30 sticky top-24">
            
            <h3 className="font-serif font-bold text-xl text-white border-b border-amber-500/20 pb-4 flex items-center justify-between">
              <span>Order Items</span>
              <span className="text-xs font-sans text-amber-300 font-semibold">{cart.length} item(s)</span>
            </h3>

            {/* Cart Preview list */}
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
              {cart.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-black/40 p-2.5 rounded-xl border border-white/5">
                  <img src={item.customizedImageUrl || item.originalImageUrl} alt={item.productName} className="w-12 h-14 object-cover rounded border border-amber-400/30" />
                  <div className="flex-1 text-xs space-y-0.5">
                    <p className="font-semibold text-white truncate">{item.productName}</p>
                    <p className="text-gray-400">{item.frame} • {item.size}</p>
                  </div>
                  <span className="font-bold text-sm text-amber-300">₹{item.price}</span>
                </div>
              ))}
            </div>

            {/* Price breakdown */}
            <div className="border-t border-amber-500/20 pt-4 space-y-2 text-xs text-gray-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Safe Delivery Packaging</span>
                <span className="text-emerald-400 font-semibold">FREE</span>
              </div>
              <div className="flex justify-between font-extrabold text-base text-white pt-2 border-t border-amber-500/20">
                <span>Total Payable</span>
                <span className="gold-gradient-text text-xl">₹{totalAmount}</span>
              </div>
            </div>

            {/* Place Order Button */}
            <button 
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-4 justify-center text-sm font-bold shadow-2xl"
            >
              <Lock className="w-4 h-4" />
              <span>{isSubmitting ? 'PLACING YOUR ORDER...' : 'PLACE ORDER NOW'}</span>
            </button>

            <div className="text-center text-[11px] text-gray-400 space-y-1">
              <p className="flex items-center justify-center gap-1 text-emerald-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Encrypted & Safe Order Flow
              </p>
              <p>Your custom photo & frame parameters are stored directly into MongoDB for instant Admin processing.</p>
            </div>

          </div>
        </div>

      </form>

    </div>
  );
};

export default CheckoutPage;
