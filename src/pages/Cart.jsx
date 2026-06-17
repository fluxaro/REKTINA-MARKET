import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiTrash2, FiArrowRight, FiMinus, FiPlus, FiShield, FiPackage } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';

export default function Cart() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateCartQty, cartTotal } = useApp();

  const escrowFee = cartTotal * 0.0105;
  const total = cartTotal + escrowFee;

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] bg-slate-50">
        <PageHeader title="Cart" subtitle="Your items are protected by UVEA escrow" />
        <EmptyState
          icon={FiShoppingCart}
          title="Your cart is empty"
          description="Browse products from verified campus sellers and add items to get started."
          actionLabel="Browse products"
          actionTo="/products"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader title="Cart" subtitle={`${cart.length} item${cart.length !== 1 ? 's' : ''} · UVEA escrow protected`} />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {cart.map(item => (
              <CartItem key={item.key} item={item} onRemove={() => removeFromCart(item.key)} onQtyChange={(qty) => updateCartQty(item.key, qty)} />
            ))}
          </div>

          <div className="space-y-4 h-fit lg:sticky lg:top-20">
            <div className="surface-card p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Order summary</h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="text-gray-900 font-medium">₦{cartTotal.toLocaleString('en-NG')}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span className="text-emerald-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>UVEA escrow (1.05%)</span>
                  <span className="font-medium">₦{escrowFee.toLocaleString('en-NG', { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between font-semibold text-gray-900 pt-3 border-t border-gray-100">
                  <span>Total</span>
                  <span className="text-blue-600">₦{total.toLocaleString('en-NG', { maximumFractionDigits: 0 })}</span>
                </div>
              </div>
              <button onClick={() => navigate('/checkout', { state: { total, escrowFee } })}
                className="w-full mt-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2">
                Checkout <FiArrowRight size={16} />
              </button>
              <Link to="/products" className="block text-center mt-2.5 py-2.5 text-sm text-gray-500 hover:text-blue-600 transition-colors">
                Continue shopping
              </Link>
            </div>

            <div className="surface-card p-4 flex items-start gap-3">
              <FiShield className="text-blue-600 shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-sm font-medium text-gray-900">Escrow protected</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">Funds held until you confirm delivery.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartItem({ item, onRemove, onQtyChange }) {
  const change = (delta) => {
    const next = Math.max(1, item.qty + delta);
    onQtyChange(next);
  };

  return (
    <div className="flex gap-4 p-4 surface-card">
      <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
        {item.product.images?.[0] ? (
          <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300"><FiPackage size={24} /></div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-gray-900 line-clamp-2">{item.product.name}</p>
        {item.variant && <p className="text-xs text-gray-400 mt-0.5">{item.variant}</p>}
        <p className="text-sm font-semibold text-blue-600 mt-1.5">₦{item.product.price.toLocaleString('en-NG')}</p>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button onClick={() => change(-1)} className="px-2.5 py-1 hover:bg-gray-50 text-gray-600"><FiMinus size={12} /></button>
            <span className="px-3 py-1 text-sm font-medium border-x border-gray-200 min-w-[2.5rem] text-center">{item.qty}</span>
            <button onClick={() => change(1)} className="px-2.5 py-1 hover:bg-gray-50 text-gray-600"><FiPlus size={12} /></button>
          </div>
          <button onClick={onRemove} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"><FiTrash2 size={15} /></button>
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-semibold text-gray-900">₦{(item.product.price * item.qty).toLocaleString('en-NG')}</p>
      </div>
    </div>
  );
}
