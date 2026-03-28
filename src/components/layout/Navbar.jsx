import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FiSearch, FiShoppingCart, FiBell, FiMessageCircle, FiMenu, FiX,
  FiUser, FiLogOut, FiPackage, FiChevronDown, FiGrid, FiSettings,
  FiShield, FiTrendingUp,
} from 'react-icons/fi';
import { useApp } from '../../context/AppContext';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/sellers', label: 'Sellers' },
];

export default function Navbar() {
  const { user, logout, cartCount, notifications, markNotificationsRead, unreadMessages } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const notifRef = useRef(null);
  const userRef = useRef(null);

  const unreadNotifs = notifications.filter(n => !n.read).length;

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handler = (e) => {
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

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
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
              <div ref={notifRef} className="relative">
                <button
                  onClick={() => { setNotifOpen(o => !o); if (!notifOpen) markNotificationsRead(); }}
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
                {notifOpen && (
                  <div className="absolute right-0 top-12 w-80 rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in z-50 bg-white">
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                      <p className="font-semibold text-sm text-gray-900">Notifications</p>
                      <span className="text-xs text-gray-400">{notifications.length} total</span>
                    </div>
                    {notifications.map(n => (
                      <div key={n.id} className={`px-4 py-3 flex gap-3 items-start border-b last:border-0 hover:bg-gray-50 transition-colors cursor-pointer ${!n.read ? 'bg-blue-50/40' : ''}`}>
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.read ? 'bg-blue-600' : 'bg-transparent'}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-700 leading-snug">{n.text}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                        </div>
                      </div>
                    ))}
                    <Link to="/orders" onClick={() => setNotifOpen(false)} className="block text-center py-2.5 text-xs text-blue-600 font-medium hover:bg-gray-50 transition-colors border-t border-gray-100">
                      View all activity
                    </Link>
                  </div>
                )}
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
            </>
          )}
        </div>
      )}
    </nav>
  );
}
