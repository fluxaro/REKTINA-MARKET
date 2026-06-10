import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiEye, FiEyeOff, FiMail, FiLock, FiUser, FiArrowRight, 
  FiTrendingUp, FiShield, FiPackage, FiUsers, FiCheckCircle, 
  FiClock, FiAlertCircle, FiChevronRight, FiGift
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import { apiLogin, apiSignup } from '../api/mockApi';
import PolicyDocument from '../components/ui/PolicyDocument';
import Modal from '../components/ui/Modal';

const ONBOARDING_SLIDES = [
  {
    title: 'Secure UVEA Escrow Protection',
    description: 'Every transaction is protected by Rektina escrow. Funds are only released when you confirm receipt or after the 48h auto-release timer.',
    icon: FiShield,
    color: 'from-blue-600 to-indigo-600',
    lightColor: 'bg-blue-50 text-blue-600',
  },
  {
    title: 'Advanced RETINAview Analytics',
    description: 'Sellers get institutional-grade monthly metrics, repeat buyer rates, AI-driven recommendations, and payout status trackers.',
    icon: FiTrendingUp,
    color: 'from-purple-600 to-pink-600',
    lightColor: 'bg-purple-50 text-purple-600',
  },
  {
    title: 'Earn with Referral Rewards',
    description: 'Invite your peers with your custom referral code. Claim a free week of Premium subscription for every 4 completed signups.',
    icon: FiGift,
    color: 'from-emerald-500 to-teal-600',
    lightColor: 'bg-emerald-50 text-emerald-600',
  },
];

