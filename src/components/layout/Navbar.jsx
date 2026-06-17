import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FiSearch, FiShoppingCart, FiBell, FiMenu, FiX,
  FiUser, FiLogOut, FiPackage, FiChevronDown, FiGrid, FiCreditCard,
  FiShield, FiGift, FiTrash2, FiInfo
} from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../hooks/useAuth';
import Logo from '../ui/Logo';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Shop' },
  { to: '/sellers', label: 'Sellers' },
  { to: '/about', label: 'About' },
];

export default function Navbar() {
  const {
    user, logout: appLogout, cartCount, notifications, markNotificationsRead,
    subscription, clearNotifications, deleteNotification,
    notifOpen, setNotifOpen
  } = useApp();
  const { logout: authLogout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const navigate = useNavigate();
  const location = useLocation();
  const notifRef = useRef(null);
  const userRef = useRef(null);
  const drawerRef = useRef(null);

  const unreadNotifs = notifications.filter(n => !n.read).length;

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  useEffect(() => {
    const handler = (e) => {
      if (drawerRef.current?.contains(e.target)) return;
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [setNotifOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchVal.trim())}`);
      setSearchVal('');
      setMobileOpen(false);
    }
  };

  const handleLogout = async () => {
    try { await authLogout(); } catch { /* demo mode */ }
    appLogout();
    setUserOpen(false);
    navigate('/');
  };

  const isActive = (to) => to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  const trialBanner = user && subscription?.plan === 'Free Plan' && (subscription?.trialDaysLeft ?? 0) > 0 && (
    <div className="bg-blue-600 text-white text-xs py-2 px-4 text-center">
      <span className="font-medium">{subscription.trialDaysLeft} days left on your free trial.</span>{' '}
      <Link to="/subscription" className="font-semibold underline underline-offset-2 ml-1">Upgrade now</Link>
    </div>
  );

  return (
    <header className="sticky top-0 z-40 w-full flex flex-col bg-white border-b border-gray-100 shadow-[0_1px_0_0_#f3f4f6]">
      {trialBanner}

      <nav className="w-full px-4">
        <div className="max-w-6xl mx-auto h-14 flex items-center gap-3">

          <Logo to="/" size="sm" className="shrink-0 mr-1" />

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map(({ to, label }) => (
              <Link key={to} to={to}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(to) ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}>
                {label}
              </Link>
            ))}
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xs hidden md:flex mx-3">
            <div className="relative w-full">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={15} />
              <input type="search" value={searchVal} onChange={e => setSearchVal(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 pr-4 py-2 rounded-xl text-sm border border-gray-200 bg-slate-50 outline-none focus:bg-white focus:border-blue-400 transition-all"
                aria-label="Search" />
            </div>
          </form>

          <div className="flex items-center gap-0.5 ml-auto">

            {/* Notifications */}
            {user && (
              <div className="relative" ref={notifRef}>
                <button onClick={() => { setNotifOpen(o => !o); if (!notifOpen) markNotificationsRead(); }}
                  className={`relative p-2 rounded-lg transition-colors ${notifOpen ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-50'}`}>
                  <FiBell size={18} />
                  {unreadNotifs > 0 && (
                    <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                      {unreadNotifs}
                    </span>
                  )}
                </button>
              </div>
            )}

            {/* Cart */}
            <Link to="/cart"
              className={`relative p-2 rounded-lg transition-colors ${isActive('/cart') ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-50'}`}>
              <FiShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-blue-600 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* User menu */}
            {user ? (
              <div ref={userRef} className="relative ml-1">
                <button onClick={() => setUserOpen(o => !o)}
                  className={`flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl border transition-colors ${userOpen ? 'border-blue-200 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                    {user.name[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-800 hidden sm:block max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
                  <FiChevronDown size={13} className={`text-gray-400 transition-transform shrink-0 ${userOpen ? 'rotate-180' : ''}`} />
                </button>

                {userOpen && (
                  <div className="absolute right-0 top-11 w-52 rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-fade-in z-50 bg-white py-1">
                    <div className="px-3 py-2.5 border-b border-gray-50">
                      <p className="font-semibold text-sm text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs text-gray-400 capitalize mt-0.5">{user.role}</p>
                    </div>
                    {(user.role === 'seller' || user.role === 'admin') && (
                      <Link to={user.role === 'seller' ? '/seller' : '/admin'} onClick={() => setUserOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <FiGrid size={14} /> {user.role === 'seller' ? 'Seller Dashboard' : 'Admin Panel'}
                      </Link>
                    )}
                    <Link to="/orders" onClick={() => setUserOpen(false)} className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"><FiPackage size={14} /> My Orders</Link>
                    <Link to="/profile" onClick={() => setUserOpen(false)} className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"><FiUser size={14} /> Profile</Link>
                    <Link to="/subscription" onClick={() => setUserOpen(false)} className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"><FiCreditCard size={14} /> Subscription</Link>
                    <Link to="/referrals" onClick={() => setUserOpen(false)} className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"><FiGift size={14} /> Referrals</Link>
                    <div className="border-t border-gray-50 mt-1 pt-1">
                      <button onClick={handleLogout} className="flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left">
                        <FiLogOut size={14} /> Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 ml-1">
                <Link to="/login" className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-blue-600 rounded-lg transition-colors">Sign in</Link>
                <Link to="/register" className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors">Sign up</Link>
              </div>
            )}

            {/* Mobile toggle */}
            <button onClick={() => setMobileOpen(o => !o)}
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-50 ml-0.5" aria-label="Menu">
              {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 px-4 pb-4 pt-3 space-y-1 animate-fade-in bg-white">
          <form onSubmit={handleSearch} className="mb-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input type="search" value={searchVal} onChange={e => setSearchVal(e.target.value)} placeholder="Search products..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border border-gray-200 bg-slate-50 outline-none focus:border-blue-400" />
            </div>
          </form>
          {NAV_LINKS.map(({ to, label }) => (
            <Link key={to} to={to}
              className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${isActive(to) ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'}`}>
              {label}
            </Link>
          ))}
          {user && (
            <div className="pt-2 border-t border-gray-50 space-y-1 mt-1">
              <Link to="/orders" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50"><FiPackage size={15} /> Orders</Link>
              <Link to="/profile" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50"><FiUser size={15} /> Profile</Link>
              <Link to="/subscription" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50"><FiCreditCard size={15} /> Subscription</Link>
            </div>
          )}
        </div>
      )}

      {/* Notification drawer */}
      {notifOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setNotifOpen(false)} />
          <div ref={drawerRef} className="relative w-full sm:w-80 bg-white h-full shadow-xl z-50 flex flex-col animate-slide-in">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                <p className="text-xs text-gray-400 mt-0.5">{unreadNotifs} unread</p>
              </div>
              <button onClick={() => setNotifOpen(false)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-50"><FiX size={18} /></button>
            </div>
            <div className="px-4 py-2 border-b border-gray-50 flex gap-1.5 overflow-x-auto shrink-0">
              {['All', 'Orders', 'System', 'Disputes'].map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 transition-colors ${activeCategory === cat ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto">
              {notifications.filter(n => activeCategory === 'All' || n.category === activeCategory).map(n => {
                const Icon = n.category === 'Orders' ? FiPackage : n.category === 'Disputes' ? FiShield : FiInfo;
                return (
                  <div key={n.id} className={`p-4 flex gap-3 border-b border-gray-50 group ${!n.read ? 'bg-blue-50/30' : ''}`}>
                    <Icon size={15} className="text-gray-400 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm leading-relaxed ${!n.read ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>{n.text}</p>
                      <span className="text-xs text-gray-400 mt-1 block">{n.time}</span>
                    </div>
                    <button onClick={() => deleteNotification(n.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-red-500 transition-all shrink-0">
                      <FiTrash2 size={13} />
                    </button>
                  </div>
                );
              })}
              {notifications.filter(n => activeCategory === 'All' || n.category === activeCategory).length === 0 && (
                <div className="flex flex-col items-center justify-center h-40 text-center px-6">
                  <FiBell size={22} className="text-gray-200 mb-2" />
                  <p className="text-sm text-gray-400 font-medium">All caught up</p>
                  <p className="text-xs text-gray-300 mt-1">No {activeCategory !== 'All' ? activeCategory.toLowerCase() + ' ' : ''}notifications</p>
                </div>
              )}
            </div>
            {notifications.length > 0 && (
              <div className="p-3 border-t border-gray-100 shrink-0">
                <button onClick={clearNotifications}
                  className="w-full py-2.5 rounded-xl text-xs font-medium text-gray-500 hover:bg-gray-50 border border-gray-200 transition-colors">
                  Clear all notifications
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
