import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FiSearch, FiShoppingCart, FiBell, FiMessageCircle, FiMenu, FiX,
  FiUser, FiLogOut, FiPackage, FiChevronDown, FiGrid, FiSettings,
  FiShield, FiTrendingUp, FiGift, FiCreditCard, FiTrash2, FiAlertCircle, FiInfo
} from 'react-icons/fi';
import { useApp } from '../../context/AppContext';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/sellers', label: 'Sellers' },
];

export default function Navbar() {
  const { 
    user, logout, cartCount, notifications, markNotificationsRead, 
    unreadMessages, subscription, clearNotifications, deleteNotification,
    notifOpen, setNotifOpen
  } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  
  const navigate = useNavigate();
  const location = useLocation();
  const notifRef = useRef(null);
  const userRef = useRef(null);
  const drawerRef = useRef(null);

  const unreadNotifs = notifications.filter(n => !n.read).length;

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handler = (e) => {
      if (drawerRef.current && drawerRef.current.contains(e.target)) return;
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchVal.trim())}`);
      setSearchVal('');
    }
  };

  const isActive = (to) => to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  const renderBanner = () => {
    if (!user) return null;
    
    const activePlan = subscription?.plan || 'Free Plan';
    const trialDaysLeft = subscription?.trialDaysLeft ?? 0;
    const isExpired = subscription?.isExpired ?? false;
    
    if (isExpired) {
      return (
        <div className="bg-gradient-to-r from-red-600 to-red-500 text-white text-xs font-semibold py-2.5 px-4 flex items-center justify-between shadow-sm animate-pulse w-full">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider shrink-0">Locked</span>
            <span className="truncate">Your premium subscription/trial has expired! Seller uploads and analytical features are currently locked.</span>
            <Link to="/subscription" className="ml-auto bg-white text-red-600 hover:bg-red-50 px-3.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors shrink-0">
              Renew Now
            </Link>
          </div>
        </div>
      );
    }
    
    if (activePlan === 'Free Plan' && trialDaysLeft > 0) {
      return (
        <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-600 text-white text-xs font-semibold py-2.5 px-4 flex items-center justify-between shadow-sm w-full">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider shrink-0">Trial</span>
            <span className="truncate">Active Free Trial: <strong>{trialDaysLeft} days remaining</strong>. Enjoy 0% escrow fees and premium listings!</span>
            <Link to="/subscription" className="ml-auto bg-white text-blue-700 hover:bg-blue-50 px-3.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors shrink-0">
              Upgrade
            </Link>
          </div>
        </div>
      );
    }
    
    if (activePlan === 'Free Plan') {
      return (
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-slate-100 text-xs font-semibold py-2.5 px-4 flex items-center justify-between shadow-sm w-full">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <span className="bg-amber-400 text-slate-900 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider shrink-0">Free Plan</span>
            <span className="truncate">You are on the Free tier. Escrow fees (+1.05%) are charged per checkout transaction. Upgrade to eliminate fees.</span>
            <Link to="/subscription" className="ml-auto bg-amber-400 hover:bg-amber-300 text-slate-900 px-3.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors shrink-0">
              Go Premium
            </Link>
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <header className="sticky top-0 z-40 w-full flex flex-col">
      {renderBanner()}
      <nav className="bg-white border-b border-gray-100 shadow-sm w-full">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-3">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 mr-2">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
            <FiTrendingUp size={16} className="text-white" />
          </div>
          <div className="hidden sm:block">
            <span className="font-black text-gray-900 text-base tracking-tight">REKTINA</span>
            <span className="font-black text-blue-600 text-base tracking-tight"> MARKET</span>
          </div>
        </Link>

        {/* Nav links desktop */}
        <div className="hidden lg:flex items-center gap-0.5">
          {NAV_LINKS.map(({ to, label }) => (
            <Link key={to} to={to}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(to) ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
              {label}
            </Link>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md hidden md:flex mx-2">
          <div className={`relative w-full transition-all ${searchFocused ? 'scale-[1.01]' : ''}`}>
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input
              type="search"
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search products, brands, sellers..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 outline-none focus:border-blue-400 focus:bg-white focus:shadow-sm transition-all"
              aria-label="Search"
            />
          </div>
        </form>

        {/* Right actions */}
        <div className="flex items-center gap-1 ml-auto">

          {user && (
            <>
              {/* Messages */}
              <Link to="/messages"
                className={`relative p-2.5 rounded-xl transition-colors ${isActive('/messages') ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                aria-label="Messages">
                <FiMessageCircle size={18} />
                {unreadMessages > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unreadMessages}
                  </span>
                )}
              </Link>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => { setNotifOpen(true); markNotificationsRead(); }}
                  className={`relative p-2.5 rounded-xl transition-colors ${notifOpen ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                  aria-label="Notifications"
                >
                  <FiBell size={18} />
                  {unreadNotifs > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {unreadNotifs}
                    </span>
                  )}
                </button>
              </div>
            </>
          )}

          {/* Cart */}
          <Link to="/cart"
            className={`relative p-2.5 rounded-xl transition-colors ${isActive('/cart') ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
            aria-label={`Cart, ${cartCount} items`}>
            <FiShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>

          {/* User menu */}
          {user ? (
            <div ref={userRef} className="relative ml-1">
              <button
                onClick={() => setUserOpen(o => !o)}
                className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border transition-colors ${userOpen ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
              >
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                  {user.name[0].toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-800 hidden sm:block">{user.name.split(' ')[0]}</span>
                <FiChevronDown size={13} className={`text-gray-400 transition-transform ${userOpen ? 'rotate-180' : ''}`} />
              </button>
              {userOpen && (
                <div className="absolute right-0 top-12 w-56 rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in z-50 bg-white">
                  <div className="px-4 py-3 bg-gradient-to-br from-blue-50 to-white border-b border-gray-100">
                    <p className="font-bold text-sm text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-400 capitalize mt-0.5">{user.role} account</p>
                  </div>
                  <div className="py-1">
                    {(user.role === 'seller' || user.role === 'admin') && (
                      <Link to={user.role === 'seller' ? '/seller' : '/admin'} onClick={() => setUserOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                        <FiGrid size={15} /> {user.role === 'seller' ? 'Seller Dashboard' : 'Admin Panel'}
                      </Link>
                    )}
                    <Link to="/orders" onClick={() => setUserOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <FiPackage size={15} /> My Orders
                    </Link>
                    <Link to="/profile" onClick={() => setUserOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <FiUser size={15} /> Profile
                    </Link>
                    <Link to="/subscription" onClick={() => setUserOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <FiCreditCard size={15} /> Subscription Plan
                    </Link>
                    <Link to="/referrals" onClick={() => setUserOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <FiGift size={15} /> Refer & Earn
                    </Link>
                    <Link to="/messages" onClick={() => setUserOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <FiMessageCircle size={15} /> Messages
                      {unreadMessages > 0 && <span className="ml-auto w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">{unreadMessages}</span>}
                    </Link>
                  </div>
                  <div className="border-t border-gray-100 py-1">
                    <button onClick={() => { logout(); setUserOpen(false); navigate('/'); }}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 w-full transition-colors">
                      <FiLogOut size={15} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-1">
              <Link to="/login" className="px-3.5 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-50">
                Sign In
              </Link>
              <Link to="/register" className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-sm hover:shadow-md">
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile toggle */}
          <button onClick={() => setMobileOpen(o => !o)}
            className="lg:hidden p-2.5 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors ml-1"
            aria-label="Toggle menu">
            {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-1 animate-fade-in">
          <form onSubmit={handleSearch} className="mb-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input type="search" value={searchVal} onChange={e => setSearchVal(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border border-gray-200 bg-gray-50 outline-none focus:border-blue-400" />
            </div>
          </form>
          {NAV_LINKS.map(({ to, label }) => (
            <Link key={to} to={to}
              className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive(to) ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'}`}>
              {label}
            </Link>
          ))}
          {user && (
            <>
              <Link to="/orders" className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50"><FiPackage size={15} /> My Orders</Link>
              <Link to="/messages" className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50"><FiMessageCircle size={15} /> Messages</Link>
              <Link to="/profile" className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50"><FiUser size={15} /> Profile</Link>
              <Link to="/subscription" className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50"><FiCreditCard size={15} /> Subscription Plan</Link>
              <Link to="/referrals" className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50"><FiGift size={15} /> Refer & Earn</Link>
            </>
          )}
        </div>
      )}
      </nav>

      {/* Notification Center Side Drawer Overlay */}
      {notifOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/45 backdrop-blur-xs transition-opacity"
            onClick={() => setNotifOpen(false)}
          />
          
          {/* Drawer Panel */}
          <div 
            ref={drawerRef}
            className="relative w-full sm:w-96 bg-white h-full shadow-2xl z-50 flex flex-col animate-slide-in overflow-hidden border-l border-gray-100"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-black text-gray-900 text-base">Notification Center</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                  {unreadNotifs} Unread Notifications
                </p>
              </div>
              <button 
                onClick={() => setNotifOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <FiX size={18} />
              </button>
            </div>
            
            {/* Category Filter Tabs */}
            <div className="px-6 py-3 bg-gray-50/50 border-b border-gray-100 flex gap-1.5 overflow-x-auto scrollbar-none">
              {['All', 'Orders', 'System', 'Disputes'].map(cat => {
                const count = (cat === 'All') 
                  ? notifications.filter(n => !n.read).length 
                  : notifications.filter(n => n.category === cat && !n.read).length;
                const isSelected = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all shrink-0 ${isSelected ? 'bg-blue-600 text-white shadow-sm shadow-blue-50' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-100'}`}
                  >
                    {cat}
                    {count > 0 && (
                      <span className={`ml-1.5 px-1 py-0.5 text-[8px] font-black rounded-full leading-none ${isSelected ? 'bg-white text-blue-600' : 'bg-red-500 text-white'}`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            
            {/* Notification List Scroll Area */}
            <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
              {(() => {
                const filtered = notifications.filter(n => activeCategory === 'All' || n.category === activeCategory);
                if (filtered.length > 0) {
                  return filtered.map(n => {
                    let Icon = FiBell;
                    let iconBg = 'bg-gray-100 text-gray-500';
                    if (n.category === 'Orders') {
                      Icon = FiPackage;
                      iconBg = 'bg-blue-50 text-blue-600';
                    } else if (n.category === 'System') {
                      Icon = FiInfo;
                      iconBg = 'bg-purple-50 text-purple-600';
                    } else if (n.category === 'Disputes') {
                      Icon = FiShield;
                      iconBg = 'bg-red-50 text-red-600';
                    }
                    
                    return (
                      <div 
                        key={n.id}
                        className={`p-5 flex gap-4 hover:bg-gray-50/40 transition-all group relative border-l-2 ${!n.read ? 'border-blue-600 bg-blue-50/10' : 'border-transparent'}`}
                      >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
                          <Icon size={16} />
                        </div>
                        <div className="flex-1 min-w-0 pr-6">
                          <p className={`text-xs leading-relaxed ${!n.read ? 'text-gray-950 font-semibold' : 'text-gray-500 font-medium'}`}>
                            {n.text}
                          </p>
                          <span className="text-[10px] text-gray-400 font-semibold mt-1.5 block">{n.time}</span>
                        </div>
                        
                        {/* Hover action to delete */}
                        <button
                          onClick={() => deleteNotification(n.id)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                          title="Delete notification"
                        >
                          <FiTrash2 size={13} />
                        </button>
                      </div>
                    );
                  });
                } else {
                  return (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                      <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
                        <FiBell size={24} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">All caught up!</p>
                        <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                          No notifications found in {activeCategory}. Any updates will show up here.
                        </p>
                      </div>
                    </div>
                  );
                }
              })()}
            </div>
            
            {/* Drawer Footer Actions */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-2 text-center">
              {notifications.length > 0 && (
                <button
                  onClick={clearNotifications}
                  className="flex-1 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-100 text-[10px] font-bold uppercase tracking-wider text-gray-500 transition-colors flex items-center justify-center gap-1.5"
                >
                  <FiTrash2 size={12} /> Clear All
                </button>
              )}
              <Link
                to="/orders"
                onClick={() => setNotifOpen(false)}
                className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold uppercase tracking-wider text-center transition-all shadow-sm shadow-blue-50 block leading-normal"
              >
                Track Orders
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
