import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiArrowRight, FiShield, FiTrendingUp, FiUsers, FiSearch,
  FiChevronRight, FiChevronLeft, FiLock, FiBarChart2, FiPackage,
  FiStar, FiCheckCircle, FiZap
} from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { useApp } from '../context/AppContext';
import { PRODUCTS, CATEGORIES } from '../data/mockData';
import ProductCard from '../components/products/ProductCard';
import { ProductCardSkeleton } from '../components/ui/Skeleton';
import CategoryIcon from '../components/ui/CategoryIcon';

/* ─── Carousel slides — campus life + ecommerce mix ─── */
const SLIDES = [
  {
    id: 0,
    // Students on campus with phones — campus meets digital commerce
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&q=85',
    badge: 'Nigeria\'s Campus Marketplace',
    headline: 'Buy and sell on campus,\nwith confidence.',
    sub: 'REKTINA MARKET connects university buyers and sellers with UVEA escrow protection on every single transaction. Zero risk, every order.',
    accent: 'from-slate-950/85 via-slate-900/70 to-slate-900/10',
  },
  {
    id: 1,
    // Online shopping / ecommerce — hands on phone browsing products
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&q=85',
    badge: 'Thousands of Verified Listings',
    headline: 'Textbooks, gadgets,\nfashion and more.',
    sub: 'Browse thousands of listings from verified campus sellers — from course materials to electronics to fashion. Everything you need, all in one place.',
    accent: 'from-blue-950/85 via-blue-950/65 to-transparent',
  },
  {
    id: 2,
    // Students studying together with laptops — collaborative, academic
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&q=85',
    badge: 'RETINAview Analytics',
    headline: 'Sell smarter.\nGrow your revenue.',
    sub: 'RETINAview gives campus sellers monthly analytics — revenue trends, top listings, buyer retention data, and AI-powered tips to grow their business.',
    accent: 'from-slate-950/90 via-slate-900/65 to-transparent',
  },
  {
    id: 3,
    // Secure mobile payment / ecommerce checkout — fintech feel
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1600&q=85',
    badge: 'UVEA Escrow — Every Order',
    headline: 'Your money is safe\nuntil you say so.',
    sub: 'UVEA holds every payment in escrow. Sellers ship, you confirm delivery, funds release. If anything is wrong, open a dispute — we resolve it in 48 hours.',
    accent: 'from-slate-950/88 via-slate-900/60 to-transparent',
  },
];

const STATS = [
  { value: '50K+', label: 'Active sellers' },
  { value: '500K+', label: 'Campus buyers' },
  { value: '₦10B+', label: 'Volume processed' },
  { value: '48h', label: 'Dispute resolution' },
];

const TRUST_PILLARS = [
  {
    icon: FiShield,
    color: 'bg-blue-600',
    title: 'UVEA Escrow on every order',
    desc: 'Funds are locked the moment a buyer pays. Sellers receive payment only after the buyer confirms delivery — or after the 48-hour auto-release window closes without a dispute.',
  },
  {
    icon: FiBarChart2,
    color: 'bg-violet-600',
    title: 'RETINAview seller analytics',
    desc: 'Monthly revenue reports, conversion rates per listing, buyer retention data, and AI-powered growth recommendations — all in one dashboard built for campus sellers.',
  },
  {
    icon: FiLock,
    color: 'bg-emerald-600',
    title: 'University-verified accounts only',
    desc: 'Every user is verified through their university email. Sellers earn reputation badges over time. Buyers review honestly. The entire ecosystem runs on real campus identity.',
  },
  {
    icon: FiZap,
    color: 'bg-amber-500',
    title: 'Instant dispute resolution',
    desc: 'If anything goes wrong with an order, file a dispute with evidence in seconds. Our UVEA system reviews both sides and issues a ruling within 48 hours — no phone calls needed.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Amara Okonkwo',
    role: 'Verified Buyer · Unilag',
    content: 'I was nervous about buying from someone I had never met. UVEA escrow completely changed that. I paid, the seller delivered, I confirmed — that was it. Seamless.',
    rating: 5,
    avatar: 'AO',
  },
  {
    name: 'Chisom Nkosi',
    role: 'Power Seller · ABU Zaria',
    content: 'RETINAview showed me that my study guide listings were converting 3x better than my gadgets. I shifted focus, doubled my listings, and grew monthly revenue by 80% in six weeks.',
    rating: 5,
    avatar: 'CN',
  },
  {
    name: 'Tunde Hassan',
    role: 'Verified Buyer · UNIABUJA',
    content: 'The dispute system actually works. I received a damaged item, filed a dispute with photos, and had a full refund in under 48 hours. That kind of trust is rare.',
    rating: 5,
    avatar: 'TH',
  },
];

