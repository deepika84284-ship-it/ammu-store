import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, ShieldCheck, ArrowRight, Frame } from 'lucide-react';
import { loginApi } from '../services/api';
import { useShop } from '../context/ShopContext';

const LoginPage = () => {
  const { loginUser, showToast } = useShop();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter email and password', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await loginApi({ email, password });
      if (res.success) {
        loginUser(res.user, res.token);
        if (res.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Login failed. Please check credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFillAdmin = () => {
    setEmail('admin@ammuframestore.com');
    setPassword('admin123');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      
      {/* Brand Icon Header */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#f7e6a7] via-[#e6c675] to-[#b8923a] p-[1px] mx-auto shadow-xl">
          <div className="w-full h-full bg-[#0d0a12] rounded-[15px] flex items-center justify-center">
            <Frame className="w-7 h-7 text-[#e6c675]" />
          </div>
        </div>
        <h1 className="font-serif text-3xl font-bold gold-gradient-text">Welcome Back</h1>
        <p className="text-xs text-[var(--text-muted)]">
          Sign in to view your customized frame orders and account details
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-3xl space-y-4 border border-white/10 shadow-2xl">
        
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address</label>
          <div className="relative">
            <input 
              type="email" required 
              value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. customer@example.com"
              className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400"
            />
            <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1">Password</label>
          <div className="relative">
            <input 
              type="password" required 
              value={password} onChange={(e) => setPassword(e.target.value)}
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
          <span>{loading ? 'SIGNING IN...' : 'SIGN IN'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Demo Admin Auto-fill shortcut */}
        <div className="pt-3 border-t border-white/10 text-center">
          <button 
            type="button"
            onClick={handleFillAdmin}
            className="text-[11px] text-amber-300 hover:underline inline-flex items-center gap-1 font-semibold"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Click here to Auto-fill Admin Demo Account
          </button>
        </div>

        <div className="text-center text-xs text-gray-400 pt-2">
          Don't have an account?{' '}
          <Link to="/register" className="text-amber-300 font-semibold hover:underline">
            Register Here
          </Link>
        </div>

      </form>

    </div>
  );
};

export default LoginPage;
