import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Sparkles, User, ShieldCheck, Heart, Frame, BookOpen, Plus } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const Navbar = () => {
  const { cart, user, logoutUser } = useShop();
  const navigate = useNavigate();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#0a090d]/90 border-b border-[var(--border-glass)] transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
        
        {/* Brand Logo & Tagline */}
        <Link to="/" className="flex items-center gap-2 sm:gap-3 group text-decoration-none min-w-0">
          <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#f7e6a7] via-[#e6c675] to-[#b8923a] p-[1px] shadow-lg group-hover:scale-105 transition-transform flex-shrink-0">
            <div className="w-full h-full bg-[#0d0a12] rounded-[11px] flex items-center justify-center">
              <Frame className="w-4 h-4 sm:w-6 sm:h-6 text-[#e6c675]" />
            </div>
          </div>
          <div className="truncate">
            <div className="font-serif font-bold text-lg sm:text-2xl tracking-wider gold-gradient-text leading-tight truncate">
              AMMU
            </div>
            <div className="text-[8px] sm:text-[10px] tracking-[0.2em] text-[var(--text-secondary)] uppercase font-semibold truncate">
              FRAME & ALBUM STORE
            </div>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-[var(--text-secondary)]">
          <Link to="/" className="hover:text-[var(--primary-gold)] transition-colors">
            Home
          </Link>

          {/* Primary CTA Link: Create Album */}
          <Link to="/create-album" className="flex items-center gap-1.5 text-amber-300 hover:text-white font-bold bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/30">
            <BookOpen className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>CREATE ALBUM</span>
          </Link>

          <Link to="/create-album" className="flex items-center gap-1 text-[var(--primary-gold)] hover:underline font-semibold">
            <Sparkles className="w-4 h-4" />
            ₹1 Test Album
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
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          
          {/* Mobile Quick Create Album Button */}
          <Link 
            to="/create-album"
            className="md:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-amber-400 text-black font-bold text-[11px] shadow"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Album</span>
          </Link>

          <Link 
            to="/cart" 
            className="relative p-2 sm:p-2.5 rounded-full bg-white/5 border border-[var(--border-glass)] hover:border-[var(--primary-gold)] hover:bg-white/10 transition-all text-white flex items-center justify-center"
            title="View Cart"
          >
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-black font-extrabold text-[9px] sm:text-xs flex items-center justify-center shadow-md">
                {totalCartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link to="/my-orders" className="text-[11px] sm:text-xs font-semibold text-[var(--text-primary)] hover:text-[var(--primary-gold)] max-w-[80px] sm:max-w-none truncate">
                Hi, {user.name.split(' ')[0]}
              </Link>
              <button 
                onClick={logoutUser}
                className="text-[10px] sm:text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-300 hover:bg-red-500/20 transition-all"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-secondary text-[11px] sm:text-xs py-1.5 sm:py-2 px-3 sm:px-4">
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Sign In</span>
            </Link>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;
