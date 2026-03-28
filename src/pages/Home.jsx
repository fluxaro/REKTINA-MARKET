import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiArrowRight, FiShield, FiTruck, FiRefreshCw, FiHeadphones,
  FiChevronLeft, FiChevronRight, FiStar, FiZap, FiPackage,
  FiCpu, FiTag, FiHome, FiActivity, FiBookOpen, FiFeather, FiGift, FiTool,
  FiCheckCircle, FiUsers, FiTrendingUp,
} from 'react-icons/fi';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { useApp } from '../context/AppContext';
import { PRODUCTS, CATEGORIES } from '../data/mockData';
import ProductCard from '../components/products/ProductCard';
import { ProductCardSkeleton } from '../components/ui/Skeleton';
import CategoryIcon from '../components/ui/CategoryIcon';

const HERO_SLIDES = [
  {
    tag: 'New Arrivals',
    title: 'Shop the Latest\nTech & Gadgets',
    sub: 'Deals up to 40% off on premium electronics from verified sellers.',
    cta: 'Shop Electronics',
    link: '/products?category=Electronics',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1400&q=80',
    accent: 'from-blue-900/80 via-blue-900/50',
  },
  {
    tag: 'Trending Now',
    title: 'Fashion That\nSpeaks Your Style',
    sub: 'New arrivals every week from top fashion brands across Nigeria.',
    cta: 'Explore Fashion',
    link: '/products?category=Fashion',
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1400&q=80',
    accent: 'from-purple-900/80 via-purple-900/50',
  },
  {
    tag: 'Best Sellers',
    title: 'Transform Your\nHome & Living',
    sub: 'Curated home essentials and garden products at unbeatable prices.',
    cta: 'Shop Home',
    link: '/products?category=Home+%26+Garden',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1400&q=80',
    accent: 'from-slate-900/80 via-slate-900/50',
  },
];

const TRUST_FEATURES = [
  { icon: FiTruck,      title: 'Fast Delivery',      sub: 'Same-day delivery available in Lagos. Nationwide shipping in 2–5 days.' },
  { icon: FiShield,     title: 'Buyer Protection',   sub: '100% secure transactions. Full refund if item doesn\'t arrive.' },
  { icon: FiRefreshCw,  title: 'Easy Returns',        sub: '30-day hassle-free returns on all eligible products.' },
  { icon: FiHeadphones, title: '24/7 Support',        sub: 'Our team is always here to help you with any issue.' },
];

const TESTIMONIALS = [
  { name: 'Amaka N.', role: 'Verified Buyer', text: 'Best marketplace in Nigeria. Prices are competitive and delivery was faster than expected. Will definitely shop again!', rating: 5, avatar: 'A' },
  { name: 'James O.', role: 'Verified Buyer', text: 'The sellers are all verified and trustworthy. Got my electronics in perfect condition with great packaging.', rating: 5, avatar: 'J' },
  { name: 'Sarah M.', role: 'Verified Buyer', text: 'Amazing selection and super fast delivery. I\'ve been shopping here for months and never been disappointed.', rating: 5, avatar: 'S' },
];

