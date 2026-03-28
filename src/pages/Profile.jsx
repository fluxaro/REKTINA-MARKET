import { useState } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiSave, FiCamera, FiPackage, FiHeart, FiSettings } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Profile() {
  const { user, addToast } = useApp();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    bio: '',
  });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    addToast('Profile updated successfully');
  };

  const inputCls = 'w-full pl-10 pr-4 py-3 rounded-xl text-sm border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:bg-white transition-colors';

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left sidebar */}
          <div className="space-y-4">
            {/* Avatar card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
              <div className="relative inline-block mb-4">
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
                  <span className="text-blue-600 font-bold text-3xl">{user?.name?.[0]?.toUpperCase()}</span>
                </div>
                <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-sm hover:bg-blue-700 transition-colors">
                  <FiCamera size={12} />
                </button>
              </div>
              <p className="font-bold text-gray-900">{user?.name}</p>
              <p className="text-sm text-gray-400 capitalize mt-0.5">{user?.role} account</p>
              <span className="inline-block mt-2 px-3 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">Verified</span>
            </div>

            {/* Quick links */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {[
                [FiPackage, 'My Orders', '/orders'],
                [FiHeart, 'Wishlist', '/products'],
                [FiSettings, 'Settings', '#'],
              ].map(([Icon, label, to]) => (
                <Link key={label} to={to} className="flex items-center gap-3 px-5 py-3.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors border-b border-gray-50 last:border-0">
                  <Icon size={16} /> {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Main form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-gray-900 mb-5">Personal Information</h2>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 mb-1.5 block">Full Name</label>
                    <div className="relative">
                      <FiUser size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputCls} placeholder="Full name" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1.5 block">Email</label>
                    <div className="relative">
                      <FiMail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={inputCls} placeholder="Email" type="email" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1.5 block">Phone</label>
                    <div className="relative">
                      <FiPhone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className={inputCls} placeholder="+234 800 000 0000" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1.5 block">Address</label>
                    <div className="relative">
                      <FiMapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className={inputCls} placeholder="Your address" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Bio</label>
                  <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} rows={3} placeholder="Tell us about yourself..."
                    className="w-full px-4 py-3 rounded-xl text-sm border border-gray-200 bg-gray-50 text-gray-900 outline-none resize-none focus:border-blue-500 focus:bg-white transition-colors" />
                </div>
                <button type="submit" disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm disabled:opacity-60 transition-all hover:scale-[1.02]">
                  <FiSave size={15} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
