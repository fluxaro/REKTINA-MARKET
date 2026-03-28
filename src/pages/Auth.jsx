import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser, FiArrowRight, FiTrendingUp, FiShield, FiPackage, FiUsers } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import { apiLogin, apiSignup, apiMagicLink } from '../api/mockApi';

const PERKS = [
  { icon: FiShield,  text: 'Buyer protection on every order' },
  { icon: FiPackage, text: 'Track all your orders in one place' },
  { icon: FiUsers,   text: 'Chat directly with sellers' },
];

export default function Auth({ mode = 'login' }) {
  const { login, addToast } = useApp();
  const navigate = useNavigate();

  const [tab, setTab] = useState(mode);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('buyer');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [magicSent, setMagicSent] = useState(false);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (tab === 'magic') { await apiMagicLink(form.email); setMagicSent(true); return; }
      const user = tab === 'login'
        ? await apiLogin(form.email, form.password)
        : await apiSignup(form.name, form.email, form.password, role);
      login(user);
      navigate(user.role === 'seller' ? '/seller' : user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      addToast(err.message, 'error');
    } finally { setLoading(false); }
  };

  const inputCls = 'w-full pl-10 pr-4 py-3 rounded-xl text-sm border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:bg-white transition-all';

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-blue-700 via-blue-800 to-blue-950 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/5" />
          <div className="absolute top-1/2 -right-20 w-64 h-64 rounded-full bg-white/5" />
          <div className="absolute -bottom-10 left-1/3 w-48 h-48 rounded-full bg-white/5" />
        </div>
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2.5 mb-16">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <FiTrendingUp size={18} className="text-white" />
            </div>
            <div>
              <span className="font-black text-white text-lg">REKTINA</span>
              <span className="font-black text-blue-300 text-lg"> MARKET</span>
            </div>
          </Link>
          <h2 className="text-4xl font-black text-white leading-tight mb-4">
            Nigeria's most trusted marketplace
          </h2>
          <p className="text-blue-200 text-base leading-relaxed mb-10">
            Shop from thousands of verified sellers. Fast delivery, secure payments, and buyer protection on every order.
          </p>
          <div className="space-y-4">
            {PERKS.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                  <Icon size={15} className="text-white" />
                </div>
                <p className="text-blue-100 text-sm">{text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 grid grid-cols-3 gap-3">
          {[['20k+', 'Products'], ['5k+', 'Sellers'], ['16k+', 'Buyers']].map(([val, label]) => (
            <div key={label} className="bg-white/10 rounded-2xl p-4 text-center backdrop-blur-sm">
              <p className="text-2xl font-black text-white">{val}</p>
              <p className="text-blue-200 text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
              <FiTrendingUp size={16} className="text-white" />
            </div>
            <span className="font-black text-gray-900">REKTINA <span className="text-blue-600">MARKET</span></span>
          </Link>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            {/* Tabs */}
            <div className="flex rounded-xl bg-gray-100 p-1 mb-7">
              {[['login', 'Sign In'], ['register', 'Register'], ['magic', 'Magic Link']].map(([v, l]) => (
                <button key={v} onClick={() => { setTab(v); setMagicSent(false); }}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${tab === v ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                  {l}
                </button>
              ))}
            </div>

            {magicSent ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
                  <FiMail size={28} className="text-blue-600" />
                </div>
                <h2 className="font-black text-lg text-gray-900 mb-2">Check your inbox</h2>
                <p className="text-gray-400 text-sm">We sent a magic link to <span className="text-blue-600 font-semibold">{form.email}</span></p>
                <button onClick={() => setMagicSent(false)} className="mt-5 text-sm text-gray-400 hover:text-blue-600 transition-colors">Try again</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="mb-5">
                  <h2 className="text-2xl font-black text-gray-900 mb-1">
                    {tab === 'login' ? 'Welcome back' : tab === 'register' ? 'Create account' : 'Passwordless login'}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {tab === 'login' ? 'Sign in to your Rektina account' : tab === 'register' ? 'Join Rektina Market today' : 'Get a secure link in your inbox'}
                  </p>
                </div>

                {tab === 'register' && (
                  <div className="relative">
                    <FiUser size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" value={form.name} onChange={set('name')} placeholder="Full name" required className={inputCls} />
                  </div>
                )}

                <div className="relative">
                  <FiMail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" value={form.email} onChange={set('email')} placeholder="Email address" required className={inputCls} />
                </div>

                {tab !== 'magic' && (
                  <div className="relative">
                    <FiLock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type={showPass ? 'text' : 'password'} value={form.password} onChange={set('password')}
                      placeholder="Password" required minLength={6} className={`${inputCls} pr-10`} />
                    <button type="button" onClick={() => setShowPass(s => !s)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                      {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                    </button>
                  </div>
                )}

                {tab === 'register' && (
                  <div>
                    <p className="text-xs text-gray-400 mb-2 font-medium">Account type</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[['buyer', FiPackage, 'Buy Products'], ['seller', FiTrendingUp, 'Sell Products']].map(([v, Icon, l]) => (
                        <button key={v} type="button" onClick={() => setRole(v)}
                          className={`flex items-center gap-2 py-3 px-4 rounded-xl border-2 text-sm transition-all font-semibold ${role === v ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                          <Icon size={15} /> {l}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button type="submit" disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-60 transition-all hover:scale-[1.01] shadow-md hover:shadow-blue-200">
                  {loading ? 'Please wait...' : tab === 'login' ? 'Sign In' : tab === 'register' ? 'Create Account' : 'Send Magic Link'}
                  {!loading && <FiArrowRight size={16} />}
                </button>

                <div className="relative my-1">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                  <div className="relative flex justify-center"><span className="px-3 text-xs bg-white text-gray-400">or continue with</span></div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[['G', 'Google', 'border-gray-200 text-gray-600 hover:bg-gray-50'], ['f', 'Facebook', 'border-gray-200 text-blue-600 hover:bg-blue-50']].map(([icon, name, cls]) => (
                    <button key={name} type="button" onClick={() => addToast(`${name} login coming soon`, 'info')}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${cls}`}>
                      <span className="font-black">{icon}</span> {name}
                    </button>
                  ))}
                </div>

                <p className="text-center text-sm text-gray-400">
                  {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
                  <button type="button" onClick={() => setTab(tab === 'login' ? 'register' : 'login')} className="text-blue-600 hover:underline font-semibold">
                    {tab === 'login' ? 'Register' : 'Sign In'}
                  </button>
                </p>

                {tab === 'login' && (
                  <p className="text-center text-xs text-gray-400 bg-gray-50 rounded-xl p-3">
                    Demo: <span className="text-blue-600 font-semibold">admin@test.com</span> · <span className="text-blue-600 font-semibold">seller@test.com</span>
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
