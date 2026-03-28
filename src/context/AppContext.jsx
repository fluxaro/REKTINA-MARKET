import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Theme — always light
  const [theme] = useState('light');

  // Auth
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });

  // Cart
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart')) || []; } catch { return []; }
  });

  // Notifications / Toasts
  const [toasts, setToasts] = useState([]);

  // Unread messages
  const [unreadMessages, setUnreadMessages] = useState(3);

  // Notifications
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Your order #1042 has been shipped', read: false, time: '2m ago' },
    { id: 2, text: 'New message from TechStore', read: false, time: '1h ago' },
    { id: 3, text: 'Flash sale starts in 1 hour!', read: true, time: '3h ago' },
  ]);

  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  const toggleTheme = () => {}; // light mode only

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Cart operations
  const addToCart = useCallback((product, variant = null, qty = 1) => {
    setCart(prev => {
      const key = variant ? `${product.id}-${variant}` : `${product.id}`;
      const existing = prev.find(i => i.key === key);
      if (existing) {
        return prev.map(i => i.key === key ? { ...i, qty: i.qty + qty } : i);
      }
      return [...prev, { key, product, variant, qty }];
    });
    addToast(`${product.name} added to cart`);
  }, [addToast]);

  const removeFromCart = useCallback((key) => {
    setCart(prev => prev.filter(i => i.key !== key));
  }, []);

  const updateCartQty = useCallback((key, qty) => {
    if (qty < 1) return;
    setCart(prev => prev.map(i => i.key === key ? { ...i, qty } : i));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = cart.reduce((sum, i) => sum + i.product.price * i.qty, 0);

  const login = useCallback((userData) => {
    setUser(userData);
    addToast(`Welcome back, ${userData.name}!`);
  }, [addToast]);

  const logout = useCallback(() => {
    setUser(null);
    addToast('Logged out successfully', 'info');
  }, [addToast]);

  const markNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  return (
    <AppContext.Provider value={{
      theme, toggleTheme,
      user, login, logout,
      cart, addToCart, removeFromCart, updateCartQty, clearCart, cartCount, cartTotal,
      toasts, addToast, removeToast,
      unreadMessages, setUnreadMessages,
      notifications, markNotificationsRead,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
