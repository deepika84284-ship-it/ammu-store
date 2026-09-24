import React, { createContext, useContext, useState, useEffect } from 'react';
import { X, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  // Cart items stored in localStorage
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('ammu_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // User auth state
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('ammu_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('ammu_token') || '');

  // Active frame customization modal
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Toast notification
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem('ammu_cart', JSON.stringify(cart));
  }, [cart]);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const loginUser = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('ammu_user', JSON.stringify(userData));
    localStorage.setItem('ammu_token', authToken);
    showToast(`Welcome back, ${userData.name}! ✨`, 'success');
  };

  const logoutUser = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('ammu_user');
    localStorage.removeItem('ammu_token');
    showToast('Logged out successfully', 'info');
  };

  const openFrameDetail = (product) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
  };

  const closeFrameDetail = () => {
    setIsDetailOpen(false);
  };

  const saveAlbumToCart = (albumItem) => {
    const albumId = albumItem.albumId || `album_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const cartItemId = albumId;
    const newItem = {
      ...albumItem,
      albumId,
      cartItemId,
      quantity: 1
    };

    setCart((prev) => {
      const existingIdx = prev.findIndex((i) => i.albumId === albumId || i.cartItemId === cartItemId);
      if (existingIdx !== -1) {
        // UPDATE existing album in place - DO NOT DUPLICATE
        const updated = [...prev];
        updated[existingIdx] = newItem;
        return updated;
      } else {
        // ADD new distinct album
        return [...prev, newItem];
      }
    });

    showToast(`Saved "${newItem.albumTitle}" to cart! 🖼️`, 'success');
    return albumId;
  };

  const addToCart = (item) => {
    if (item.albumId || item.photos) {
      return saveAlbumToCart(item);
    }
    const cartItemId = `${item.productId}_${item.frame}_${item.size}_${Date.now()}`;
    const newItem = { ...item, cartItemId };

    setCart((prev) => [...prev, newItem]);
    showToast(`Added "${item.productName}" to cart! 🖼️`, 'success');
  };

  const removeFromCart = (cartItemId) => {
    setCart((prev) => prev.filter((i) => i.cartItemId !== cartItemId && i.albumId !== cartItemId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  };

  return (
    <ShopContext.Provider value={{
      cart,
      addToCart,
      saveAlbumToCart,
      removeFromCart,
      clearCart,
      getCartTotal,
      user,
      token,
      loginUser,
      logoutUser,
      selectedProduct,
      openFrameDetail,
      closeFrameDetail,
      isDetailOpen,
      toast,
      showToast
    }}>
      {children}
      {/* Top Floating Toast Notification Container */}
      {toast && (
        <div className={`toast-popup ${toast.type === 'error' ? 'toast-popup-error' : ''}`}>
          <div className="flex items-center gap-2.5 overflow-hidden">
            {toast.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            ) : toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            ) : (
              <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0" />
            )}
            <span className="text-xs sm:text-sm font-medium text-white leading-tight">
              {toast.message}
            </span>
          </div>

          <button 
            onClick={() => setToast(null)}
            className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
            title="Close message"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
