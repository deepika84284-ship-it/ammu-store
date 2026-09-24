import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Plus, Edit2, Trash2, RefreshCw, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/api';
import { useShop } from '../context/ShopContext';

const AdminProductsPage = () => {
  const { user, showToast } = useShop();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Classic Frames',
    price: 99,
    originalPrice: 199,
    description: '',
    dimensions: '12 × 18 inch',
    imageUrl: '',
    frameType: 'Classic',
    badge: ''
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
    fetchProductsList();
  }, [user]);

  const fetchProductsList = async () => {
    setLoading(true);
    try {
      const res = await getProducts();
      if (res.success) setProducts(res.products);
    } catch (e) {
      console.error(e);
      showToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'Classic Frames',
      price: 99,
      originalPrice: 199,
      description: '',
      dimensions: '12 × 18 inch',
      imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
      frameType: 'Classic',
      badge: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice || 0,
      description: product.description,
      dimensions: product.dimensions,
      imageUrl: product.imageUrl,
      frameType: product.frameType || 'Classic',
      badge: product.badge || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this frame product?')) return;
    try {
      const res = await deleteProduct(id);
      if (res.success) {
        showToast('Product deleted successfully', 'success');
        fetchProductsList();
      }
    } catch (err) {
      showToast('Failed to delete product', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        const res = await updateProduct(editingProduct._id, formData);
        if (res.success) showToast('Product updated successfully! ✨', 'success');
      } else {
        const res = await createProduct(formData);
        if (res.success) showToast('New frame product added! ✨', 'success');
      }
      setIsModalOpen(false);
      fetchProductsList();
    } catch (err) {
      showToast(err.response?.data?.message || 'Operation failed', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--border-glass)] pb-6 gap-4">
        <div>
          <button onClick={() => navigate('/admin/dashboard')} className="text-xs text-amber-400 hover:underline flex items-center gap-1 mb-1 font-semibold">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin Dashboard
          </button>
          <h1 className="font-serif text-3xl font-bold text-white">Manage Frame Products & Prices</h1>
        </div>

        <button onClick={handleOpenAddModal} className="btn-primary py-2.5 px-5 text-xs">
          <Plus className="w-4 h-4" /> Add New Frame
        </button>
      </div>

      {/* Product List Table */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-[var(--primary-gold)] animate-spin mx-auto" />
          <p className="text-xs text-gray-400">Loading products database...</p>
        </div>
      ) : (
        <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-white/5 uppercase text-gray-400 font-semibold tracking-wider text-[10px] border-b border-white/10">
                <tr>
                  <th className="p-4">Image</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Dimensions</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Badge</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((prod) => (
                  <tr key={prod._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="w-12 h-14 rounded overflow-hidden frame-border-gold">
                        <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="p-4 font-bold text-white text-sm">{prod.name}</td>
                    <td className="p-4 text-amber-300 font-semibold">{prod.category}</td>
                    <td className="p-4 text-gray-400">{prod.dimensions}</td>
                    <td className="p-4 font-extrabold text-white text-sm">₹{prod.price}</td>
                    <td className="p-4">
                      {prod.badge && <span className="badge-gold">{prod.badge}</span>}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleOpenEditModal(prod)} className="p-2 rounded-full bg-white/10 text-amber-300 hover:bg-white/20">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(prod._id)} className="p-2 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20">
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="glass-panel-gold max-w-lg w-full p-6 rounded-3xl space-y-4 border border-amber-400/40">
            <h3 className="font-serif font-bold text-xl text-white">
              {editingProduct ? 'Edit Frame Product' : 'Add New Frame Product'}
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="col-span-2">
                <label className="block text-gray-300 mb-1 font-semibold">Product Name *</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white" />
              </div>

              <div>
                <label className="block text-gray-300 mb-1 font-semibold">Category *</label>
                <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white">
                  {['Mini Memories', 'Classic Frames', 'Couple Frames', 'Family Frames', 'Parents', 'Grandparents', 'Wedding Frames', 'Birthday', 'Baby', 'Friendship', 'Memories', 'Custom Collage', 'Premium Frames'].map(c => (
                    <option key={c} value={c} className="bg-gray-900">{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-1 font-semibold">Price (₹) *</label>
                <input type="number" required value={formData.price} onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})} className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white" />
              </div>

              <div>
                <label className="block text-gray-300 mb-1 font-semibold">Original Price (₹)</label>
                <input type="number" value={formData.originalPrice} onChange={(e) => setFormData({...formData, originalPrice: parseFloat(e.target.value)})} className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white" />
              </div>

              <div>
                <label className="block text-gray-300 mb-1 font-semibold">Dimensions</label>
                <input type="text" value={formData.dimensions} onChange={(e) => setFormData({...formData, dimensions: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white" />
              </div>

              <div className="col-span-2">
                <label className="block text-gray-300 mb-1 font-semibold">Image URL *</label>
                <input type="text" required value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white" />
              </div>

              <div className="col-span-2">
                <label className="block text-gray-300 mb-1 font-semibold">Description *</label>
                <textarea rows={2} required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white" />
              </div>

              <div>
                <label className="block text-gray-300 mb-1 font-semibold">Badge Text</label>
                <input type="text" value={formData.badge} onChange={(e) => setFormData({...formData, badge: e.target.value})} placeholder="e.g. BESTSELLER" className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white" />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary py-2 px-4 text-xs">Cancel</button>
              <button type="submit" className="btn-primary py-2 px-6 text-xs">Save Frame</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default AdminProductsPage;
