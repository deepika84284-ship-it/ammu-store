import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, ArrowRight, Frame } from 'lucide-react';
import { registerApi } from '../services/api';
import { useShop } from '../context/ShopContext';

const RegisterPage = () => {
  const { loginUser, showToast } = useShop();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      showToast('Please fill in required fields', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await registerApi(formData);
      if (res.success) {
        loginUser(res.user, res.token);
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#f7e6a7] via-[#e6c675] to-[#b8923a] p-[1px] mx-auto shadow-xl">
          <div className="w-full h-full bg-[#0d0a12] rounded-[15px] flex items-center justify-center">
            <Frame className="w-7 h-7 text-[#e6c675]" />
          </div>
        </div>
        <h1 className="font-serif text-3xl font-bold gold-gradient-text">Create Account</h1>
        <p className="text-xs text-[var(--text-muted)]">
          Join AMMU Frame Store to save your frame customizations & track deliveries
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-3xl space-y-4 border border-white/10 shadow-2xl">
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Full Name *</label>
          <div className="relative">
            <input 
              type="text" required 
              value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. Deepika"
              className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400"
            />
            <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address *</label>
          <div className="relative">
            <input 
              type="email" required 
              value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="deepika@example.com"
              className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400"
            />
            <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Mobile Phone Number</label>
          <div className="relative">
            <input 
              type="tel" 
              value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="9876543210"
              className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400"
            />
            <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Password *</label>
          <div className="relative">
            <input 
              type="password" required 
              value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="••••••••"
              className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400"
            />
            <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="btn-primary w-full py-3.5 justify-center text-xs font-bold shadow-lg"
        >
          <span>{loading ? 'CREATING ACCOUNT...' : 'REGISTER ACCOUNT'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="text-center text-xs text-gray-400 pt-2">
          Already have an account?{' '}
          <Link to="/login" className="text-amber-300 font-semibold hover:underline">
            Sign In Here
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