const STATS = [
  { icon: FiUsers,    val: '16k+',  label: 'Happy Customers' },
  { icon: FiPackage,  val: '20k+',  label: 'Products Listed' },
  { icon: FiCheckCircle, val: '5k+', label: 'Verified Sellers' },
  { icon: FiTrendingUp,  val: '98%', label: 'Satisfaction Rate' },
];

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [featured, setFeatured] = useState([]);
  const [heroIdx, setHeroIdx] = useState(0);
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    const t = setTimeout(() => {
      setFeatured(PRODUCTS.filter(p => p.featured));
      setNewArrivals(PRODUCTS.filter(p => !p.featured).slice(0, 4));
      setLoading(false);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setHeroIdx(i => (i + 1) % HERO_SLIDES.length), 5500);
    return () => clearInterval(t);
  }, []);

  const slide = HERO_SLIDES[heroIdx];

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero ── */}
      <section className="relative bg-gray-950 overflow-hidden" style={{ minHeight: 520 }}>
        {HERO_SLIDES.map((s, i) => (
          <div key={i} className={`absolute inset-0 transition-opacity duration-700 ${i === heroIdx ? 'opacity-100' : 'opacity-0'}`}>
            <img src={s.image} alt="" className="w-full h-full object-cover" />
            <div className={`absolute inset-0 bg-gradient-to-r ${s.accent} to-transparent`} />
          </div>
        ))}

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 md:py-28 flex flex-col justify-center" style={{ minHeight: 520 }}>
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold mb-5 backdrop-blur-sm border border-white/20">
              <FiZap size={11} /> {slide.tag}
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-5 whitespace-pre-line">
              {slide.title}
            </h1>
            <p className="text-gray-200 text-base md:text-lg mb-8 leading-relaxed max-w-md">
              {slide.sub}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link to={slide.link}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02]">
                {slide.cta} <FiArrowRight size={16} />
              </Link>
              <Link to="/products"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all backdrop-blur-sm border border-white/20">
                Browse All
              </Link>
            </div>

            {/* Stats row */}
            <div className="flex gap-8 mt-10">
              {[['20k+', 'Products'], ['5k+', 'Sellers'], ['16k+', 'Buyers']].map(([v, l]) => (
                <div key={l}>
                  <p className="text-2xl font-black text-white">{v}</p>
                  <p className="text-xs text-gray-300 mt-0.5">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Slide controls */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => setHeroIdx(i)}
              className={`h-1.5 rounded-full transition-all ${i === heroIdx ? 'w-8 bg-white' : 'w-2 bg-white/40'}`} />
          ))}
        </div>
        <button onClick={() => setHeroIdx(i => (i - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white backdrop-blur-sm transition-colors">
          <FiChevronLeft size={20} />
        </button>
        <button onClick={() => setHeroIdx(i => (i + 1) % HERO_SLIDES.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white backdrop-blur-sm transition-colors">
          <FiChevronRight size={20} />
        </button>
      </section>

      {/* ── Trust bar ── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {TRUST_FEATURES.map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <Icon size={17} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">{title}</p>
                  <p className="text-xs text-gray-400 mt-0.5 leading-relaxed hidden md:block">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-2">Browse by Category</p>
              <h2 className="text-3xl font-black text-gray-900">Shop Every Category</h2>
            </div>
            <Link to="/products" className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
              All Products <FiArrowRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CATEGORIES.map(cat => (
              <Link key={cat.id} to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] block shadow-sm hover:shadow-lg transition-all duration-300">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <CategoryIcon name={cat.iconName} size={14} className="text-white" />
                    </div>
                    <p className="text-white font-bold text-sm">{cat.name}</p>
                  </div>
                  <p className="text-gray-300 text-xs">{cat.count} products</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-2">Hand-Picked</p>
              <h2 className="text-3xl font-black text-gray-900">Featured Products</h2>
            </div>
            <Link to="/products" className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
              View All <FiArrowRight size={15} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : featured.map(p => <ProductCard key={p.id} product={p} />)
            }
          </div>
          <div className="text-center mt-8 md:hidden">
            <Link to="/products" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors">
              View All Products <FiArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Promo Banner ── */}
      <section className="py-6 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                title: 'Up to 40% off Electronics',
                sub: 'Limited time deals on top gadgets',
                cta: 'Shop Now',
                link: '/products?category=Electronics',
                bg: 'bg-gradient-to-br from-blue-600 to-blue-800',
                img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
              },
              {
                title: 'New Fashion Arrivals',
                sub: 'Fresh styles added every week',
                cta: 'Explore',
                link: '/products?category=Fashion',
                bg: 'bg-gradient-to-br from-purple-600 to-pink-600',
                img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
              },
            ].map(b => (
              <Link key={b.title} to={b.link}
                className={`${b.bg} rounded-2xl p-8 flex items-center justify-between overflow-hidden relative group hover:shadow-xl transition-all`}>
                <div className="relative z-10">
                  <p className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-2">Special Offer</p>
                  <h3 className="text-white font-black text-xl md:text-2xl mb-1">{b.title}</h3>
                  <p className="text-white/70 text-sm mb-4">{b.sub}</p>
                  <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-gray-900 font-bold text-sm group-hover:bg-gray-100 transition-colors">
                    {b.cta} <FiArrowRight size={14} />
                  </span>
                </div>
                <img src={b.img} alt="" className="absolute right-0 top-0 h-full w-48 object-cover opacity-20 group-hover:opacity-30 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── New Arrivals ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-2">Just In</p>
              <h2 className="text-3xl font-black text-gray-900">New Arrivals</h2>
            </div>
            <Link to="/products?sort=newest" className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
              See All <FiArrowRight size={15} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : newArrivals.map(p => <ProductCard key={p.id} product={p} />)
            }
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map(({ icon: Icon, val, label }) => (
              <div key={label}>
                <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-3">
                  <Icon size={22} className="text-white" />
                </div>
                <p className="text-3xl font-black text-white">{val}</p>
                <p className="text-blue-100 text-sm mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-2">Reviews</p>
            <h2 className="text-3xl font-black text-gray-900">What Customers Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex gap-0.5 mb-4">
                  {[1,2,3,4,5].map(i => <FaStar key={i} size={14} className="text-yellow-400" />)}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Top Sellers preview ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-2">Trusted Vendors</p>
              <h2 className="text-3xl font-black text-gray-900">Top Sellers</h2>
            </div>
            <Link to="/sellers" className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
              All Sellers <FiArrowRight size={15} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['TechStore Pro', 'FashionHub', 'HomeGoods Co', 'SportZone', 'BookWorld'].map((name, i) => (
              <Link key={name} to={`/products?seller=${i + 1}`}
                className="group bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 rounded-2xl p-5 text-center transition-all">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 group-hover:bg-blue-600 flex items-center justify-center mx-auto mb-3 transition-colors">
                  <span className="text-blue-600 group-hover:text-white font-black text-lg transition-colors">{name[0]}</span>
                </div>
                <p className="font-semibold text-sm text-gray-900 leading-tight">{name}</p>
                <p className="text-xs text-gray-400 mt-0.5">Verified Seller</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-gray-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-blue-500 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-purple-500 blur-3xl" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-4">Join Today</p>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
            Ready to start<br />shopping smarter?
          </h2>
          <p className="text-gray-400 text-base mb-8 max-w-lg mx-auto">
            Join over 16,000 happy customers. Create your free account and unlock exclusive deals today.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register" className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02]">
              Create Free Account
            </Link>
            <Link to="/products" className="px-8 py-4 rounded-xl border border-gray-700 text-gray-300 font-semibold hover:bg-gray-800 transition-colors">
              Browse Products
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
