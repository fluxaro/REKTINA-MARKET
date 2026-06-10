import { useState, useEffect } from 'react';
import { 
  FiUser, FiMail, FiPhone, FiMapPin, FiSave, FiCamera, 
  FiPackage, FiHeart, FiSettings, FiBell, FiLock, FiShield, 
  FiChevronRight, FiCreditCard, FiGift, FiAlertTriangle, FiHelpCircle
} from 'react-icons/fi';
import { Link, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import PolicyDocument from '../components/ui/PolicyDocument';

export default function Profile() {
  const { user, subscription, referrals, preferences, setPreferences, addToast } = useApp();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '+234 812 345 6789',
    address: user?.address || 'University Hall B, Room 412',
    bio: user?.bio || 'Computer Science undergrad | Gamer | Tech enthusiast',
  });
  const [saving, setSaving] = useState(false);
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam || 'profile');

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // Security States
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [activeDevices, setActiveDevices] = useState([
    { id: 1, name: 'Windows PC • Lagos, NG', device: 'Chrome Browser', active: true },
    { id: 2, name: 'iPhone 15 • Enugu, NG', device: 'Mobile App', active: false }
  ]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    setSaving(false);
    addToast('Profile information updated', 'success');
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      addToast('Please fill in all password fields', 'error');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      addToast('New passwords do not match', 'error');
      return;
    }
    setUpdatingPassword(true);
    setTimeout(() => {
      setUpdatingPassword(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      addToast('Password reset successfully', 'success');
    }, 1000);
  };

  const handleTogglePreference = (key) => {
    setPreferences(prev => {
      const next = { ...prev, [key]: !prev[key] };
      addToast('Notification settings saved', 'success');
      return next;
    });
  };

  const handleToggle2FA = () => {
    setTwoFactor(p => {
      const next = !p;
      addToast(next ? 'Two-Factor Authentication enabled' : 'Two-Factor Authentication disabled', 'info');
      return next;
    });
  };

  const handleLogOutDevices = () => {
    setActiveDevices(prev => prev.filter(d => d.active));
    addToast('Logged out of other devices successfully', 'success');
  };

  const inputCls = 'w-full pl-10 pr-4 py-3 rounded-xl text-sm border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:bg-white transition-colors';
  const labelCls = 'text-[10px] text-gray-400 font-bold block mb-1.5 uppercase tracking-wider';

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-12">
      {/* Cover/Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-black text-gray-900">Account Settings</h1>
          <p className="text-xs text-gray-400 mt-1">Manage your account preferences, credentials, and configurations</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Left Sidebar Info Card */}
          <div className="space-y-4">
            
            {/* User Profile Card */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 text-center space-y-4">
              <div className="relative inline-block">
                <div className="w-20 h-20 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto text-blue-600 text-3xl font-black">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md hover:bg-blue-700 transition-all cursor-pointer">
                  <FiCamera size={12} />
                </button>
              </div>
              <div>
                <p className="font-bold text-gray-900 text-base">{user?.name}</p>
                <p className="text-xs text-gray-400 capitalize mt-0.5">{user?.role} account</p>
              </div>
              <div className="pt-2">
                <span className="px-3.5 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider">
                  Verified Member
                </span>
              </div>
            </div>

            {/* V2 Dashboard Widgets (Subscription & Referrals Overview) */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 space-y-4">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Services Overview</p>
              
              {/* Subscription widget */}
              <div className="p-3 rounded-2xl border border-gray-100 bg-gray-50 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold">CURRENT PLAN</p>
                  <p className="text-xs font-black text-blue-600 mt-0.5">{subscription?.plan || 'Free Plan'}</p>
                </div>
                <Link to="/subscription" className="p-2 rounded-lg bg-white text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors border border-gray-100">
                  <FiCreditCard size={14} />
                </Link>
              </div>

              {/* Referrals widget */}
              <div className="p-3 rounded-2xl border border-gray-100 bg-gray-50 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold">INVITE CODE</p>
                  <p className="text-xs font-black text-gray-800 mt-0.5">{referrals?.code || 'REK-USER-9182'}</p>
                </div>
                <Link to="/referrals" className="p-2 rounded-lg bg-white text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors border border-gray-100">
                  <FiGift size={14} />
                </Link>
              </div>
            </div>

            {/* Quick Switch Sidebar Tabs */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
              {[
                { tab: 'profile', label: 'Personal Information', Icon: FiUser },
                { tab: 'notifications', label: 'Notification Settings', Icon: FiBell },
                { tab: 'security', label: 'Security & Login', Icon: FiLock },
                { tab: 'help', label: 'Help & Support', Icon: FiHelpCircle },
                { tab: 'legal', label: 'Legal & Policies', Icon: FiShield }
              ].map(({ tab, label, Icon }) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`w-full flex items-center justify-between px-5 py-4 text-xs font-bold transition-all text-left ${isActive ? 'bg-blue-50/50 text-blue-600' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50/50'}`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon size={14} /> {label}
                    </span>
                    <FiChevronRight size={14} className={isActive ? 'text-blue-600' : 'text-gray-300'} />
                  </button>
                );
              })}
            </div>

          </div>

          {/* Main Area */}
          <div className="md:col-span-2">
            
            {/* Tab 1: Profile Form */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-black text-gray-900">Personal Information</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Manage details related to your public page identity</p>
                </div>
                
                <form onSubmit={handleSave} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Full Name</label>
                      <div className="relative">
                        <FiUser size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputCls} placeholder="Full Name" required />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Email Address</label>
                      <div className="relative">
                        <FiMail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={inputCls} placeholder="Email" type="email" required />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Phone Number</label>
                      <div className="relative">
                        <FiPhone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className={inputCls} placeholder="+234 Phone Number" />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Campus / Address</label>
                      <div className="relative">
                        <FiMapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className={inputCls} placeholder="Room / Hall / campus" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>User Bio</label>
                    <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} rows={3} placeholder="Tell campus buyers about yourself..."
                      className="w-full px-4 py-3 rounded-xl text-sm border border-gray-200 bg-gray-50 text-gray-900 outline-none resize-none focus:border-blue-500 focus:bg-white transition-colors" />
                  </div>
                  
                  <button type="submit" disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs disabled:opacity-60 transition-all shadow-md shadow-blue-50"
                  >
                    <FiSave size={14} /> {saving ? 'Saving...' : 'Save Profile Details'}
                  </button>
                </form>
              </div>
            )}

            {/* Tab 2: Notifications Config */}
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-black text-gray-900">Notification Channels</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Control how and where REKTINA sends notifications and notices</p>
                </div>

                <div className="space-y-4">
                  {[
                    ['email', 'Email Alerts', 'Receive real-time transactional logs and invoices on your registered email address'],
                    ['push', 'Push Notifications', 'Show desktop browser slide notification alerts for incoming peer messages'],
                    ['inApp', 'In-App Notifications', 'Store history log alerts in your sliding Notification Center Drawer']
                  ].map(([key, title, desc]) => (
                    <div key={key} className="flex items-start justify-between p-4 rounded-2xl border border-gray-100 bg-gray-50/50">
                      <div className="pr-4">
                        <h4 className="text-xs font-bold text-gray-900">{title}</h4>
                        <p className="text-[10px] text-gray-400 leading-relaxed mt-0.5">{desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer mt-1 select-none">
                        <input 
                          type="checkbox" 
                          checked={preferences?.[key] ?? false}
                          onChange={() => handleTogglePreference(key)}
                          className="sr-only peer" 
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600" />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Security & Credentials */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                
                {/* Reset Password Card */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
                  <div>
                    <h2 className="text-lg font-black text-gray-900">Update Credentials</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Change your password to maintain dashboard security</p>
                  </div>

                  <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <label className={labelCls}>Current Password</label>
                        <div className="relative">
                          <FiLock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input 
                            type="password"
                            value={passwordForm.currentPassword}
                            onChange={e => setPasswordForm(f => ({ ...f, currentPassword: e.target.value }))}
                            className={inputCls}
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                      <div>
                        <label className={labelCls}>New Password</label>
                        <div className="relative">
                          <FiLock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input 
                            type="password"
                            value={passwordForm.newPassword}
                            onChange={e => setPasswordForm(f => ({ ...f, newPassword: e.target.value }))}
                            className={inputCls}
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                      <div>
                        <label className={labelCls}>Confirm Password</label>
                        <div className="relative">
                          <FiLock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input 
                            type="password"
                            value={passwordForm.confirmPassword}
                            onChange={e => setPasswordForm(f => ({ ...f, confirmPassword: e.target.value }))}
                            className={inputCls}
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                    </div>

                    <button type="submit" disabled={updatingPassword}
                      className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-50 transition-colors"
                    >
                      {updatingPassword ? 'Authorizing password reset...' : 'Update Password'}
                    </button>
                  </form>
                </div>

                {/* 2FA Card */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-lg font-black text-gray-900">Two-Factor Authentication (2FA)</h2>
                      <p className="text-xs text-gray-400 mt-0.5">Add an extra layer of security to your student seller wallet payouts</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer mt-1 select-none">
                      <input 
                        type="checkbox" 
                        checked={twoFactor}
                        onChange={handleToggle2FA}
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600" />
                    </label>
                  </div>
                </div>

                {/* Active Sessions Device Panel */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-black text-gray-900">Active Sessions</h2>
                      <p className="text-xs text-gray-400 mt-0.5">Logged-in active devices accessing this account</p>
                    </div>
                    {activeDevices.length > 1 && (
                      <button 
                        onClick={handleLogOutDevices} 
                        className="px-3 py-1.5 rounded-lg border border-red-200 text-red-500 font-bold text-[10px] hover:bg-red-50"
                      >
                        Log Out Other Sessions
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    {activeDevices.map(device => (
                      <div key={device.id} className="p-3.5 rounded-2xl border border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${device.active ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                            {device.device[0]}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-900">{device.name}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{device.device}</p>
                          </div>
                        </div>
                        {device.active ? (
                          <span className="text-[9px] font-black uppercase text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded">Current Session</span>
                        ) : (
                          <span className="text-[9px] font-black uppercase text-gray-400 bg-gray-50 px-2 py-0.5 rounded">Connected</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* Tab 5: Help & Support */}
            {activeTab === 'help' && (
              <div className="space-y-6 animate-fade-in">
                
                {/* Searchable FAQs */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
                  <div>
                    <h2 className="text-lg font-black text-gray-900">Frequently Asked Questions</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Quick answers to common campus trade and escrow questions</p>
                  </div>

                  <div className="space-y-3.5 pt-2">
                    {[
                      { 
                        q: "How does the UVEA Escrow system protect me?", 
                        a: "When a buyer pays for an item, the funds are held securely in the UVEA vault. Once the buyer confirms receipt of the item, the funds are released. If the buyer doesn't act within 48 hours of delivery confirmation, the funds are auto-released to the seller." 
                      },
                      { 
                        q: "What is the transaction fee for transactions?", 
                        a: "Sellers on the Free Plan are charged a +1.05% UVEA Escrow Fee per transaction. Sellers on any of the Premium Plans (Monthly, Semester, Full Session) pay 0.00% escrow transaction fees." 
                      },
                      { 
                        q: "How can I avoid getting account strikes?", 
                        a: "Ensure you only list real, active items in correct categories. Scam listings, trademark violation claims, or abusing the escrow release workflow will trigger administrative strikes. Accumulating 3 strikes results in a permanent ban." 
                      },
                      { 
                        q: "What should I do if a buyer/seller scams me?", 
                        a: "You can file a formal dispute under the active order inside the My Orders history page. Submit text explanations along with evidence images/recordings. An administrator will review and rule on the case." 
                      }
                    ].map((faq, i) => (
                      <div key={i} className="p-4 rounded-2xl border border-gray-100 bg-gray-50/30 space-y-1.5">
                        <p className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                          {faq.q}
                        </p>
                        <p className="text-[11px] text-gray-500 leading-relaxed pl-3">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit Support Ticket / Bug Report forms */}
                <div className="grid sm:grid-cols-2 gap-6">
                  
                  {/* Contact Support Ticket */}
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
                    <div>
                      <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">Submit Support Ticket</h3>
                      <p className="text-[10px] text-gray-400 mt-0.5">Open a formal request to our administrative staff</p>
                    </div>

                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const formEl = e.target;
                      const randomId = Math.floor(1000 + Math.random() * 9000);
                      addToast(`Support ticket #TKT-${randomId} created successfully`, 'success');
                      formEl.reset();
                    }} className="space-y-3">
                      <div>
                        <label className={labelCls}>Subject</label>
                        <input type="text" placeholder="Summary of issue" className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-gray-200 bg-gray-50 outline-none focus:border-blue-500 focus:bg-white" required />
                      </div>
                      <div>
                        <label className={labelCls}>Category</label>
                        <select className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-gray-200 bg-gray-50 outline-none focus:border-blue-500 focus:bg-white font-bold text-gray-600">
                          <option>Payment & Escrow Lock</option>
                          <option>Account Credentials</option>
                          <option>Listing Dispute</option>
                          <option>Other Feedback</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>Details</label>
                        <textarea rows={3} placeholder="Describe the issue in detail..." className="w-full p-3 rounded-xl text-xs border border-gray-200 bg-gray-50 outline-none resize-none focus:border-blue-500 focus:bg-white font-medium" required />
                      </div>
                      <button type="submit" className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] uppercase tracking-wider shadow-sm transition-colors">
                        Submit Ticket
                      </button>
                    </form>
                  </div>

                  {/* Bug Report */}
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
                    <div>
                      <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">Report Platform Bug</h3>
                      <p className="text-[10px] text-gray-400 mt-0.5">Report bugs to help improve REKTINA MARKET</p>
                    </div>

                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const formEl = e.target;
                      const randomId = Math.floor(100 + Math.random() * 900);
                      addToast(`Bug report #BUG-${randomId} submitted. Thank you!`, 'success');
                      formEl.reset();
                    }} className="space-y-3">
                      <div>
                        <label className={labelCls}>Bug Title</label>
                        <input type="text" placeholder="Short description of the bug" className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-gray-200 bg-gray-50 outline-none focus:border-blue-500 focus:bg-white" required />
                      </div>
                      <div>
                        <label className={labelCls}>Steps to Reproduce</label>
                        <textarea rows={6} placeholder="1. Go to page X&#10;2. Click on button Y&#10;3. See error Z..." className="w-full p-3 rounded-xl text-xs border border-gray-200 bg-gray-50 outline-none resize-none focus:border-blue-500 focus:bg-white font-mono" required />
                      </div>
                      <button type="submit" className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-950 text-white font-bold text-[10px] uppercase tracking-wider shadow-sm transition-colors">
                        Report Bug
                      </button>
                    </form>
                  </div>

                </div>

              </div>
            )}

            {/* Tab 4: Legal & Policies */}
            {activeTab === 'legal' && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-black text-gray-900">Platform Policies & Legal Agreements</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Read terms, guarantees, and legal guidelines governing our marketplace</p>
                </div>

                <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
                  <PolicyDocument />
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
