import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiPlus, FiEdit2, FiTrash2, FiTrendingUp, FiPackage, FiDollarSign,
  FiShoppingCart, FiDownload, FiGrid, FiList, FiStar, FiAlertCircle,
  FiCheckCircle, FiClock, FiTruck, FiArrowUp, FiArrowDown, FiEye,
  FiMessageCircle, FiSettings, FiBarChart2, FiUsers,
} from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, CartesianGrid,
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

const MOCK_ORDERS = [
  { id: 'RKT-1042', customer: 'Chidi Okonkwo',   date: '2026-03-20', items: 2, total: 73000,  status: 'shipped' },
  { id: 'RKT-1038', customer: 'Ngozi Eze',        date: '2026-03-18', items: 1, total: 95000,  status: 'delivered' },
  { id: 'RKT-1031', customer: 'Emeka Obiora',     date: '2026-03-15', items: 3, total: 42500,  status: 'processing' },
  { id: 'RKT-1025', customer: 'Funmilayo Bello',  date: '2026-03-12', items: 1, total: 55000,  status: 'pending' },
  { id: 'RKT-1019', customer: 'Tunde Adeyemi',    date: '2026-03-10', items: 2, total: 130000, status: 'delivered' },
  { id: 'RKT-1014', customer: 'Amaka Igwe',       date: '2026-03-08', items: 1, total: 45000,  status: 'shipped' },
];

const RECENT_ACTIVITY = [
  { icon: FiShoppingCart, text: 'New order from Chidi Okonkwo', sub: '₦73,000 · 2 items', time: '5 min ago', color: 'text-blue-600 bg-blue-50' },
  { icon: FiStar,         text: 'New 5-star review on Headphones', sub: '"Excellent product!"', time: '1 hr ago', color: 'text-yellow-600 bg-yellow-50' },
  { icon: FiPackage,      text: 'Low stock alert: Smart Watch', sub: 'Only 3 units left', time: '3 hrs ago', color: 'text-orange-600 bg-orange-50' },
  { icon: FiCheckCircle,  text: 'Order RKT-1038 delivered', sub: 'Ngozi Eze confirmed receipt', time: '5 hrs ago', color: 'text-green-600 bg-green-50' },
  { icon: FiMessageCircle,text: 'New message from Emeka Obiora', sub: 'Asking about warranty', time: 'Yesterday', color: 'text-purple-600 bg-purple-50' },
];

const NAV_ITEMS = [
  { id: 'overview',  icon: FiGrid,        label: 'Overview' },
  { id: 'products',  icon: FiPackage,     label: 'Products' },
  { id: 'orders',    icon: FiShoppingCart,label: 'Orders' },
  { id: 'analytics', icon: FiBarChart2,   label: 'Analytics' },
  { id: 'messages',  icon: FiMessageCircle,label: 'Messages' },
  { id: 'settings',  icon: FiSettings,    label: 'Settings' },
];

const fmt = (n) => '₦' + Number(n).toLocaleString('en-NG');

