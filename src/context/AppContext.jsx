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
    { id: 1, text: 'Your order #1042 has been shipped', read: false, time: '2m ago', category: 'Orders' },
    { id: 2, text: 'New message from Chukwuemeka Gadgets', read: false, time: '1h ago', category: 'System' },
    { id: 3, text: 'Your dispute DISP-101 is under review', read: false, time: '3h ago', category: 'Disputes' },
  ]);

  const [notifOpen, setNotifOpen] = useState(false);

  // Subscription V2
  const [subscription, setSubscription] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('subscription')) || {
        plan: 'Free Plan',
        price: 'Free',
        expiryDate: null,
        trialDaysLeft: 14,
        isExpired: false,
      };
    } catch {
      return { plan: 'Free Plan', price: 'Free', expiryDate: null, trialDaysLeft: 14, isExpired: false };
    }
  });

  // Referrals V2
  const [referrals, setReferrals] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('referrals')) || {
        code: 'REK-USER-' + Math.floor(1000 + Math.random() * 9000),
        invited: [
          { name: 'Emeka Obi', status: 'Completed', date: '2026-06-01' },
          { name: 'Kelechi Uzo', status: 'Pending', date: '2026-06-08' },
        ],
        claimedCount: 1,
      };
    } catch {
      return { code: 'REK-USER-8921', invited: [], claimedCount: 0 };
    }
  });

  // Disputes V2
  const [disputes, setDisputes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('disputes')) || [
        {
          id: 'DISP-101',
          orderId: 'RKT-1042',
          reason: 'Defective item',
          description: 'The headphones crackle when active noise cancellation is turned on.',
          status: 'under_review',
          evidence: 'headphone_crackle_audio.mp3',
          ruling: null,
          date: '2026-06-08',
          timeline: [
            { title: 'Dispute opened', date: '2026-06-08', done: true },
            { title: 'Evidence submitted by buyer', date: '2026-06-08', done: true },
            { title: 'Under administrative review', date: '2026-06-09', done: true },
            { title: 'Ruling issued', date: null, done: false },
          ]
        }
      ];
    } catch {
      return [];
    }
  });

  // Notification Preferences
  const [preferences, setPreferences] = useState({
    email: true,
    push: true,
    inApp: true,
  });

  // Seller specific V2 metrics
  const [sellerMetrics, setSellerMetrics] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('sellerMetrics')) || {
        balance: 450000,
        pendingPayouts: 120000,
        strikes: 0,
        bankDetails: null,
        payoutHistory: [
          { date: '2026-05-01', amount: 300000, status: 'Completed', reference: 'PAY-8271' },
          { date: '2026-05-15', amount: 150000, status: 'Completed', reference: 'PAY-9018' },
        ]
      };
    } catch {
      return { balance: 0, pendingPayouts: 0, strikes: 0, bankDetails: null, payoutHistory: [] };
    }
  });

  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  useEffect(() => {
    localStorage.setItem('subscription', JSON.stringify(subscription));
  }, [subscription]);

  useEffect(() => {
    localStorage.setItem('referrals', JSON.stringify(referrals));
  }, [referrals]);

  useEffect(() => {
    localStorage.setItem('disputes', JSON.stringify(disputes));
  }, [disputes]);

  useEffect(() => {
    localStorage.setItem('sellerMetrics', JSON.stringify(sellerMetrics));
  }, [sellerMetrics]);

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

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const deleteNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Subscription V2
  const updateSubscription = useCallback((newPlan, price, durationDays) => {
    const expiry = durationDays ? new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null;
    setSubscription({
      plan: newPlan,
      price: price,
      expiryDate: expiry,
      trialDaysLeft: 0,
      isExpired: false,
    });
    addToast(`Subscribed to ${newPlan} successfully!`);
  }, [addToast]);

  const cancelSubscription = useCallback(() => {
    setSubscription(prev => ({
      ...prev,
      plan: 'Free Plan',
      price: 'Free',
      expiryDate: null,
    }));
    addToast('Subscription cancelled. Reverted to Free Plan.', 'info');
  }, [addToast]);

  // Disputes V2
  const addDispute = useCallback((orderId, reason, description, evidence) => {
    const id = 'DISP-' + Math.floor(100 + Math.random() * 900);
    const newDispute = {
      id,
      orderId,
      reason,
      description,
      status: 'opened',
      evidence,
      ruling: null,
      date: new Date().toISOString().split('T')[0],
      timeline: [
        { title: 'Dispute opened', date: new Date().toISOString().split('T')[0], done: true },
        { title: 'Evidence submitted by buyer', date: evidence ? new Date().toISOString().split('T')[0] : null, done: !!evidence },
        { title: 'Under administrative review', date: null, done: false },
        { title: 'Ruling issued', date: null, done: false },
      ]
    };
    setDisputes(prev => [newDispute, ...prev]);
    addToast('Dispute filed successfully');
  }, [addToast]);

  const updateDisputeStatus = useCallback((disputeId, nextStatus, ruling = null) => {
    setDisputes(prev => prev.map(d => {
      if (d.id === disputeId) {
        const nextTimeline = d.timeline.map(t => {
          if (t.title.toLowerCase().includes('evidence') && nextStatus === 'evidence_submitted') {
            return { ...t, date: new Date().toISOString().split('T')[0], done: true };
          }
          if (t.title.toLowerCase().includes('review') && nextStatus === 'under_review') {
            return { ...t, date: new Date().toISOString().split('T')[0], done: true };
          }
          if (t.title.toLowerCase().includes('ruling') && nextStatus === 'resolved') {
            return { ...t, date: new Date().toISOString().split('T')[0], done: true };
          }
          return t;
        });
        return { ...d, status: nextStatus, ruling, timeline: nextTimeline };
      }
      return d;
    }));
  }, []);

  const addNotification = useCallback((text, category = 'System') => {
    const id = Date.now();
    setNotifications(prev => [
      { id, text, read: false, time: 'Just now', category },
      ...prev
    ]);
  }, []);

  // Financials V2
  const requestPayout = useCallback((bankDetails, amount) => {
    setSellerMetrics(prev => {
      if (prev.balance < amount) return prev;
      const ref = 'PAY-' + Math.floor(1000 + Math.random() * 9000);
      return {
        ...prev,
        balance: prev.balance - amount,
        pendingPayouts: prev.pendingPayouts + amount,
        bankDetails,
        payoutHistory: [
          { date: new Date().toISOString().split('T')[0], amount, status: 'Pending', reference: ref },
          ...prev.payoutHistory
        ]
      };
    });
    addToast('Payout request submitted');
  }, [addToast]);

  const addStrike = useCallback(() => {
    setSellerMetrics(prev => {
      const nextStrikes = prev.strikes + 1;
      if (nextStrikes >= 3) {
        addToast('Seller account suspended due to multiple policy violations', 'error');
      } else {
        addToast(`Strike issued. Warning: ${nextStrikes}/3 strikes`, 'warning');
      }
      return { ...prev, strikes: nextStrikes };
    });
  }, [addToast]);

  const claimReferral = useCallback(() => {
    setReferrals(prev => ({ ...prev, claimedCount: prev.claimedCount + 1 }));
    setSubscription(sub => ({
      ...sub,
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      plan: 'Monthly Plan (Referral Free Week)',
    }));
    addToast('Free week of Premium subscription claimed!');
  }, [addToast]);

  return (
    <AppContext.Provider value={{
      theme, toggleTheme,
      user, login, logout,
      cart, addToCart, removeFromCart, updateCartQty, clearCart, cartCount, cartTotal,
      toasts, addToast, removeToast,
      unreadMessages, setUnreadMessages,
      notifications, markNotificationsRead, addNotification, clearNotifications, deleteNotification,
      notifOpen, setNotifOpen,
      subscription, setSubscription, updateSubscription, cancelSubscription,
      referrals, setReferrals, claimReferral,
      disputes, setDisputes, addDispute, updateDisputeStatus,
      preferences, setPreferences,
      sellerMetrics, setSellerMetrics, requestPayout, addStrike,
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
