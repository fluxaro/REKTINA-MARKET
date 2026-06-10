import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiPlus, FiEdit2, FiTrash2, FiTrendingUp, FiPackage, FiDollarSign, 
  FiShoppingCart, FiDownload, FiGrid, FiList, FiStar, FiAlertCircle, 
  FiCheckCircle, FiClock, FiTruck, FiArrowUp, FiArrowDown, FiEye, 
  FiMessageCircle, FiSettings, FiBarChart2, FiUsers, FiLock, FiCalendar
} from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  BarChart, Bar, CartesianGrid, LineChart, Line, Legend
} from 'recharts';
import { useApp } from '../context/AppContext';
import { SELLER_ANALYTICS, PRODUCTS } from '../data/mockData';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';

const STATUS_VARIANT = { pending: 'yellow', processing: 'blue', shipped: 'blue', delivered: 'green', cancelled: 'red' };
const STATUS_ICON = {
  pending: <FiClock size={12} />, processing: <FiAlertCircle size={12} />,
  shipped: <FiTruck size={12} />, delivered: <FiCheckCircle size={12} />,
};

const MOCK_MONTHS = [
  'June 2026', 'May 2026', 'April 2026', 'March 2026', 'February 2026', 
  'January 2026', 'December 2025', 'November 2025', 'October 2025', 
  'September 2025', 'August 2025', 'July 2025'
];