/* ─── Hero Carousel ─── */
function HeroCarousel({ search, setSearch, onSearch, user }) {
  const [active, setActive] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const goTo = useCallback((idx) => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setActive(idx);
      setTransitioning(false);
    }, 300);
  }, [transitioning]);

  const prev = () => goTo((active - 1 + SLIDES.length) % SLIDES.length);
  const next = useCallback(() => goTo((active + 1) % SLIDES.length), [active, goTo]);

  useEffect(() => {
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [next]);

  const slide = SLIDES[active];

  return (
    <section className="relative h-[92vh] min-h-[580px] max-h-[860px] overflow-hidden bg-slate-950 select-none">
      {/* Background images — all preloaded, fade between them */}
      {SLIDES.map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{ opacity: i === active && !transitioning ? 1 : 0 }}
        >
          <img
            src={s.image}
            alt=""
            className="w-full h-full object-cover object-center"
            loading={i === 0 ? 'eager' : 'lazy'}
          />
          {/* Gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-r ${s.accent}`} />
          {/* Bottom vignette always */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-950/10" />
        </div>
      ))}

      {/* Content */}
      <div className="relative h-full flex flex-col">
        <div className="flex-1 flex items-center">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
            <div
              key={active}
              className="max-w-2xl animate-fade-in"
            >
              {/* Badge pill */}
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-white text-xs font-semibold uppercase tracking-wider mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse shrink-0" />
                {slide.badge}
              </span>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.12] tracking-tight mb-5 whitespace-pre-line">
                {slide.headline}
              </h1>

              {/* Subtext */}
              <p className="text-slate-200/85 text-base md:text-lg leading-relaxed mb-8 max-w-xl">
                {slide.sub}
              </p>

              {/* Search bar */}
              <form onSubmit={onSearch} className="flex gap-2 mb-7 max-w-lg">
                <div className="relative flex-1">
                  <FiSearch size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search products, categories, sellers..."
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-white/12 border border-white/20 text-white placeholder-slate-400 text-sm outline-none focus:bg-white/18 focus:border-blue-400/60 transition-all backdrop-blur-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-sm transition-colors shrink-0 shadow-lg shadow-blue-600/30"
                >
                  Search
                </button>
              </form>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-gray-900 font-semibold text-sm hover:bg-slate-100 transition-colors shadow-md"
                >
                  Browse products <FiArrowRight size={15} />
                </Link>
                {!user && (
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/25 text-white font-semibold text-sm hover:bg-white/10 transition-colors backdrop-blur-sm"
                  >
                    Start selling free <FiChevronRight size={15} />
                  </Link>
                )}
                {user?.role === 'seller' && (
                  <Link
                    to="/seller"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/25 text-white font-semibold text-sm hover:bg-white/10 transition-colors backdrop-blur-sm"
                  >
                    Seller dashboard <FiChevronRight size={15} />
                  </Link>
                )}
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/25 text-white font-semibold text-sm hover:bg-white/10 transition-colors backdrop-blur-sm"
                  >
                    Admin console <FiChevronRight size={15} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom controls row */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full pb-8 flex items-center justify-between">
          {/* Slide dots */}
          <div className="flex items-center gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === active
                    ? 'w-7 h-2 bg-white'
                    : 'w-2 h-2 bg-white/35 hover:bg-white/60'
                }`}
              />
            ))}
          </div>

          {/* Prev / Next arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              aria-label="Previous slide"
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
            >
              <FiChevronLeft size={17} />
            </button>
            <button
              onClick={next}
              aria-label="Next slide"
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
            >
              <FiChevronRight size={17} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Main Page ─── */
export default function Home() {
  const navigate = useNavigate();
  const { user } = useApp();
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [featured, setFeatured] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const t = setTimeout(() => {
      setFeatured(PRODUCTS.filter(p => p.featured || p.rating >= 4.5).slice(0, 8));
      setFeaturedLoading(false);
    }, 400);
    return () => clearTimeout(t);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/products?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <div className="bg-white">

      {/* ── HERO CAROUSEL ── */}
      <HeroCarousel search={search} setSearch={setSearch} onSearch={handleSearch} user={user} />

      {/* ── STATS STRIP ── */}
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-700/60">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center px-4 py-1">
                <p className="text-xl md:text-2xl font-bold text-white mb-0.5">{value}</p>
                <p className="text-xs text-slate-400 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CATEGORIES ── */}
      <section className="py-14 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">Browse by category</p>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Find what you need on campus</h2>
            </div>
            <Link to="/products" className="hidden sm:inline-flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors">
              View all <FiArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {(CATEGORIES || []).map((cat) => (
              <Link
                key={cat.slug}
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="group flex flex-col items-center gap-2.5 p-3.5 md:p-4 rounded-2xl bg-slate-50 hover:bg-white border border-transparent hover:border-blue-100 hover:shadow-sm transition-all"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cat.color} transition-transform group-hover:scale-110`}>
                  <CategoryIcon name={cat.iconName} size={18} />
                </div>
                <p className="text-xs font-medium text-gray-700 text-center leading-snug">{cat.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="py-14 md:py-20 bg-slate-50/60 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">Featured listings</p>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Top picks from verified sellers</h2>
            </div>
            <Link to="/products" className="hidden sm:inline-flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors">
              See all <FiArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredLoading
              ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : featured.map(p => <ProductCard key={p.id} product={p} />)
            }
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link to="/products" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              View all products <FiArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── TRUST PILLARS ── */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3">Why REKTINA MARKET</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-3">
              Built for campus. Built for trust.
            </h2>
            <p className="text-gray-500 text-base max-w-xl mx-auto leading-relaxed">
              Every feature on REKTINA MARKET exists to protect buyers, empower sellers, and make campus commerce as safe and efficient as possible.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TRUST_PILLARS.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="surface-card p-6 flex flex-col gap-4 hover:shadow-md transition-shadow">
                  <div className={`w-11 h-11 rounded-xl ${p.color} flex items-center justify-center shrink-0`}>
                    <Icon size={19} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 leading-snug">{p.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW UVEA WORKS ── */}
      <section className="py-16 md:py-24 bg-slate-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3">Escrow explained</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-3">
              How UVEA protects every transaction
            </h2>
            <p className="text-gray-500 text-base max-w-lg mx-auto leading-relaxed">
              UVEA is the escrow layer built into every REKTINA MARKET order. Your money is never at risk.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { step: '01', icon: FiShield, title: 'Buyer pays into escrow', desc: 'Payment is captured by UVEA. The seller sees the order but does not yet receive any funds.' },
              { step: '02', icon: FiPackage, title: 'Seller ships the order', desc: 'The seller fulfils and dispatches the order, then marks it as delivered on the dashboard.' },
              { step: '03', icon: FiCheckCircle, title: 'Buyer confirms receipt', desc: 'You confirm you received the item in good condition — or open a dispute within 48 hours.' },
              { step: '04', icon: FiZap, title: 'Funds released instantly', desc: 'On confirmation, funds are released to the seller. If no dispute is raised, auto-release triggers after 48 hours.' },
            ].map(s => {
              const Icon = s.icon;
              return (
                <div key={s.step} className="relative surface-card p-5">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block mb-3">{s.step}</span>
                  <Icon size={20} className="text-blue-600 mb-3" />
                  <h4 className="font-semibold text-gray-900 text-sm mb-2 leading-snug">{s.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3">Real reviews</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              Trusted by students across Nigeria
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="surface-card p-6 flex flex-col gap-4 hover:shadow-md transition-shadow">
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }, (_, i) => (
                    <FaStar key={i} size={13} className="text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed flex-1">"{t.content}"</p>
                <div className="flex items-center gap-3 pt-3 border-t border-gray-50">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SUBSCRIPTION CTA ── */}
      <section className="py-16 md:py-24 bg-slate-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="rounded-2xl overflow-hidden relative">
            {/* BG image */}
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&q=80"
                alt=""
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/90 to-slate-900/60" />
            </div>

            <div className="relative px-8 py-12 md:px-14 md:py-16 flex flex-col md:flex-row md:items-center gap-8">
              <div className="flex-1">
                <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-3">Start selling today</p>
                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-3">
                  14-day free trial. No card required.
                </h2>
                <p className="text-slate-300 text-base leading-relaxed max-w-md">
                  Create a seller account and get full access to listings, UVEA escrow, and RETINAview analytics for 14 days — completely free. Upgrade to a paid plan from ₦1,850/month when you're ready.
                </p>

                {/* Plan comparison pills */}
                <div className="flex flex-wrap gap-2 mt-6">
                  {[
                    { name: 'Free', price: 'Free', note: 'Trial' },
                    { name: 'Monthly', price: '₦1,850', note: '/month' },
                    { name: 'Semester', price: '₦8,500', note: '~23% off' },
                    { name: 'Full Session', price: '₦15,900', note: 'Best value' },
                  ].map(plan => (
                    <div key={plan.name} className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 text-white text-xs">
                      <span className="font-semibold">{plan.name}</span>
                      <span className="text-slate-300 ml-1.5">{plan.price}</span>
                      <span className="text-slate-400 ml-1">· {plan.note}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 shrink-0">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-blue-600/30"
                >
                  Create account <FiArrowRight size={15} />
                </Link>
                <Link
                  to="/subscription"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-white/20 text-white font-medium text-sm hover:bg-white/10 transition-colors"
                >
                  View all plans
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
