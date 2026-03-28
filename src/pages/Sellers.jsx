import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiShoppingBag, FiSearch, FiAward, FiUsers, FiTrendingUp, FiArrowRight, FiStar } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { apiGetSellers } from '../api/mockApi';
import { Skeleton } from '../components/ui/Skeleton';

export default function Sellers() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    apiGetSellers().then(data => { setSellers(data); setLoading(false); });
  }, []);

  const filtered = sellers.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-700 to-blue-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-3">Trusted Vendors</p>
          <h1 className="text-4xl font-black mb-3">Our Sellers</h1>
          <p className="text-blue-100 mb-8 max-w-md mx-auto">Discover verified vendors on Rektina Market. Every seller is vetted for quality and reliability.</p>
          <div className="relative max-w-md mx-auto">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search sellers..."
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white text-gray-900 text-sm outline-none shadow-lg placeholder-gray-400" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid grid-cols-3 gap-6 text-center">
            {[[FiUsers, '5,000+', 'Active Sellers'], [FiShoppingBag, '20,000+', 'Products'], [FiAward, '98%', 'Satisfaction']].map(([Icon, val, label]) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-1">
                  <Icon size={18} className="text-blue-600" />
                </div>
                <p className="text-2xl font-black text-gray-900">{val}</p>
                <p className="text-xs text-gray-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sellers grid */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        {!loading && filtered.length > 0 && (
          <p className="text-sm text-gray-400 mb-5">{filtered.length} seller{filtered.length !== 1 ? 's' : ''} found</p>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-56 w-full rounded-2xl" />)
            : filtered.map(s => (
              <div key={s.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-100 transition-all group">
                {/* Card header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center group-hover:from-blue-600 group-hover:to-blue-700 transition-all">
                        <span className="text-blue-600 group-hover:text-white font-black text-xl transition-colors">{s.name[0]}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-gray-900">{s.name}</p>
                          {s.verified && <FiCheckCircle size={14} className="text-blue-600" />}
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          {[1,2,3,4,5].map(i => <FaStar key={i} size={10} className={i <= Math.round(s.rating) ? 'text-yellow-400' : 'text-gray-200'} />)}
                          <span className="text-xs text-gray-400 ml-1">{s.rating}</span>
                        </div>
                      </div>
                    </div>
                    {s.verified && (
                      <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold">Verified</span>
                    )}
                  </div>

                  <p className="text-sm text-gray-400 mb-4 leading-relaxed">{s.bio || 'Quality products from a trusted seller.'}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <FiShoppingBag size={13} className="text-blue-600" />
                      {s.sales.toLocaleString()} sales
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FiTrendingUp size={13} className="text-blue-600" />
                      Top Seller
                    </span>
                  </div>
                </div>

                <div className="px-6 pb-6">
                  <Link to={`/products?seller=${s.id}`}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-50 text-blue-600 text-sm font-bold hover:bg-blue-600 hover:text-white transition-all group-hover:bg-blue-600 group-hover:text-white">
                    View Products <FiArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))
          }
        </div>

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <FiSearch size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400">No sellers found matching "{search}"</p>
          </div>
        )}
      </div>

      {/* Become a seller CTA */}
      <div className="bg-white border-t border-gray-100 py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-5">
            <FiTrendingUp size={24} className="text-blue-600" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-3">Want to sell on Rektina Market?</h2>
          <p className="text-gray-400 mb-7 leading-relaxed">Join thousands of sellers and reach millions of customers across Nigeria. Zero listing fees to get started.</p>
          <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-md hover:shadow-lg hover:scale-[1.02]">
            Start Selling Today <FiArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
