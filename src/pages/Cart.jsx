import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiPlus, FiMinus, FiTag, FiArrowRight, FiShoppingBag, FiShield, FiTruck } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import { apiValidateCoupon } from '../api/mockApi';

export default function Cart() {
  const { cart, removeFromCart, updateCartQty, clearCart, cartTotal, addToast } = useApp();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [coupon, setCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');

  const TAX_RATE = 0.075;
  const discount = coupon ? (coupon.type === 'percent' ? cartTotal * coupon.discount / 100 : coupon.discount) : 0;
  const subtotal = cartTotal;
  const tax = (subtotal - discount) * TAX_RATE;
  const total = subtotal - discount + tax;

  const handleCoupon = async () => {
    setCouponError('');
    setCouponLoading(true);
    try {
      const c = await apiValidateCoupon(couponCode, cartTotal);
      setCoupon(c);
      addToast(`Coupon applied! ${c.type === 'percent' ? c.discount + '%' : '₦' + c.discount} off`);
    } catch (e) {
      setCouponError(e.message);
    } finally { setCouponLoading(false); }
  };

  if (cart.length === 0) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
          <FiShoppingBag size={36} className="text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-400 mb-6">Add some products to get started</p>
        <Link to="/products" className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all">
          Browse Products
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-gray-900">Shopping Cart <span className="text-gray-400 text-lg font-normal">({cart.length} items)</span></h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            {cart.map(item => (
              <div key={item.key} className="flex gap-4 p-4 rounded-2xl border border-gray-100 bg-white shadow-sm">
                <Link to={`/products/${item.product.id}`} className="shrink-0">
                  <img src={item.product.images[0]} alt={item.product.name} className="w-20 h-20 object-cover rounded-xl" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/products/${item.product.id}`}>
                    <h3 className="font-semibold text-sm text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">{item.product.name}</h3>
                  </Link>
                  {item.variant && <p className="text-xs text-gray-400 mt-0.5">{item.variant}</p>}
                  <p className="text-xs text-gray-400">{item.product.sellerName}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center rounded-xl border border-gray-200 overflow-hidden bg-gray-50">
                      <button onClick={() => updateCartQty(item.key, item.qty - 1)} className="px-2.5 py-1.5 hover:bg-gray-100 transition-colors text-gray-600"><FiMinus size={12} /></button>
                      <span className="px-3 py-1.5 text-sm font-semibold">{item.qty}</span>
                      <button onClick={() => updateCartQty(item.key, item.qty + 1)} className="px-2.5 py-1.5 hover:bg-gray-100 transition-colors text-gray-600"><FiPlus size={12} /></button>
                    </div>
                    <span className="font-bold text-blue-600">₦{(item.product.price * item.qty).toFixed(2)}</span>
                  </div>
                </div>
                <button onClick={() => removeFromCart(item.key)} className="text-gray-300 hover:text-red-400 transition-colors self-start p-1" aria-label="Remove item">
                  <FiTrash2 size={16} />
                </button>
              </div>
            ))}

            <button onClick={clearCart} className="text-sm text-red-400 hover:text-red-500 transition-colors mt-2">
              Clear all items
            </button>

            {/* Trust row */}
            <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-100">
              {[[FiTruck, 'Free shipping on orders over ₦50'], [FiShield, 'Buyer protection guarantee']].map(([Icon, text]) => (
                <div key={text} className="flex items-center gap-2 text-xs text-gray-400">
                  <Icon size={14} className="text-blue-600" /> {text}
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm h-fit sticky top-24">
            <h2 className="font-bold text-lg text-gray-900 mb-5">Order Summary</h2>

            {/* Coupon */}
            <div className="mb-5">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <FiTag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Coupon code"
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl text-sm border border-gray-200 bg-gray-50 outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <button onClick={handleCoupon} disabled={couponLoading || !couponCode}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold disabled:opacity-50 transition-colors">
                  {couponLoading ? '...' : 'Apply'}
                </button>
              </div>
              {couponError && <p className="text-red-400 text-xs mt-1">{couponError}</p>}
              {coupon && <p className="text-blue-600 text-xs mt-1">✓ {coupon.code} applied</p>}
              <p className="text-xs text-gray-400 mt-1">Try: SAVE10, FLAT20, NEWUSER</p>
            </div>

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between"><span className="text-gray-400">Subtotal</span><span className="text-gray-900">₦{subtotal.toFixed(2)}</span></div>
              {discount > 0 && (
                <div className="flex justify-between text-blue-600"><span>Discount</span><span>-₦{discount.toFixed(2)}</span></div>
              )}
              <div className="flex justify-between"><span className="text-gray-400">Tax (7.5%)</span><span className="text-gray-900">₦{tax.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Shipping</span><span className="text-blue-600">Free</span></div>
              <div className="flex justify-between font-bold text-base pt-3 border-t border-gray-100">
                <span className="text-gray-900">Total</span>
                <span className="text-blue-600">₦{total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout', { state: { total, discount, tax, coupon } })}
              className="w-full mt-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              Proceed to Checkout <FiArrowRight size={16} />
            </button>
            <Link to="/products" className="block text-center text-sm text-gray-400 hover:text-blue-600 mt-3 transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
