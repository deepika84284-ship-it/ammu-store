import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Package, Truck, ArrowRight, RefreshCw, Heart, Sparkles, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { getOrderById } from '../services/api';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    fetchOrder(false);
    // Poll every 4 seconds so customer sees status update instantly when Admin confirms
    const interval = setInterval(() => {
      fetchOrder(false);
    }, 4000);
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

  const getStatusStepIndex = (payStatus, ordStatus) => {
    if (payStatus === 'Payment Rejected' || ordStatus === 'Cancelled') return -1;
    if (payStatus === 'Verification Pending') return 1; // Step 1: Verification Pending
    if (payStatus === 'Paid' && ordStatus === 'Pending') return 2; // Step 2: Payment Confirmed
    if (ordStatus === 'Confirmed') return 3; // Step 3: Order Confirmed
    if (ordStatus === 'Processing') return 4; // Step 4: Processing
    if (ordStatus === 'Shipped' || ordStatus === 'Out for Delivery') return 5; // Step 5: Shipped
    if (ordStatus === 'Delivered') return 6; // Step 6: Delivered
    return 1;
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

  const stepIndex = getStatusStepIndex(order.paymentStatus, order.orderStatus);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      
      {/* Success Hero Header */}
      <div className="glass-panel-gold p-8 rounded-3xl text-center space-y-4 border border-amber-400/40 shadow-2xl">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto border shadow-lg ${
          order.paymentStatus === 'Verification Pending' 
            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 animate-pulse'
            : order.paymentStatus === 'Paid'
            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
            : 'bg-red-500/20 text-red-400 border-red-500/40'
        }`}>
          {order.paymentStatus === 'Verification Pending' ? <Clock className="w-9 h-9" /> :
           order.paymentStatus === 'Paid' ? <CheckCircle2 className="w-9 h-9" /> : <AlertTriangle className="w-9 h-9" />}
        </div>

        <span className="badge-gold">ORDER #{order.orderId}</span>
        
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
          {order.paymentStatus === 'Verification Pending' ? `Order Submitted, ${order.customerName}!` :
           order.paymentStatus === 'Paid' ? `Order Confirmed, ${order.customerName}! ❤️` :
           `Order Status Update`}
        </h1>
        
        <p className="text-sm text-amber-200/90 max-w-lg mx-auto">
          Your frame customization details have been saved.
        </p>

        {/* Live Payment & Order Status Card */}
        <div className="p-5 rounded-2xl bg-black/60 border border-amber-400/30 max-w-md mx-auto space-y-2">
          
          <div className="flex justify-between items-center text-xs text-gray-300 border-b border-white/10 pb-2">
            <span>Payment Method:</span>
            <strong className="text-white">{order.paymentMethod}</strong>
          </div>

          {order.utrNumber && (
            <div className="flex justify-between items-center text-xs text-gray-300 border-b border-white/10 pb-2">
              <span>UPI Transaction UTR:</span>
              <strong className="font-mono text-amber-300">{order.utrNumber}</strong>
            </div>
          )}

          <div className="flex justify-between items-center text-xs text-gray-300 border-b border-white/10 pb-2">
            <span>Payment Status:</span>
            <span className={`font-bold px-3 py-0.5 rounded-full text-xs ${
              order.paymentStatus === 'Verification Pending' ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40' :
              order.paymentStatus === 'Paid' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
              'bg-red-500/20 text-red-400 border border-red-500/40'
            }`}>
              {order.paymentStatus === 'Verification Pending' ? '⏳ Verification Pending' : order.paymentStatus}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs text-gray-300 pt-1">
            <span>Order Status:</span>
            <span className="font-bold text-amber-300">
              {order.orderStatus === 'Confirmed' ? '✓ Order Confirmed' : order.orderStatus}
            </span>
          </div>

        </div>

      </div>

      {/* Visual Customer Timeline Tracker */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 border border-white/10">
        <h3 className="font-serif font-bold text-lg text-white">Payment & Order Verification Timeline</h3>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-center text-xs">
          
          {/* Step 1: Verification Pending */}
          <div className="space-y-2">
            <div className={`w-9 h-9 rounded-full mx-auto flex items-center justify-center font-bold text-xs transition-all ${
              stepIndex >= 1 ? 'bg-amber-400 text-black shadow-lg scale-110' : 'bg-white/10 text-gray-500'
            }`}>
              {stepIndex > 1 ? '✓' : '1'}
            </div>
            <span className={stepIndex >= 1 ? 'text-amber-300 font-semibold' : 'text-gray-500'}>
              Payment Verification Pending
            </span>
          </div>

          {/* Step 2: Payment Confirmed */}
          <div className="space-y-2">
            <div className={`w-9 h-9 rounded-full mx-auto flex items-center justify-center font-bold text-xs transition-all ${
              stepIndex >= 2 ? 'bg-amber-400 text-black shadow-lg scale-110' : 'bg-white/10 text-gray-500'
            }`}>
              {stepIndex > 2 ? '✓' : '2'}
            </div>
            <span className={stepIndex >= 2 ? 'text-amber-300 font-semibold' : 'text-gray-500'}>
              Payment Confirmed
            </span>
          </div>

          {/* Step 3: Order Confirmed */}
          <div className="space-y-2">
            <div className={`w-9 h-9 rounded-full mx-auto flex items-center justify-center font-bold text-xs transition-all ${
              stepIndex >= 3 ? 'bg-amber-400 text-black shadow-lg scale-110' : 'bg-white/10 text-gray-500'
            }`}>
              {stepIndex > 3 ? '✓' : '3'}
            </div>
            <span className={stepIndex >= 3 ? 'text-amber-300 font-semibold' : 'text-gray-500'}>
              Order Confirmed
            </span>
          </div>

          {/* Step 4: Processing */}
          <div className="space-y-2">
            <div className={`w-9 h-9 rounded-full mx-auto flex items-center justify-center font-bold text-xs transition-all ${
              stepIndex >= 4 ? 'bg-amber-400 text-black shadow-lg scale-110' : 'bg-white/10 text-gray-500'
            }`}>
              {stepIndex > 4 ? '✓' : '4'}
            </div>
            <span className={stepIndex >= 4 ? 'text-amber-300 font-semibold' : 'text-gray-500'}>
              Processing
            </span>
          </div>

          {/* Step 5: Shipped */}
          <div className="space-y-2">
            <div className={`w-9 h-9 rounded-full mx-auto flex items-center justify-center font-bold text-xs transition-all ${
              stepIndex >= 5 ? 'bg-amber-400 text-black shadow-lg scale-110' : 'bg-white/10 text-gray-500'
            }`}>
              {stepIndex > 5 ? '✓' : '5'}
            </div>
            <span className={stepIndex >= 5 ? 'text-amber-300 font-semibold' : 'text-gray-500'}>
              Shipped
            </span>
          </div>

          {/* Step 6: Delivered */}
          <div className="space-y-2">
            <div className={`w-9 h-9 rounded-full mx-auto flex items-center justify-center font-bold text-xs transition-all ${
              stepIndex >= 6 ? 'bg-amber-400 text-black shadow-lg scale-110' : 'bg-white/10 text-gray-500'
            }`}>
              {stepIndex >= 6 ? '✓' : '6'}
            </div>
            <span className={stepIndex >= 6 ? 'text-amber-300 font-semibold' : 'text-gray-500'}>
              Delivered
            </span>
          </div>

        </div>
      </div>

      {/* Order Item & Shipping Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Items */}
        <div className="glass-panel p-6 rounded-2xl space-y-4 border border-white/10">
          <h4 className="font-serif font-semibold text-white text-base border-b border-white/10 pb-2">
            Ordered Customized Items
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
            <span>Total Payable</span>
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
