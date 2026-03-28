import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiUsers, FiShoppingBag, FiDollarSign, FiTrendingUp, FiCheckCircle,
  FiXCircle, FiShield, FiGrid, FiSettings, FiBarChart2, FiTag,
  FiAlertCircle, FiArrowUp, FiArrowDown, FiSearch, FiDownload,
  FiEye, FiMessageCircle, FiPackage,
} from 'react-icons/fi';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, CartesianGrid,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { ADMIN_ANALYTICS, CATEGORIES } from '../data/mockData';
import { apiGetUsers } from '../api/mockApi';
import Badge from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import CategoryIcon from '../components/ui/CategoryIcon';

const PIE_COLORS = ['#2563EB', '#7C3AED', '#DB2777', '#D97706', '#059669'];
const fmt = n => '₦' + Number(n).toLocaleString('en-NG');

const NAV_ITEMS = [
  { id: 'overview',   icon: FiGrid,       label: 'Overview' },
  { id: 'users',      icon: FiUsers,      label: 'Users' },
  { id: 'sellers',    icon: FiShield,     label: 'Sellers' },
  { id: 'orders',     icon: FiShoppingBag,label: 'Orders' },
  { id: 'categories', icon: FiTag,        label: 'Categories' },
  { id: 'analytics',  icon: FiBarChart2,  label: 'Analytics' },
  { id: 'settings',   icon: FiSettings,   label: 'Settings' },
];

const RECENT_ORDERS = [
  { id: 'RKT-1042', customer: 'Chidi Okonkwo',    amount: 73000,  status: 'shipped',    date: '2026-03-20' },
  { id: 'RKT-1038', customer: 'Ngozi Eze',         amount: 95000,  status: 'delivered',  date: '2026-03-18' },
  { id: 'RKT-1031', customer: 'Emeka Obiora',      amount: 42500,  status: 'processing', date: '2026-03-15' },
  { id: 'RKT-1025', customer: 'Funmilayo Bello',   amount: 55000,  status: 'pending',    date: '2026-03-12' },
  { id: 'RKT-1019', customer: 'Tunde Adeyemi',     amount: 130000, status: 'delivered',  date: '2026-03-10' },
];

