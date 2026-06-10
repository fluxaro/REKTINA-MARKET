import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FiCheckCircle, FiCreditCard, FiMapPin, FiTruck, 
  FiChevronRight, FiShield, FiInfo, FiActivity, FiArrowRight 
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import { apiCreateOrder } from '../api/mockApi';

const STEPS = ['Shipping Address', 'Delivery Mode', 'Escrow Payment', 'Final Review'];

export default function Checkout() {
  const { cart, cartTotal, clearCart, user, addToast, subscription } = useApp();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);

  // Form states
  const [address, setAddress] = useState({ name: user?.name || '', phone: '', street: '', city: '', state: '', zip: '' });
  const [shipping, setShipping] = useState('standard');
  const [payment, setPayment] = useState('card');
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' });

  // Gateway Simulation States
  const [showGateway, setShowGateway] = useState(false);
  const [gatewayStatus, setGatewayStatus] = useState('input'); // 'input' | 'otp' | 'success'
  const [gatewayOtp, setGatewayOtp] = useState('');
  const [gatewayPhone, setGatewayPhone] = useState('');

  // Subscription Escrow Pricing calculation (1.05% for free plan, 0.00% for paid plans)
  const isFreePlan = !subscription || subscription.plan === 'Free Plan';
  const escrowFeeRate = isFreePlan ? 0.0105 : 0;
  const subTotal = state?.total || cartTotal;
  const escrowFee = subTotal * escrowFeeRate;
  
  // Naira shipping pricing
  const shippingCost = shipping === 'express' ? 1500 : shipping === 'overnight' ? 3000 : 0;
  const total = subTotal + escrowFee + shippingCost;

  const inputCls = 'w-full px-3 py-2.5 rounded-xl text-sm border border-gray-200 bg-white text-gray-900 outline-none focus:border-blue-500 transition-colors placeholder-gray-400';

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const o = await apiCreateOrder({ 
        items: cart, 
        address, 
        shipping, 
        payment, 
        escrowFee,
        total 
      });
      setOrder(o);
      clearCart();
      setStep(4);
    } catch {
      addToast('Order placement failed. Please try again.', 'error');
    } finally {
      setLoading(false);
      setShowGateway(false);
    }
  };

  const startPaymentGateway = () => {
    if (payment === 'card') {
      // Direct placement for card
      handlePlaceOrder();
    } else {
      // Trigger Paystack / Flutterwave overlay
      setGatewayStatus('input');
      setShowGateway(true);
    }
  };

  const handleGatewayNext = () => {
    if (gatewayStatus === 'input') {
      setGatewayStatus('otp');
    } else if (gatewayStatus === 'otp') {
      setGatewayStatus('success');
      setTimeout(() => {
        handlePlaceOrder();
      }, 1500);
    }
  };

  // Order Complete View
  if (step === 4 && order) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center p-8 rounded-3xl border border-gray-100 bg-white shadow-xl max-w-md w-full animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-4">
          <FiCheckCircle size={40} />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Escrow Locked!</h2>
        <p className="text-gray-400 text-xs mb-1">Your secure payment has been placed in escrow</p>
        <p className="text-blue-600 font-mono font-bold text-lg mb-6">{order.id}</p>
        
        <div className="p-5 rounded-2xl bg-slate-50 mb-6 text-left space-y-3 border border-gray-100">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-gray-400">Total Escrow Held</span>
            <span className="text-gray-950">₦{total.toLocaleString('en-NG')}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">UVEA Fee ({isFreePlan ? '1.05%' : '0.00% Premium'})</span>
            <span className="text-gray-700">₦{escrowFee.toLocaleString('en-NG')}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Escrow Agent</span>
            <span className="text-blue-600 font-bold">Rektina UVEA</span>
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <button onClick={() => navigate('/orders')} className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-colors shadow-md shadow-blue-100">
            Track Order Escrow Status
          </button>
          <button onClick={() => navigate('/products')} className="w-full py-3.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-xs hover:bg-gray-50 transition-colors">
            Return to Marketplace
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-12">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-black text-gray-900">Secure Checkout</h1>
          <p className="text-xs text-gray-400 mt-1">Payments are held in secure UVEA Escrow</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Step Indicator Header */}
        <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center shrink-0">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                  ${i <= step ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-400'}`}>
                  {i < step ? <FiCheckCircle size={14} /> : i + 1}
                </div>
                <span className={`text-xs font-semibold ${i === step ? 'text-blue-600' : 'text-gray-400'}`}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-8 md:w-16 h-0.5 mx-3 ${i < step ? 'bg-blue-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Step 0: Address Form */}
            {step === 0 && (
              <div className="p-6 rounded-3xl border border-gray-100 bg-white shadow-sm">
                <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
                  <FiMapPin size={20} className="text-blue-600" />
                  <h2 className="font-bold text-gray-900">Delivery Address</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-xs text-gray-400 font-semibold mb-1 block">Full Name</label>
                    <input value={address.name} onChange={e => setAddress(a => ({ ...a, name: e.target.value }))} placeholder="Receiver's name" className={inputCls} />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-xs text-gray-400 font-semibold mb-1 block">Phone Number</label>
                    <input value={address.phone} onChange={e => setAddress(a => ({ ...a, phone: e.target.value }))} placeholder="+234..." className={inputCls} />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-gray-400 font-semibold mb-1 block">Street Address</label>
                    <input value={address.street} onChange={e => setAddress(a => ({ ...a, street: e.target.value }))} placeholder="No, Street, Campus Hostels" className={inputCls} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 font-semibold mb-1 block">City</label>
                    <input value={address.city} onChange={e => setAddress(a => ({ ...a, city: e.target.value }))} placeholder="e.g. Nsukka, Ife" className={inputCls} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 font-semibold mb-1 block">State</label>
                    <input value={address.state} onChange={e => setAddress(a => ({ ...a, state: e.target.value }))} placeholder="e.g. Enugu, Osun" className={inputCls} />
                  </div>
                </div>
                <button
                  onClick={() => setStep(1)}
                  disabled={!address.name || !address.street || !address.city || !address.phone}
                  className="mt-6 w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-50"
                >
                  Continue <FiChevronRight size={16} />
                </button>
              </div>
            )}

            {/* Step 1: Shipping Methods */}
            {step === 1 && (
              <div className="p-6 rounded-3xl border border-gray-100 bg-white shadow-sm">
                <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
                  <FiTruck size={20} className="text-blue-600" />
                  <h2 className="font-bold text-gray-900">Select Shipping Speed</h2>
                </div>
                <div className="space-y-3">
                  {[
                    { id: 'standard', label: 'Standard Delivery', sub: '3-5 campus business days', price: 'Free' },
                    { id: 'express', label: 'Express Shuttle', sub: '1-2 days shuttle delivery', price: '₦1,500' },
                    { id: 'overnight', label: 'Same Day Delivery', sub: 'Within 12 hours dispatch', price: '₦3,000' },
                  ].map(opt => (
                    <label key={opt.id} className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all
                      ${shipping === opt.id ? 'border-blue-600 bg-blue-50/40' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="shipping" value={opt.id} checked={shipping === opt.id} onChange={() => setShipping(opt.id)} className="accent-blue-600 w-4 h-4" />
                      <div className="flex-1">
                        <p className="font-bold text-sm text-gray-900">{opt.label}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{opt.sub}</p>
                      </div>
                      <span className={`font-black text-sm ${opt.price === 'Free' ? 'text-blue-600' : 'text-gray-950'}`}>{opt.price}</span>
                    </label>
                  ))}
                </div>
                
                <div className="flex gap-3 mt-8">
                  <button onClick={() => setStep(0)} className="flex-1 py-3.5 rounded-xl border border-gray-200 text-gray-500 font-semibold text-xs hover:bg-gray-50 transition-colors">Back</button>
                  <button onClick={() => setStep(2)} className="flex-1 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-50">
                    Continue <FiChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Payment Portal */}
            {step === 2 && (
              <div className="p-6 rounded-3xl border border-gray-100 bg-white shadow-sm">
                <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
                  <FiCreditCard size={20} className="text-blue-600" />
                  <h2 className="font-bold text-gray-900">Escrow Payment Gateway</h2>
                </div>
                
                <div className="flex rounded-2xl border border-gray-200 overflow-hidden mb-6">
                  {[
                    ['card', 'Credit Card'], 
                    ['paystack', 'Paystack Direct'], 
                    ['flutterwave', 'Flutterwave']
                  ].map(([v, l]) => (
                    <button key={v} onClick={() => setPayment(v)}
                      className={`flex-1 py-3 text-xs font-bold transition-all duration-200 ${payment === v ? 'bg-blue-600 text-white' : 'text-gray-500 bg-slate-50 hover:bg-gray-100'}`}>
                      {l}
                    </button>
                  ))}
                </div>

                {payment === 'card' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-gray-400 font-semibold mb-1 block">Card Number</label>
                      <input value={card.number} onChange={e => setCard(c => ({ ...c, number: e.target.value }))} placeholder="4000 1234 5678 9010" maxLength={19} className={inputCls} />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 font-semibold mb-1 block">Cardholder Name</label>
                      <input value={card.name} onChange={e => setCard(c => ({ ...c, name: e.target.value }))} placeholder="John Doe" className={inputCls} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-400 font-semibold mb-1 block">Expiry Date</label>
                        <input value={card.expiry} onChange={e => setCard(c => ({ ...c, expiry: e.target.value }))} placeholder="MM/YY" maxLength={5} className={inputCls} />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 font-semibold mb-1 block">CVV</label>
                        <input value={card.cvv} onChange={e => setCard(c => ({ ...c, cvv: e.target.value }))} placeholder="123" maxLength={4} type="password" className={inputCls} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl text-center bg-slate-50 border border-gray-100">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm ${payment === 'paystack' ? 'bg-emerald-50 text-emerald-500' : 'bg-orange-50 text-orange-500'}`}>
                      <span className="font-black text-lg">{payment === 'paystack' ? 'Paystack' : 'Flutterwave'}</span>
                    </div>
                    <p className="font-bold text-gray-900 mb-1">Pay Securely with {payment === 'paystack' ? 'Paystack' : 'Flutterwave'}</p>
                    <p className="text-xs text-gray-400 leading-relaxed max-w-xs mx-auto">
                      Click continue to open the secure campus overlay to complete the escrow authorization.
                    </p>
                  </div>
                )}

                <div className="flex gap-3 mt-8">
                  <button onClick={() => setStep(1)} className="flex-1 py-3.5 rounded-xl border border-gray-200 text-gray-500 font-semibold text-xs hover:bg-gray-50 transition-colors">Back</button>
                  <button onClick={() => setStep(3)} className="flex-1 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-50">
                    Continue <FiChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Final Review */}
            {step === 3 && (
              <div className="p-6 rounded-3xl border border-gray-100 bg-white shadow-sm">
                <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
                  <FiCheckCircle size={20} className="text-blue-600" />
                  <h2 className="font-bold text-gray-900">Review Escrow Order</h2>
                </div>

                <div className="space-y-4 mb-6">
                  {cart.map(item => (
                    <div key={item.key} className="flex gap-4 items-center">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-14 h-14 object-cover rounded-2xl border border-gray-100 shadow-sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{item.product.name}</p>
                        {item.variant && <p className="text-[11px] text-gray-400">Variant: {item.variant}</p>}
                        <p className="text-[11px] text-gray-400">Quantity: {item.qty}</p>
                      </div>
                      <span className="text-sm font-black text-gray-900">₦{(item.product.price * item.qty).toLocaleString('en-NG')}</span>
                    </div>
                  ))}
                </div>

                {/* Secure Escrow Protection Warnings */}
                <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl mb-6 flex items-start gap-3">
                  <FiShield className="text-blue-600 shrink-0 mt-0.5" size={18} />
                  <div>
                    <h4 className="text-xs font-bold text-blue-900">UVEA Escrow Active</h4>
                    <p className="text-[10px] text-blue-700/80 leading-relaxed mt-0.5">
                      Your funds are stored securely in Rektina Escrow. The seller is only paid when you mark the item received or when the 48-hour delivery timer lapses without disputes.
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 text-xs space-y-2.5 mb-6 border border-gray-100">
                  <p className="text-gray-500"><strong className="text-gray-700">Shipping To:</strong> {address.name} - {address.street}, {address.city}, {address.state} ({address.phone})</p>
                  <p className="text-gray-500"><strong className="text-gray-700">Delivery:</strong> {shipping === 'standard' ? 'Standard (Free)' : shipping === 'express' ? 'Express Shuttle (+₦1,500)' : 'Same Day Dispatch (+₦3,000)'}</p>
                  <p className="text-gray-500"><strong className="text-gray-700">Authorization Channel:</strong> {payment === 'card' ? 'Direct Credit/Debit Card' : payment === 'paystack' ? 'Paystack checkout API' : 'Flutterwave checkout API'}</p>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="flex-1 py-3.5 rounded-xl border border-gray-200 text-gray-500 font-semibold text-xs hover:bg-gray-50 transition-colors">Back</button>
                  <button onClick={startPaymentGateway} disabled={loading}
                    className="flex-1 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-50">
                    {loading ? 'Processing Escrow Lock...' : `Authorize Escrow · ₦${total.toLocaleString('en-NG')}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Summary (Fixed scroll) */}
          <div className="space-y-4 h-fit sticky top-24">
            <div className="p-5 rounded-3xl border border-gray-100 bg-white shadow-sm">
              <h3 className="font-bold text-gray-900 border-b border-gray-50 pb-3 mb-4">Summary</h3>
              
              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal ({cartCount} item{cartCount > 1 ? 's' : ''})</span>
                  <span className="text-gray-950 font-semibold">₦{subTotal.toLocaleString('en-NG')}</span>
                </div>
                
                {/* Dynamically Styled Escrow Fee Breakdown */}
                <div className="flex justify-between text-gray-400">
                  <span className="flex items-center gap-1">
                    Escrow Fee ({isFreePlan ? '1.05%' : '0.00% Premium'})
                    <div className="relative group">
                      <FiInfo className="text-gray-400 cursor-pointer" size={12} />
                      <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 bg-gray-950 text-white text-[9px] p-2 rounded-lg w-40 z-20 shadow-md">
                        Paid users receive 0% escrow fees on all peer transactions.
                      </div>
                    </div>
                  </span>
                  {isFreePlan ? (
                    <span className="text-red-500 font-semibold">₦{escrowFee.toLocaleString('en-NG')}</span>
                  ) : (
                    <span className="text-emerald-500 font-bold">₦0.00 (Free)</span>
                  )}
                </div>

                <div className="flex justify-between text-gray-400">
                  <span>Shipping Cost</span>
                  <span className="text-gray-950 font-semibold">{shippingCost === 0 ? 'Free' : `₦${shippingCost.toLocaleString('en-NG')}`}</span>
                </div>

                <div className="flex justify-between font-black text-sm pt-4 border-t border-gray-50 text-gray-950">
                  <span>Total Payable</span>
                  <span className="text-blue-600">₦{total.toLocaleString('en-NG')}</span>
                </div>
              </div>
            </div>

            {/* Escrow Badge banner */}
            <div className="p-4 rounded-3xl border border-blue-50 bg-blue-50/20 text-center flex flex-col items-center">
              <FiShield className="text-blue-600 mb-2" size={24} />
              <p className="text-xs font-bold text-blue-900">UVEA Escrow Certified</p>
              <p className="text-[10px] text-blue-600/70 mt-1 max-w-[200px] leading-relaxed">
                Rektina escrow locks verification codes until customer receipt confirmations. 
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Paystack / Flutterwave Gateway Modal Overlay */}
      {showGateway && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden max-w-sm w-full animate-fade-in">
            {/* Header branding */}
            <div className={`p-6 ${payment === 'paystack' ? 'bg-emerald-600' : 'bg-amber-500'} text-white flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-bold text-sm">
                  {payment === 'paystack' ? 'P' : 'F'}
                </div>
                <span className="font-black text-sm tracking-wide capitalize">{payment} Secure API</span>
              </div>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">Test Sandbox</span>
            </div>

            {/* Content body */}
            <div className="p-6">
              {gatewayStatus === 'input' && (
                <div className="space-y-4">
                  <div className="text-center mb-2">
                    <p className="text-xs text-gray-400">Total amount to authorize</p>
                    <p className="text-2xl font-black text-gray-950 mt-1">₦{total.toLocaleString('en-NG')}</p>
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 font-bold block mb-1.5 uppercase">Phone Number (linked to bank/wallet)</label>
                    <input 
                      type="text" 
                      value={gatewayPhone} 
                      onChange={e => setGatewayPhone(e.target.value)} 
                      placeholder="+234 803 123 4567" 
                      className={inputCls} 
                    />
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-gray-100 text-[10px] text-gray-500 flex items-start gap-2">
                    <FiInfo className="text-blue-500 shrink-0 mt-0.5" size={13} />
                    <span>In production, this overlay redirects to paystack.co or flutterwave.com to complete checkout.</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={handleGatewayNext}
                    disabled={!gatewayPhone}
                    className={`w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all shadow-md ${payment === 'paystack' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100' : 'bg-amber-500 hover:bg-amber-600 shadow-amber-100'}`}
                  >
                    Authenticate Payment
                  </button>
                </div>
              )}

              {gatewayStatus === 'otp' && (
                <div className="space-y-4 text-center">
                  <div>
                    <p className="text-xs text-gray-400">We sent an OTP to {gatewayPhone}</p>
                    <p className="text-lg font-bold text-gray-900 mt-2">Enter Verification Code</p>
                  </div>
                  <input 
                    type="text" 
                    maxLength={6}
                    value={gatewayOtp} 
                    onChange={e => setGatewayOtp(e.target.value)} 
                    placeholder="Enter 6-Digit OTP" 
                    className="w-full text-center px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-lg font-bold outline-none focus:bg-white focus:border-blue-500" 
                  />
                  <button 
                    type="button" 
                    onClick={handleGatewayNext}
                    disabled={gatewayOtp.length < 4}
                    className={`w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all shadow-md ${payment === 'paystack' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100' : 'bg-amber-500 hover:bg-amber-600 shadow-amber-100'}`}
                  >
                    Verify & Confirm
                  </button>
                </div>
              )}

              {gatewayStatus === 'success' && (
                <div className="py-8 text-center space-y-4 animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto">
                    <FiCheckCircle size={32} className="animate-bounce" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-950 text-sm">Payment Authorized</h4>
                    <p className="text-xs text-gray-400 mt-1">Locking escrow assets...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
