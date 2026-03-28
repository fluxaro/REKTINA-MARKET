import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiCreditCard, FiMapPin, FiTruck, FiChevronRight } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import { apiCreateOrder } from '../api/mockApi';

const STEPS = ['Address', 'Shipping', 'Payment', 'Review'];

export default function Checkout() {
  const { cart, cartTotal, clearCart, user, addToast } = useApp();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);

  const [address, setAddress] = useState({ name: user?.name || '', phone: '', street: '', city: '', state: '', zip: '' });
  const [shipping, setShipping] = useState('standard');
  const [payment, setPayment] = useState('card');
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' });

  const shippingCost = shipping === 'express' ? 15 : shipping === 'overnight' ? 30 : 0;
  const total = (state?.total || cartTotal) + shippingCost;

  const inputCls = 'w-full px-3 py-2.5 rounded-xl text-sm border border-gray-200 bg-white text-gray-900 outline-none focus:border-blue-500 transition-colors placeholder-gray-400';

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const o = await apiCreateOrder({ items: cart, address, shipping, payment, total });
      setOrder(o);
      clearCart();
      setStep(4);
    } catch {
      addToast('Order failed. Please try again.', 'error');
    } finally { setLoading(false); }
  };

  if (step === 4 && order) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 rounded-3xl border border-gray-100 bg-white shadow-lg max-w-md w-full mx-4 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
          <FiCheckCircle size={40} className="text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h2>
        <p className="text-gray-400 mb-1">Your order has been confirmed</p>
        <p className="text-blue-600 font-mono font-bold text-lg mb-6">{order.id}</p>
        <div className="p-4 rounded-xl bg-gray-50 mb-6 text-left space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Total Paid</span>
            <span className="font-bold text-gray-900">₦{total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Shipping</span>
            <span className="text-gray-700">{shipping === 'standard' ? 'Free Standard' : shipping === 'express' ? 'Express' : 'Overnight'}</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/orders')} className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors">
            Track Order
          </button>
          <button onClick={() => navigate('/products')} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors">
            Keep Shopping
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Stepper */}
        <div className="flex items-center mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors
                  ${i <= step ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                  {i < step ? <FiCheckCircle size={16} /> : i + 1}
                </div>
                <span className={`text-xs mt-1 hidden sm:block ${i === step ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${i < step ? 'bg-blue-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Step 0: Address */}
            {step === 0 && (
              <div className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                  <FiMapPin size={18} className="text-blue-600" />
                  <h2 className="font-bold text-gray-900">Delivery Address</h2>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-xs text-gray-400 mb-1 block">Full Name</label>
                    <input value={address.name} onChange={e => setAddress(a => ({ ...a, name: e.target.value }))} placeholder="John Doe" className={inputCls} />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-xs text-gray-400 mb-1 block">Phone Number</label>
                    <input value={address.phone} onChange={e => setAddress(a => ({ ...a, phone: e.target.value }))} placeholder="+234 800 000 0000" className={inputCls} />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-gray-400 mb-1 block">Street Address</label>
                    <input value={address.street} onChange={e => setAddress(a => ({ ...a, street: e.target.value }))} placeholder="123 Main Street" className={inputCls} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">City</label>
                    <input value={address.city} onChange={e => setAddress(a => ({ ...a, city: e.target.value }))} placeholder="Lagos" className={inputCls} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">State</label>
                    <input value={address.state} onChange={e => setAddress(a => ({ ...a, state: e.target.value }))} placeholder="Lagos" className={inputCls} />
                  </div>
                </div>
                <button
                  onClick={() => setStep(1)}
                  disabled={!address.name || !address.street || !address.city}
                  className="mt-5 w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
                >
                  Continue <FiChevronRight size={16} />
                </button>
              </div>
            )}

            {/* Step 1: Shipping */}
            {step === 1 && (
              <div className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                  <FiTruck size={18} className="text-blue-600" />
                  <h2 className="font-bold text-gray-900">Shipping Method</h2>
                </div>
                <div className="space-y-3">
                  {[
                    { id: 'standard', label: 'Standard Delivery', sub: '5-7 business days', price: 'Free' },
                    { id: 'express', label: 'Express Delivery', sub: '2-3 business days', price: '₦15.00' },
                    { id: 'overnight', label: 'Overnight Delivery', sub: 'Next business day', price: '₦30.00' },
                  ].map(opt => (
                    <label key={opt.id} className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors
                      ${shipping === opt.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="shipping" value={opt.id} checked={shipping === opt.id} onChange={() => setShipping(opt.id)} className="accent-blue-600" />
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-900">{opt.label}</p>
                        <p className="text-xs text-gray-400">{opt.sub}</p>
                      </div>
                      <span className={`font-semibold text-sm ${opt.price === 'Free' ? 'text-blue-600' : 'text-gray-900'}`}>{opt.price}</span>
                    </label>
                  ))}
                </div>
                <div className="flex gap-3 mt-5">
                  <button onClick={() => setStep(0)} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors">Back</button>
                  <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-2 transition-colors">
                    Continue <FiChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                  <FiCreditCard size={18} className="text-blue-600" />
                  <h2 className="font-bold text-gray-900">Payment Method</h2>
                </div>
                <div className="flex rounded-xl border border-gray-200 overflow-hidden mb-5">
                  {[['card', 'Card'], ['paystack', 'Paystack'], ['flutterwave', 'Flutterwave']].map(([v, l]) => (
                    <button key={v} onClick={() => setPayment(v)}
                      className={`flex-1 py-2.5 text-sm font-medium transition-colors ${payment === v ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
                      {l}
                    </button>
                  ))}
                </div>

                {payment === 'card' && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Card Number</label>
                      <input value={card.number} onChange={e => setCard(c => ({ ...c, number: e.target.value }))} placeholder="1234 5678 9012 3456" maxLength={19} className={inputCls} />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Cardholder Name</label>
                      <input value={card.name} onChange={e => setCard(c => ({ ...c, name: e.target.value }))} placeholder="John Doe" className={inputCls} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Expiry Date</label>
                        <input value={card.expiry} onChange={e => setCard(c => ({ ...c, expiry: e.target.value }))} placeholder="MM/YY" maxLength={5} className={inputCls} />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">CVV</label>
                        <input value={card.cvv} onChange={e => setCard(c => ({ ...c, cvv: e.target.value }))} placeholder="123" maxLength={4} type="password" className={inputCls} />
                      </div>
                    </div>
                  </div>
                )}

                {payment !== 'card' && (
                  <div className="p-6 rounded-xl text-center bg-gray-50 border border-gray-100">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${payment === 'paystack' ? 'bg-blue-100' : 'bg-orange-100'}`}>
                      <span className={`font-bold text-lg ${payment === 'paystack' ? 'text-blue-600' : 'text-orange-500'}`}>{payment === 'paystack' ? 'P' : 'F'}</span>
                    </div>
                    <p className="font-semibold text-gray-900 mb-1">Pay with {payment === 'paystack' ? 'Paystack' : 'Flutterwave'}</p>
                    <p className="text-sm text-gray-400">You'll be redirected to complete payment securely.</p>
                  </div>
                )}

                <div className="flex gap-3 mt-5">
                  <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors">Back</button>
                  <button onClick={() => setStep(3)} className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-2 transition-colors">
                    Review Order <FiChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm">
                <h2 className="font-bold text-gray-900 mb-5">Review Your Order</h2>
                <div className="space-y-3 mb-5">
                  {cart.map(item => (
                    <div key={item.key} className="flex gap-3 items-center">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-12 h-12 object-cover rounded-xl" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.product.name}</p>
                        {item.variant && <p className="text-xs text-gray-400">{item.variant}</p>}
                        <p className="text-xs text-gray-400">Qty: {item.qty}</p>
                      </div>
                      <span className="text-sm font-semibold text-blue-600">₦{(item.product.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="p-4 rounded-xl bg-gray-50 text-sm space-y-1.5 mb-5 border border-gray-100">
                  <p className="text-gray-500">📍 {address.street}, {address.city}, {address.state}</p>
                  <p className="text-gray-500">🚚 {shipping === 'standard' ? 'Standard (Free)' : shipping === 'express' ? 'Express (₦15)' : 'Overnight (₦30)'}</p>
                  <p className="text-gray-500">💳 {payment === 'card' ? 'Credit/Debit Card' : payment === 'paystack' ? 'Paystack' : 'Flutterwave'}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors">Back</button>
                  <button onClick={handlePlaceOrder} disabled={loading}
                    className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-70 transition-colors">
                    {loading ? 'Placing Order...' : `Place Order · ₦${total.toFixed(2)}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Summary sidebar */}
          <div className="p-5 rounded-2xl border border-gray-100 bg-white shadow-sm h-fit sticky top-24">
            <h3 className="font-bold text-gray-900 mb-4">Summary</h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between"><span className="text-gray-400">Items ({cart.length})</span><span className="text-gray-900">₦{cartTotal.toFixed(2)}</span></div>
              {state?.discount > 0 && <div className="flex justify-between text-blue-600"><span>Discount</span><span>-₦{state.discount.toFixed(2)}</span></div>}
              {state?.tax > 0 && <div className="flex justify-between"><span className="text-gray-400">Tax</span><span className="text-gray-900">₦{state.tax.toFixed(2)}</span></div>}
              <div className="flex justify-between"><span className="text-gray-400">Shipping</span><span className={shippingCost === 0 ? 'text-blue-600' : 'text-gray-900'}>{shippingCost === 0 ? 'Free' : `₦${shippingCost}`}</span></div>
              <div className="flex justify-between font-bold pt-2.5 border-t border-gray-100">
                <span className="text-gray-900">Total</span><span className="text-blue-600">₦{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