export default function SellerDashboard() {
  const { addToast, subscription, sellerMetrics, requestPayout } = useApp();
  const [loading, setLoading] = useState(true);
  const inputCls = 'w-full px-4 py-2.5 rounded-xl text-sm border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:bg-white transition-all';
  const location = useLocation();

  // Dashboard view selection: 'overview' | 'listings' | 'orders' | 'earnings' | 'retinaview' | 'settings'
  const [tab, setTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam) {
      setTab(tabParam);
    }
  }, [location.search]);

  // Sub-tabs for Home Screen / Listings & Orders
  const [listingsTab, setListingsTab] = useState('active'); // 'active' | 'pending'
  const [analyticsTab, setAnalyticsTab] = useState('overview'); // RETINAview tabs: overview | revenue | products | customers | performance

  // Listings state
  const [products, setProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form states
  const [form, setForm] = useState({ name: '', price: '', stock: '', category: 'Electronics', description: '', deliveryTime: '1-2 Days' });

  // Mark Delivered states
  const [deliveryOrderId, setDeliveryOrderId] = useState(null);

  // Payout request modal states
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [payoutForm, setPayoutForm] = useState({ bankName: 'Access Bank', accountNumber: '', accountName: '', amount: '' });

  // Limit upgrade modal state
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState('');

  // Historical date picker state
  const [selectedMonth, setSelectedMonth] = useState('June 2026');

  // Load products
  useEffect(() => {
    setTimeout(() => { 
      setProducts(PRODUCTS.filter(p => p.sellerId === 1).map(p => ({
        ...p,
        views: Math.floor(Math.random() * 500) + 100,
        ordersCount: Math.floor(Math.random() * 40) + 5,
      }))); 
      setLoading(false); 
    }, 500);
  }, []);

  const openCreate = () => {
    setEditProduct(null);
    setForm({ name: '', price: '', stock: '', category: 'Electronics', description: '', deliveryTime: '1-2 Days' });
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setEditProduct(p);
    setForm({ name: p.name, price: p.price, stock: p.stock, category: p.category, description: p.description, deliveryTime: p.deliveryTime || '1-2 Days' });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (editProduct) {
      setProducts(prev => prev.map(p => p.id === editProduct.id
        ? { ...p, ...form, price: Number(form.price), stock: Number(form.stock) } : p));
      addToast('Listing updated successfully');
    } else {
      setProducts(prev => [...prev, {
        id: Date.now(), 
        ...form, 
        price: Number(form.price), 
        stock: Number(form.stock),
        rating: 0, 
        reviewCount: 0,
        views: 0,
        ordersCount: 0,
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80'],
        sellerId: 1, 
        sellerName: 'Chukwuemeka Gadgets', 
        featured: false,
        variants: { colors: [], sizes: [] }, 
        tags: [],
      }]);
      addToast('New listing created successfully');
    }
    setModalOpen(false);
  };

  const handleDeleteListing = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setDeleteConfirmId(null);
    addToast('Product listing deleted', 'info');
  };

  // Safe checks for Premium Features
  const handleTabChange = (targetTab) => {
    if (targetTab === 'retinaview' && subscription?.plan === 'Free Plan') {
      setUpgradeReason('RETINAview Analytics requires a Premium Subscription plan.');
      setShowUpgradePrompt(true);
    } else {
      setTab(targetTab);
    }
  };

  const handleMarkAsDelivered = () => {
    addToast(`Order ${deliveryOrderId} marked as delivered. 48h Escrow auto-release timer started.`, 'success');
    setDeliveryOrderId(null);
  };

  const submitPayout = () => {
    const amount = Number(payoutForm.amount);
    if (!amount || amount <= 0) {
      addToast('Please enter a valid payout amount', 'error');
      return;
    }
    if (amount > sellerMetrics.balance) {
      addToast('Insufficient balance for this withdrawal amount', 'error');
      return;
    }
    requestPayout(payoutForm, amount);
    setPayoutModalOpen(false);
    setPayoutForm({ bankName: 'Access Bank', accountNumber: '', accountName: '', amount: '' });
  };

  const isFree = subscription?.plan === 'Free Plan';
  const fmt = (n) => '₦' + Number(n).toLocaleString('en-NG');

  const navItems = [
    { id: 'overview',   icon: FiGrid,        label: 'Dashboard' },
    { id: 'listings',   icon: FiPackage,     label: 'Listings Manager' },
    { id: 'orders',     icon: FiShoppingCart,label: 'Escrow Orders' },
    { id: 'earnings',   icon: FiDollarSign,  label: 'Earnings & Payout' },
    { id: 'retinaview', icon: FiBarChart2,   label: 'RETINAview Analytics', premium: true },
    { id: 'settings',   icon: FiSettings,    label: 'Profile Settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      
      {/* ── Sidebar Navigation ── */}
      <aside className={`${sidebarCollapsed ? 'w-16' : 'w-60'} shrink-0 bg-slate-950 flex flex-col transition-all duration-300 sticky top-0 h-screen z-20`}>
        <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/10">
            <FiTrendingUp size={16} className="text-white" />
          </div>
          {!sidebarCollapsed && (
            <div>
              <p className="text-white font-black text-xs tracking-wider leading-tight">REKTINA</p>
              <p className="text-blue-400 font-bold text-[10px] tracking-wider leading-tight">SELLER PORTAL</p>
            </div>
          )}
        </div>

        <nav className="flex-1 px-2.5 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => handleTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-bold transition-all ${tab === item.id ? 'bg-blue-600 text-white shadow-md shadow-blue-500/15' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}>
              <item.icon size={16} className="shrink-0" />
              {!sidebarCollapsed && (
                <div className="flex items-center justify-between w-full">
                  <span>{item.label}</span>
                  {item.premium && isFree && <FiLock className="text-amber-500 shrink-0" size={12} />}
                </div>
              )}
            </button>
          ))}
        </nav>

        <div className="px-3 pb-4">
          <button onClick={() => setSidebarCollapsed(c => !c)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-slate-500 hover:text-white hover:bg-slate-900 transition-colors text-[10px] uppercase font-bold tracking-wider">
            {sidebarCollapsed ? '→' : '← Collapse Panel'}
          </button>
        </div>
      </aside>

      {/* ── Main Container ── */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-gray-900 capitalize">{tab === 'overview' ? 'Seller Hub' : tab.replace('retinaview', 'RETINAview')}</h1>
              {isFree && (
                <span className="bg-amber-50 text-amber-600 px-2 py-0.5 rounded-md text-[9px] font-bold border border-amber-100 uppercase tracking-wider">Free Plan Tier</span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-0.5">Shop Admin: Chukwuemeka Gadgets</p>
          </div>
          
          <div className="flex items-center gap-2.5">
            {tab === 'retinaview' && (
              <div className="relative">
                <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                <select 
                  value={selectedMonth} 
                  onChange={e => setSelectedMonth(e.target.value)}
                  className="pl-8 pr-8 py-2 rounded-xl border border-gray-200 text-xs font-bold bg-white text-gray-700 outline-none focus:border-blue-500 cursor-pointer"
                >
                  {MOCK_MONTHS.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
            )}
            
            <button onClick={() => addToast('Exporting data as CSV...')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-slate-50 transition-colors">
              <FiDownload size={14} /> Export Report
            </button>
            
            {tab === 'listings' && (
              <button onClick={openCreate}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-50">
                <FiPlus size={14} /> New Listing
              </button>
            )}
          </div>
        </header>

        {/* Dynamic Warning Banners for Free Users */}
        {isFree && (
          <div className="bg-amber-50 border-b border-amber-100 px-6 py-2.5 flex items-center justify-between gap-4">
            <p className="text-[11px] text-amber-800 font-semibold leading-snug flex items-center gap-2">
              <FiAlertCircle className="text-amber-500 shrink-0" size={14} />
              You are using a Free Plan. Unlock +1.05% escrow savings, RETINAview visitor analytics, and VIP listings.
            </p>
            <button 
              onClick={() => { setUpgradeReason('Upgrade to Premium to activate custom business listings.'); setShowUpgradePrompt(true); }}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-[10px] uppercase tracking-wider shrink-0 transition-colors"
            >
              Upgrade Now
            </button>
          </div>
        )}

        {/* Dashboard Main Workspace */}
        <main className="flex-1 p-6 overflow-y-auto">

          {/* ── TABS 1: HUB OVERVIEW ── */}
          {tab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              {/* Core KPIs */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Escrow Balance', value: fmt(sellerMetrics.balance), change: '+32.4%', up: true, icon: FiDollarSign, light: 'bg-emerald-50 text-emerald-600' },
                  { label: 'Weekly Orders', value: '18 Orders', change: '+12%', up: true, icon: FiShoppingCart, light: 'bg-blue-50 text-blue-600' },
                  { label: 'Conversion Rate', value: '4.8%', change: '+0.5%', up: true, icon: FiTrendingUp, light: 'bg-purple-50 text-purple-600' },
                  { label: 'Account Strikes', value: `${sellerMetrics.strikes}/3`, change: 'Limit: 3', up: false, icon: FiAlertCircle, light: 'bg-red-50 text-red-500' }
                ].map((kpi, idx) => (
                  <div key={idx} className="bg-white rounded-3xl border border-gray-100 p-5 flex flex-col justify-between h-32 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-xl ${kpi.light} flex items-center justify-center`}>
                        <kpi.icon size={18} />
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${kpi.up ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                        {kpi.change}
                      </span>
                    </div>
                    <div>
                      <p className="text-xl font-black text-gray-900">{kpi.value}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-wider">{kpi.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pending Escrows & Performance Section */}
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Pending Orders Queue */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between">
                  <div className="px-5 py-4 border-b border-gray-50 flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider">Awaiting Dispatch</h3>
                    <button onClick={() => setTab('orders')} className="text-xs text-blue-600 font-bold hover:underline">Full Queue</button>
                  </div>
                  <div className="p-4 space-y-3">
                    {[
                      { id: 'RKT-1031', buyer: 'Emeka Obiora', item: 'Ankara Slim Shirt', amount: 8500, status: 'processing' },
                      { id: 'RKT-1025', buyer: 'Funmilayo Bello', item: 'Smart Watch X', amount: 85000, status: 'pending' },
                    ].map(ord => (
                      <div key={ord.id} className="flex items-center justify-between p-3 border border-slate-50 rounded-2xl hover:bg-slate-50/50 transition-colors">
                        <div className="min-w-0">
                          <p className="font-mono text-xs font-bold text-blue-600">{ord.id}</p>
                          <p className="text-xs text-gray-900 font-semibold mt-0.5">{ord.item}</p>
                          <p className="text-[10px] text-gray-400">Buyer: {ord.buyer}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-gray-900 text-xs">₦{ord.amount.toLocaleString('en-NG')}</p>
                          <button 
                            onClick={() => setDeliveryOrderId(ord.id)}
                            className="mt-1 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] uppercase tracking-wider"
                          >
                            Mark Delivered
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI growth engine recommendations card */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 flex flex-col justify-between">
                  <div className="border-b border-gray-50 pb-3">
                    <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                      <FiStar className="text-yellow-500" />
                      AI Growth Recommendations
                    </h3>
                  </div>
                  <div className="space-y-3 py-3">
                    {[
                      'Upgrade to premium to reduce UVEA escrow fees by 1.05%.',
                      'Your gaming keyboards conversion is high. Consider increasing stock count.',
                      'Filing delivery notices under 24 hours will improve your average rating.',
                    ].map((tip, index) => (
                      <div key={index} className="flex gap-2.5 items-start">
                        <div className="w-5 h-5 rounded-full bg-yellow-50 flex items-center justify-center shrink-0 text-yellow-600 text-xs font-bold mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-[11px] text-gray-600 leading-relaxed">{tip}</p>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => handleTabChange('retinaview')}
                    className="w-full py-2.5 rounded-xl border border-blue-100 hover:bg-blue-50 text-blue-600 font-bold text-xs text-center transition-colors"
                  >
                    Open Full Analytics
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── TABS 2: PRODUCT LISTINGS MANAGER ── */}
          {tab === 'listings' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex border-b border-gray-100">
                <button onClick={() => setListingsTab('active')} className={`pb-3 px-5 text-xs font-bold border-b-2 transition-colors ${listingsTab === 'active' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                  Active Inventory ({products.length})
                </button>
              </div>

              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 border-b border-gray-100">
                      <tr>
                        {['Listing Item', 'Price', 'Stock Level', 'Performance (Views/Sales)', 'Delivery Time', 'Actions'].map(h => (
                          <th key={h} className="py-3.5 px-5 text-slate-400 uppercase font-black tracking-wider text-[10px]">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(p => (
                        <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-3">
                              <img src={p.images[0]} alt={p.name} className="w-12 h-12 rounded-xl object-cover border border-gray-100 shadow-inner" />
                              <div>
                                <p className="font-bold text-gray-900 text-xs line-clamp-1 max-w-[180px]">{p.name}</p>
                                <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{p.category}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-5 font-bold text-gray-900">₦{p.price.toLocaleString('en-NG')}</td>
                          <td className="py-4 px-5">
                            <span className={`px-2.5 py-1 rounded-full font-bold text-[9px] uppercase tracking-wider ${p.stock === 0 ? 'bg-red-50 text-red-500' : p.stock < 10 ? 'bg-orange-50 text-orange-500' : 'bg-green-50 text-green-600'}`}>
                              {p.stock === 0 ? 'Out of stock' : `${p.stock} units`}
                            </span>
                          </td>
                          <td className="py-4 px-5 font-semibold text-gray-500">
                            👁️ {p.views} views · 🛍️ {p.ordersCount} sales
                          </td>
                          <td className="py-4 px-5 font-semibold text-slate-500">{p.deliveryTime || '1-2 Days'}</td>
                          <td className="py-4 px-5">
                            <div className="flex gap-2">
                              <button onClick={() => openEdit(p)} className="p-2 rounded-xl bg-slate-50 text-gray-400 hover:text-blue-600 transition-colors"><FiEdit2 size={13} /></button>
                              <button onClick={() => setDeleteConfirmId(p.id)} className="p-2 rounded-xl bg-slate-50 text-gray-400 hover:text-red-500 transition-colors"><FiTrash2 size={13} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── TABS 3: ESCROW ORDERS QUEUE ── */}
          {tab === 'orders' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-50 bg-slate-50/50">
                  <h3 className="text-xs font-black text-gray-950 uppercase tracking-wider">Secure Escrow Orders</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 border-b border-gray-100">
                      <tr>
                        {['Order Code', 'Buyer & Address', 'Total Price', 'Status', 'Escrow State', 'Update Actions'].map(h => (
                          <th key={h} className="py-3.5 px-5 text-slate-400 uppercase font-black tracking-wider text-[10px]">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { id: 'RKT-1042', customer: 'Chidi Okonkwo', address: 'Victoria Island, Lagos', date: '2026-03-20', total: 73000, status: 'shipped', escrow: 'held' },
                        { id: 'RKT-1038', customer: 'Ngozi Eze', address: 'Garki, Abuja', date: '2026-03-18', total: 95000, status: 'delivered', escrow: 'held' },
                        { id: 'RKT-1031', customer: 'Emeka Obiora', address: 'Wuse, Abuja', date: '2026-03-15', total: 8500, status: 'processing', escrow: 'held' },
                        { id: 'RKT-1025', customer: 'Funmilayo Bello', address: 'Lekki Phase 1, Lagos', date: '2026-03-12', total: 85000, status: 'pending', escrow: 'pending' },
                      ].map(o => (
                        <tr key={o.id} className="border-b border-gray-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-5 font-mono font-black text-blue-600">{o.id}</td>
                          <td className="py-4 px-5">
                            <p className="font-bold text-gray-950">{o.customer}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{o.address}</p>
                          </td>
                          <td className="py-4 px-5 font-black text-gray-900">₦{o.total.toLocaleString('en-NG')}</td>
                          <td className="py-4 px-5">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold border uppercase tracking-wider ${
                              o.status === 'delivered' ? 'bg-emerald-50 text-emerald-500 border-emerald-100' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {STATUS_ICON[o.status] || <FiClock size={12} />} {o.status}
                            </span>
                          </td>
                          <td className="py-4 px-5">
                            <span className={`px-2 py-0.5 rounded font-bold text-[9px] uppercase tracking-wider ${
                              o.escrow === 'held' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'
                            }`}>
                              UVEA {o.escrow}
                            </span>
                          </td>
                          <td className="py-4 px-5">
                            {o.status !== 'delivered' && o.status !== 'completed' && (
                              <button 
                                onClick={() => setDeliveryOrderId(o.id)}
                                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] uppercase tracking-wider shadow-sm"
                              >
                                Mark Delivered
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── TABS 4: EARNINGS & PAYOUT ── */}
          {tab === 'earnings' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { label: 'Available Balance', value: fmt(sellerMetrics.balance), action: () => setPayoutModalOpen(true), btnLabel: 'Withdraw to Bank' },
                  { label: 'Pending UVEA Escrow', value: fmt(sellerMetrics.pendingPayouts), detail: 'Funds held in customer escrow locks' },
                  { label: 'Escrow Fee Exemption', value: isFree ? 'None (+1.05%)' : '0.00% Premium', detail: isFree ? 'Standard fees apply' : 'VIP member benefits active' },
                ].map((card, idx) => (
                  <div key={idx} className="bg-white rounded-3xl border border-gray-100 p-6 flex flex-col justify-between h-40 shadow-sm">
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{card.label}</p>
                      <p className="text-2xl font-black text-gray-900 mt-2">{card.value}</p>
                    </div>
                    {card.action ? (
                      <button onClick={card.action} className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm">
                        {card.btnLabel}
                      </button>
                    ) : (
                      <p className="text-[10px] text-gray-400">{card.detail}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Payout History logs */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-50 bg-slate-50/50">
                  <h3 className="text-xs font-black text-gray-950 uppercase tracking-wider">Payout History Logs</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 border-b border-gray-100">
                      <tr>
                        {['Date', 'Reference ID', 'Amount Received', 'Status'].map(h => (
                          <th key={h} className="py-3.5 px-5 text-slate-400 uppercase font-black tracking-wider text-[10px]">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sellerMetrics.payoutHistory.map((h, i) => (
                        <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-5 text-gray-500">{h.date}</td>
                          <td className="py-4 px-5 font-mono text-gray-700">{h.reference}</td>
                          <td className="py-4 px-5 font-bold text-gray-900">₦{h.amount.toLocaleString('en-NG')}</td>
                          <td className="py-4 px-5">
                            <span className={`px-2 py-0.5 rounded font-bold text-[9px] uppercase tracking-wider ${
                              h.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {h.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── TABS 5: RETINAview ANALYTICS ── */}
          {tab === 'retinaview' && (
            <div className="space-y-6 animate-fade-in">
              {/* RETINAview sub tabs navigation */}
              <div className="flex border-b border-gray-100 overflow-x-auto pb-0.5">
                {[
                  { id: 'overview', label: 'Metric Overview' },
                  { id: 'revenue', label: 'Revenue Trends' },
                  { id: 'products', label: 'Conversion Rates' },
                  { id: 'customers', label: 'Retention & Hours' },
                  { id: 'performance', label: 'UVEA Release Rates' },
                ].map(sub => (
                  <button 
                    key={sub.id} 
                    onClick={() => setAnalyticsTab(sub.id)}
                    className={`pb-3 px-5 text-xs font-bold shrink-0 border-b-2 transition-colors ${analyticsTab === sub.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>

              {/* Subtab Overview */}
              {analyticsTab === 'overview' && (
                <div className="space-y-6">
                  {/* Overview summary cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    {[
                      { label: 'Total Orders', value: '184' },
                      { label: 'Gross Margin', value: '₦4.8M' },
                      { label: 'Avg Buyer Review', value: '4.8★' },
                      { label: 'Dispute Rate', value: '0.54%' },
                      { label: 'Referral Traffic', value: '1,240 clicks' },
                    ].map((card, idx) => (
                      <div key={idx} className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
                        <p className="text-lg font-black text-gray-950">{card.value}</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-1">{card.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Core Chart widgets */}
                  <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">
                    <div className="mb-4">
                      <h4 className="text-xs font-black text-gray-950 uppercase tracking-wider">Overview Growth Metrics</h4>
                    </div>
                    <ResponsiveContainer width="100%" height={240}>
                      <AreaChart data={SELLER_ANALYTICS.revenue}>
                        <defs>
                          <linearGradient id="premiumChart" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="value" stroke="#2563EB" fillOpacity={1} fill="url(#premiumChart)" strokeWidth={2.5} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Subtab Revenue */}
              {analyticsTab === 'revenue' && (
                <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm space-y-4">
                  <div>
                    <h4 className="text-xs font-black text-gray-950 uppercase tracking-wider">Revenue & Net After Fees (Monthly)</h4>
                  </div>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={SELLER_ANALYTICS.revenue}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Gross Revenue" fill="#2563EB" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Subtab Products (Conversion View) */}
              {analyticsTab === 'products' && (
                <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm space-y-4">
                  <div>
                    <h4 className="text-xs font-black text-gray-950 uppercase tracking-wider">Views vs Purchase Conversions</h4>
                  </div>
                  <div className="space-y-4">
                    {products.map(p => {
                      const conversion = ((p.ordersCount / p.views) * 100).toFixed(1);
                      return (
                        <div key={p.id} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-gray-800">{p.name}</span>
                            <span className="text-blue-600 font-bold">{conversion}% conversion</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${Math.min(Number(conversion) * 3, 100)}%` }} />
                          </div>
                          <p className="text-[9px] text-gray-400">{p.views} views · {p.ordersCount} completed purchases</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Subtab Customers */}
              {analyticsTab === 'customers' && (
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Peak order hours */}
                  <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm space-y-4">
                    <h4 className="text-xs font-black text-gray-950 uppercase tracking-wider">Peak Order Hours (Daily)</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={[
                        { hour: '8 AM', orders: 12 }, { hour: '12 PM', orders: 48 }, { hour: '4 PM', orders: 32 },
                        { hour: '8 PM', orders: 84 }, { hour: '11 PM', orders: 96 }, { hour: '3 AM', orders: 8 }
                      ]}>
                        <XAxis dataKey="hour" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="orders" stroke="#7C3AED" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Return rate */}
                  <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-black text-gray-950 uppercase tracking-wider mb-4">Customer Segment Retention</h4>
                      <p className="text-2xl font-black text-gray-950">64.5%</p>
                      <p className="text-xs text-gray-400 mt-1">Repeat buyer retention rate (last 90 days)</p>
                    </div>
                    <div className="p-4 bg-purple-50/50 rounded-2xl text-[10px] text-purple-700 leading-relaxed border border-purple-100">
                      🌟 Retained customers have generated ₦840,000 in gross escrow payments over this period.
                    </div>
                  </div>
                </div>
              )}

              {/* Subtab Performance */}
              {analyticsTab === 'performance' && (
                <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm space-y-4">
                  <h4 className="text-xs font-black text-gray-950 uppercase tracking-wider">UVEA Auto-Release Timeline Compliance</h4>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {[
                      { label: 'On-Time Dispatch Rate', val: '98.2%' },
                      { label: 'Auto-Release Triggers', val: '2 cases' },
                      { label: 'Escrow Frozen Disputes', val: '0 cases' }
                    ].map((m, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 border border-gray-100 rounded-2xl text-center">
                        <p className="text-lg font-black text-gray-950">{m.val}</p>
                        <p className="text-[10px] text-gray-400 font-semibold mt-1">{m.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── TABS 6: SETTINGS ── */}
          {tab === 'settings' && (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 max-w-2xl space-y-5 animate-fade-in">
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider border-b border-gray-50 pb-3">Edit Public Profile Details</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: 'Store Bio / Tagline', key: 'bio', value: 'Premium gadgets verified vendor in Lagos' },
                  { label: 'Physical Dispatch Office', key: 'address', value: 'No 4 Hostels, Campus Mall, Lagos' },
                ].map(field => (
                  <div key={field.key} className="col-span-2">
                    <label className="text-[10px] text-gray-400 font-bold block mb-1 uppercase">{field.label}</label>
                    <input type="text" defaultValue={field.value} className={inputCls} />
                  </div>
                ))}
              </div>
              <button onClick={() => addToast('Seller profile saved successfully')} className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-sm">
                Save Public Profile
              </button>
            </div>
          )}

        </main>
      </div>

      {/* Listing Create/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editProduct ? 'Modify Listing Details' : 'Create Custom Listing'}>
        <div className="space-y-4">
          <div>
            <label className="text-[10px] text-gray-400 font-bold block mb-1 uppercase">Item Name</label>
            <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Headphones, Shirt, etc." className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-gray-400 font-bold block mb-1 uppercase">Price (₦)</label>
              <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="₦..." className={inputCls} />
            </div>
            <div>
              <label className="text-[10px] text-gray-400 font-bold block mb-1 uppercase">Stock Count</label>
              <input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} placeholder="Stock level" className={inputCls} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-gray-400 font-bold block mb-1 uppercase">Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl text-sm border border-gray-200 bg-gray-50 outline-none focus:border-blue-500">
                <option>Electronics</option>
                <option>Fashion</option>
                <option>Home & Garden</option>
                <option>Sports</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-gray-400 font-bold block mb-1 uppercase">Delivery Frame</label>
              <select value={form.deliveryTime} onChange={e => setForm(f => ({ ...f, deliveryTime: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl text-sm border border-gray-200 bg-gray-50 outline-none focus:border-blue-500">
                <option>Same Day</option>
                <option>1-2 Days</option>
                <option>3-5 Days</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-[10px] text-gray-400 font-bold block mb-1 uppercase">Product Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} placeholder="Describe product details..." className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none resize-none focus:bg-white focus:border-blue-500" />
          </div>
          <div className="flex gap-2.5 pt-2">
            <button onClick={() => setModalOpen(false)} className="flex-1 py-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-500 hover:bg-gray-50 transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={!form.name || !form.price} className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs disabled:opacity-50 transition-all shadow-md shadow-blue-50">
              {editProduct ? 'Update Listing' : 'Publish Listing'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl p-6 max-w-sm w-full text-center animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-3">
              <FiAlertCircle size={24} />
            </div>
            <h4 className="font-bold text-gray-900 text-sm">Delete Product Listing?</h4>
            <p className="text-gray-400 text-xs leading-relaxed mt-1 mb-5">
              This action cannot be undone. Any active buyer escrows targeting this specific item listing will remain unaffected.
            </p>
            <div className="flex gap-2">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={() => handleDeleteListing(deleteConfirmId)} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs transition-colors shadow-md shadow-red-50">
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mark Delivered Modal */}
      {deliveryOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl p-6 max-w-sm w-full text-center animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
              <FiTruck size={24} />
            </div>
            <h4 className="font-bold text-gray-900 text-sm">Mark Order Delivered?</h4>
            <p className="text-gray-400 text-xs leading-relaxed mt-1 mb-5">
              This triggers the 48-hour buyer verification countdown. If the buyer doesn't dispute or confirm within 48h, escrow release completes automatically.
            </p>
            <div className="flex gap-2">
              <button onClick={() => setDeliveryOrderId(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleMarkAsDelivered} className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-md shadow-blue-50">
                Yes, Delivered
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payout Bank Details Modal */}
      {payoutModalOpen && (
        <Modal open={payoutModalOpen} onClose={() => setPayoutModalOpen(false)} title="Request Payout Withdrawal">
          <div className="space-y-4">
            <div>
              <label className="text-[10px] text-gray-400 font-bold block mb-1 uppercase">Select Nigerian Bank</label>
              <select 
                value={payoutForm.bankName} 
                onChange={e => setPayoutForm(f => ({ ...f, bankName: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl text-sm border border-gray-200 bg-gray-50 outline-none focus:border-blue-500"
              >
                <option>Access Bank</option>
                <option>GTBank</option>
                <option>Zenith Bank</option>
                <option>OPay / PalmPay</option>
                <option>United Bank for Africa (UBA)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-gray-400 font-bold block mb-1 uppercase">10-Digit NUBAN Account Number</label>
              <input 
                type="text" 
                maxLength={10}
                value={payoutForm.accountNumber} 
                onChange={e => setPayoutForm(f => ({ ...f, accountNumber: e.target.value }))} 
                placeholder="0012345678" 
                className={inputCls} 
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-400 font-bold block mb-1 uppercase">Account Name</label>
              <input 
                type="text" 
                value={payoutForm.accountName} 
                onChange={e => setPayoutForm(f => ({ ...f, accountName: e.target.value }))} 
                placeholder="Receiver Account Name" 
                className={inputCls} 
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-400 font-bold block mb-1 uppercase">Withdrawal Amount (₦)</label>
              <input 
                type="number" 
                value={payoutForm.amount} 
                onChange={e => setPayoutForm(f => ({ ...f, amount: e.target.value }))} 
                placeholder={`Max Available: ₦${sellerMetrics.balance.toLocaleString('en-NG')}`} 
                className={inputCls} 
              />
            </div>
            <div className="flex gap-2.5 pt-2">
              <button onClick={() => setPayoutModalOpen(false)} className="flex-1 py-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-500 hover:bg-gray-50 transition-colors">Cancel</button>
              <button 
                onClick={submitPayout} 
                disabled={!payoutForm.accountNumber || !payoutForm.accountName || !payoutForm.amount} 
                className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs disabled:opacity-50 transition-all shadow-md shadow-blue-50"
              >
                Confirm Payout
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Upgrade Limit Prompt Modal (Paywall modal context) */}
      {showUpgradePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl p-6 max-w-sm w-full text-center animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-3">
              <FiLock size={22} />
            </div>
            <h4 className="font-bold text-gray-900 text-sm">Premium Feature Locked</h4>
            <p className="text-gray-400 text-xs leading-relaxed mt-1 mb-5">
              {upgradeReason} Upgrade your subscription tier to access full metrics and RETINAview analytics reports.
            </p>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => { setShowUpgradePrompt(false); setTab('overview'); navigate('/profile'); }}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-50"
              >
                Go to Plans Settings
              </button>
              <button onClick={() => setShowUpgradePrompt(false)} className="w-full py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-500 hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
