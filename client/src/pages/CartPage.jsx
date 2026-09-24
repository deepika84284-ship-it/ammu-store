import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight, Sparkles, Image as ImageIcon } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const CartPage = () => {
  const { cart, removeFromCart, clearCart, getCartTotal } = useShop();
  const navigate = useNavigate();

  const totalAmount = getCartTotal();

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/20 text-[var(--primary-gold)] flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-white">Your Cart is Empty</h2>
        <p className="text-sm text-[var(--text-muted)] max-w-md mx-auto">
          You haven't added any customized photo frames yet. Select a frame from our showroom and upload your favorite memory!
        </p>
        <Link to="/" className="btn-primary py-3 px-8 text-sm">
          Explore Frame Showroom
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--border-glass)] pb-6 gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">Your Frame Shopping Cart</h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">Review your customized frame orders before checkout</p>
        </div>
        <button onClick={clearCart} className="text-xs text-red-400 hover:underline flex items-center gap-1">
          <Trash2 className="w-3.5 h-3.5" /> Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Cart Items List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => (
            <div 
              key={item.cartItemId} 
              className="glass-panel p-4 sm:p-6 rounded-2xl flex flex-col sm:flex-row items-center gap-6 border border-white/10 hover:border-amber-400/30 transition-all"
            >
              {/* Photo Frame Thumbnail */}
              <div className="relative w-28 h-32 rounded-lg overflow-hidden frame-border-gold flex-shrink-0 bg-black">
                <img 
                  src={item.customizedImageUrl || item.originalImageUrl} 
                  alt={item.productName}
                  className="w-full h-full object-cover" 
                />
              </div>

              {/* Item Info */}
              <div className="flex-1 space-y-1.5 text-center sm:text-left">
                <span className="text-[10px] font-bold text-[var(--primary-gold)] uppercase tracking-wider">
                  {item.frame} Frame
                </span>
                <h3 className="font-serif font-bold text-lg text-white">
                  {item.productName}
                </h3>
                <div className="text-xs text-gray-400 space-y-0.5">
                  <p>📐 Size: <strong className="text-gray-200">{item.size}</strong></p>
                  <p>🎨 Filter: <strong className="text-gray-200">{item.filter}</strong></p>
                  {item.customText && (
                    <p className="italic text-amber-300">"{item.customText}"</p>
                  )}
                </div>
              </div>

              {/* Price & Quantity */}
              <div className="flex sm:flex-col items-center justify-between w-full sm:w-auto gap-4 border-t sm:border-t-0 pt-4 sm:pt-0 border-white/10">
                <div className="text-right">
                  <span className="font-serif font-extrabold text-2xl gold-gradient-text">
                    ₹{item.price * item.quantity}
                  </span>
                  <p className="text-[10px] text-gray-500">Qty: {item.quantity}</p>
                </div>

                <button 
                  onClick={() => removeFromCart(item.cartItemId)}
                  className="p-2 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Order Summary (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel-gold p-6 rounded-2xl space-y-6 border border-amber-400/30">
            <h3 className="font-serif font-bold text-xl text-white border-b border-amber-500/20 pb-4">
              Order Summary
            </h3>

            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex justify-between">
                <span>Subtotal ({cart.length} items)</span>
                <span>₹{totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping & Packaging</span>
                <span className="text-emerald-400 font-semibold">FREE</span>
              </div>
              <div className="flex justify-between">
                <span>AI Photo Customization</span>
                <span className="text-emerald-400 font-semibold">FREE</span>
              </div>
              <div className="border-t border-amber-500/20 pt-3 flex justify-between font-extrabold text-lg text-white">
                <span>Total Amount</span>
                <span className="gold-gradient-text">₹{totalAmount}</span>
              </div>
            </div>

            <button 
              onClick={() => navigate('/checkout')}
              className="btn-primary w-full py-4 justify-center text-sm font-bold"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            {totalAmount === 1 && (
              <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/30 text-[11px] text-amber-200 text-center font-semibold">
                ⚡ ₹1 Test Order active! Perfect for rapid end-to-end testing.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default CartPage;
