import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiPackage, FiChevronRight, FiCheckCircle, FiClock, 
  FiTruck, FiXCircle, FiShield, FiAlertTriangle, FiStar, FiUpload, FiSend 
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import { apiGetOrders } from '../api/mockApi';
import { Skeleton } from '../components/ui/Skeleton';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';

const STATUS_CONFIG = {
  pending:    { label: 'Pending',    variant: 'yellow', icon: <FiClock size={12} /> },
  processing: { label: 'Processing', variant: 'blue',   icon: <FiClock size={12} /> },
  shipped:    { label: 'Shipped',    variant: 'blue',   icon: <FiTruck size={12} /> },
  delivered:  { label: 'Delivered (Escrow Held)',  variant: 'green',  icon: <FiShield size={12} /> },
  completed:  { label: 'Completed (Released)',  variant: 'green',  icon: <FiCheckCircle size={12} /> },
  disputed:   { label: 'Disputed (Escrow Frozen)',   variant: 'red',    icon: <FiAlertTriangle size={12} /> },
  refunded:   { label: 'Refunded',   variant: 'gray',    icon: <FiXCircle size={12} /> },
  cancelled:  { label: 'Cancelled',  variant: 'red',    icon: <FiXCircle size={12} /> },
};

export default function Orders() {
  const { disputes, addDispute, addToast } = useApp();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  // Rate & Review Modal states
  const [reviewOrder, setReviewOrder] = useState(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  // Dispute View/Tabs state: 'file' | 'status'
  const [disputeTab, setDisputeTab] = useState('file');
  const [disputeReason, setDisputeReason] = useState('Not Delivered');
  const [disputeDesc, setDisputeDesc] = useState('');
  const [disputeFile, setDisputeFile] = useState('');

  // 48h Countdown logic mock
  const [countdownString, setCountdownString] = useState('47h 59m 52s');

  useEffect(() => {
    apiGetOrders().then(data => {
      // Mock V2 status mapping
      const updatedData = data.map((o, idx) => ({
        ...o,
        // Make the first shipped order look like V2 delivered
        status: idx === 0 ? 'delivered' : o.status,
        escrowHeld: idx === 0 || o.status === 'shipped',
      }));
      setOrders(updatedData);
      setLoading(false);
    });
  }, []);

  // Update countdown clock randomly to simulate seconds ticking
  useEffect(() => {
    const interval = setInterval(() => {
      const h = 47;
      const m = Math.floor(Math.random() * 60);
      const s = Math.floor(Math.random() * 60);
      setCountdownString(`${h}h ${m}m ${s}s`);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleConfirmReceipt = (orderId) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'completed', escrowHeld: false } : o));
    addToast('Funds successfully released to the seller!');
  };

  const handleReorder = (order) => {
    addToast(`Reordered items from ${order.id} successfully!`, 'success');
  };

  const submitReview = () => {
    addToast('Review submitted successfully! Thank you.', 'success');
    setOrders(prev => prev.map(o => o.id === reviewOrder ? { ...o, reviewed: true } : o));
    setReviewOrder(null);
    setReviewText('');
    setRating(5);
  };

  const submitDispute = (orderId) => {
    if (!disputeDesc.trim()) {
      addToast('Please enter a description for the dispute', 'error');
      return;
    }
    // Add dispute globally
    addDispute(orderId, disputeReason, disputeDesc, disputeFile || 'evidence_upload.png');
    // Update order status to disputed
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'disputed' } : o));
    setDisputeDesc('');
    setDisputeFile('');
    setDisputeTab('status');
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto space-y-4">
        {[1, 2].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-12">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-black text-gray-900">Purchases & Escrows</h1>
          <p className="text-gray-400 text-xs mt-1">Track orders, manage escrows, and handle dispute resolutions</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <FiPackage size={28} className="text-blue-600" />
            </div>
            <p className="font-bold text-gray-900 mb-1">No orders yet</p>
            <p className="text-gray-400 text-xs mb-5">Your order escrow history will appear here</p>
            <Link to="/products" className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors shadow-md shadow-blue-50">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map(order => {
              const sc = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              const hasActiveDispute = disputes.find(d => d.orderId === order.id);

              return (
                <div key={order.id} className="rounded-3xl border border-gray-100 bg-white shadow-sm overflow-hidden transition-all duration-300">
                  <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
                    <div>
                      <p className="font-mono font-black text-blue-600 text-sm">{order.id}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{order.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={sc.variant}>{sc.icon} <span className="font-bold text-[10px] uppercase tracking-wider">{sc.label}</span></Badge>
                      <button onClick={() => setSelected(selected === order.id ? null : order.id)}
                        className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-colors">
                        <FiChevronRight size={18} className={`transition-transform duration-300 ${selected === order.id ? 'rotate-90 text-blue-600' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <div className="px-6 py-4 flex items-center gap-4">
                    <div className="flex -space-x-3">
                      {order.items.slice(0, 3).map((item, i) => (
                        <img key={i} src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-sm" />
                      ))}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800 truncate">
                        {order.items[0].name}{order.items.length > 1 ? ` +${order.items.length - 1} other item` : ''}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">Quantity: {order.items.reduce((sum, item) => sum + item.qty, 0)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-blue-600">₦{order.total.toLocaleString('en-NG')}</p>
                      {order.escrowHeld && (
                        <p className="text-[9px] text-orange-500 font-bold uppercase tracking-wider mt-0.5">UVEA Locked</p>
                      )}
                    </div>
                  </div>

                  {selected === order.id && (
                    <div className="px-6 pb-6 pt-2 border-t border-gray-50 space-y-6">
                      
                      {/* Delivered Phase & 48h Countdown Timer */}
                      {order.status === 'delivered' && (
                        <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                          <div>
                            <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                              <FiClock className="animate-spin text-emerald-600" style={{ animationDuration: '6s' }} />
                              48h Auto-Release Active
                            </h4>
                            <p className="text-[10px] text-emerald-700/80 leading-relaxed mt-1">
                              Funds auto-release to seller in <strong className="font-mono text-emerald-800">{countdownString}</strong>. Please confirm receipt below.
                            </p>
                          </div>
                          <button 
                            onClick={() => handleConfirmReceipt(order.id)}
                            className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-100 transition-colors shrink-0"
                          >
                            I Have Received This
                          </button>
                        </div>
                      )}

                      {/* Dispute Dashboard Section */}
                      <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50">
                        <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
                          <h4 className="text-xs font-black text-gray-900 flex items-center gap-1.5">
                            <FiAlertTriangle className="text-red-500" />
                            UVEA Escrow Disputes
                          </h4>
                          {hasActiveDispute && (
                            <div className="flex rounded-xl bg-slate-100 p-0.5">
                              <button onClick={() => setDisputeTab('file')} className={`px-2.5 py-1 text-[10px] font-bold rounded-lg ${disputeTab === 'file' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}>File New</button>
                              <button onClick={() => setDisputeTab('status')} className={`px-2.5 py-1 text-[10px] font-bold rounded-lg ${disputeTab === 'status' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}>Status Logs</button>
                            </div>
                          )}
                        </div>

                        {/* File Tab */}
                        {(!hasActiveDispute || disputeTab === 'file') ? (
                          <div className="space-y-4">
                            <p className="text-[10px] text-gray-400 leading-relaxed">
                              Issues with delivery or item condition? Lock escrow and alert admins by filing a dispute.
                            </p>
                            <div className="grid sm:grid-cols-2 gap-3">
                              <div>
                                <label className="text-[9px] text-gray-400 font-bold block mb-1 uppercase">Reason</label>
                                <select 
                                  value={disputeReason} 
                                  onChange={e => setDisputeReason(e.target.value)}
                                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-blue-500"
                                >
                                  <option>Not Delivered</option>
                                  <option>Item Defective / Broken</option>
                                  <option>Wrong Product Sent</option>
                                  <option>Seller Refusing Delivery</option>
                                </select>
                              </div>
                              <div>
                                <label className="text-[9px] text-gray-400 font-bold block mb-1 uppercase">Attach Evidence</label>
                                <div className="relative">
                                  <FiUpload className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
                                  <input 
                                    type="text" 
                                    placeholder="Upload photo or logs (e.g. proof.png)" 
                                    value={disputeFile}
                                    onChange={e => setDisputeFile(e.target.value)}
                                    className="w-full pl-8 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-blue-500 placeholder-gray-300"
                                  />
                                </div>
                              </div>
                            </div>
                            <div>
                              <label className="text-[9px] text-gray-400 font-bold block mb-1 uppercase">Explanation</label>
                              <textarea 
                                rows={2}
                                placeholder="Describe the transaction issue in detail..."
                                value={disputeDesc}
                                onChange={e => setDisputeDesc(e.target.value)}
                                className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs outline-none resize-none focus:border-blue-500"
                              />
                            </div>
                            <button 
                              type="button" 
                              onClick={() => submitDispute(order.id)}
                              className="w-full py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-red-50"
                            >
                              <FiSend size={12} /> Lock Escrow & Open Dispute
                            </button>
                          </div>
                        ) : (
                          // Status Tab
                          <div className="space-y-4">
                            {disputes.filter(d => d.orderId === order.id).map(disp => (
                              <div key={disp.id} className="space-y-3">
                                <div className="flex justify-between items-center text-xs">
                                  <span className="font-bold text-gray-900">Dispute ID: {disp.id}</span>
                                  <span className="capitalize px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 font-bold text-[9px] uppercase tracking-wider">{disp.status.replace('_', ' ')}</span>
                                </div>
                                <div className="p-3 bg-white rounded-xl border border-gray-100 text-[11px] text-gray-600">
                                  <p className="font-semibold text-gray-800">Reason: {disp.reason}</p>
                                  <p className="mt-1 leading-relaxed">{disp.description}</p>
                                  <p className="mt-2 text-[9px] text-blue-600 font-bold">📄 Attachment: {disp.evidence}</p>
                                </div>
                                {/* Timeline */}
                                <div className="space-y-2 mt-4 pl-2">
                                  {disp.timeline.map((step, sidx) => (
                                    <div key={sidx} className="flex gap-3">
                                      <div className="flex flex-col items-center">
                                        <div className={`w-3 h-3 rounded-full mt-1 ${step.done ? 'bg-red-500' : 'bg-gray-200'}`} />
                                        {sidx < disp.timeline.length - 1 && (
                                          <div className={`w-0.5 h-6 ${step.done ? 'bg-red-200' : 'bg-gray-100'}`} />
                                        )}
                                      </div>
                                      <div className="pb-1">
                                        <p className={`text-xs font-semibold ${step.done ? 'text-gray-900' : 'text-gray-400'}`}>{step.title}</p>
                                        {step.date && <p className="text-[9px] text-gray-400">{step.date}</p>}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Shipment Tracking details */}
                      <div>
                        <h4 className="text-xs font-black text-gray-900 mb-3">Shipment Progress</h4>
                        <div className="space-y-0.5 pl-2">
                          {order.tracking.map((t, i) => (
                            <div key={i} className="flex gap-3">
                              <div className="flex flex-col items-center">
                                <div className={`w-3 h-3 rounded-full mt-1 ${t.done ? 'bg-blue-600 shadow-md shadow-blue-100' : 'bg-gray-200'}`} />
                                {i < order.tracking.length - 1 && (
                                  <div className={`w-0.5 h-6 ${t.done ? 'bg-blue-200' : 'bg-gray-100'}`} />
                                )}
                              </div>
                              <div className="pb-2">
                                <p className={`text-xs font-semibold ${t.done ? 'text-gray-900' : 'text-gray-400'}`}>{t.status}</p>
                                {t.date && <p className="text-[9px] text-gray-400">{t.date}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Ordered Items list */}
                      <div>
                        <h4 className="text-xs font-black text-gray-900 mb-3">Order Invoice Details</h4>
                        <div className="space-y-3">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex items-center gap-3 bg-slate-50/50 p-2.5 rounded-2xl border border-slate-50">
                              <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover border border-gray-100" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-gray-900 truncate">{item.name}</p>
                                <p className="text-[10px] text-gray-400">Quantity: {item.qty}</p>
                              </div>
                              <p className="text-xs font-black text-blue-600">₦{item.price.toLocaleString('en-NG')}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2 pt-2 border-t border-gray-50">
                        {order.status === 'completed' && !order.reviewed && (
                          <button 
                            onClick={() => setReviewOrder(order.id)}
                            className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-50 transition-colors"
                          >
                            Rate & Review Product
                          </button>
                        )}
                        <button 
                          onClick={() => handleReorder(order)}
                          className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-50 transition-colors"
                        >
                          Reorder Items
                        </button>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Rate & Review Modal Overlay */}
      {reviewOrder && (
        <Modal 
          open={!!reviewOrder} 
          onClose={() => setReviewOrder(null)} 
          title="Product Rate & Review"
        >
          <div className="space-y-5">
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-2">How would you grade your purchase?</p>
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <button 
                    key={star} 
                    type="button" 
                    onClick={() => setRating(star)}
                    className="text-yellow-400 focus:outline-none transition-transform hover:scale-110"
                  >
                    <FiStar 
                      size={28} 
                      className={star <= rating ? 'fill-yellow-400' : 'text-gray-300'} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] text-gray-400 font-bold block mb-1.5 uppercase">Write your comment</label>
              <textarea 
                rows={3}
                placeholder="Share your experience with this product..."
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none resize-none focus:bg-white focus:border-blue-500"
              />
            </div>

            <div className="flex gap-2">
              <button 
                type="button" 
                onClick={() => setReviewOrder(null)}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-500 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={submitReview}
                className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-50"
              >
                Submit Review
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