export default function Auth({ mode = 'login' }) {
  const { login, addToast } = useApp();
  const navigate = useNavigate();

  // Unified dynamic view state: 'splash' | 'login' | 'register' | 'forgot' | 'verify' | 'onboarding'
  const [view, setView] = useState('splash');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Registration Wizard states
  const [registerStep, setRegisterStep] = useState(1); // 1 = credentials, 2 = role select
  const [role, setRole] = useState('buyer');

  // Forms
  const [form, setForm] = useState({ name: '', email: '', password: '', rememberMe: false });
  const [verifyCode, setVerifyCode] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);

  // Forgot password states
  const [forgotStep, setForgotStep] = useState(1); // 1 = request, 2 = input code & new pass
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Onboarding states
  const [slideIdx, setSlideIdx] = useState(0);

  // Splash Screen timer (1.5s)
  useEffect(() => {
    const t = setTimeout(() => {
      setView(mode);
    }, 1500);
    return () => clearTimeout(t);
  }, [mode]);

  // Verification timer
  useEffect(() => {
    let t;
    if (view === 'verify' && timer > 0) {
      t = setInterval(() => setTimer(v => v - 1), 1000);
    }
    return () => clearInterval(t);
  }, [view, timer]);

  const handleChange = k => e => setForm(f => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  // Handle Log In
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await apiLogin(form.email, form.password);
      login(user);
      // If remember me is checked, save login logic
      if (form.rememberMe) {
        localStorage.setItem('remembered_email', form.email);
      } else {
        localStorage.removeItem('remembered_email');
      }
      setView('onboarding');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle Sign Up
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!form.email.endsWith('.edu') && !form.email.includes('university') && !form.email.includes('test')) {
      addToast('Please use a valid university (.edu) email address', 'error');
      return;
    }
    if (!agreed) {
      addToast('You must agree to the Pricing, Policy & Privacy Document to register', 'error');
      return;
    }
    setRegisterStep(2); // Move to role selection
  };

  const handleRoleSelection = () => {
    // Proceed to Email Verification step
    setView('verify');
    setTimer(60);
  };

  // Handle Verification
  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    const code = verifyCode.join('');
    if (code.length < 4) {
      addToast('Please enter the full 4-digit verification code', 'error');
      return;
    }
    setLoading(true);
    try {
      // Create user
      const user = await apiSignup(form.name || form.email.split('@')[0], form.email, form.password, role);
      login(user);
      setShowTrialModal(true); // Trigger Trial Modal overlay
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = () => {
    setTimer(60);
    addToast('New verification code sent to your email', 'info');
  };

  // Handle Forgot Password
  const handleForgotRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 800)); // mock api call
      setForgotStep(2);
      addToast('Password reset code sent successfully', 'success');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotReset = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      addToast('Password must be at least 6 characters long', 'error');
      return;
    }
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 800)); // mock reset api
      addToast('Password reset successful. Please login.', 'success');
      setView('login');
      setForgotStep(1);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFinishOnboarding = () => {
    const activeUser = JSON.parse(localStorage.getItem('user'));
    if (activeUser?.role === 'seller') {
      navigate('/seller');
    } else if (activeUser?.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  const inputCls = 'w-full pl-10 pr-4 py-3 rounded-xl text-sm border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:bg-white transition-all duration-200 shadow-inner-sm';

  // Render Splash
  if (view === 'splash') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />

        <div className="relative z-10 flex flex-col items-center text-center px-4">
          <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 mb-6 animate-bounce">
            <FiTrendingUp size={44} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
            REKTINA <span className="text-blue-500">MARKET</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-sm tracking-wide">
            Secure College Escrow & Peer Marketplace
          </p>
          <div className="mt-8 flex gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0.3s' }} />
            <div className="w-2.5 h-2.5 rounded-full bg-blue-300 animate-bounce" style={{ animationDelay: '0.5s' }} />
          </div>
        </div>
      </div>
    );
  }

  // Render Onboarding Carousel
  if (view === 'onboarding') {
    const slide = ONBOARDING_SLIDES[slideIdx];
    const SlideIcon = slide.icon;
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl max-w-lg w-full overflow-hidden flex flex-col">
          {/* Top visual banner */}
          <div className={`p-8 bg-gradient-to-br ${slide.color} flex flex-col items-center justify-center text-white h-48 transition-all duration-500`}>
            <div className="w-16 h-16 rounded-2xl bg-white/25 flex items-center justify-center mb-4 backdrop-blur-md">
              <SlideIcon size={32} />
            </div>
            <h3 className="font-black text-lg text-center">{slide.title}</h3>
          </div>
          {/* Description */}
          <div className="p-8 flex-1 flex flex-col justify-between">
            <p className="text-gray-600 text-center leading-relaxed text-sm md:text-base">
              {slide.description}
            </p>

            <div className="mt-8 space-y-6">
              {/* Pagination Dots */}
              <div className="flex justify-center gap-2">
                {ONBOARDING_SLIDES.map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setSlideIdx(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${i === slideIdx ? 'w-8 bg-blue-600' : 'w-2 bg-gray-200'}`}
                  />
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleFinishOnboarding}
                  className="flex-1 py-3.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  Skip
                </button>
                {slideIdx < ONBOARDING_SLIDES.length - 1 ? (
                  <button 
                    onClick={() => setSlideIdx(v => v + 1)}
                    className="flex-1 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-100"
                  >
                    Next <FiChevronRight size={16} />
                  </button>
                ) : (
                  <button 
                    onClick={handleFinishOnboarding}
                    className="flex-1 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-100 animate-pulse"
                  >
                    Get Started <FiCheckCircle size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* Visual side panel (Desktop) */}
      <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-blue-700 via-blue-800 to-blue-950 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white border border-white" />
          <div className="absolute top-1/2 -right-20 w-64 h-64 rounded-full bg-white border border-white" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-16">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shadow-lg backdrop-blur-md">
              <FiTrendingUp size={20} className="text-white" />
            </div>
            <div>
              <span className="font-black text-white text-lg tracking-wide">REKTINA</span>
              <span className="font-black text-blue-300 text-lg tracking-wide"> MARKET</span>
            </div>
          </div>
          
          <h2 className="text-4xl font-black text-white leading-tight mb-4">
            Unified College Escrow Network
          </h2>
          <p className="text-blue-100 text-sm leading-relaxed mb-10 max-w-sm">
            Fast payment checkout, integrated disputes tracking, automated escrow release thresholds, and monthly shop analytics.
          </p>

          <div className="space-y-4">
            {[
              { icon: FiShield, text: 'UVEA secure escrow lock-in protection' },
              { icon: FiPackage, text: 'Single checkout for payments and orders' },
              { icon: FiUsers, text: 'Direct messaging and verified reviews' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 backdrop-blur-sm">
                  <Icon size={14} className="text-white" />
                </div>
                <p className="text-blue-200 text-xs font-semibold">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-3">
          {[['1.05%', 'Escrow Fee'], ['48 Hours', 'Auto-Release'], ['100%', 'Safe Trades']].map(([val, label]) => (
            <div key={label} className="bg-white/10 rounded-2xl p-4 text-center backdrop-blur-sm border border-white/10">
              <p className="text-lg font-black text-white">{val}</p>
              <p className="text-blue-200 text-[10px] uppercase font-bold tracking-wider mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Form Area */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Logo (Mobile Only) */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden justify-center">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <FiTrendingUp size={18} />
            </div>
            <span className="font-black text-gray-900 tracking-tight">REKTINA <span className="text-blue-600">MARKET</span></span>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 transition-all duration-300">
            {/* View tabs */}
            {(view === 'login' || view === 'register') && (
              <div className="flex rounded-2xl bg-gray-100 p-1.5 mb-8">
                {[['login', 'Sign In'], ['register', 'Register']].map(([v, l]) => (
                  <button key={v} onClick={() => { setView(v); setRegisterStep(1); }}
                    className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 ${view === v ? 'bg-white text-blue-600 shadow-md shadow-slate-200' : 'text-gray-400 hover:text-gray-700'}`}>
                    {l}
                  </button>
                ))}
              </div>
            )}

            {/* LOGIN VIEW */}
            {view === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="mb-6">
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight">Welcome Back</h3>
                  <p className="text-xs text-gray-400 mt-1">Access your peer marketplace account</p>
                </div>

                <div className="relative">
                  <FiMail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" value={form.email} onChange={handleChange('email')} placeholder="University email" required className={inputCls} />
                </div>

                <div className="relative">
                  <FiLock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type={showPass ? 'text' : 'password'} value={form.password} onChange={handleChange('password')}
                    placeholder="Password" required className={`${inputCls} pr-10`} />
                  <button type="button" onClick={() => setShowPass(s => !s)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                  </button>
                </div>

                <div className="flex items-center justify-between py-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.rememberMe} onChange={handleChange('rememberMe')} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4" />
                    <span className="text-xs text-gray-500 font-semibold select-none">Remember me</span>
                  </label>
                  <button type="button" onClick={() => { setView('forgot'); setForgotStep(1); }} className="text-xs text-blue-600 hover:underline font-bold">
                    Forgot Password?
                  </button>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-60 transition-all hover:scale-[1.01] shadow-lg shadow-blue-500/10">
                  {loading ? 'Please wait...' : 'Sign In'}
                  {!loading && <FiArrowRight size={16} />}
                </button>

                <p className="text-center text-xs text-gray-400 bg-slate-50 rounded-2xl p-4 mt-6">
                  Demo Accounts:<br />
                  Seller: <span className="text-blue-600 font-bold">seller@test.com</span> · Pass: <span className="text-blue-600 font-bold">123456</span><br/>
                  Admin: <span className="text-blue-600 font-bold">admin@test.com</span> · Pass: <span className="text-blue-600 font-bold">123456</span>
                </p>
              </form>
            )}

            {/* REGISTER WIZARD VIEW */}
            {view === 'register' && (
              <div>
                {/* Steps Indicator */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Step {registerStep} of 2</span>
                  <div className="flex gap-1.5">
                    <div className={`w-6 h-1 rounded-full ${registerStep >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`} />
                    <div className={`w-6 h-1 rounded-full ${registerStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
                  </div>
                </div>

                {registerStep === 1 ? (
                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    <div className="mb-6">
                      <h3 className="text-2xl font-black text-gray-900 tracking-tight">Create Account</h3>
                      <p className="text-xs text-gray-400 mt-1">Join the campus buyer & seller hub</p>
                    </div>

                    <div className="relative">
                      <FiUser size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" value={form.name} onChange={handleChange('name')} placeholder="Full name" required className={inputCls} />
                    </div>

                    <div className="relative">
                      <FiMail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="email" value={form.email} onChange={handleChange('email')} placeholder="University email (.edu)" required className={inputCls} />
                    </div>

                    <div className="relative">
                      <FiLock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type={showPass ? 'text' : 'password'} value={form.password} onChange={handleChange('password')}
                        placeholder="Password (min 6 chars)" required minLength={6} className={`${inputCls} pr-10`} />
                      <button type="button" onClick={() => setShowPass(s => !s)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                        {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                      </button>
                    </div>

                    <div className="flex items-start gap-2.5 py-1">
                      <input 
                        type="checkbox" 
                        id="agreed-policy"
                        checked={agreed} 
                        onChange={e => setAgreed(e.target.checked)} 
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4 mt-0.5 cursor-pointer" 
                      />
                      <label htmlFor="agreed-policy" className="text-xs text-gray-500 leading-normal select-none cursor-pointer">
                        I have read and agree to the{' '}
                        <button 
                          type="button" 
                          onClick={() => setShowPolicyModal(true)} 
                          className="text-blue-600 font-bold hover:underline inline"
                        >
                          Pricing, Policy & Privacy Document
                        </button>
                      </label>
                    </div>

                    <button type="submit"
                      className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.01] shadow-lg shadow-blue-500/10">
                      Continue to Role Select <FiChevronRight size={16} />
                    </button>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-black text-gray-900 tracking-tight">Select Account Role</h3>
                      <p className="text-xs text-gray-400 mt-1">How do you plan to use Rektina Market?</p>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {[
                        { id: 'buyer', icon: FiPackage, label: 'Buyer Account', desc: 'Browse products, order items securely, track escrow shipments, and review local sellers.' },
                        { id: 'seller', icon: FiTrendingUp, label: 'Seller Account', desc: 'List items, manage inventory, view shop visitor conversion rates, and get monthly analytics.' }
                      ].map(opt => (
                        <button 
                          key={opt.id} 
                          type="button" 
                          onClick={() => setRole(opt.id)}
                          className={`flex items-start gap-4 p-4 rounded-2xl border-2 text-left transition-all ${role === opt.id ? 'border-blue-600 bg-blue-50/50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${role === opt.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                            <opt.icon size={20} />
                          </div>
                          <div>
                            <p className={`font-bold text-sm ${role === opt.id ? 'text-blue-600' : 'text-gray-900'}`}>{opt.label}</p>
                            <p className="text-gray-400 text-xs mt-1 leading-relaxed">{opt.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-3 mt-8">
                      <button 
                        type="button" 
                        onClick={() => setRegisterStep(1)} 
                        className="flex-1 py-3.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                      >
                        Back
                      </button>
                      <button 
                        type="button" 
                        onClick={handleRoleSelection} 
                        className="flex-1 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/10"
                      >
                        Verify Email <FiArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* EMAIL VERIFICATION STATE */}
            {view === 'verify' && (
              <form onSubmit={handleVerifySubmit} className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
                    <FiClock size={28} className="animate-spin" style={{ animationDuration: '4s' }} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight">Verify Email</h3>
                  <p className="text-xs text-gray-400 mt-1">We sent a 4-digit code to <span className="font-semibold text-gray-700">{form.email}</span></p>
                </div>

                <div className="flex justify-center gap-3">
                  {verifyCode.map((val, idx) => (
                    <input 
                      key={idx}
                      id={`code-${idx}`}
                      type="text" 
                      maxLength={1}
                      value={val}
                      onChange={e => {
                        const nextVal = e.target.value;
                        setVerifyCode(curr => {
                          const copy = [...curr];
                          copy[idx] = nextVal;
                          return copy;
                        });
                        if (nextVal !== '' && idx < 3) {
                          document.getElementById(`code-${idx + 1}`)?.focus();
                        }
                      }}
                      onKeyDown={e => {
                        if (e.key === 'Backspace' && val === '' && idx > 0) {
                          document.getElementById(`code-${idx - 1}`)?.focus();
                        }
                      }}
                      className="w-14 h-14 text-center text-xl font-bold bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all"
                    />
                  ))}
                </div>

                <div className="text-center text-xs">
                  {timer > 0 ? (
                    <p className="text-gray-400 font-medium">Resend code in <span className="text-blue-600 font-bold">{timer}s</span></p>
                  ) : (
                    <button type="button" onClick={handleResendCode} className="text-blue-600 font-bold hover:underline">
                      Resend Verification Code
                    </button>
                  )}
                </div>

                <button type="submit" disabled={loading}
                  className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-60 transition-all shadow-lg shadow-blue-500/10">
                  {loading ? 'Verifying...' : 'Complete Verification'}
                  {!loading && <FiCheckCircle size={16} />}
                </button>
              </form>
            )}

            {/* FORGOT PASSWORD INLINE RESET */}
            {view === 'forgot' && (
              <div>
                <div className="mb-6">
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight">Reset Password</h3>
                  <p className="text-xs text-gray-400 mt-1">Recover your locked campus profile</p>
                </div>

                {forgotStep === 1 ? (
                  <form onSubmit={handleForgotRequest} className="space-y-4">
                    <div className="relative">
                      <FiMail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="email" 
                        value={forgotEmail} 
                        onChange={e => setForgotEmail(e.target.value)} 
                        placeholder="Enter email address" 
                        required 
                        className={inputCls} 
                      />
                    </div>

                    <div className="flex gap-2">
                      <button 
                        type="button" 
                        onClick={() => setView('login')} 
                        className="flex-1 py-3.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        disabled={loading}
                        className="flex-1 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/10"
                      >
                        {loading ? 'Please wait...' : 'Send Code'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleForgotReset} className="space-y-4">
                    <div className="relative">
                      <FiLock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" 
                        value={resetCode} 
                        onChange={e => setResetCode(e.target.value)} 
                        placeholder="Verification code (e.g. 1234)" 
                        required 
                        className={inputCls} 
                      />
                    </div>

                    <div className="relative">
                      <FiLock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="password" 
                        value={newPassword} 
                        onChange={e => setNewPassword(e.target.value)} 
                        placeholder="New Password" 
                        required 
                        className={inputCls} 
                      />
                    </div>

                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/10"
                    >
                      {loading ? 'Resetting...' : 'Save New Password'}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Policy Modal Overlay */}
      <Modal open={showPolicyModal} onClose={() => setShowPolicyModal(false)} title="Pricing & Policy Document" size="max-w-2xl">
        <div className="max-h-[70vh] overflow-y-auto pr-1">
          <PolicyDocument />
        </div>
      </Modal>

      {/* Free Trial Modal Overlay */}
      {showTrialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl p-8 max-w-sm w-full text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-4">
              <FiGift size={32} />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">Free Trial Activated!</h3>
            <p className="text-gray-500 text-xs leading-relaxed mb-6">
              Congratulations! Your email has been verified. We have automatically activated your <strong>14-Day Premium Trial</strong> with full visibility and zero UVEA escrow fees.
            </p>
            <button 
              onClick={() => {
                setShowTrialModal(false);
                setView('onboarding');
              }}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-100 transition-colors"
            >
              Continue to Onboarding
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
