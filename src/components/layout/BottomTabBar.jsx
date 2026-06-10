import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiSearch, FiPackage, FiBell, FiUser, FiGrid, FiList, FiBarChart2 } from 'react-icons/fi';
import { useApp } from '../../context/AppContext';

export default function BottomTabBar() {
  const { user, setNotifOpen, notifications } = useApp();
  const location = useLocation();

  if (!user || user.role === 'admin') return null;

  const unreadNotifs = notifications.filter(n => !n.read).length;

  const isActive = (path) => location.pathname === path;
  const isSellerTabActive = (tabName) => {
    if (location.pathname !== '/seller') return false;
    const params = new URLSearchParams(location.search);
    return (params.get('tab') || 'overview') === tabName;
  };

  const linkCls = (active) => 
    `flex flex-col items-center justify-center flex-1 py-1.5 transition-colors cursor-pointer ${
      active ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
    }`;
  const textCls = "text-[9px] font-bold mt-1 uppercase tracking-wider scale-95 select-none";

  if (user.role === 'seller') {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-lg flex justify-around items-center h-16 lg:hidden">
        <Link to="/seller?tab=overview" className={linkCls(isSellerTabActive('overview'))}>
          <FiGrid size={18} />
          <span className={textCls}>Dashboard</span>
        </Link>
        <Link to="/seller?tab=listings" className={linkCls(isSellerTabActive('listings'))}>
          <FiList size={18} />
          <span className={textCls}>Listings</span>
        </Link>
        <Link to="/seller?tab=orders" className={linkCls(isSellerTabActive('orders'))}>
          <FiPackage size={18} />
          <span className={textCls}>Orders</span>
        </Link>
        <Link to="/seller?tab=retinaview" className={linkCls(isSellerTabActive('retinaview'))}>
          <FiBarChart2 size={18} />
          <span className={textCls}>RETINAview</span>
        </Link>
        <Link to="/profile" className={linkCls(isActive('/profile'))}>
          <FiUser size={18} />
          <span className={textCls}>Profile</span>
        </Link>
      </div>
    );
  }

  // Buyer navigation tabs
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-lg flex justify-around items-center h-16 lg:hidden">
      <Link to="/" className={linkCls(isActive('/'))}>
        <FiHome size={18} />
        <span className={textCls}>Home</span>
      </Link>
      <Link to="/products" className={linkCls(isActive('/products'))}>
        <FiSearch size={18} />
        <span className={textCls}>Search</span>
      </Link>
      <Link to="/orders" className={linkCls(isActive('/orders'))}>
        <FiPackage size={18} />
        <span className={textCls}>Orders</span>
      </Link>
      <button 
        onClick={() => setNotifOpen(true)} 
        className={`relative ${linkCls(false)} bg-transparent border-0`}
      >
        <FiBell size={18} />
        {unreadNotifs > 0 && (
          <span className="absolute top-1 right-6 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
            {unreadNotifs}
          </span>
        )}
        <span className={textCls}>Alerts</span>
      </button>
      <Link to="/profile" className={linkCls(isActive('/profile'))}>
        <FiUser size={18} />
        <span className={textCls}>Profile</span>
      </Link>
    </div>
  );
}
