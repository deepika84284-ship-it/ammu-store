import React from 'react';
import { Frame, Heart, ShieldCheck, Truck, Sparkles, Award } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-28 bg-[#07060a] border-t border-[var(--border-glass)] text-sm text-[var(--text-secondary)]">
      {/* Features Bar */}
      <div className="border-b border-[var(--border-glass)] bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center gap-2">
            <Award className="w-8 h-8 text-[var(--primary-gold)]" />
            <h4 className="text-white font-semibold">Museum Quality Prints</h4>
            <p className="text-xs text-[var(--text-muted)]">Archival canvas & high-definition photo papers</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Truck className="w-8 h-8 text-[var(--primary-gold)]" />
            <h4 className="text-white font-semibold">Safe Express Delivery</h4>
            <p className="text-xs text-[var(--text-muted)]">Reinforced bubble & wooden box packaging</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Sparkles className="w-8 h-8 text-[var(--primary-gold)]" />
            <h4 className="text-white font-semibold">Live Live Photo Editor</h4>
            <p className="text-xs text-[var(--text-muted)]">Instant preview in your chosen photo frame</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-[var(--primary-gold)]" />
            <h4 className="text-white font-semibold">100% Satisfaction</h4>
            <p className="text-xs text-[var(--text-muted)]">Dedicated AI assistant & friendly support</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#f7e6a7] to-[#b8923a] p-[1px]">
              <div className="w-full h-full bg-[#0d0a12] rounded-[7px] flex items-center justify-center">
                <Frame className="w-5 h-5 text-[#e6c675]" />
              </div>
            </div>
            <div>
              <span className="font-serif font-bold text-xl gold-gradient-text">AMMU</span>
              <span className="block text-[9px] tracking-widest text-gray-400">FRAME STORE</span>
            </div>
          </div>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4">
            “Your Memories. Our Frames. One Beautiful Story.”
            Turning your cherished photos into luxury handcrafted wooden & glass frame wall art.
          </p>
        </div>

        <div>
          <h5 className="text-white font-semibold mb-4 text-sm tracking-wide">Popular Categories</h5>
          <ul className="space-y-2 text-xs">
            <li><a href="#showroom-grid" className="hover:text-[var(--primary-gold)]">Couple & Anniversary Frames</a></li>
            <li><a href="#showroom-grid" className="hover:text-[var(--primary-gold)]">Family & Reunion Frames</a></li>
            <li><a href="#showroom-grid" className="hover:text-[var(--primary-gold)]">Parents & Grandparents Special</a></li>
            <li><a href="#showroom-grid" className="hover:text-[var(--primary-gold)]">Royal Wedding Frames</a></li>
            <li><a href="#showroom-grid" className="hover:text-[var(--primary-gold)]">Baby & Birthday Milestones</a></li>
          </ul>
        </div>

        <div>
          <h5 className="text-white font-semibold mb-4 text-sm tracking-wide">Customer Support</h5>
          <ul className="space-y-2 text-xs">
            <li><a href="/my-orders" className="hover:text-[var(--primary-gold)]">Track Order Status</a></li>
            <li><a href="#ai-assistant" className="hover:text-[var(--primary-gold)]">Ask Ammu AI Assistant</a></li>
            <li><span className="text-[var(--text-muted)]">Call/WhatsApp: +91 98765 43210</span></li>
            <li><span className="text-[var(--text-muted)]">Email: support@ammuframestore.com</span></li>
          </ul>
        </div>

        <div>
          <h5 className="text-white font-semibold mb-4 text-sm tracking-wide">Test Order Demo Mode</h5>
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 space-y-2">
            <p className="font-semibold text-amber-400">⚡ Test Order Available</p>
            <p>Select the ₹1 Mini Memory product to test full order placement, database storage & admin confirmation!</p>
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--border-glass)] py-6 text-center text-xs text-[var(--text-muted)] flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto px-4 gap-4">
        <p>© {new Date().getFullYear()} AMMU FRAME STORE. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for beautiful memories
        </p>
      </div>
    </footer>
  );
};

export default Footer;
