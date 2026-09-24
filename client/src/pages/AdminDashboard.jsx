import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Package, ShoppingBag, CheckCircle, Clock, Truck, RefreshCw, Eye, Check, X, Search, Filter } from 'lucide-react';
import { getAdminOrders, updateOrderStatus } from '../services/api';
import { useShop } from '../context/ShopContext';

const AdminDashboard = () => {
  const { user, showToast } = useShop();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, processing: 0, shipped: 0, delivered: 0 });
  const [filterStatus, setFilterStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    // Check if user is logged in as Admin
    if (!user || user.role !== 'admin') {
      showToast('Admin access required. Please login with admin credentials.', 'error');
      navigate('/admin/login');
      return;
    }
    fetchOrdersData();
  }, [filterStatus, user]);

  const fetchOrdersData = async () => {
    setLoading(true);
    try {
      const res = await getAdminOrders(filterStatus);
      if (res.success) {
        setOrders(res.orders);
        if (res.stats) setStats(res.stats);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to fetch admin order dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await updateOrderStatus(orderId, newStatus);
      if (res.success) {
        showToast(`Order updated to status: ${newStatus} ✨`, 'success');
        fetchOrdersData();
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(res.order);
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Status update failed', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--border-glass)] pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" />
            <span>AMMU FRAME STORE ADMIN DASHBOARD</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-white mt-1">Order & Store Management</h1>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={fetchOrdersData} className="btn-secondary py-2 px-4 text-xs">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Data
          </button>
          <button onClick={() => navigate('/admin/products')} className="btn-primary py-2 px-4 text-xs">
            Manage Products
          </button>
        </div>
      </div>

      {/* Analytics Counter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-1">
          <span className="text-[10px] text-gray-400 uppercase font-semibold">TOTAL ORDERS</span>
          <div className="text-2xl font-bold font-serif text-white">{stats.total}</div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-amber-500/30 space-y-1">
          <span className="text-[10px] text-amber-400 uppercase font-semibold">PENDING</span>
          <div className="text-2xl font-bold font-serif text-amber-300">{stats.pending}</div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-emerald-500/30 space-y-1">
          <span className="text-[10px] text-emerald-400 uppercase font-semibold">CONFIRMED</span>
          <div className="text-2xl font-bold font-serif text-emerald-300">{stats.confirmed}</div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-blue-500/30 space-y-1">
          <span className="text-[10px] text-blue-400 uppercase font-semibold">PROCESSING</span>
          <div className="text-2xl font-bold font-serif text-blue-300">{stats.processing}</div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-purple-500/30 space-y-1">
          <span className="text-[10px] text-purple-400 uppercase font-semibold">SHIPPED</span>
          <div className="text-2xl font-bold font-serif text-purple-300">{stats.shipped}</div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-teal-500/30 space-y-1">
          <span className="text-[10px] text-teal-400 uppercase font-semibold">DELIVERED</span>
          <div className="text-2xl font-bold font-serif text-teal-300">{stats.delivered}</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
        {['All', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-4 py-2 rounded-full font-semibold transition-all whitespace-nowrap ${
              filterStatus === st
                ? 'bg-amber-400 text-black shadow-md'
                : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Main Table & Selected Order Modal */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-[var(--primary-gold)] animate-spin mx-auto" />
          <p className="text-xs text-gray-400">Loading orders from MongoDB database...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="glass-panel p-12 text-center text-gray-400 space-y-2">
          <Package className="w-10 h-10 mx-auto text-gray-600" />
          <p className="text-base font-semibold text-white">No orders matching status "{filterStatus}"</p>
        </div>
      ) : (
        <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-white/5 uppercase text-gray-400 font-semibold tracking-wider text-[10px] border-b border-white/10">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Frame Photo</th>
                  <th className="p-4">Item Details</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Action Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-white/[0.02] transition-colors">
                    
                    {/* ID */}
                    <td className="p-4 font-bold text-amber-300 font-mono">
                      #{ord.orderId}
                    </td>

                    {/* Customer */}
                    <td className="p-4">
                      <div className="font-semibold text-white">{ord.customerName}</div>
                      <div className="text-[10px] text-gray-500">{ord.email}</div>
                    </td>

                    {/* Phone */}
                    <td className="p-4 text-white font-mono">
                      {ord.phone}
                    </td>

                    {/* Custom Photo Preview */}
                    <td className="p-4">
                      {ord.items[0]?.customizedImageUrl ? (
                        <div className="w-12 h-14 rounded overflow-hidden frame-border-gold shadow">
                          <img src={ord.items[0].customizedImageUrl} alt="Custom Frame" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <span className="text-gray-500 italic">No image</span>
                      )}
                    </td>

                    {/* Items */}
                    <td className="p-4 space-y-0.5">
                      <div className="font-semibold text-white">{ord.items[0]?.productName}</div>
                      <div className="text-[10px] text-gray-400">
                        {ord.items[0]?.frame} • {ord.items[0]?.size}
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="p-4 font-extrabold text-sm text-white">
                      ₹{ord.totalAmount}
                    </td>

                    {/* Status Badge */}
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase inline-block ${
                        ord.orderStatus === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        ord.orderStatus === 'Processing' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                        ord.orderStatus === 'Shipped' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                        ord.orderStatus === 'Delivered' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' :
                        'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {ord.orderStatus}
                      </span>
                    </td>

                    {/* Quick Action Buttons */}
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 flex-wrap">
                        {ord.orderStatus === 'Pending' && (
                          <button
                            onClick={() => handleStatusChange(ord._id, 'Confirmed')}
                            className="px-2.5 py-1 rounded-full bg-emerald-500 text-black font-bold text-[10px] hover:bg-emerald-400 transition-all shadow"
                          >
                            ✓ Confirm Order
                          </button>
                        )}

                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="p-1.5 rounded-full bg-white/10 text-gray-300 hover:text-white hover:bg-white/20 transition-all"
                          title="View Full Order Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detailed Order Inspector Drawer Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel-gold max-w-2xl w-full p-6 sm:p-8 rounded-3xl space-y-6 border border-amber-400/40 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <button 
              onClick={() => setSelectedOrder(null)} 
              className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white/80 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-white/10 pb-4">
              <span className="badge-gold">INSPECT ORDER #{selectedOrder.orderId}</span>
              <h2 className="font-serif text-2xl font-bold text-white mt-1">Customer Order Specs</h2>
              <p className="text-xs text-gray-400">Placed: {new Date(selectedOrder.createdAt).toLocaleString()}</p>
            </div>

            {/* Customer & Address Details */}
            <div className="grid grid-cols-2 gap-4 text-xs text-gray-300 bg-black/40 p-4 rounded-xl">
              <div>
                <p className="text-[10px] text-amber-400 font-bold uppercase">Customer:</p>
                <p className="font-semibold text-white text-sm">{selectedOrder.customerName}</p>
                <p>Phone: <strong>{selectedOrder.phone}</strong></p>
                <p>Email: {selectedOrder.email}</p>
              </div>

              <div>
                <p className="text-[10px] text-amber-400 font-bold uppercase">Shipping Address:</p>
                <p>{selectedOrder.shippingAddress.doorNo}, {selectedOrder.shippingAddress.street}</p>
                <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}</p>
              </div>
            </div>

            {/* Photo & Frame Specs */}
            <div className="flex items-center gap-6 bg-black/50 p-4 rounded-xl border border-white/10">
              {selectedOrder.items[0]?.customizedImageUrl && (
                <div className="w-24 h-28 rounded-lg overflow-hidden frame-border-gold flex-shrink-0">
                  <img src={selectedOrder.items[0].customizedImageUrl} alt="Custom Frame" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="text-xs space-y-1">
                <h4 className="font-serif font-bold text-white text-base">{selectedOrder.items[0]?.productName}</h4>
                <p className="text-gray-300">🖼️ Frame Style: <strong>{selectedOrder.items[0]?.frame}</strong></p>
                <p className="text-gray-300">📐 Size: <strong>{selectedOrder.items[0]?.size}</strong></p>
                <p className="text-gray-300">🎨 Filter: <strong>{selectedOrder.items[0]?.filter}</strong></p>
                <p className="text-amber-300 font-bold text-sm">Total Amount: ₹{selectedOrder.totalAmount}</p>
              </div>
            </div>

            {/* Order Status Action Buttons */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <label className="block text-xs font-semibold text-white uppercase tracking-wider">
                Update Order Status:
              </label>
              <div className="flex flex-wrap gap-2">
                {['Pending', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(selectedOrder._id, st)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      selectedOrder.orderStatus === st
                        ? 'bg-amber-400 text-black font-extrabold shadow'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
