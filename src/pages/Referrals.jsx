import { useState } from 'react';
import { 
  FiGift, FiCopy, FiCheckCircle, FiUsers, FiTrendingUp, 
  FiClock, FiChevronRight, FiAlertCircle 
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';

export default function Referrals() {
  const { referrals, claimReferral, addToast } = useApp();
  const [copied, setCopied] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);

  const code = referrals?.code || 'REK-USER-8921';
  const invitedList = referrals?.invited || [];
  
  // Count completed referrals
  const completedCount = invitedList.filter(u => u.status === 'Completed').length;
  const progressPercent = Math.min(100, (completedCount / 4) * 100);

  const handleCopyLink = () => {
    const link = `https://rektinamarket.com/register?ref=${code}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    addToast('Referral link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClaimReward = () => {
    setClaiming(true);
    setTimeout(() => {
      claimReferral();
      setClaiming(false);
      setShowClaimModal(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-12">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-black text-gray-900">Affiliate Referral Program</h1>
          <p className="text-xs text-gray-400 mt-1">Invite your peers and unlock free weeks of Premium access</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        
        {/* Referral Status Panel */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 p-6 rounded-3xl border border-gray-100 bg-white shadow-sm flex flex-col justify-between h-48">
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Your Unique Code</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="font-mono text-xl font-black text-blue-600 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">{code}</span>
                <button 
                  onClick={handleCopyLink}
                  className="p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:text-blue-600 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
                >
                  {copied ? <FiCheckCircle className="text-emerald-500" size={16} /> : <FiCopy size={16} />}
                  <span className="text-xs font-bold">{copied ? 'Copied' : 'Copy Link'}</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed">
              Share your link with students. For every 4 signups that complete their first escrow trade, you receive <strong>1 week of Premium features free</strong>.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-gray-100 bg-white shadow-sm flex flex-col justify-between h-48 text-center items-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
              <FiGift size={24} />
            </div>
            <div className="w-full">
              <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1.5 uppercase">
                <span>Milestone Progress</span>
                <span>{completedCount} of 4</span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
            <button 
              disabled={completedCount < 4 || claiming}
              onClick={handleClaimReward}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none transition-colors"
            >
              {claiming ? 'Claiming...' : 'Claim Free Week'}
            </button>
          </div>
        </div>

        {/* Invited users tracking table */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 bg-slate-50/50 flex items-center justify-between">
            <h3 className="text-xs font-black text-gray-950 uppercase tracking-wider">Invited Peer Signups</h3>
            <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-full uppercase">{invitedList.length} total</span>
          </div>

          {invitedList.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <FiUsers className="text-gray-300 mx-auto" size={32} />
              <p className="text-xs font-bold text-gray-500">No referrals yet</p>
              <p className="text-[10px] text-gray-400">Share your invite link to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-gray-100">
                  <tr>
                    {['Invited User', 'Registration Date', 'Activity Status', 'Bonus Status'].map(h => (
                      <th key={h} className="py-3.5 px-5 text-slate-400 uppercase font-black tracking-wider text-[10px]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {invitedList.map((u, i) => (
                    <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shadow-inner">
                            {u.name[0]}
                          </div>
                          <span className="font-bold text-gray-900">{u.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-gray-500">{u.date}</td>
                      <td className="py-4 px-5">
                        <span className={`px-2.5 py-1 rounded-full font-bold text-[9px] uppercase tracking-wider border ${
                          u.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="py-4 px-5 font-semibold text-slate-400">
                        {u.status === 'Completed' ? 'Credited to Milestone' : 'Awaiting First Escrow release'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 30-Day Referral Expiry Alert Notice */}
        <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-2xl flex items-start gap-3">
          <FiAlertCircle className="text-amber-500 shrink-0 mt-0.5" size={18} />
          <div>
            <h4 className="text-xs font-bold text-amber-900">Referral Expiry Notice</h4>
            <p className="text-[10px] text-amber-700/80 leading-relaxed mt-0.5">
              Pending referrals expire after 30 days of registration if they do not complete a qualifying peer transaction.
            </p>
          </div>
        </div>

      </div>

      {/* Reward Claimed Modal Overlay */}
      {showClaimModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl p-6 max-w-sm w-full text-center animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-3">
              <FiCheckCircle size={28} />
            </div>
            <h4 className="font-bold text-gray-900 text-sm">Milestone Reward Claimed!</h4>
            <p className="text-gray-400 text-xs leading-relaxed mt-1 mb-5">
              Congratulations! Your <strong>Free Week of Premium Access</strong> has been credited to your subscription. Check your new profile expiry logs.
            </p>
            <button 
              onClick={() => setShowClaimModal(false)} 
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-50"
            >
              Continue Working
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
