import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Sparkles, User, ShieldCheck, Heart, Frame } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const Navbar = () => {
  const { cart, user, logoutUser } = useShop();
  const navigate = useNavigate();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[#0a090d]/80 border-b border-[var(--border-glass)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo & Tagline */}
        <Link to="/" className="flex items-center gap-3 group text-decoration-none">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#f7e6a7] via-[#e6c675] to-[#b8923a] p-[1px] shadow-lg group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0d0a12] rounded-[11px] flex items-center justify-center">
              <Frame className="w-6 h-6 text-[#e6c675]" />
            </div>
          </div>
          <div>
            <div className="font-serif font-bold text-2xl tracking-wider gold-gradient-text leading-tight">
              AMMU
            </div>
            <div className="text-[10px] tracking-[0.2em] text-[var(--text-secondary)] uppercase font-semibold">
              FRAME STORE
            </div>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--text-secondary)]">
          <Link to="/" className="hover:text-[var(--primary-gold)] transition-colors">
            Showroom
          </Link>
          <a href="#showroom-grid" className="hover:text-[var(--primary-gold)] transition-colors">
            Explore Frames
          </a>
          <Link to="/#mini-memory" className="flex items-center gap-1 text-[var(--primary-gold)] hover:underline font-semibold">
            <Sparkles className="w-4 h-4 animate-pulse" />
            ₹1 Test Memory
          </Link>
          <Link to="/my-orders" className="hover:text-[var(--primary-gold)] transition-colors flex items-center gap-1">
            <Heart className="w-4 h-4" />
            Track Order
          </Link>
          {user && user.role === 'admin' && (
            <Link to="/admin/dashboard" className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 font-bold">
              <ShieldCheck className="w-4 h-4" />
              Admin Panel
            </Link>
          )}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative p-2.5 rounded-full bg-white/5 border border-[var(--border-glass)] hover:border-[var(--primary-gold)] hover:bg-white/10 transition-all text-white">
            <ShoppingBag className="w-5 h-5" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-black font-extrabold text-xs flex items-center justify-center shadow-md animate-bounce">
                {totalCartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/my-orders" className="text-xs font-semibold text-[var(--text-primary)] hover:text-[var(--primary-gold)]">
                Hi, {user.name.split(' ')[0]}
              </Link>
              <button 
                onClick={logoutUser}
                className="text-xs px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-300 hover:bg-red-500/20 transition-all"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-secondary text-xs py-2 px-4">
              <User className="w-4 h-4" />
              Sign In
            </Link>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;
