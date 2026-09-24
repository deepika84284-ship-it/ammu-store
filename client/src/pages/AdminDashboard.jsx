import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Package, ShoppingBag, CheckCircle, Clock, Truck, RefreshCw, Eye, Check, X, Search, Filter, QrCode, AlertTriangle, ExternalLink, BookOpen, Image as ImageIcon } from 'lucide-react';
import { getAdminOrders, updateOrderStatus, verifyPaymentApi } from '../services/api';
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
        showToast(`Order status updated to: ${newStatus} ✨`, 'success');
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

  const handlePaymentVerify = async (orderId, action) => {
    try {
      const res = await verifyPaymentApi(orderId, action);
      if (res.success) {
        showToast(`Payment ${action === 'confirm' ? 'CONFIRMED' : 'REJECTED'}! Order updated. ✨`, 'success');
        fetchOrdersData();
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(res.order);
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Payment verification failed', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--border-glass)] pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" />
            <span>AMMU FRAME & ALBUM STORE ADMIN DASHBOARD</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-white mt-1">Photo Album Orders & Verification</h1>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={fetchOrdersData} className="btn-secondary py-2 px-4 text-xs">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Orders
          </button>
          <button onClick={() => navigate('/admin/products')} className="btn-primary py-2 px-4 text-xs">
            Manage Catalog
          </button>
        </div>
      </div>

      {/* Analytics Counter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-1">
          <span className="text-[10px] text-gray-400 uppercase font-semibold">TOTAL ALBUMS</span>
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
        {['All', 'Pending', 'Payment Verification', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].map((st) => (
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

      {/* Main Orders Table */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-[var(--primary-gold)] animate-spin mx-auto" />
          <p className="text-xs text-gray-400">Loading album orders from database...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="glass-panel p-12 text-center text-gray-400 space-y-2">
          <Package className="w-10 h-10 mx-auto text-gray-600" />
          <p className="text-base font-semibold text-white">No album orders matching filter "{filterStatus}"</p>
        </div>
      ) : (
        <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-white/5 uppercase text-gray-400 font-semibold tracking-wider text-[10px] border-b border-white/10">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Album Name</th>
                  <th className="p-4">Photos</th>
                  <th className="p-4">Size & Style</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Payment Status</th>
                  <th className="p-4">Order Status</th>
                  <th className="p-4 text-center">Inspect Album</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-white/[0.02] transition-colors">
                    
                    {/* Order ID */}
                    <td className="p-4 font-bold text-amber-300 font-mono">
                      #{ord.orderId}
                    </td>

                    {/* Customer */}
                    <td className="p-4">
                      <div className="font-semibold text-white">{ord.customerName}</div>
                      <div className="text-[10px] text-gray-500">{ord.phone}</div>
                    </td>

                    {/* Album Name & Cover */}
                    <td className="p-4 flex items-center gap-3">
                      {ord.coverPhoto || ord.items[0]?.customizedImageUrl ? (
                        <img 
                          src={ord.coverPhoto || ord.items[0]?.customizedImageUrl} 
                          alt="Cover" 
                          className="w-10 h-12 object-cover rounded border border-amber-400/40 flex-shrink-0"
                        />
                      ) : null}
                      <span className="font-semibold text-white truncate max-w-[140px]">
                        {ord.albumTitle || ord.items[0]?.productName}
                      </span>
                    </td>

                    {/* Photo Count */}
                    <td className="p-4 font-bold text-amber-200">
                      {ord.photoCount || (ord.photos ? ord.photos.length : 1)} Photos
                    </td>

                    {/* Size & Style */}
                    <td className="p-4 text-gray-300 space-y-0.5">
                      <div>{ord.albumSize || ord.items[0]?.size}</div>
                      <div className="text-[10px] text-gray-400">{ord.albumStyle || ord.items[0]?.frame}</div>
                    </td>

                    {/* Amount */}
                    <td className="p-4 font-extrabold text-sm text-white">
                      ₹{ord.totalAmount}
                    </td>

                    {/* Payment Status */}
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase inline-block ${
                        ord.paymentStatus === 'Verification Pending' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse' :
                        ord.paymentStatus === 'Paid' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        ord.paymentStatus === 'Payment Rejected' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                        'bg-gray-500/20 text-gray-300'
                      }`}>
                        {ord.paymentStatus}
                      </span>
                    </td>

                    {/* Order Status */}
                    <td className="p-4 font-bold text-gray-200">
                      {ord.orderStatus}
                    </td>

                    {/* Action Controls */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="btn-primary py-1.5 px-3 text-[11px] justify-center"
                      >
                        <Eye className="w-3.5 h-3.5" /> Inspect Photos
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FULL ALBUM INSPECTOR & PHOTO ORDER VIEW MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel-gold max-w-4xl w-full p-6 sm:p-8 rounded-3xl space-y-6 border border-amber-400/40 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <button 
              onClick={() => setSelectedOrder(null)} 
              className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white/80 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="badge-gold">INSPECT ALBUM #{selectedOrder.orderId}</span>
                <h2 className="font-serif text-2xl font-bold text-white mt-1">
                  "{selectedOrder.albumTitle}" ({selectedOrder.photoCount || (selectedOrder.photos ? selectedOrder.photos.length : 1)} Photos)
                </h2>
                <p className="text-xs text-gray-400">Placed: {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>

              <div className="text-right">
                <span className="text-xs text-gray-400 block">Total Amount</span>
                <span className="font-serif font-extrabold text-2xl gold-gradient-text">₹{selectedOrder.totalAmount}</span>
              </div>
            </div>

            {/* SECTION 1: CUSTOMER UPLOADED PHOTOS IN EXACT ORDER */}
            <div className="space-y-3 bg-black/40 p-5 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between">
                <h4 className="font-serif font-bold text-amber-300 text-sm flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-amber-400" />
                  Uploaded Photos Sequence ({selectedOrder.photos?.length || 1} Photos)
                </h4>
                <span className="text-[10px] text-gray-400">Sequence selected by customer</span>
              </div>

              {selectedOrder.photos && selectedOrder.photos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
                  {selectedOrder.photos.map((photo, pIdx) => (
                    <div key={pIdx} className="relative aspect-square rounded-xl overflow-hidden frame-border-gold shadow bg-black group">
                      <img src={photo.url} alt={`Photo ${pIdx + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute top-1.5 left-1.5 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] text-amber-300 font-bold border border-amber-400/30">
                        #{photo.order || pIdx + 1}
                      </div>
                      <a 
                        href={photo.url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-amber-300 text-xs font-semibold"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-4 pt-2">
                  {selectedOrder.items[0]?.customizedImageUrl && (
                    <div className="w-20 h-24 rounded-lg overflow-hidden frame-border-gold flex-shrink-0">
                      <img src={selectedOrder.items[0].customizedImageUrl} alt="Photo" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="text-xs space-y-1">
                    <p className="text-white font-semibold">{selectedOrder.items[0]?.productName}</p>
                    <p className="text-gray-400">{selectedOrder.items[0]?.frame} • {selectedOrder.items[0]?.size}</p>
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 2: PAYMENT VERIFICATION & UTR */}
            <div className="p-4 rounded-2xl bg-black/60 border border-amber-400/30 space-y-3 text-xs text-gray-200">
              <h4 className="font-serif font-bold text-amber-300 text-sm flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-amber-400" />
                Payment Verification
              </h4>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-[10px] text-gray-400 block font-semibold">Payment Method:</span>
                  <strong className="text-white text-sm">{selectedOrder.paymentMethod}</strong>
                </div>

                <div>
                  <span className="text-[10px] text-gray-400 block font-semibold">Payment Status:</span>
                  <strong className={
                    selectedOrder.paymentStatus === 'Paid' ? 'text-emerald-400' :
                    selectedOrder.paymentStatus === 'Verification Pending' ? 'text-amber-400' : 'text-red-400'
                  }>
                    {selectedOrder.paymentStatus}
                  </strong>
                </div>

                <div>
                  <span className="text-[10px] text-gray-400 block font-semibold">Transaction / UTR ID:</span>
                  <strong className="font-mono text-amber-300 text-sm">{selectedOrder.utrNumber || 'N/A'}</strong>
                </div>

                <div>
                  <span className="text-[10px] text-gray-400 block font-semibold">Order Status:</span>
                  <strong className="text-white text-sm">{selectedOrder.orderStatus}</strong>
                </div>
              </div>

              {/* Payment Screenshot */}
              {selectedOrder.paymentScreenshotUrl && (
                <div className="pt-2">
                  <span className="text-[10px] text-gray-400 block font-semibold mb-1">Payment Screenshot:</span>
                  <a href={selectedOrder.paymentScreenshotUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-amber-200 border border-white/10">
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View Customer Payment Screenshot</span>
                  </a>
                </div>
              )}

              {/* Verification Buttons */}
              {selectedOrder.paymentStatus === 'Verification Pending' && (
                <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                  <button 
                    onClick={() => handlePaymentVerify(selectedOrder._id, 'confirm')}
                    className="btn-primary flex-1 justify-center py-2.5 text-xs font-bold"
                  >
                    [Confirm Payment]
                  </button>

                  <button 
                    onClick={() => handlePaymentVerify(selectedOrder._id, 'reject')}
                    className="px-4 py-2.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-bold hover:bg-red-500/30 transition-all flex-1 justify-center"
                  >
                    [Reject Payment]
                  </button>
                </div>
              )}
            </div>

            {/* SECTION 3: CUSTOMER & ADDRESS DETAILS */}
            <div className="grid grid-cols-2 gap-4 text-xs text-gray-300 bg-black/40 p-4 rounded-xl">
              <div>
                <p className="text-[10px] text-amber-400 font-bold uppercase">Customer Info:</p>
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

            {/* SECTION 4: ORDER STATUS UPDATE */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <label className="block text-xs font-semibold text-white uppercase tracking-wider">
                Update Order Lifecycle Status:
              </label>
              <div className="flex flex-wrap gap-2">
                {['Pending', 'Payment Verification', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].map((st) => (
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
