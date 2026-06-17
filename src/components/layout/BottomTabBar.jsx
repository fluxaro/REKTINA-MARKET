import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiSearch, FiPackage, FiBell, FiUser, FiGrid, FiList, FiBarChart2, FiDollarSign } from 'react-icons/fi';
import { useApp } from '../../context/AppContext';

export default function BottomTabBar() {
  const { user, setNotifOpen, notifications } = useApp();
  const location = useLocation();

  if (!user || user.role === 'admin') return null;

  const unreadNotifs = notifications.filter(n => !n.read).length;

  const isActive = (path) => location.pathname === path;
  const isSellerTab = (tabName) => {
    if (location.pathname !== '/seller') return false;
    return (new URLSearchParams(location.search).get('tab') || 'overview') === tabName;
  };

  const item = (active) =>
    `flex flex-col items-center justify-center flex-1 gap-1 py-1.5 transition-colors ${
      active ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
    }`;
  const label = 'text-[10px] font-medium';

  if (user.role === 'seller') {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-t border-gray-100 grid grid-cols-5 h-14 lg:hidden">
        <Link to="/seller?tab=overview" className={item(isSellerTab('overview'))}>
          <FiGrid size={18} /><span className={label}>Overview</span>
        </Link>
        <Link to="/seller?tab=listings" className={item(isSellerTab('listings'))}>
          <FiList size={18} /><span className={label}>Listings</span>
        </Link>
        <Link to="/seller?tab=orders" className={item(isSellerTab('orders'))}>
          <FiPackage size={18} /><span className={label}>Orders</span>
        </Link>
        <Link to="/seller?tab=earnings" className={item(isSellerTab('earnings'))}>
          <FiDollarSign size={18} /><span className={label}>Earnings</span>
        </Link>
        <Link to="/profile" className={item(isActive('/profile'))}>
          <FiUser size={18} /><span className={label}>Profile</span>
        </Link>
      </nav>
    );
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-t border-gray-100 grid grid-cols-5 h-14 lg:hidden">
      <Link to="/" className={item(isActive('/'))}>
        <FiHome size={18} /><span className={label}>Home</span>
      </Link>
      <Link to="/products" className={item(isActive('/products'))}>
        <FiSearch size={18} /><span className={label}>Shop</span>
      </Link>
      <Link to="/orders" className={item(isActive('/orders'))}>
        <FiPackage size={18} /><span className={label}>Orders</span>
      </Link>
      <button
        onClick={() => setNotifOpen(true)}
        className={`relative ${item(false)} bg-transparent border-0`}
      >
        <FiBell size={18} />
        {unreadNotifs > 0 && (
          <span className="absolute top-1 right-[calc(50%-22px)] w-3.5 h-3.5 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
            {unreadNotifs}
          </span>
        )}
        <span className={label}>Alerts</span>
      </button>
      <Link to="/profile" className={item(isActive('/profile'))}>
        <FiUser size={18} /><span className={label}>Profile</span>
      </Link>
    </nav>
  );
}
