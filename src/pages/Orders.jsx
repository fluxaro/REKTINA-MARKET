import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiChevronRight, FiCheckCircle, FiClock, FiTruck, FiXCircle } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import { apiGetOrders } from '../api/mockApi';
import { Skeleton } from '../components/ui/Skeleton';
import Badge from '../components/ui/Badge';

const STATUS_CONFIG = {
  pending:    { label: 'Pending',    variant: 'yellow', icon: <FiClock size={12} /> },
  processing: { label: 'Processing', variant: 'blue',   icon: <FiClock size={12} /> },
  shipped:    { label: 'Shipped',    variant: 'blue',   icon: <FiTruck size={12} /> },
  delivered:  { label: 'Delivered',  variant: 'green',  icon: <FiCheckCircle size={12} /> },
  cancelled:  { label: 'Cancelled',  variant: 'red',    icon: <FiXCircle size={12} /> },
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    apiGetOrders().then(data => { setOrders(data); setLoading(false); });
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto space-y-4">
        {[1, 2].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-400 text-sm mt-1">Track and manage your purchases</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <FiPackage size={28} className="text-blue-600" />
            </div>
            <p className="font-semibold text-gray-900 mb-1">No orders yet</p>
            <p className="text-gray-400 text-sm mb-4">Your order history will appear here</p>
            <Link to="/products" className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => {
              const sc = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              return (
                <div key={order.id} className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <div>
                      <p className="font-mono font-bold text-blue-600">{order.id}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{order.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={sc.variant}>{sc.icon} {sc.label}</Badge>
                      <button onClick={() => setSelected(selected === order.id ? null : order.id)}
                        className="text-gray-300 hover:text-blue-600 transition-colors">
                        <FiChevronRight size={18} className={`transition-transform ${selected === order.id ? 'rotate-90' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <div className="px-5 py-3 flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 3).map((item, i) => (
                        <img key={i} src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover border-2 border-white shadow-sm" />
                      ))}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">
                        {order.items[0].name}{order.items.length > 1 ? ` +${order.items.length - 1} more` : ''}
                      </p>
                    </div>
                    <p className="font-bold text-blue-600">₦{order.total.toFixed(2)}</p>
                  </div>

                  {selected === order.id && (
                    <div className="px-5 pb-5 border-t border-gray-100">
                      <h3 className="font-semibold text-sm text-gray-900 mt-4 mb-3">Tracking</h3>
                      <div className="space-y-0">
                        {order.tracking.map((t, i) => (
                          <div key={i} className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <div className={`w-3 h-3 rounded-full mt-1 ${t.done ? 'bg-blue-600' : 'bg-gray-200'}`} />
                              {i < order.tracking.length - 1 && (
                                <div className={`w-0.5 h-6 ${t.done ? 'bg-blue-200' : 'bg-gray-100'}`} />
                              )}
                            </div>
                            <div className="pb-2">
                              <p className={`text-sm font-medium ${t.done ? 'text-gray-900' : 'text-gray-400'}`}>{t.status}</p>
                              {t.date && <p className="text-xs text-gray-400">{t.date}</p>}
                            </div>
                          </div>
                        ))}
                      </div>

                      <h3 className="font-semibold text-sm text-gray-900 mt-4 mb-3">Items</h3>
                      <div className="space-y-2">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{item.name}</p>
                              <p className="text-xs text-gray-400">Qty: {item.qty}</p>
                            </div>
                            <p className="text-sm font-semibold text-blue-600">₦{item.price.toFixed(2)}</p>
                          </div>
                        ))}
                      </div>

                      {order.status !== 'delivered' && order.status !== 'cancelled' && (
                        <button className="mt-4 px-4 py-2 rounded-xl border border-red-200 text-red-400 text-sm hover:bg-red-50 transition-colors">
                          Cancel Order
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