export default function SellerDashboard() {
  const { addToast } = useApp();
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState({ name: '', price: '', stock: '', category: '', description: '' });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    setTimeout(() => { setProducts(PRODUCTS.filter(p => p.sellerId === 1)); setLoading(false); }, 700);
  }, []);

  const openCreate = () => {
    setEditProduct(null);
    setForm({ name: '', price: '', stock: '', category: '', description: '' });
    setModalOpen(true);
  };
  const openEdit = (p) => {
    setEditProduct(p);
    setForm({ name: p.name, price: p.price, stock: p.stock, category: p.category, description: p.description });
    setModalOpen(true);
  };
  const handleSave = () => {
    if (editProduct) {
      setProducts(prev => prev.map(p => p.id === editProduct.id
        ? { ...p, ...form, price: Number(form.price), stock: Number(form.stock) } : p));
      addToast('Product updated successfully');
    } else {
      setProducts(prev => [...prev, {
        id: Date.now(), ...form, price: Number(form.price), stock: Number(form.stock),
        rating: 0, reviewCount: 0,
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80'],
        sellerId: 1, sellerName: 'Chukwuemeka Gadgets', featured: false,
        variants: { colors: [], sizes: [] }, tags: [],
      }]);
      addToast('Product created successfully');
    }
    setModalOpen(false);
  };
  const handleDelete = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    addToast('Product deleted', 'info');
  };

  const kpis = [
    { label: 'Total Revenue',  value: fmt(940000), change: '+32%', up: true,  icon: FiDollarSign,  color: 'bg-blue-600',   light: 'bg-blue-50 text-blue-600' },
    { label: 'Total Orders',   value: '94',        change: '+18%', up: true,  icon: FiShoppingCart,color: 'bg-indigo-600', light: 'bg-indigo-50 text-indigo-600' },
    { label: 'Products Listed',value: loading ? '—' : String(products.length), change: '', up: true, icon: FiPackage, color: 'bg-purple-600', light: 'bg-purple-50 text-purple-600' },
    { label: 'Avg. Rating',    value: '4.7',       change: '+0.2', up: true,  icon: FiStar,        color: 'bg-yellow-500', light: 'bg-yellow-50 text-yellow-600' },
  ];

  const inputCls = 'w-full px-3 py-2.5 rounded-xl text-sm border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:bg-white transition-colors';

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* ── Sidebar ── */}
      <aside className={`${sidebarCollapsed ? 'w-16' : 'w-56'} shrink-0 bg-gray-950 flex flex-col transition-all duration-300 sticky top-0 h-screen`}>
        {/* Brand */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-800">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
            <FiTrendingUp size={16} className="text-white" />
          </div>
          {!sidebarCollapsed && (
            <div className="min-w-0">
              <p className="text-white font-black text-xs leading-tight">REKTINA</p>
              <p className="text-blue-400 font-black text-xs leading-tight">SELLER</p>
            </div>
          )}
        </div>

        {/* Seller info */}
        {!sidebarCollapsed && (
          <div className="px-4 py-4 border-b border-gray-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm shrink-0">
                C
              </div>
              <div className="min-w-0">
                <p className="text-white text-xs font-semibold truncate">Chukwuemeka Gadgets</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <p className="text-gray-400 text-[10px]">Active seller</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((navItem) => (
            <button key={navItem.id} onClick={() => setTab(navItem.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${tab === navItem.id ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
              <navItem.icon size={16} className="shrink-0" />
              {!sidebarCollapsed && <span className="font-medium">{navItem.label}</span>}
            </button>
          ))}
        </nav>

        {/* Collapse toggle */}
        <div className="px-2 pb-4">
          <button onClick={() => setSidebarCollapsed(c => !c)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-gray-500 hover:text-white hover:bg-gray-800 transition-colors text-xs">
            {sidebarCollapsed ? '→' : '← Collapse'}
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-lg font-black text-gray-900 capitalize">{tab === 'overview' ? 'Dashboard Overview' : tab}</h1>
            <p className="text-xs text-gray-400 mt-0.5">Welcome back, Chukwuemeka</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => addToast('CSV export started', 'info')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              <FiDownload size={14} /> Export
            </button>
            {tab === 'products' && (
              <button onClick={openCreate}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors shadow-sm">
                <FiPlus size={14} /> Add Product
              </button>
            )}
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">

          {/* ── OVERVIEW ── */}
          {tab === 'overview' && (
            <div className="space-y-6">
              {/* KPI cards */}
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {kpis.map((kpi) => (
                  <div key={kpi.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-xl ${kpi.light} flex items-center justify-center`}>
                        <kpi.icon size={18} />
                      </div>
                      {kpi.change && (
                        <span className={`flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full ${kpi.up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                          {kpi.up ? <FiArrowUp size={10} /> : <FiArrowDown size={10} />} {kpi.change}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-2xl font-black text-gray-900">{loading ? '—' : kpi.value}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{kpi.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts row */}
              <div className="grid xl:grid-cols-3 gap-4">
                {/* Revenue chart */}
                <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <p className="font-bold text-gray-900">Revenue Trend</p>
                      <p className="text-xs text-gray-400 mt-0.5">Last 6 months</p>
                    </div>
                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <FiArrowUp size={10} /> +32% vs last period
                    </span>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={SELLER_ANALYTICS.revenue} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                      <defs>
                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                      <XAxis dataKey="month" tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₦${(v/1000).toFixed(0)}k`} />
                      <Tooltip formatter={v => [fmt(v), 'Revenue']} contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, fontSize: 12 }} />
                      <Area type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={2.5} fill="url(#revGrad)" dot={false} activeDot={{ r: 5, fill: '#2563EB' }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Orders bar */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="mb-5">
                    <p className="font-bold text-gray-900">Orders</p>
                    <p className="text-xs text-gray-400 mt-0.5">Monthly volume</p>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={SELLER_ANALYTICS.orders} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                      <XAxis dataKey="month" tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, fontSize: 12 }} />
                      <Bar dataKey="value" fill="#2563EB" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bottom row */}
              <div className="grid xl:grid-cols-3 gap-4">
                {/* Top products */}
                <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-bold text-gray-900">Top Products</p>
                    <button onClick={() => setTab('products')} className="text-xs text-blue-600 font-semibold hover:underline">View all</button>
                  </div>
                  <div className="space-y-3">
                    {SELLER_ANALYTICS.topProducts.map((p, i) => {
                      const maxRevenue = SELLER_ANALYTICS.topProducts[0].revenue;
                      const pct = Math.round((p.revenue / maxRevenue) * 100);
                      return (
                        <div key={p.name}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-lg bg-gray-100 text-gray-500 text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
                              <span className="text-sm font-medium text-gray-800 truncate max-w-[180px]">{p.name}</span>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              <span className="text-xs text-gray-400">{p.sales} sold</span>
                              <span className="text-sm font-bold text-blue-600">{fmt(p.revenue)}</span>
                            </div>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Activity feed */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <p className="font-bold text-gray-900 mb-4">Recent Activity</p>
                  <div className="space-y-3">
                    {RECENT_ACTIVITY.map((a, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${a.color}`}>
                          <a.icon size={14} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-gray-800 leading-snug">{a.text}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">{a.sub}</p>
                        </div>
                        <span className="text-[10px] text-gray-400 shrink-0 mt-0.5">{a.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── PRODUCTS ── */}
          {tab === 'products' && (
            <div>
              {/* Summary cards */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Total Products', value: products.length, color: 'text-blue-600' },
                  { label: 'Low Stock (< 10)', value: products.filter(p => p.stock < 10).length, color: 'text-orange-500' },
                  { label: 'Out of Stock', value: products.filter(p => p.stock === 0).length, color: 'text-red-500' },
                ].map(s => (
                  <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
                    <p className={`text-3xl font-black ${s.color}`}>{loading ? '—' : s.value}</p>
                    <p className="text-xs text-gray-400 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <p className="font-bold text-gray-900">Product Inventory</p>
                  <span className="text-xs text-gray-400">{products.length} products</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        {['Product', 'Category', 'Price', 'Stock', 'Rating', 'Status', 'Actions'].map(h => (
                          <th key={h} className="text-left py-3 px-4 text-xs text-gray-400 font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {loading
                        ? Array.from({ length: 4 }).map((_, i) => (
                          <tr key={i}><td colSpan={7} className="px-4 py-3"><Skeleton className="h-10 w-full rounded-xl" /></td></tr>
                        ))
                        : products.map(p => (
                          <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/70 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img src={p.images[0]} alt={p.name} className="w-11 h-11 rounded-xl object-cover border border-gray-100" />
                                <div>
                                  <p className="font-semibold text-gray-900 line-clamp-1 max-w-[160px] text-xs">{p.name}</p>
                                  <p className="text-[11px] text-gray-400 mt-0.5">{p.sellerName}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-xs text-gray-500">{p.category}</td>
                            <td className="py-3 px-4 text-sm font-bold text-blue-600">{fmt(p.price)}</td>
                            <td className="py-3 px-4">
                              <span className={`text-xs font-bold px-2 py-1 rounded-lg ${p.stock === 0 ? 'bg-red-50 text-red-500' : p.stock < 10 ? 'bg-orange-50 text-orange-500' : 'bg-green-50 text-green-600'}`}>
                                {p.stock} units
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-1">
                                <FaStar size={11} className="text-yellow-400" />
                                <span className="text-xs text-gray-600 font-medium">{p.rating}</span>
                                <span className="text-[10px] text-gray-400">({p.reviewCount})</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant={p.featured ? 'blue' : 'gray'}>{p.featured ? 'Featured' : 'Standard'}</Badge>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex gap-1">
                                <Link to={`/products/${p.id}`}
                                  className="p-1.5 rounded-lg text-gray-300 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                                  <FiEye size={14} />
                                </Link>
                                <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-gray-300 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"><FiEdit2 size={14} /></button>
                                <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"><FiTrash2 size={14} /></button>
                              </div>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── ORDERS ── */}
          {tab === 'orders' && (
            <div>
              {/* Status summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Pending',    count: MOCK_ORDERS.filter(o => o.status === 'pending').length,    color: 'bg-yellow-50 text-yellow-600 border-yellow-100' },
                  { label: 'Processing', count: MOCK_ORDERS.filter(o => o.status === 'processing').length, color: 'bg-blue-50 text-blue-600 border-blue-100' },
                  { label: 'Shipped',    count: MOCK_ORDERS.filter(o => o.status === 'shipped').length,    color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
                  { label: 'Delivered',  count: MOCK_ORDERS.filter(o => o.status === 'delivered').length,  color: 'bg-green-50 text-green-600 border-green-100' },
                ].map(s => (
                  <div key={s.label} className={`rounded-2xl border p-4 text-center ${s.color}`}>
                    <p className="text-3xl font-black">{s.count}</p>
                    <p className="text-xs font-semibold mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <p className="font-bold text-gray-900">All Orders</p>
                  <span className="text-xs text-gray-400">{MOCK_ORDERS.length} orders</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        {['Order ID', 'Customer', 'Date', 'Items', 'Total', 'Status', 'Update'].map(h => (
                          <th key={h} className="text-left py-3 px-4 text-xs text-gray-400 font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_ORDERS.map(o => (
                        <tr key={o.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/70 transition-colors">
                          <td className="py-3.5 px-4 font-mono text-blue-600 font-bold text-xs">{o.id}</td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0">
                                {o.customer[0]}
                              </div>
                              <span className="text-xs font-medium text-gray-800">{o.customer}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-xs text-gray-400">{o.date}</td>
                          <td className="py-3.5 px-4 text-xs text-gray-500">{o.items} item{o.items > 1 ? 's' : ''}</td>
                          <td className="py-3.5 px-4 text-sm font-bold text-gray-900">{fmt(o.total)}</td>
                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                              o.status === 'delivered'  ? 'bg-green-50 text-green-600 border-green-100' :
                              o.status === 'shipped'    ? 'bg-blue-50 text-blue-600 border-blue-100' :
                              o.status === 'processing' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                              'bg-yellow-50 text-yellow-600 border-yellow-100'
                            }`}>
                              {STATUS_ICON[o.status]} {o.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <select defaultValue={o.status}
                              onChange={e => addToast(`Order ${o.id} updated to ${e.target.value}`)}
                              className="text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white outline-none focus:border-blue-500 cursor-pointer">
                              {['pending', 'processing', 'shipped', 'delivered'].map(s => (
                                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── ANALYTICS ── */}
          {tab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <p className="font-bold text-gray-900 mb-1">Revenue by Month</p>
                  <p className="text-xs text-gray-400 mb-5">Naira (₦)</p>
                  <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={SELLER_ANALYTICS.revenue}>
                      <defs>
                        <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                      <XAxis dataKey="month" tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₦${(v/1000).toFixed(0)}k`} />
                      <Tooltip formatter={v => [fmt(v), 'Revenue']} contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, fontSize: 12 }} />
                      <Area type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={2.5} fill="url(#aGrad)" dot={false} activeDot={{ r: 5 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <p className="font-bold text-gray-900 mb-1">Orders by Month</p>
                  <p className="text-xs text-gray-400 mb-5">Number of orders</p>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={SELLER_ANALYTICS.orders}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                      <XAxis dataKey="month" tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, fontSize: 12 }} />
                      <Bar dataKey="value" fill="#6366F1" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <p className="font-bold text-gray-900 mb-5">Product Performance</p>
                <div className="space-y-4">
                  {SELLER_ANALYTICS.topProducts.map((p, i) => {
                    const max = SELLER_ANALYTICS.topProducts[0].revenue;
                    return (
                      <div key={p.name} className="flex items-center gap-4">
                        <span className="w-6 text-xs text-gray-400 font-bold shrink-0">#{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm font-semibold text-gray-800 truncate">{p.name}</span>
                            <span className="text-sm font-bold text-blue-600 shrink-0 ml-2">{fmt(p.revenue)}</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" style={{ width: `${(p.revenue / max) * 100}%` }} />
                          </div>
                          <p className="text-[11px] text-gray-400 mt-1">{p.sales} units sold</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── MESSAGES ── */}
          {tab === 'messages' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
              <FiMessageCircle size={40} className="text-blue-200 mx-auto mb-4" />
              <p className="font-bold text-gray-900 mb-2">Seller Messages</p>
              <p className="text-gray-400 text-sm mb-5">Manage all your customer conversations</p>
              <Link to="/messages" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors">
                Open Messages
              </Link>
            </div>
          )}

          {/* ── SETTINGS ── */}
          {tab === 'settings' && (
            <div className="max-w-2xl space-y-5">
              {[
                { title: 'Store Name', value: 'Chukwuemeka Gadgets', type: 'text' },
                { title: 'Contact Email', value: 'chukwuemeka@gmail.com', type: 'email' },
                { title: 'Phone Number', value: '+234 803 456 7890', type: 'tel' },
                { title: 'Store Location', value: 'Lagos Island, Lagos', type: 'text' },
              ].map(f => (
                <div key={f.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">{f.title}</label>
                  <input type={f.type} defaultValue={f.value}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 outline-none focus:border-blue-500 focus:bg-white transition-colors" />
                </div>
              ))}
              <button onClick={() => addToast('Settings saved!')}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-colors shadow-sm">
                Save Changes
              </button>
            </div>
          )}

        </main>
      </div>

      {/* Product Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editProduct ? 'Edit Product' : 'Add New Product'}>
        <div className="space-y-4">
          {[['name', 'Product Name', 'text'], ['price', 'Price (₦)', 'number'], ['stock', 'Stock Quantity', 'number'], ['category', 'Category', 'text']].map(([k, label, type]) => (
            <div key={k}>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">{label}</label>
              <input type={type} value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                placeholder={label} className={inputCls} />
            </div>
          ))}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 block">Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={3} placeholder="Describe your product..."
              className="w-full px-3 py-2.5 rounded-xl text-sm border border-gray-200 bg-gray-50 text-gray-900 outline-none resize-none focus:border-blue-500 transition-colors" />
          </div>
          <div className="flex gap-3 pt-1">
            <button onClick={() => setModalOpen(false)}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} disabled={!form.name || !form.price}
              className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm disabled:opacity-50 transition-colors shadow-sm">
              {editProduct ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
