import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Package, Truck, ArrowRight, RefreshCw, Heart, Sparkles } from 'lucide-react';
import { getOrderById } from '../services/api';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (!order) {
      fetchOrder();
    }
    // Set up auto polling every 5 seconds so status changes from Admin show live!
    const interval = setInterval(() => {
      fetchOrder(false);
    }, 5000);
    return () => clearInterval(interval);
  }, [id]);

  const fetchOrder = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const res = await getOrderById(id);
      if (res.success) {
        setOrder(res.order);
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const getStatusStepIndex = (status) => {
    switch (status) {
      case 'Pending': return 1;
      case 'Confirmed': return 2;
      case 'Processing': return 3;
      case 'Shipped':
      case 'Out for Delivery': return 4;
      case 'Delivered': return 5;
      default: return 1;
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-4">
        <RefreshCw className="w-8 h-8 text-[var(--primary-gold)] animate-spin mx-auto" />
        <p className="text-sm text-gray-400">Loading order status details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl text-white font-bold">Order Not Found</h2>
        <Link to="/" className="btn-primary py-2 px-6 text-xs">Back to Home</Link>
      </div>
    );
  }

  const currentStep = getStatusStepIndex(order.orderStatus);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      
      {/* Success Hero Header */}
      <div className="glass-panel-gold p-8 rounded-3xl text-center space-y-4 border border-amber-400/40 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40 animate-pulse">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <span className="badge-gold">ORDER #{order.orderId}</span>
        
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
          Thank You, {order.customerName}! ❤️
        </h1>
        
        <p className="text-sm text-amber-200/90 max-w-lg mx-auto">
          Your custom frame order has been successfully saved to our database!
        </p>

        {/* Live Admin status highlight banner */}
        <div className="p-4 rounded-2xl bg-black/60 border border-amber-400/30 max-w-md mx-auto">
          <span className="text-xs text-gray-400 block mb-1">Current Order Status:</span>
          <span className="text-lg font-bold text-amber-300 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            {order.orderStatus === 'Confirmed' ? 'Your order has been confirmed!' : order.orderStatus}
          </span>
          <p className="text-[11px] text-gray-400 mt-1">
            (Auto-updates when Admin confirms your order in the Admin Dashboard)
          </p>
        </div>
      </div>

      {/* Visual Timeline Tracker */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 border border-white/10">
        <h3 className="font-serif font-bold text-lg text-white">Order Tracking Progress</h3>

        <div className="grid grid-cols-5 gap-2 text-center text-xs relative">
          
          {/* Step 1 */}
          <div className="space-y-2">
            <div className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center font-bold transition-all ${
              currentStep >= 1 ? 'bg-amber-400 text-black shadow-lg scale-110' : 'bg-white/10 text-gray-500'
            }`}>
              ✓
            </div>
            <span className={currentStep >= 1 ? 'text-amber-300 font-semibold' : 'text-gray-500'}>Order Placed</span>
          </div>

          {/* Step 2 */}
          <div className="space-y-2">
            <div className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center font-bold transition-all ${
              currentStep >= 2 ? 'bg-amber-400 text-black shadow-lg scale-110' : 'bg-white/10 text-gray-500'
            }`}>
              {currentStep >= 2 ? '✓' : '2'}
            </div>
            <span className={currentStep >= 2 ? 'text-amber-300 font-semibold' : 'text-gray-500'}>Confirmed</span>
          </div>

          {/* Step 3 */}
          <div className="space-y-2">
            <div className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center font-bold transition-all ${
              currentStep >= 3 ? 'bg-amber-400 text-black shadow-lg scale-110' : 'bg-white/10 text-gray-500'
            }`}>
              {currentStep >= 3 ? '✓' : '3'}
            </div>
            <span className={currentStep >= 3 ? 'text-amber-300 font-semibold' : 'text-gray-500'}>Processing</span>
          </div>

          {/* Step 4 */}
          <div className="space-y-2">
            <div className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center font-bold transition-all ${
              currentStep >= 4 ? 'bg-amber-400 text-black shadow-lg scale-110' : 'bg-white/10 text-gray-500'
            }`}>
              {currentStep >= 4 ? '✓' : '4'}
            </div>
            <span className={currentStep >= 4 ? 'text-amber-300 font-semibold' : 'text-gray-500'}>Shipped</span>
          </div>

          {/* Step 5 */}
          <div className="space-y-2">
            <div className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center font-bold transition-all ${
              currentStep >= 5 ? 'bg-amber-400 text-black shadow-lg scale-110' : 'bg-white/10 text-gray-500'
            }`}>
              {currentStep >= 5 ? '✓' : '5'}
            </div>
            <span className={currentStep >= 5 ? 'text-amber-300 font-semibold' : 'text-gray-500'}>Delivered</span>
          </div>

        </div>
      </div>

      {/* Order Item & Shipping Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Items */}
        <div className="glass-panel p-6 rounded-2xl space-y-4 border border-white/10">
          <h4 className="font-serif font-semibold text-white text-base border-b border-white/10 pb-2">
            Ordered Items
          </h4>
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 bg-black/40 p-3 rounded-xl">
                <img src={item.customizedImageUrl || item.originalImageUrl} alt={item.productName} className="w-14 h-16 object-cover rounded border border-amber-400/40" />
                <div className="flex-1 text-xs space-y-1">
                  <h5 className="font-semibold text-white">{item.productName}</h5>
                  <p className="text-gray-400">Frame: {item.frame} | Size: {item.size}</p>
                  <p className="text-amber-300 font-bold">₹{item.price} × {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-3 flex justify-between font-bold text-sm text-white">
            <span>Total Paid</span>
            <span className="gold-gradient-text text-lg">₹{order.totalAmount}</span>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="glass-panel p-6 rounded-2xl space-y-4 border border-white/10 text-xs text-gray-300">
          <h4 className="font-serif font-semibold text-white text-base border-b border-white/10 pb-2">
            Delivery Destination
          </h4>
          <div className="space-y-1 leading-relaxed">
            <p className="font-bold text-white text-sm">{order.customerName}</p>
            <p>Phone: {order.phone}</p>
            <p>Email: {order.email}</p>
            <p>{order.shippingAddress.doorNo}, {order.shippingAddress.street}</p>
            {order.shippingAddress.area && <p>{order.shippingAddress.area}</p>}
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
            <p className="pt-2 text-amber-300">Payment: <strong>{order.paymentMethod}</strong> ({order.paymentStatus})</p>
          </div>
        </div>

      </div>

      <div className="flex justify-center pt-4">
        <Link to="/" className="btn-secondary text-xs py-3 px-6">
          <ArrowRight className="w-4 h-4 rotate-180" /> Return to Frame Showroom
        </Link>
      </div>

    </div>
  );
};

export default OrderSuccessPage;
