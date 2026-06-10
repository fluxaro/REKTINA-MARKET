import { useState } from 'react';
import { 
  FiCheck, FiX, FiActivity, FiCreditCard, FiAlertCircle, 
  FiClock, FiShield, FiTrendingUp, FiGift 
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';

const PLANS = [
  {
    name: 'Free Plan',
    price: '₦0',
    frequency: 'forever',
    features: [
      { text: 'Low listing visibility', active: true },
      { text: 'Low support priority', active: true },
      { text: '+1.05% UVEA Escrow Charge', active: true, negative: true },
      { text: 'No RETINAview Analytics access', active: false },
      { text: 'Basic features only', active: true }
    ],
    cta: 'Current Plan',
    disabled: true,
    color: 'border-gray-200 bg-white text-gray-900',
    btnClass: 'bg-gray-100 text-gray-400'
  },
  {
    name: 'Monthly Plan',
    price: '₦1,850',
    frequency: 'month',
    durationDays: 30,
    features: [
      { text: 'Full listing visibility', active: true },
      { text: 'Full support priority', active: true },
      { text: '0.00% UVEA Escrow Charge', active: true },
      { text: 'Full RETINAview Analytics access', active: true },
      { text: 'Cancel anytime', active: true }
    ],
    cta: 'Upgrade to Monthly',
    disabled: false,
    color: 'border-blue-200 bg-white text-gray-900 hover:border-blue-500',
    btnClass: 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-50'
  },
  {
    name: 'Semester Plan',
    price: '₦8,500',
    frequency: 'semester',
    durationDays: 120,
    features: [
      { text: 'Full listing visibility', active: true },
      { text: 'Full support priority', active: true },
      { text: '0.00% UVEA Escrow Charge', active: true },
      { text: 'Full RETINAview Analytics access', active: true },
      { text: '~23% Semester savings', active: true }
    ],
    cta: 'Upgrade to Semester',
    disabled: false,
    color: 'border-purple-200 bg-purple-50/20 text-purple-950 hover:border-purple-500',
    btnClass: 'bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-50'
  },
  {
    name: 'Full Session Plan',
    price: '₦15,900',
    frequency: 'session',
    durationDays: 280,
    features: [
      { text: 'Full listing visibility', active: true },
      { text: 'Full support priority', active: true },
      { text: '0.00% UVEA Escrow Charge', active: true },
      { text: 'Full RETINAview Analytics access', active: true },
      { text: 'Best overall session value', active: true }
    ],
    cta: 'Upgrade to Full Session',
    disabled: false,
    color: 'border-slate-800 bg-slate-900 text-white shadow-xl scale-105',
    btnClass: 'bg-blue-500 hover:bg-blue-600 text-white shadow-md'
  }
];

export default function Subscription() {
  const { subscription, updateSubscription, cancelSubscription, addToast } = useApp();

  const [checkoutPlan, setCheckoutPlan] = useState(null);
  const [gateway, setGateway] = useState('paystack'); // 'paystack' | 'flutterwave'
  const [paying, setPaying] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRenewalModal, setShowRenewalModal] = useState(false);

  const activePlan = subscription?.plan || 'Free Plan';
  const expiryDate = subscription?.expiryDate;

  // Calculate days remaining helper
  const getDaysRemaining = () => {
    if (!expiryDate) return 0;
    const diff = new Date(expiryDate).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const daysRemaining = getDaysRemaining();
  const progressPercent = expiryDate ? Math.min(100, Math.max(0, (daysRemaining / 30) * 100)) : 0;

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    setPaying(true);
    setTimeout(() => {
      updateSubscription(checkoutPlan.name, checkoutPlan.price, checkoutPlan.durationDays);
      setPaying(false);
      setCheckoutPlan(null);
    }, 1500);
  };

  const handleConfirmCancel = () => {
    cancelSubscription();
    setShowCancelModal(false);
  };

  const handleRenewal = () => {
    setShowRenewalModal(true);
  };

  const confirmRenewal = () => {
    setShowRenewalModal(false);
    // Add 30 days to existing or default plan
    updateSubscription(activePlan, subscription?.price || '₦1,850', 30);
    addToast('Subscription renewed successfully', 'success');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-12">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-black text-gray-900">Manage Subscription</h1>
          <p className="text-xs text-gray-400 mt-1">Upgrade or renew your premium benefits and features</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        
        {/* Active Plan Dashboard Status Panel */}
        <div className="p-6 rounded-3xl border border-gray-100 bg-white shadow-sm grid md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 space-y-3">
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Active Plan Status</p>
              <h2 className="text-2xl font-black text-blue-600 mt-1">{activePlan}</h2>
            </div>
            
            {expiryDate ? (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-gray-500">
                  <span>Expires: {expiryDate}</span>
                  <span>{daysRemaining} Days Left</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-400 leading-relaxed">
                You are currently on the Free tier. Upgrade below to remove escrow fees and get full visibility.
              </p>
            )}
          </div>
          
          <div className="flex flex-col gap-2">
            {expiryDate ? (
              <>
                <button onClick={handleRenewal} className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-50">
                  Renew Plan
                </button>
                <button onClick={() => setShowCancelModal(true)} className="w-full py-3 rounded-xl border border-red-200 text-red-500 font-bold text-xs hover:bg-red-50">
                  Cancel Subscription
                </button>
              </>
            ) : (
              <p className="text-xs font-bold text-gray-400 text-center">14-Day Free Trial Available</p>
            )}
          </div>
        </div>

        {/* Feature Comparison Table Title */}
        <div className="text-center space-y-1 py-4">
          <h2 className="text-xl font-black text-gray-900 tracking-tight">Compare Premium Features</h2>
          <p className="text-xs text-gray-400">Unlock more options to reach student buyers across campus</p>
        </div>

        {/* Comparative Pricing Cards */}
        <div className="grid md:grid-cols-4 gap-4 items-stretch">
          {PLANS.map((plan) => {
            const isCurrent = plan.name === activePlan;
            return (
              <div key={plan.name} className={`rounded-3xl border p-5 flex flex-col justify-between transition-all border-gray-100 ${plan.color}`}>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-blue-500">{plan.name}</span>
                    {isCurrent && (
                      <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider">Active</span>
                    )}
                  </div>
                  <div className="mt-4 mb-5">
                    <span className="text-3xl font-black">{plan.price}</span>
                    <span className="text-xs text-gray-400 font-semibold"> / {plan.frequency}</span>
                  </div>
                  
                  <div className="space-y-2.5 border-t border-gray-50 pt-4">
                    {plan.features.map((f, i) => (
                      <div key={i} className="flex gap-2 items-start text-[11px]">
                        {f.active ? (
                          <FiCheck className={`shrink-0 mt-0.5 ${f.negative ? 'text-red-500' : 'text-emerald-500'}`} size={12} />
                        ) : (
                          <FiX className="shrink-0 mt-0.5 text-gray-300" size={12} />
                        )}
                        <span className={f.active ? 'text-gray-600 font-medium' : 'text-gray-300'}>{f.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-50/50">
                  <button 
                    disabled={plan.disabled || isCurrent}
                    onClick={() => setCheckoutPlan(plan)}
                    className={`w-full py-3 rounded-xl text-xs font-bold transition-all ${plan.btnClass}`}
                  >
                    {isCurrent ? 'Active Plan' : plan.cta}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Subscription Paystack/Flutterwave Integration Modal */}
      {checkoutPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden max-w-sm w-full animate-fade-in">
            <div className="p-6 bg-slate-900 text-white">
              <span className="text-[10px] text-blue-400 font-black uppercase tracking-widest">Premium Plan checkout</span>
              <h3 className="text-lg font-black mt-1">Upgrade to {checkoutPlan.name}</h3>
            </div>
            
            <form onSubmit={handleCheckoutSubmit} className="p-6 space-y-4">
              <div className="flex justify-between items-center text-xs border-b border-slate-50 pb-3">
                <span className="text-gray-400 font-semibold">Amount to Pay</span>
                <span className="text-gray-950 font-black text-lg">{checkoutPlan.price}</span>
              </div>

              <div>
                <label className="text-[9px] text-gray-400 font-bold block mb-1.5 uppercase">Select Billing Channel</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    ['paystack', 'Paystack'], 
                    ['flutterwave', 'Flutterwave']
                  ].map(([v, l]) => (
                    <button 
                      type="button" 
                      key={v}
                      onClick={() => setGateway(v)}
                      className={`py-2 rounded-xl text-xs font-bold border-2 transition-all ${gateway === v ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-200 text-gray-500 bg-white'}`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="submit" 
                disabled={paying}
                className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-50 transition-all flex items-center justify-center"
              >
                {paying ? 'Authorizing checkout...' : `Authorize Escrow Plan via ${gateway === 'paystack' ? 'Paystack' : 'Flutterwave'}`}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Cancellation Modal Overlay */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl p-6 max-w-sm w-full text-center animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-3">
              <FiAlertCircle size={24} />
            </div>
            <h4 className="font-bold text-gray-900 text-sm">Cancel Premium Subscription?</h4>
            <p className="text-gray-400 text-xs leading-relaxed mt-1 mb-5">
              Your benefits will continue until the end of the current period, after which your account will automatically revert back to the Free Plan.
            </p>
            <div className="flex gap-2">
              <button onClick={() => setShowCancelModal(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors">
                Close
              </button>
              <button onClick={handleConfirmCancel} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs transition-colors shadow-md shadow-red-50">
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Renewal Modal Overlay */}
      {showRenewalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl p-6 max-w-sm w-full text-center animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
              <FiClock size={24} />
            </div>
            <h4 className="font-bold text-gray-900 text-sm">Confirm Subscription Renewal?</h4>
            <p className="text-gray-400 text-xs leading-relaxed mt-1 mb-5">
              Confirming this extends your premium coverage for another billing period under the current plan rates.
            </p>
            <div className="flex gap-2">
              <button onClick={() => setShowRenewalModal(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors">
                Back
              </button>
              <button onClick={confirmRenewal} className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-md shadow-blue-50">
                Confirm Renewal
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
