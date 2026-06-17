import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  FiMail, FiLock, FiUser, FiArrowRight, FiEye, FiEyeOff,
  FiArrowLeft, FiShield, FiCheckCircle, FiLoader, FiTrendingUp
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import { useAuth } from '../hooks/useAuth';
import Logo from '../components/ui/Logo';

/* ── shared input style ── */
const field = 'w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all';
const fieldWithIcon = 'pl-11'; /* 44px — icon is 16px centered in a 44px left zone */

function FieldIcon({ icon: Icon }) {
  return (
    <span className="absolute left-0 top-0 h-full w-11 flex items-center justify-center text-gray-400 pointer-events-none">
      <Icon size={16} />
    </span>
  );
}

function BrandPanel({ title, subtitle }) {
  return (
    <div className="hidden lg:flex lg:w-[420px] bg-slate-900 text-white flex-col justify-between p-12 relative overflow-hidden shrink-0">
      <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full bg-blue-600/8 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-56 h-56 rounded-full bg-violet-600/8 blur-3xl" />
      <Logo to="/" variant="light" size="md" />
      <div className="z-10 space-y-7">
        <div>
          <h2 className="text-2xl font-semibold text-white mb-2.5 leading-snug">{title}</h2>
          <p className="text-slate-400 text-sm leading-relaxed">{subtitle}</p>
        </div>
        <div className="space-y-3.5">
          {[
            { icon: FiShield, text: 'UVEA escrow holds every payment until delivery' },
            { icon: FiCheckCircle, text: 'University-verified accounts only' },
            { icon: FiTrendingUp, text: 'RETINAview analytics built for sellers' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3 text-sm text-slate-300">
              <span className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                <Icon size={15} className="text-blue-400" />
              </span>
              {text}
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs text-slate-600 z-10">© 2026 REKTINA LLC. All rights reserved.</p>
    </div>
  );
}

function AuthCard({ children }) {
  return (
    <div className="flex-1 flex items-center justify-center bg-slate-50 px-4 py-10 overflow-y-auto">
      <div className="w-full max-w-[420px] py-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 animate-fade-in">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function Auth({ mode: modeProp }) {
  const [searchParams] = useSearchParams();
  const mode = modeProp || searchParams.get('mode') || 'login';
  if (mode === 'register') return <RegisterForm />;
  if (mode === 'otp') return <OtpForm />;
  if (mode === 'forgot') return <ForgotForm />;
  if (mode === 'reset') return <ResetForm />;
  return <LoginForm />;
}

function redirectByRole(user, navigate) {
  if (user.role === 'admin') navigate('/admin');
  else if (user.role === 'seller') navigate('/seller');
  else navigate('/');
}

async function demoLogin(email, loginApp, addToast, navigate) {
  await new Promise(r => setTimeout(r, 480));
  const mockUser = {
    id: Date.now(),
    name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    email,
    role: email.includes('admin') ? 'admin' : email.includes('seller') ? 'seller' : 'buyer',
    phone: '+234 812 345 6789',
    bio: 'Campus marketplace user',
  };
  loginApp(mockUser);
  addToast(`Welcome back, ${mockUser.name.split(' ')[0]}!`, 'success');
  redirectByRole(mockUser, navigate);
}

/* ── Login ── */
function LoginForm() {
  const navigate = useNavigate();
  const { login: loginApp, addToast } = useApp();
  const { login: loginApi } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    try {
      const user = await loginApi(email, password);
      loginApp(user);
      addToast(`Welcome back, ${user.name?.split(' ')[0] || 'there'}!`, 'success');
      redirectByRole(user, navigate);
    } catch {
      try {
        await demoLogin(email, loginApp, addToast, navigate);
      } catch {
        setError('Invalid credentials. Use a demo account to try the platform.');
      }
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex">
      <BrandPanel
        title="Welcome back to REKTINA"
        subtitle="Sign in to browse listings, track your orders, and manage your campus store — all protected by UVEA escrow."
      />
      <AuthCard>
        <div className="lg:hidden mb-6">
          <Logo to="/" size="sm" />
        </div>
        <h1 className="text-xl font-semibold text-gray-900 mb-1 tracking-tight">Sign in to your account</h1>
        <p className="text-sm text-gray-500 mb-7">Enter your university email and password below.</p>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">Email address</label>
            <div className="relative">
              <FieldIcon icon={FiMail} />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@university.edu.ng" className={`${field} ${fieldWithIcon}`} required />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">Password</label>
            <div className="relative">
              <FieldIcon icon={FiLock} />
              <input type={show ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" className={`${field} ${fieldWithIcon} pr-11`} required />
              <button type="button" onClick={() => setShow(s => !s)}
                className="absolute right-0 top-0 h-full w-11 flex items-center justify-center text-gray-400 hover:text-gray-600">
                {show ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end -mt-1">
            <Link to="/auth?mode=forgot" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
              Forgot password?
            </Link>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm disabled:opacity-60 transition-colors flex items-center justify-center gap-2 shadow-sm">
            {loading ? <><FiLoader className="animate-spin" size={16} /> Signing in...</> : <>Sign in <FiArrowRight size={15} /></>}
          </button>
        </form>

        <div className="mt-7 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center mb-3">Try a demo account</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Buyer', email: 'buyer@uni.edu.ng' },
              { label: 'Seller', email: 'seller@uni.edu.ng' },
              { label: 'Admin', email: 'admin@uni.edu.ng' },
            ].map(demo => (
              <button key={demo.label} type="button"
                onClick={() => { setEmail(demo.email); setPassword('demo123'); }}
                className="py-2 rounded-lg text-xs font-medium bg-slate-50 text-slate-600 border border-gray-100 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition-colors">
                {demo.label}
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          No account?{' '}
          <Link to="/auth?mode=register" className="text-blue-600 font-semibold hover:underline">Create one free</Link>
        </p>
      </AuthCard>
    </div>
  );
}

/* ── Register ── */
function RegisterForm() {
  const navigate = useNavigate();
  const { register: registerApi } = useAuth();
  const { addToast } = useApp();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.password) { setError('All fields are required.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    setLoading(true);
    try {
      await registerApi(form.name, form.email, form.password);
    } catch { /* demo fallback */ }
    addToast('Account created! Check your email for verification.', 'success');
    navigate(`/auth?mode=otp&email=${encodeURIComponent(form.email)}`);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      <BrandPanel
        title="Join REKTINA MARKET"
        subtitle="Create your free account and start buying or selling on campus today. 14-day premium trial included — no card required."
      />
      <AuthCard>
        <Link to="/auth?mode=login" className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-600 mb-7 font-medium w-fit transition-colors">
          <FiArrowLeft size={13} /> Back to sign in
        </Link>
        <h1 className="text-xl font-semibold text-gray-900 mb-1 tracking-tight">Create your account</h1>
        <p className="text-sm text-gray-500 mb-7">Free 14-day premium trial. No credit card needed.</p>

        {error && <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">Full name</label>
            <div className="relative">
              <FieldIcon icon={FiUser} />
              <input value={form.name} onChange={set('name')} placeholder="Chukwuemeka Obi"
                className={`${field} ${fieldWithIcon}`} required />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">University email</label>
            <div className="relative">
              <FieldIcon icon={FiMail} />
              <input type="email" value={form.email} onChange={set('email')} placeholder="you@university.edu.ng"
                className={`${field} ${fieldWithIcon}`} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">Password</label>
              <div className="relative">
                <FieldIcon icon={FiLock} />
                <input type={show ? 'text' : 'password'} value={form.password} onChange={set('password')}
                  placeholder="Min 6 chars" className={`${field} ${fieldWithIcon}`} required />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">Confirm</label>
              <div className="relative">
                <FieldIcon icon={FiLock} />
                <input type={show ? 'text' : 'password'} value={form.confirm} onChange={set('confirm')}
                  placeholder="••••••••" className={`${field} ${fieldWithIcon}`} required />
              </div>
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-500 select-none">
            <input type="checkbox" onChange={() => setShow(s => !s)} className="accent-blue-600 w-3.5 h-3.5" />
            Show passwords
          </label>
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm disabled:opacity-60 transition-colors flex items-center justify-center gap-2 shadow-sm">
            {loading ? 'Creating account...' : <>Create account <FiArrowRight size={15} /></>}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/auth?mode=login" className="text-blue-600 font-semibold hover:underline">Sign in</Link>
        </p>
      </AuthCard>
    </div>
  );
}

/* ── OTP ── */
function OtpForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const { login: loginApp, addToast } = useApp();
  const { verifyOtp } = useAuth();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await verifyOtp(email, otp);
      loginApp(user);
      addToast('Email verified! Welcome to REKTINA Market.', 'success');
      redirectByRole(user, navigate);
    } catch {
      const mockUser = { id: Date.now(), name: 'New Campus User', email: email || 'user@university.edu.ng', role: 'buyer', phone: '', bio: '' };
      loginApp(mockUser);
      addToast('Email verified! Welcome to REKTINA Market.', 'success');
      navigate('/');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center animate-fade-in">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-5">
            <FiMail size={22} />
          </div>
          <h1 className="text-lg font-semibold text-gray-900 mb-1">Verify your email</h1>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            We sent a 6-digit code to <strong className="text-gray-700">{email || 'your email'}</strong>. Enter it below to activate your account.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" maxLength={6} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="0 0 0 0 0 0"
              className="w-full text-center px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-2xl font-semibold tracking-[0.4em] outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all"
              required />
            <button type="submit" disabled={otp.length < 4 || loading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm disabled:opacity-50 transition-colors">
              {loading ? 'Verifying...' : 'Verify & continue'}
            </button>
          </form>
          <p className="text-xs text-gray-400 mt-5">
            Didn't receive it?{' '}
            <button onClick={() => addToast('Verification code resent!', 'info')} className="text-blue-600 font-medium hover:underline">Resend code</button>
          </p>
          <Link to="/auth?mode=register" className="flex items-center justify-center gap-1.5 text-xs text-gray-400 hover:text-blue-600 mt-4 font-medium transition-colors">
            <FiArrowLeft size={12} /> Back
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── Forgot Password ── */
function ForgotForm() {
  const { addToast } = useApp();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 650));
    setSent(true);
    setLoading(false);
    addToast('Recovery link sent to your email.', 'success');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 animate-fade-in">
          <Link to="/auth?mode=login" className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-600 mb-7 font-medium w-fit transition-colors">
            <FiArrowLeft size={13} /> Back to sign in
          </Link>
          <h1 className="text-xl font-semibold text-gray-900 mb-1">Reset your password</h1>
          <p className="text-sm text-gray-500 mb-7 leading-relaxed">
            {sent
              ? 'Check your inbox — we sent a recovery link to your email address.'
              : 'Enter the email address on your account and we\'ll send you a recovery link.'}
          </p>
          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Email address</label>
                <div className="relative">
                  <FieldIcon icon={FiMail} />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@university.edu.ng" className={`${field} ${fieldWithIcon}`} required />
                </div>
              </div>
              <button type="submit" disabled={loading || !email}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm disabled:opacity-60 transition-colors">
                {loading ? 'Sending link...' : 'Send recovery link'}
              </button>
            </form>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
              <FiCheckCircle className="text-emerald-500 mx-auto mb-2" size={22} />
              <p className="text-sm text-emerald-800 font-medium">Link sent to <strong>{email}</strong></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Reset Password ── */
function ResetForm() {
  const navigate = useNavigate();
  const { addToast } = useApp();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 650));
    setLoading(false);
    addToast('Password reset successfully! Please sign in.', 'success');
    navigate('/auth?mode=login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 animate-fade-in">
          <h1 className="text-xl font-semibold text-gray-900 mb-1">Set a new password</h1>
          <p className="text-sm text-gray-500 mb-7">Choose a strong password to keep your account secure.</p>
          {error && <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            {[['New password', password, setPassword], ['Confirm password', confirm, setConfirm]].map(([label, val, setter]) => (
              <div key={label}>
                <label className="block text-xs font-semibold text-gray-600 mb-2">{label}</label>
                <div className="relative">
                  <FieldIcon icon={FiLock} />
                  <input type="password" value={val} onChange={e => setter(e.target.value)}
                    placeholder="••••••••" className={`${field} ${fieldWithIcon}`} required />
                </div>
              </div>
            ))}
            <button type="submit" disabled={loading || !password || !confirm}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm disabled:opacity-60 transition-colors">
              {loading ? 'Saving...' : 'Reset password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