export default function AdminDashboard() {
  const { addToast } = useApp();
  const [tab, setTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userSearch, setUserSearch] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    apiGetUsers().then(data => { setUsers(data); setLoading(false); });
  }, []);

  const handleUserAction = (userId, action) => {
    setUsers(prev => prev.map(u => u.id === userId
      ? { ...u, status: action === 'suspend' ? 'suspended' : 'active', verified: action === 'verify' ? true : u.verified }
      : u
    ));
    addToast(`User ${action}d successfully`);
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const kpis = [
    { label: 'Total Users',   value: ADMIN_ANALYTICS.totalUsers.toLocaleString(), change: '+12%', up: true,  icon: FiUsers,       light: 'bg-blue-50 text-blue-600' },
    { label: 'Active Sellers',value: ADMIN_ANALYTICS.totalSellers,                change: '+8%',  up: true,  icon: FiShield,      light: 'bg-purple-50 text-purple-600' },
    { label: 'Total Orders',  value: ADMIN_ANALYTICS.totalOrders.toLocaleString(),change: '+24%', up: true,  icon: FiShoppingBag, light: 'bg-indigo-50 text-indigo-600' },
    { label: 'Total Revenue', value: fmt(ADMIN_ANALYTICS.totalRevenue),           change: '+31%', up: true,  icon: FiDollarSign,  light: 'bg-yellow-50 text-yellow-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* ── Sidebar ── */}
      <aside className={`${sidebarCollapsed ? 'w-16' : 'w-56'} shrink-0 bg-gray-950 flex flex-col transition-all duration-300 sticky top-0 h-screen`}>
        <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-800">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
            <FiTrendingUp size={16} className="text-white" />
          </div>
          {!sidebarCollapsed && (
            <div>
              <p className="text-white font-black text-xs leading-tight">REKTINA</p>
              <p className="text-blue-400 font-black text-xs leading-tight">ADMIN</p>
            </div>
          )}
        </div>

        {!sidebarCollapsed && (
          <div className="px-4 py-4 border-b border-gray-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white font-black text-sm shrink-0">A</div>
              <div className="min-w-0">
                <p className="text-white text-xs font-semibold truncate">Super Admin</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <p className="text-gray-400 text-[10px]">System online</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ id, icon: Icon, label }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${tab === id ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
              <Icon size={16} className="shrink-0" />
              {!sidebarCollapsed && <span className="font-medium">{label}</span>}
            </button>
          ))}
        </nav>

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
            <h1 className="text-lg font-black text-gray-900 capitalize">{tab === 'overview' ? 'Platform Overview' : tab}</h1>
            <p className="text-xs text-gray-400 mt-0.5">Rektina Market Admin Panel</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-green-100 bg-green-50 text-green-600 text-xs font-semibold">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              All Systems Online
            </div>
            <button onClick={() => addToast('Report exported', 'info')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              <FiDownload size={14} /> Export
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">

          {/* ── OVERVIEW ── */}
          {tab === 'overview' && (
            <div className="space-y-6">
              {/* KPIs */}
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {kpis.map(({ label, value, change, up, icon: Icon, light }) => (
                  <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl ${light} flex items-center justify-center`}>
                        <Icon size={18} />
                      </div>
                      <span className={`flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full ${up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                        {up ? <FiArrowUp size={10} /> : <FiArrowDown size={10} />} {change}
                      </span>
                    </div>
                    <p className="text-2xl font-black text-gray-900">{value}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              {/* Charts */}
              <div className="grid xl:grid-cols-3 gap-4">
                <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <p className="font-bold text-gray-900">Platform Revenue</p>
                      <p className="text-xs text-gray-400 mt-0.5">Last 6 months (₦)</p>
                    </div>
                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <FiArrowUp size={10} /> +31% growth
                    </span>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={ADMIN_ANALYTICS.revenueByMonth} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                      <defs>
                        <linearGradient id="adminGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                      <XAxis dataKey="month" tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₦${(v/1000000).toFixed(0)}M`} />
                      <Tooltip formatter={v => [fmt(v), 'Revenue']} contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, fontSize: 12 }} />
                      <Area type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={2.5} fill="url(#adminGrad)" dot={false} activeDot={{ r: 5 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <p className="font-bold text-gray-900 mb-1">Sales by Category</p>
                  <p className="text-xs text-gray-400 mb-4">Revenue distribution</p>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={ADMIN_ANALYTICS.categoryBreakdown} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" paddingAngle={3}>
                        {ADMIN_ANALYTICS.categoryBreakdown.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={v => [`${v}%`, 'Share']} contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 mt-3">
                    {ADMIN_ANALYTICS.categoryBreakdown.map((c, i) => (
                      <div key={c.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: PIE_COLORS[i] }} />
                          <span className="text-xs text-gray-500">{c.name}</span>
                        </div>
                        <span className="text-xs font-bold text-gray-900">{c.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent orders */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <p className="font-bold text-gray-900">Recent Orders</p>
                  <button onClick={() => setTab('orders')} className="text-xs text-blue-600 font-semibold hover:underline">View all</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        {['Order ID', 'Customer', 'Amount', 'Status', 'Date'].map(h => (
                          <th key={h} className="text-left py-3 px-4 text-xs text-gray-400 font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {RECENT_ORDERS.map(o => (
                        <tr key={o.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/70 transition-colors">
                          <td className="py-3 px-4 font-mono text-blue-600 font-bold text-xs">{o.id}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">{o.customer[0]}</div>
                              <span className="text-xs font-medium text-gray-800">{o.customer}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm font-bold text-gray-900">{fmt(o.amount)}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                              o.status === 'delivered'  ? 'bg-green-50 text-green-600' :
                              o.status === 'shipped'    ? 'bg-blue-50 text-blue-600' :
                              o.status === 'processing' ? 'bg-indigo-50 text-indigo-600' :
                              'bg-yellow-50 text-yellow-600'
                            }`}>{o.status}</span>
                          </td>
                          <td className="py-3 px-4 text-xs text-gray-400">{o.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── USERS ── */}
          {(tab === 'users' || tab === 'sellers') && (
            <div>
              {/* Summary */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Total Users',    value: users.length,                                  color: 'text-blue-600' },
                  { label: 'Active',         value: users.filter(u => u.status === 'active').length, color: 'text-green-600' },
                  { label: 'Suspended',      value: users.filter(u => u.status === 'suspended').length, color: 'text-red-500' },
                ].map(s => (
                  <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
                    <p className={`text-3xl font-black ${s.color}`}>{loading ? '—' : s.value}</p>
                    <p className="text-xs text-gray-400 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
                  <div className="relative flex-1 max-w-xs">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input type="text" value={userSearch} onChange={e => setUserSearch(e.target.value)}
                      placeholder="Search users..."
                      className="w-full pl-9 pr-4 py-2 rounded-xl text-sm border border-gray-200 bg-gray-50 outline-none focus:border-blue-400 transition-colors" />
                  </div>
                  <span className="text-xs text-gray-400 ml-auto">{filteredUsers.length} users</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        {['User', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                          <th key={h} className="text-left py-3 px-4 text-xs text-gray-400 font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {loading
                        ? Array.from({ length: 5 }).map((_, i) => (
                          <tr key={i}><td colSpan={6} className="px-4 py-3"><Skeleton className="h-10 w-full rounded-xl" /></td></tr>
                        ))
                        : filteredUsers.map(u => (
                          <tr key={u.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/70 transition-colors">
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm ${u.role === 'admin' ? 'bg-red-100 text-red-600' : u.role === 'seller' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                  {u.name[0]}
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900 text-xs">{u.name}</p>
                                  {u.verified && <p className="text-[10px] text-blue-600 flex items-center gap-0.5 mt-0.5"><FiCheckCircle size={9} /> Verified</p>}
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-xs text-gray-400">{u.email}</td>
                            <td className="py-3.5 px-4">
                              <Badge variant={u.role === 'admin' ? 'red' : u.role === 'seller' ? 'blue' : 'gray'}>{u.role}</Badge>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${u.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' ? 'bg-green-500' : 'bg-red-400'}`} />
                                {u.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-xs text-gray-400">{u.joined}</td>
                            <td className="py-3.5 px-4">
                              <div className="flex gap-1">
                                {u.role === 'seller' && !u.verified && (
                                  <button onClick={() => handleUserAction(u.id, 'verify')}
                                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-blue-600 hover:bg-blue-50 font-semibold transition-colors">
                                    <FiCheckCircle size={11} /> Verify
                                  </button>
                                )}
                                <button onClick={() => handleUserAction(u.id, u.status === 'active' ? 'suspend' : 'activate')}
                                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${u.status === 'active' ? 'text-red-500 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}>
                                  {u.status === 'active' ? <><FiXCircle size={11} /> Suspend</> : <><FiCheckCircle size={11} /> Activate</>}
                                </button>
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Pending',   count: 1, color: 'bg-yellow-50 text-yellow-600 border-yellow-100' },
                  { label: 'Processing',count: 1, color: 'bg-blue-50 text-blue-600 border-blue-100' },
                  { label: 'Shipped',   count: 2, color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
                  { label: 'Delivered', count: 2, color: 'bg-green-50 text-green-600 border-green-100' },
                ].map(s => (
                  <div key={s.label} className={`rounded-2xl border p-4 text-center ${s.color}`}>
                    <p className="text-3xl font-black">{s.count}</p>
                    <p className="text-xs font-semibold mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <p className="font-bold text-gray-900">All Platform Orders</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        {['Order ID', 'Customer', 'Amount', 'Status', 'Date'].map(h => (
                          <th key={h} className="text-left py-3 px-4 text-xs text-gray-400 font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {RECENT_ORDERS.map(o => (
                        <tr key={o.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/70 transition-colors">
                          <td className="py-3.5 px-4 font-mono text-blue-600 font-bold text-xs">{o.id}</td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">{o.customer[0]}</div>
                              <span className="text-xs font-medium text-gray-800">{o.customer}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-gray-900">{fmt(o.amount)}</td>
                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                              o.status === 'delivered' ? 'bg-green-50 text-green-600' :
                              o.status === 'shipped' ? 'bg-blue-50 text-blue-600' :
                              o.status === 'processing' ? 'bg-indigo-50 text-indigo-600' :
                              'bg-yellow-50 text-yellow-600'
                            }`}>{o.status}</span>
                          </td>
                          <td className="py-3.5 px-4 text-xs text-gray-400">{o.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── CATEGORIES ── */}
          {tab === 'categories' && (
            <div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {CATEGORIES.map(c => (
                  <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-24 relative overflow-hidden">
                      <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className={`absolute top-3 left-3 w-8 h-8 rounded-xl ${c.color} flex items-center justify-center`}>
                        <CategoryIcon name={c.iconName} size={15} />
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="font-bold text-gray-900 text-sm">{c.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5 mb-3">{c.count} products</p>
                      <div className="flex gap-2">
                        <button onClick={() => addToast(`Editing ${c.name}`, 'info')}
                          className="flex-1 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 font-medium transition-colors">Edit</button>
                        <button onClick={() => addToast(`${c.name} removed`, 'info')}
                          className="flex-1 py-1.5 rounded-lg border border-red-100 text-xs text-red-400 hover:bg-red-50 font-medium transition-colors">Remove</button>
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={() => addToast('Add category coming soon', 'info')}
                  className="rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 p-8 text-gray-300 hover:border-blue-400 hover:text-blue-500 transition-colors min-h-[180px]">
                  <div className="w-10 h-10 rounded-xl border-2 border-current flex items-center justify-center text-xl font-black">+</div>
                  <span className="text-sm font-semibold">Add Category</span>
                </button>
              </div>
            </div>
          )}

          {/* ── ANALYTICS ── */}
          {tab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <p className="font-bold text-gray-900 mb-1">Revenue Growth</p>
                  <p className="text-xs text-gray-400 mb-5">Monthly platform revenue (₦)</p>
                  <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={ADMIN_ANALYTICS.revenueByMonth}>
                      <defs>
                        <linearGradient id="aGrad2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                      <XAxis dataKey="month" tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₦${(v/1000000).toFixed(0)}M`} />
                      <Tooltip formatter={v => [fmt(v), 'Revenue']} contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, fontSize: 12 }} />
                      <Area type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={2.5} fill="url(#aGrad2)" dot={false} activeDot={{ r: 5 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <p className="font-bold text-gray-900 mb-1">Category Breakdown</p>
                  <p className="text-xs text-gray-400 mb-5">Revenue share by category</p>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={ADMIN_ANALYTICS.categoryBreakdown} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
                      <XAxis type="number" tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                      <YAxis type="category" dataKey="name" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} width={70} />
                      <Tooltip formatter={v => [`${v}%`, 'Share']} contentStyle={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, fontSize: 12 }} />
                      <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                        {ADMIN_ANALYTICS.categoryBreakdown.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* ── SETTINGS ── */}
          {tab === 'settings' && (
            <div className="max-w-2xl space-y-5">
              {[
                { title: 'Platform Name', value: 'Rektina Market' },
                { title: 'Support Email', value: 'support@rektinamarket.com' },
                { title: 'Support Phone', value: '+234 800 000 0000' },
                { title: 'HQ Address', value: 'Victoria Island, Lagos, Nigeria' },
              ].map(f => (
                <div key={f.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">{f.title}</label>
                  <input type="text" defaultValue={f.value}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 outline-none focus:border-blue-500 focus:bg-white transition-colors" />
                </div>
              ))}
              <button onClick={() => addToast('Platform settings saved!')}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-colors shadow-sm">
                Save Settings
              </button>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
