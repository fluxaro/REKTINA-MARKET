import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiUsers, FiShoppingBag, FiDollarSign, FiTrendingUp, FiCheckCircle, 
  FiXCircle, FiShield, FiGrid, FiSettings, FiBarChart2, FiTag, 
  FiAlertCircle, FiArrowUp, FiArrowDown, FiSearch, FiDownload, 
  FiEye, FiMessageCircle, FiPackage, FiRadio, FiFileText, FiTrash2, FiLayers
} from 'react-icons/fi';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar, CartesianGrid 
} from 'recharts';
import { useApp } from '../context/AppContext';
import { ADMIN_ANALYTICS, CATEGORIES, SELLER_ANALYTICS } from '../data/mockData';
import { apiGetUsers } from '../api/mockApi';
import Badge from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import CategoryIcon from '../components/ui/CategoryIcon';
import Modal from '../components/ui/Modal';

const PIE_COLORS = ['#2563EB', '#7C3AED', '#DB2777', '#D97706', '#059669'];
const fmt = n => '₦' + Number(n).toLocaleString('en-NG');

export default function AdminDashboard() {
  const { disputes, updateDisputeStatus, addNotification, addToast } = useApp();
  
  // Tab states: 'overview' | 'users' | 'disputes' | 'listings' | 'policy' | 'broadcast' | 'retinaview' | 'settings'
  const [tab, setTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  // User Management
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null); // Expanded user detail ID

  // Disputes management expanded states
  const [selectedDispute, setSelectedDispute] = useState(null);

  // Flagged Listings
  const [flaggedListings, setFlaggedListings] = useState([
    { id: 1, name: 'Adire Print Shirts (Counterfeit)', seller: 'Adaeze Fashion House', reason: 'Copyright trademark claim', status: 'flagged' },
    { id: 2, name: 'Cloned Hack Keys', seller: 'Chukwuemeka Gadgets', reason: 'Illegal malware software tools', status: 'flagged' }
  ]);

  // Policy drafted logs
  const [policies, setPolicies] = useState([
    { version: 'v2.1', title: 'Campus Escrow Lock Policies', date: '2026-06-01', author: 'System Admin', status: 'Published' },
    { version: 'v2.0', title: 'UVEA Dispute Timelines', date: '2026-05-10', author: 'System Admin', status: 'Archived' }
  ]);
  const [newPolicy, setNewPolicy] = useState({ title: '', content: '' });

  // Broadcast messaging states
  const [broadcastForm, setBroadcastForm] = useState({ title: '', message: '', segment: 'all' });

  // RETINAview Seller analytics search selector
  const [searchSeller, setSearchSeller] = useState('Adaeze Fashion House');

  useEffect(() => {
    apiGetUsers().then(data => { 
      // Add custom metrics for detail panel
      setUsers(data.map(u => ({
        ...u,
        strikes: u.role === 'seller' ? Math.floor(Math.random() * 2) : 0,
        ordersCount: Math.floor(Math.random() * 30) + 5,
        totalSales: Math.floor(Math.random() * 300000) + 20000,
        subscriptionPlan: u.role === 'seller' ? (Math.random() > 0.5 ? 'Monthly Plan' : 'Free Plan') : 'Free Plan'
      }))); 
      setLoading(false); 
    });
  }, []);

  const handleUserAction = (userId, action) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        let updated = { ...u };
        if (action === 'suspend') updated.status = 'suspended';
        else if (action === 'activate') updated.status = 'active';
        else if (action === 'strike') {
          updated.strikes = (updated.strikes || 0) + 1;
          addToast(`Strike issued to ${u.name}. Strikes: ${updated.strikes}/3`, 'warning');
          if (updated.strikes >= 3) {
            updated.status = 'suspended';
            addToast(`User ${u.name} automatically suspended due to strike limit reached`, 'error');
          }
        } else if (action === 'verify') updated.verified = true;
        return updated;
      }
      return u;
    }));
    if (action !== 'strike') {
      addToast(`User account status updated: ${action}`, 'success');
    }
  };

  const handleOverrideSubscription = (userId, planName) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, subscriptionPlan: planName } : u));
    addToast(`Subscription overridden successfully to ${planName}`, 'success');
  };

  const handleDisputeRuling = (disputeId, rulingType) => {
    updateDisputeStatus(disputeId, 'resolved', rulingType);
    addNotification(`Dispute ${disputeId} has been resolved: funds ${rulingType.replace('_', ' ')}.`, 'Disputes');
    addToast(`Dispute resolved. Funds ${rulingType.replace('_', ' ')}!`, 'success');
    setSelectedDispute(null);
  };

  const handleListModeration = (id, action) => {
    setFlaggedListings(prev => prev.map(l => l.id === id ? { ...l, status: action } : l));
    addToast(`Listing listing successfully: ${action}`, 'info');
  };

  const handlePublishPolicy = (e) => {
    e.preventDefault();
    if (!newPolicy.title.trim()) return;
    const vNum = (policies.length + 1) * 0.5 + 2.0;
    setPolicies(prev => [
      { version: `v${vNum.toFixed(1)}`, title: newPolicy.title, date: new Date().toISOString().split('T')[0], author: 'Super Admin', status: 'Published' },
      ...prev
    ]);
    setNewPolicy({ title: '', content: '' });
    addToast('New campus policy draft published platform-wide', 'success');
  };

  const handleSendBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastForm.title.trim() || !broadcastForm.message.trim()) return;
    addNotification(`Broadcast: ${broadcastForm.title} - ${broadcastForm.message}`, 'System');
    addToast(`Mass platform broadcast sent to segment: ${broadcastForm.segment}`, 'success');
    setBroadcastForm({ title: '', message: '', segment: 'all' });
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const kpis = [
    { label: 'Platform Users', value: users.length, change: '+12%', up: true, icon: FiUsers, light: 'bg-blue-50 text-blue-600' },
    { label: 'Platform Escrows', value: disputes.length + 8, change: '+8%', up: true, icon: FiShield, light: 'bg-purple-50 text-purple-600' },
    { label: 'Total Sales Volume', value: fmt(ADMIN_ANALYTICS.totalRevenue), change: '+31%', up: true, icon: FiDollarSign, light: 'bg-yellow-50 text-yellow-600' },
    { label: 'Open Disputes', value: disputes.filter(d => d.status !== 'resolved').length, change: 'Critical', up: false, icon: FiAlertCircle, light: 'bg-red-50 text-red-500' },
  ];

  const navItems = [
    { id: 'overview',  icon: FiGrid,        label: 'Platform Stats' },
    { id: 'users',      icon: FiUsers,       label: 'User Striking' },
    { id: 'disputes',   icon: FiShield,      label: 'Escrow Disputes' },
    { id: 'listings',   icon: FiPackage,     // Moderation
      label: 'Flagged Listings' },
    { id: 'policy',     icon: FiFileText,    label: 'Platform Policies' },
    { id: 'broadcast',  icon: FiRadio,       label: 'Send Broadcasts' },
    { id: 'retinaview', icon: FiBarChart2,   label: 'Seller Analytics' },
    { id: 'settings',   icon: FiSettings,    label: 'Config Settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      
      {/* ── Sidebar ── */}
      <aside className={`${sidebarCollapsed ? 'w-16' : 'w-60'} shrink-0 bg-slate-950 flex flex-col transition-all duration-300 sticky top-0 h-screen z-20`}>
        <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/10">
            <FiTrendingUp size={16} className="text-white" />
          </div>
          {!sidebarCollapsed && (
            <div>
              <p className="text-white font-black text-xs tracking-wider leading-tight">REKTINA</p>
              <p className="text-red-400 font-bold text-[10px] tracking-wider leading-tight">SUPERADMIN</p>
            </div>
          )}
        </div>

        <nav className="flex-1 px-2.5 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-bold transition-all ${tab === item.id ? 'bg-blue-600 text-white shadow-md shadow-blue-500/15' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}>
              <item.icon size={16} className="shrink-0" />
              {!sidebarCollapsed && <span>{item.label}</span>}
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
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-lg font-black text-gray-900 capitalize">{tab.replace('retinaview', 'RETINAview').replace('overview', 'Platform Dashboard')}</h1>
            <p className="text-xs text-gray-400 mt-0.5">Control Center • UVEA Escrow Override Active</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-green-100 bg-green-50 text-green-600 text-xs font-bold shadow-sm">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Secure Gateway Sync
            </span>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">

          {/* ── TABS 1: PLATFORM STATS OVERVIEW ── */}
          {tab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((kpi, idx) => (
                  <div key={idx} className="bg-white rounded-3xl border border-gray-100 p-5 flex flex-col justify-between h-32 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-xl ${kpi.light} flex items-center justify-center`}>
                        <kpi.icon size={18} />
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${kpi.up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
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

              {/* Core Analytics Line & Pie Charts */}
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">
                  <h4 className="text-xs font-black text-gray-950 uppercase tracking-wider mb-4">Total Escrows Held (Monthly)</h4>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={ADMIN_ANALYTICS.revenueByMonth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="value" stroke="#2563EB" fill="#EFF6FF" strokeWidth={2.5} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">
                  <h4 className="text-xs font-black text-gray-950 uppercase tracking-wider mb-4">Sales Distribution</h4>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={ADMIN_ANALYTICS.categoryBreakdown} innerRadius={40} outerRadius={65} dataKey="value">
                        {ADMIN_ANALYTICS.categoryBreakdown.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1.5 mt-4">
                    {ADMIN_ANALYTICS.categoryBreakdown.map((c, i) => (
                      <div key={c.name} className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 font-medium">{c.name}</span>
                        <span className="font-bold text-gray-900">{c.value}% share</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── TABS 2: USER STRIKES MANAGEMENT ── */}
          {tab === 'users' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between bg-slate-50/50">
                  <div className="relative w-64">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                    <input 
                      type="text" 
                      value={userSearch} 
                      onChange={e => setUserSearch(e.target.value)}
                      placeholder="Search accounts..." 
                      className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-blue-500" 
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 border-b border-gray-100">
                      <tr>
                        {['Member Account', 'Email', 'Plan Status', 'Strike Count', 'Status', 'Manage Actions'].map(h => (
                          <th key={h} className="py-3.5 px-5 text-slate-400 uppercase font-black tracking-wider text-[10px]">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(u => {
                        const isExpanded = selectedUser === u.id;
                        return (
                          <>
                            <tr key={u.id} className="border-b border-gray-50 last:border-0 hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => setSelectedUser(isExpanded ? null : u.id)}>
                              <td className="py-4 px-5">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                                    {u.name[0]}
                                  </div>
                                  <div>
                                    <p className="font-bold text-gray-900">{u.name}</p>
                                    <p className="text-[10px] text-gray-400 capitalize">{u.role}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-5 text-gray-500">{u.email}</td>
                              <td className="py-4 px-5">
                                <Badge variant="blue">{u.subscriptionPlan || 'Free Plan'}</Badge>
                              </td>
                              <td className="py-4 px-5">
                                <span className={`px-2 py-0.5 rounded font-black text-[9px] ${u.strikes >= 2 ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-600'}`}>
                                  {u.strikes || 0} / 3 Strikes
                                </span>
                              </td>
                              <td className="py-4 px-5">
                                <span className={`px-2 py-0.5 rounded font-bold text-[9px] uppercase tracking-wider ${
                                  u.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                                }`}>
                                  {u.status}
                                </span>
                              </td>
                              <td className="py-4 px-5">
                                <button className="text-blue-600 font-bold hover:underline">
                                  {isExpanded ? 'Collapse' : 'Manage Profile'}
                                </button>
                              </td>
                            </tr>

                            {/* Expanded User Details Section */}
                            {isExpanded && (
                              <tr className="bg-slate-50/50 border-b border-gray-50">
                                <td colSpan={6} className="p-6">
                                  <div className="grid sm:grid-cols-3 gap-6 text-xs">
                                    <div className="space-y-2">
                                      <p className="font-bold text-gray-900 uppercase text-[10px] tracking-wider text-slate-400">Moderation Override</p>
                                      <div className="flex gap-2">
                                        <button 
                                          onClick={() => handleUserAction(u.id, 'strike')}
                                          className="px-3 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-sm transition-colors"
                                        >
                                          Issue Policy Strike (+1)
                                        </button>
                                        <button 
                                          onClick={() => handleUserAction(u.id, u.status === 'active' ? 'suspend' : 'activate')}
                                          className={`px-3 py-2 rounded-xl text-white font-bold text-xs shadow-sm transition-colors ${
                                            u.status === 'active' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'
                                          }`}
                                        >
                                          {u.status === 'active' ? 'Ban / Suspend Account' : 'Activate Account'}
                                        </button>
                                      </div>
                                    </div>

                                    <div className="space-y-2">
                                      <p className="font-bold text-gray-900 uppercase text-[10px] tracking-wider text-slate-400">Subscription Override</p>
                                      <div className="flex flex-wrap gap-2">
                                        {['Free Plan', 'Monthly Plan', 'Semester Plan', 'Full Session Plan'].map(plan => (
                                          <button 
                                            key={plan}
                                            disabled={u.subscriptionPlan === plan}
                                            onClick={() => handleOverrideSubscription(u.id, plan)}
                                            className={`px-2.5 py-1.5 rounded-lg border font-semibold text-[10px] transition-colors ${
                                              u.subscriptionPlan === plan ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                            }`}
                                          >
                                            {plan}
                                          </button>
                                        ))}
                                      </div>
                                    </div>

                                    <div className="p-4 bg-white border border-gray-100 rounded-2xl space-y-1.5 shadow-sm">
                                      <p className="font-bold text-gray-800 text-[10px] uppercase tracking-wider">Historical Stats</p>
                                      <p className="text-gray-500">Completed Trades: <strong className="text-gray-800">{u.ordersCount} transactions</strong></p>
                                      <p className="text-gray-500">Gross Sales Value: <strong className="text-gray-800">{fmt(u.totalSales)}</strong></p>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── TABS 3: ESCROW DISPUTES PANEL ── */}
          {tab === 'disputes' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-50 bg-slate-50/50">
                  <h3 className="text-xs font-black text-gray-950 uppercase tracking-wider">UVEA Disputes & Rulings</h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 border-b border-gray-100">
                      <tr>
                        {['Dispute ID', 'Order Reference', 'Reason Category', 'Filing Date', 'Escrow Status', 'Action Rulings'].map(h => (
                          <th key={h} className="py-3.5 px-5 text-slate-400 uppercase font-black tracking-wider text-[10px]">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {disputes.map(d => {
                        const isExpanded = selectedDispute === d.id;
                        return (
                          <>
                            <tr key={d.id} className="border-b border-gray-50 last:border-0 hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => setSelectedDispute(isExpanded ? null : d.id)}>
                              <td className="py-4 px-5 font-mono font-black text-gray-900">{d.id}</td>
                              <td className="py-4 px-5 font-mono font-bold text-blue-600">{d.orderId}</td>
                              <td className="py-4 px-5 font-bold text-gray-700">{d.reason}</td>
                              <td className="py-4 px-5 text-gray-500">{d.date}</td>
                              <td className="py-4 px-5">
                                <span className={`px-2.5 py-1 rounded-full font-bold text-[9px] uppercase tracking-wider ${
                                  d.status === 'resolved' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                                }`}>
                                  {d.status.replace('_', ' ')}
                                </span>
                              </td>
                              <td className="py-4 px-5 text-blue-600 font-bold hover:underline">
                                {isExpanded ? 'Collapse' : 'Review Evidence & Ruling'}
                              </td>
                            </tr>

                            {isExpanded && (
                              <tr className="bg-slate-50/50 border-b border-gray-50">
                                <td colSpan={6} className="p-6">
                                  <div className="grid sm:grid-cols-3 gap-6 text-xs">
                                    <div className="sm:col-span-2 space-y-3">
                                      <p className="font-bold text-gray-900 uppercase text-[10px] tracking-wider text-slate-400">Buyer Explanation</p>
                                      <div className="p-4 bg-white border border-gray-100 rounded-2xl space-y-2 shadow-sm">
                                        <p className="leading-relaxed text-gray-700">{d.description}</p>
                                        <div className="text-[10px] text-blue-600 font-bold flex items-center gap-1.5 pt-1 border-t border-slate-50 mt-2">
                                          <span>📄 Evidence File: {d.evidence}</span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="space-y-4">
                                      <p className="font-bold text-gray-900 uppercase text-[10px] tracking-wider text-slate-400">Official Admin Resolution</p>
                                      {d.status === 'resolved' ? (
                                        <div className="p-4 bg-green-50 border border-green-100 rounded-2xl text-green-800 text-[11px] font-semibold">
                                          ✓ Resolved: Funds {d.ruling.replace('_', ' ')}.
                                        </div>
                                      ) : (
                                        <div className="space-y-2">
                                          <button 
                                            onClick={() => handleDisputeRuling(d.id, 'refunded_to_buyer')}
                                            className="w-full py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs shadow-sm transition-colors"
                                          >
                                            Refund Buyer (Release Escrow)
                                          </button>
                                          <button 
                                            onClick={() => handleDisputeRuling(d.id, 'released_to_seller')}
                                            className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs shadow-sm transition-colors"
                                          >
                                            Release Escrow to Seller
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── TABS 4: FLAGGED LISTINGS MODERATION ── */}
          {tab === 'listings' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-50 bg-slate-50/50">
                  <h3 className="text-xs font-black text-gray-950 uppercase tracking-wider">Reported Flagged Products</h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 border-b border-gray-100">
                      <tr>
                        {['Listing ID', 'Product Details', 'Store Owner', 'Flag Reason', 'Status', 'Action Panels'].map(h => (
                          <th key={h} className="py-3.5 px-5 text-slate-400 uppercase font-black tracking-wider text-[10px]">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {flaggedListings.map(l => (
                        <tr key={l.id} className="border-b border-gray-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-5 font-mono">{l.id}</td>
                          <td className="py-4 px-5 font-bold text-gray-950">{l.name}</td>
                          <td className="py-4 px-5 text-slate-500 font-semibold">{l.seller}</td>
                          <td className="py-4 px-5 font-semibold text-red-500">{l.reason}</td>
                          <td className="py-4 px-5">
                            <span className={`px-2 py-0.5 rounded font-bold text-[9px] uppercase tracking-wider ${
                              l.status === 'flagged' ? 'bg-red-50 text-red-500' : l.status === 'hidden' ? 'bg-slate-100 text-slate-500' : 'bg-green-50 text-green-600'
                            }`}>
                              {l.status}
                            </span>
                          </td>
                          <td className="py-4 px-5">
                            {l.status === 'flagged' && (
                              <div className="flex gap-2">
                                <button onClick={() => handleListModeration(l.id, 'approved')} className="px-2.5 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold text-[10px] uppercase tracking-wider shadow-sm">Approve</button>
                                <button onClick={() => handleListModeration(l.id, 'hidden')} className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-950 text-white font-bold text-[10px] uppercase tracking-wider shadow-sm">Hide Listing</button>
                              </div>
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

          {/* ── TABS 5: PLATFORM POLICIES DRAFT ── */}
          {tab === 'policy' && (
            <div className="grid md:grid-cols-3 gap-6 animate-fade-in">
              <form onSubmit={handlePublishPolicy} className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm space-y-4 h-fit">
                <h3 className="text-xs font-black text-gray-950 uppercase tracking-wider border-b border-gray-50 pb-2">Draft Policy Update</h3>
                <div>
                  <label className="text-[9px] text-gray-400 font-bold block mb-1 uppercase">Version Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Escrow Refund Policies Update" 
                    value={newPolicy.title}
                    onChange={e => setNewPolicy(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-blue-500 focus:bg-white" 
                  />
                </div>
                <div>
                  <label className="text-[9px] text-gray-400 font-bold block mb-1 uppercase">Policy Contents</label>
                  <textarea 
                    rows={4}
                    placeholder="Write detailed campus marketplace policies amendments here..." 
                    value={newPolicy.content}
                    onChange={e => setNewPolicy(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full p-3 bg-slate-50 border border-gray-200 rounded-xl text-xs outline-none resize-none focus:border-blue-500 focus:bg-white" 
                  />
                </div>
                <button type="submit" className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-50 transition-colors">
                  Publish Policy Amendment (7d Notice)
                </button>
              </form>

              {/* Version logs */}
              <div className="md:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between">
                <div className="px-5 py-4 border-b border-gray-50 bg-slate-50/50">
                  <h3 className="text-xs font-black text-gray-950 uppercase tracking-wider">Policy Version History Logs</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 border-b border-gray-100">
                      <tr>
                        {['Version', 'Policy Document', 'Author', 'Release Date', 'Status'].map(h => (
                          <th key={h} className="py-3.5 px-5 text-slate-400 uppercase font-black tracking-wider text-[10px]">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {policies.map((p, i) => (
                        <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-5 font-mono font-bold text-blue-600">{p.version}</td>
                          <td className="py-4 px-5 font-bold text-gray-900">{p.title}</td>
                          <td className="py-4 px-5 text-gray-500">{p.author}</td>
                          <td className="py-4 px-5 text-gray-400">{p.date}</td>
                          <td className="py-4 px-5">
                            <span className={`px-2 py-0.5 rounded font-bold text-[9px] uppercase tracking-wider ${
                              p.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {p.status}
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

          {/* ── TABS 6: SEND BROADCASTS ── */}
          {tab === 'broadcast' && (
            <div className="max-w-xl bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-5 animate-fade-in">
              <div className="border-b border-gray-50 pb-3">
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider">Compose Platform-Wide Broadcast</h3>
                <p className="text-[10px] text-gray-400 mt-0.5">Alert targeted campus users via push & in-app banners</p>
              </div>

              <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
                <div>
                  <label className="text-[9px] text-gray-400 font-bold block mb-1.5 uppercase">Recipient Segment</label>
                  <select 
                    value={broadcastForm.segment} 
                    onChange={e => setBroadcastForm(prev => ({ ...prev, segment: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-blue-500 focus:bg-white"
                  >
                    <option value="all">All Platform Users (Buyers & Sellers)</option>
                    <option value="buyers">Buyers Only Segment</option>
                    <option value="sellers">Sellers Only Segment</option>
                  </select>
                </div>

                <div>
                  <label className="text-[9px] text-gray-400 font-bold block mb-1.5 uppercase">Notification Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Server Maintenance Reminder" 
                    value={broadcastForm.title}
                    onChange={e => setBroadcastForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-[9px] text-gray-400 font-bold block mb-1.5 uppercase">Notification Message Body</label>
                  <textarea 
                    rows={3}
                    placeholder="Compose announcement body text..." 
                    value={broadcastForm.message}
                    onChange={e => setBroadcastForm(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full p-3 bg-slate-50 border border-gray-200 rounded-xl text-xs outline-none resize-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <button type="submit" className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-50 transition-all">
                  Broadcast Notification Alert
                </button>
              </form>
            </div>
          )}

          {/* ── TABS 7: SELLER ANALYTICS INSPECTOR ── */}
          {tab === 'retinaview' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-50 pb-3">
                  <div>
                    <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider">RETINAview Analytics Inspector</h3>
                    <p className="text-[10px] text-gray-400 mt-0.5">Search and view any seller's monthly analytics metrics</p>
                  </div>
                  <div className="relative w-64">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                    <select 
                      value={searchSeller} 
                      onChange={e => setSearchSeller(e.target.value)}
                      className="pl-8 pr-4 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs font-bold outline-none focus:bg-white cursor-pointer w-full text-gray-700"
                    >
                      <option>Chukwuemeka Gadgets</option>
                      <option>Adaeze Fashion House</option>
                      <option>Babatunde Home Store</option>
                    </select>
                  </div>
                </div>

                {/* Seller Analytics metrics mock */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Seller Name', val: searchSeller },
                    { label: 'Inspect Month', val: 'June 2026' },
                    { label: 'Rating Grade', val: '4.8★' },
                    { label: 'UVEA Release Compliance', val: '99.4%' }
                  ].map((item, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-gray-100 text-center">
                      <p className="text-xs font-black text-gray-900">{item.val}</p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase mt-1 tracking-wider">{item.label}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={SELLER_ANALYTICS.revenue}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* ── TABS 8: PLATFORM SETTINGS CONFIG ── */}
          {tab === 'settings' && (
            <div className="max-w-xl bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-5 animate-fade-in">
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider border-b border-gray-50 pb-3">Admin Configuration Settings</h3>
              <div className="space-y-4 text-xs">
                {[
                  { label: 'UVEA Escrow Base Charge (%)', value: '1.05' },
                  { label: 'Strike Expiry Threshold (Days)', value: '365' },
                  { label: 'Auto-Release Timeout Duration (Hours)', value: '48' }
                ].map((item, idx) => (
                  <div key={idx}>
                    <label className="text-[9px] text-gray-400 font-bold block mb-1 uppercase">{item.label}</label>
                    <input type="text" defaultValue={item.value} className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs font-bold outline-none" />
                  </div>
                ))}
              </div>
              <button onClick={() => addToast('System variables updated successfully', 'success')} className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm">
                Save Parameters
              </button>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}
