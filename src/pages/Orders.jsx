import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiChevronRight, FiSearch, FiTruck, FiCheckCircle, FiClock, FiXCircle, FiAlertCircle } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import { ORDERS } from '../data/mockData';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import Badge from '../components/ui/Badge';

const STATUS_CONFIG = {
  pending:    { label: 'Pending',    variant: 'yellow', icon: FiClock },
  processing: { label: 'Processing', variant: 'blue',   icon: FiAlertCircle },
  shipped:    { label: 'Shipped',    variant: 'blue',   icon: FiTruck },
  delivered:  { label: 'Delivered', variant: 'green',  icon: FiCheckCircle },
  cancelled:  { label: 'Cancelled', variant: 'red',    icon: FiXCircle },
};

export default function Orders() {
  const { disputes, addDispute, addToast } = useApp();
  const [search, setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedId, setExpandedId]     = useState(null);
  const [disputeForm, setDisputeForm]   = useState({ orderId: '', reason: '', description: '', evidence: '' });
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({ orderId: '', rating: 5, comment: '' });
  const [showReviewModal, setShowReviewModal] = useState(false);

  const orders = ORDERS || [];

  const filtered = orders.filter(o => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.items.some(i => i.name.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleOpenDispute = (orderId) => {
    setDisputeForm(f => ({ ...f, orderId }));
    setShowDisputeModal(true);
  };

  const handleSubmitDispute = (e) => {
    e.preventDefault();
    addDispute(disputeForm.orderId, disputeForm.reason, disputeForm.description, disputeForm.evidence);
    setShowDisputeModal(false);
    setDisputeForm({ orderId: '', reason: '', description: '', evidence: '' });
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    addToast('Review submitted successfully!', 'success');
    setShowReviewModal(false);
    setReviewForm({ orderId: '', rating: 5, comment: '' });
  };

  const openReview = (orderId) => {
    setReviewForm(f => ({ ...f, orderId }));
    setShowReviewModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader title="My orders" subtitle="Track escrow-protected purchases" />

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        {/* Search + Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FiSearch size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search orders or items..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border border-gray-200 bg-white outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {['all','pending','processing','shipped','delivered','cancelled'].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3.5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider shrink-0 transition-colors
                  ${statusFilter === s ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'}`}
              >
                {s === 'all' ? 'All Orders' : s}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
              <FiPackage size={24} className="text-gray-300" />
            </div>
            <p className="font-bold text-gray-500 text-sm">No orders found</p>
            <p className="text-[11px] text-gray-400 mt-1">
              {search ? `No results for "${search}"` : 'Start shopping to see your orders here'}
            </p>
            <Link to="/products" className="inline-block mt-5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-colors">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(order => {
              const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              const StatusIcon = cfg.icon;
              const isExpanded = expandedId === order.id;
              const hasDispute = disputes.some(d => d.orderId === order.id);

              return (
                <div key={order.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                  {/* Order Header Row */}
                  <div
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                    onClick={() => setExpandedId(isExpanded ? null : order.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                        <FiPackage size={18} className="text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-bold text-sm text-blue-600">{order.id}</span>
                          <Badge variant={cfg.variant}>
                            <StatusIcon size={10} />
                            {cfg.label}
                          </Badge>
                          {hasDispute && (
                            <Badge variant="red">Dispute Active</Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">{order.date} · {order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                        <p className="text-xs text-gray-500 mt-0.5 font-medium truncate max-w-xs">
                          {order.items.map(i => i.name).join(', ')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:text-right">
                      <div>
                        <p className="font-black text-gray-900 text-base">₦{order.total.toLocaleString('en-NG')}</p>
                        <p className="text-[10px] text-gray-400 font-semibold">UVEA Escrow</p>
                      </div>
                      <FiChevronRight
                        size={16}
                        className={`text-gray-400 transition-transform shrink-0 ${isExpanded ? 'rotate-90' : ''}`}
                      />
                    </div>
                  </div>

                  {/* Expanded Order Detail */}
                  {isExpanded && (
                    <div className="border-t border-gray-50 px-5 py-5 space-y-5 bg-slate-50/30 animate-fade-in">

                      {/* Items */}
                      <div>
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-3">Order Items</h4>
                        <div className="space-y-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-gray-100">
                              <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover border border-gray-100 shadow-inner" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-gray-900 truncate">{item.name}</p>
                                <p className="text-[10px] text-gray-400 mt-0.5">Qty: {item.qty}</p>
                              </div>
                              <span className="font-black text-xs text-gray-900">₦{(item.price * item.qty).toLocaleString('en-NG')}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Shipping + Tracking Timeline */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-3">Delivery Address</h4>
                          <div className="p-4 bg-white border border-gray-100 rounded-2xl text-xs text-gray-500 space-y-1 shadow-sm">
                            <p className="font-bold text-gray-900">{order.address?.name}</p>
                            <p>{order.address?.street}</p>
                            <p>{order.address?.city}, {order.address?.state}</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-3">Tracking Timeline</h4>
                          <div className="p-4 bg-white border border-gray-100 rounded-2xl space-y-3 shadow-sm relative overflow-hidden">
                            {[
                              { label: 'Order Placed', done: true },
                              { label: 'Processing', done: ['processing','shipped','delivered'].includes(order.status) },
                              { label: 'Shipped', done: ['shipped','delivered'].includes(order.status) },
                              { label: 'Delivered', done: order.status === 'delivered' },
                            ].map((step, i) => (
                              <div key={i} className="flex items-center gap-3 text-xs">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 font-bold text-[10px] ${step.done ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                  {step.done ? '✓' : i + 1}
                                </div>
                                <span className={step.done ? 'text-gray-800 font-semibold' : 'text-gray-400'}>{step.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-50">
                        {order.status === 'delivered' && !hasDispute && (
                          <button
                            onClick={() => openReview(order.id)}
                            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-colors"
                          >
                            Leave a Review
                          </button>
                        )}
                        {!hasDispute && order.status !== 'cancelled' && (
                          <button
                            onClick={() => handleOpenDispute(order.id)}
                            className="px-4 py-2 rounded-xl border border-red-200 text-red-500 font-bold text-xs hover:bg-red-50 transition-colors"
                          >
                            Open Dispute
                          </button>
                        )}
                        {hasDispute && (
                          <span className="px-4 py-2 rounded-xl bg-red-50 text-red-600 font-bold text-xs border border-red-100">
                            Dispute Under Review
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Dispute Modal */}
      {showDisputeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl p-6 max-w-md w-full animate-fade-in">
            <h3 className="font-bold text-gray-900 mb-1">File a Dispute</h3>
            <p className="text-xs text-gray-400 mb-5">Order: <strong className="text-blue-600 font-mono">{disputeForm.orderId}</strong> — Escrow funds will be frozen.</p>

            <form onSubmit={handleSubmitDispute} className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] text-gray-400 font-bold block mb-1 uppercase">Dispute Reason</label>
                <select
                  required
                  value={disputeForm.reason}
                  onChange={e => setDisputeForm(f => ({ ...f, reason: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-xs outline-none focus:border-blue-500"
                >
                  <option value="">Select reason...</option>
                  <option value="item_not_delivered">Item Not Delivered</option>
                  <option value="not_as_described">Not As Described</option>
                  <option value="damaged_item">Damaged Item</option>
                  <option value="wrong_item">Wrong Item Sent</option>
                  <option value="fraudulent_seller">Fraudulent Seller</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-gray-400 font-bold block mb-1 uppercase">Dispute Description</label>
                <textarea
                  required
                  rows={3}
                  value={disputeForm.description}
                  onChange={e => setDisputeForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Describe the issue in detail..."
                  className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 text-xs resize-none outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-400 font-bold block mb-1 uppercase">Evidence (optional)</label>
                <input
                  type="text"
                  value={disputeForm.evidence}
                  onChange={e => setDisputeForm(f => ({ ...f, evidence: e.target.value }))}
                  placeholder="File name or URL of evidence..."
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-xs outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowDisputeModal(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-500 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={!disputeForm.reason || !disputeForm.description} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs disabled:opacity-50 shadow-md">Submit Dispute</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl p-6 max-w-sm w-full animate-fade-in">
            <h3 className="font-bold text-gray-900 mb-1">Leave a Review</h3>
            <p className="text-xs text-gray-400 mb-5">Your honest feedback helps other buyers and improves seller reputation.</p>

            <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] text-gray-400 font-bold block mb-1 uppercase">Star Rating</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm(f => ({ ...f, rating: star }))}
                      className={`text-2xl transition-transform hover:scale-110 ${star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-200'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] text-gray-400 font-bold block mb-1 uppercase">Your Comment</label>
                <textarea
                  required
                  rows={3}
                  value={reviewForm.comment}
                  onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                  placeholder="Describe your experience with the seller..."
                  className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 text-xs resize-none outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowReviewModal(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-500 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={!reviewForm.comment} className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs disabled:opacity-50 shadow-md">Submit Review</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
