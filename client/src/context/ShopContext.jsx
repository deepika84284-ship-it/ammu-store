import React, { createContext, useContext, useState, useEffect } from 'react';

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
    }, 3500);
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

  const addToCart = (item) => {
    // Generate unique key based on product + frame + size + uploaded photo
    const cartItemId = `${item.productId}_${item.frame}_${item.size}_${Date.now()}`;
    const newItem = { ...item, cartItemId };

    setCart((prev) => [...prev, newItem]);
    showToast(`Added "${item.productName}" to cart! 🖼️`, 'success');
  };

  const removeFromCart = (cartItemId) => {
    setCart((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  return (
    <ShopContext.Provider value={{
      cart,
      addToCart,
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
      {/* Toast Notification Container */}
      {toast && (
        <div className="toast-popup">
          <span>✨</span>
          <span style={{ fontSize: '0.92rem', fontWeight: '500' }}>{toast.message}</span>
        </div>
      )}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
