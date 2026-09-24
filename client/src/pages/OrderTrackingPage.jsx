import React, { useState, useEffect } from 'react';
import { Search, Package, RefreshCw, ChevronRight, Sparkles, Clock, CheckCircle2 } from 'lucide-react';
import { getMyOrders } from '../services/api';
import { useShop } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const OrderTrackingPage = () => {
  const { user } = useShop();
  const [phone, setPhone] = useState(user?.phone || '');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (user?.phone || user?.id) {
      handleFetchOrders(user.phone, user.id);
    }
  }, [user]);

  const handleFetchOrders = async (targetPhone, userId) => {
    setLoading(true);
    setSearched(true);
    try {
      const res = await getMyOrders({ phone: targetPhone || phone, userId });
      if (res.success) {
        setOrders(res.orders);
      }
    } catch (err) {
      console.error(err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (phone.trim()) {
      handleFetchOrders(phone.trim(), null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      
      {/* Search Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Customer Order Lookup</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">Track Your Frame Orders</h1>
        <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto">
          Enter your registered mobile phone number to check order updates, dispatch & delivery status.
        </p>
      </div>

      {/* Phone Search Form */}
      <form onSubmit={handleSubmit} className="max-w-md mx-auto relative">
        <input 
          type="tel" 
          placeholder="Enter 10-digit mobile number..." 
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full pl-11 pr-28 py-3.5 rounded-full bg-white/5 border border-[var(--border-glass)] focus:border-amber-400 focus:outline-none text-sm text-white placeholder-gray-500 transition-all backdrop-blur-md"
        />
        <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <button 
          type="submit" 
          disabled={loading}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 btn-primary text-xs py-2 px-5"
        >
          {loading ? 'Searching...' : 'Track Orders'}
        </button>
      </form>

      {/* Results List */}
      {loading ? (
        <div className="py-16 text-center space-y-4">
          <RefreshCw className="w-8 h-8 text-[var(--primary-gold)] animate-spin mx-auto" />
          <p className="text-xs text-gray-400">Searching MongoDB for orders...</p>
        </div>
      ) : searched && orders.length === 0 ? (
        <div className="glass-panel p-10 text-center space-y-4 max-w-lg mx-auto">
          <Package className="w-12 h-12 text-gray-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Orders Found</h3>
          <p className="text-xs text-gray-400">
            No orders found associated with phone number "{phone}". Make sure you enter the phone number provided during checkout.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link 
              key={order._id} 
              to={`/order-success/${order.orderId}`}
              className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-amber-400/50 transition-all block group text-decoration-none"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <span className="badge-gold">#{order.orderId}</span>
                  <h3 className="font-serif font-bold text-white text-lg mt-1">
                    Customer: {order.customerName}
                  </h3>
                  <p className="text-xs text-gray-400">
                    Placed on: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs text-gray-400 block">Status</span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      order.orderStatus === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      order.orderStatus === 'Delivered' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                      'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {order.orderStatus === 'Confirmed' ? '✓ Confirmed' : order.orderStatus}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Order Item preview */}
              <div className="pt-4 flex items-center justify-between text-xs text-gray-300">
                <div className="flex items-center gap-3">
                  {order.items[0]?.customizedImageUrl && (
                    <img src={order.items[0].customizedImageUrl} alt="Item" className="w-10 h-12 object-cover rounded border border-amber-400/30" />
                  )}
                  <div>
                    <span className="font-semibold text-white">{order.items[0]?.productName}</span>
                    {order.items.length > 1 && (
                      <span className="text-amber-400 ml-2">+{order.items.length - 1} more items</span>
                    )}
                  </div>
                </div>

                <div className="font-extrabold text-base gold-gradient-text">
                  ₹{order.totalAmount}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

    </div>
  );
};

export default OrderTrackingPage;
