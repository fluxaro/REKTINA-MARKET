import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiFilter, FiX, FiGrid, FiList, FiChevronDown } from 'react-icons/fi';
import { PRODUCTS, CATEGORIES } from '../data/mockData';
import ProductCard from '../components/products/ProductCard';
import { ProductCardSkeleton } from '../components/ui/Skeleton';

const SORT_OPTIONS = [
  { label: 'Featured First', value: 'featured' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Best Rated', value: 'rated' },
  { label: 'Most Reviews', value: 'reviews' },
];

const PRICE_RANGES = [
  { label: 'Any Price', min: 0, max: Infinity },
  { label: 'Under ₦5,000', min: 0, max: 5000 },
  { label: '₦5,000 – ₦20,000', min: 5000, max: 20000 },
  { label: '₦20,000 – ₦50,000', min: 20000, max: 50000 },
  { label: '₦50,000 – ₦100,000', min: 50000, max: 100000 },
  { label: 'Over ₦100,000', min: 100000, max: Infinity },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState([]);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity });
  const [sort, setSort] = useState('featured');
  const [view, setView] = useState('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    setTimeout(() => { setAllProducts(PRODUCTS); setLoading(false); }, 400);
  }, []);

  const filtered = useMemo(() => {
    let result = [...allProducts];

    if (search) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase()) ||
        p.category?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      result = result.filter(p => p.category?.toLowerCase() === category.toLowerCase());
    }

    result = result.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);

    if (sort === 'price_asc') result.sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') result.sort((a, b) => b.price - a.price);
    else if (sort === 'rated') result.sort((a, b) => b.rating - a.rating);
    else if (sort === 'reviews') result.sort((a, b) => b.reviewCount - a.reviewCount);
    else result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

    return result;
  }, [allProducts, search, category, priceRange, sort]);

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    const params = new URLSearchParams(searchParams);
    if (cat) params.set('category', cat);
    else params.delete('category');
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setPriceRange({ min: 0, max: Infinity });
    setSort('featured');
    setSearchParams({});
  };

  const activeFilters = [
    search && `"${search}"`,
    category,
    priceRange.max !== Infinity && PRICE_RANGES.find(r => r.min === priceRange.min && r.max === priceRange.max)?.label,
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-gray-100 sticky top-14 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <FiSearch size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border border-gray-200 bg-gray-50 outline-none focus:bg-white focus:border-blue-400 transition-all"
            />
          </div>

          {/* Sort */}
          <div className="relative hidden sm:block">
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2.5 rounded-xl text-xs font-semibold border border-gray-200 bg-white text-gray-700 outline-none focus:border-blue-400 cursor-pointer"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <FiChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* View toggle */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setView('grid')}
              className={`p-1.5 rounded-lg transition-colors ${view === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <FiGrid size={14} />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-1.5 rounded-lg transition-colors ${view === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <FiList size={14} />
            </button>
          </div>

          {/* Mobile filter */}
          <button
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-600 hover:bg-gray-50"
          >
            <FiFilter size={14} /> Filters
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">

          {/* Sidebar — Desktop */}
          <aside className="w-56 shrink-0 hidden lg:block">
            <div className="space-y-6 sticky top-28">

              {/* Categories */}
              <div>
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-3">Categories</h3>
                <div className="space-y-1">
                  <button
                    onClick={() => handleCategoryChange('')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${!category ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    All Products
                  </button>
                  {(CATEGORIES || []).map(cat => (
                    <button
                      key={cat.slug}
                      onClick={() => handleCategoryChange(cat.name)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${category === cat.name ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      <span>{cat.icon}</span> {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-3">Price Range</h3>
                <div className="space-y-1">
                  {PRICE_RANGES.map((r, idx) => (
                    <label key={idx} className="flex items-center gap-2.5 cursor-pointer p-2 rounded-xl hover:bg-gray-100 transition-colors">
                      <input
                        type="radio"
                        name="price"
                        checked={priceRange.min === r.min && priceRange.max === r.max}
                        onChange={() => setPriceRange({ min: r.min, max: r.max })}
                        className="accent-blue-600 w-3.5 h-3.5"
                      />
                      <span className="text-xs text-gray-600 font-medium">{r.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear */}
              {activeFilters.length > 0 && (
                <button
                  onClick={clearFilters}
                  className="w-full py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {/* Results header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3 flex-wrap">
                <p className="text-sm text-gray-500 font-medium">
                  {loading ? 'Loading...' : `${filtered.length} product${filtered.length !== 1 ? 's' : ''}`}
                </p>
                {activeFilters.map(f => (
                  <span key={f} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold">
                    {f}
                    <button onClick={clearFilters}><FiX size={10} /></button>
                  </span>
                ))}
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div className={`grid gap-4 ${view === 'list' ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4'}`}>
                {Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
                  <FiSearch size={22} className="text-gray-300" />
                </div>
                <p className="font-semibold text-gray-700 mb-1">No products found</p>
                <p className="text-sm text-gray-400 mb-5">Try adjusting your search or filters</p>
                <button onClick={clearFilters} className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors">
                  Clear filters
                </button>
              </div>
            ) : (
              <div className={`grid gap-4 ${view === 'list' ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4'}`}>
                {filtered.map(p => <ProductCard key={p.id} product={p} view={view} />)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
          <div className="relative ml-auto w-72 bg-white h-full overflow-y-auto shadow-2xl flex flex-col animate-slide-in">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="font-black text-gray-900">Filters</h2>
              <button onClick={() => setShowMobileFilters(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><FiX size={18} /></button>
            </div>
            <div className="p-4 space-y-6 flex-1">
              {/* Same filter content */}
              <div>
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-3">Categories</h3>
                <div className="space-y-1">
                  <button onClick={() => { handleCategoryChange(''); setShowMobileFilters(false); }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${!category ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                    All Products
                  </button>
                  {(CATEGORIES || []).map(cat => (
                    <button key={cat.slug} onClick={() => { handleCategoryChange(cat.name); setShowMobileFilters(false); }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${category === cat.name ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                      <span>{cat.icon}</span> {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-3">Price Range</h3>
                <div className="space-y-1">
                  {PRICE_RANGES.map((r, idx) => (
                    <label key={idx} className="flex items-center gap-2.5 cursor-pointer p-2 rounded-xl hover:bg-gray-100 transition-colors">
                      <input type="radio" name="price_mobile" checked={priceRange.min === r.min && priceRange.max === r.max}
                        onChange={() => setPriceRange({ min: r.min, max: r.max })} className="accent-blue-600 w-3.5 h-3.5" />
                      <span className="text-xs text-gray-600 font-medium">{r.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-3">Sort By</h3>
                <select value={sort} onChange={e => setSort(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-xs font-semibold border border-gray-200 bg-white text-gray-700 outline-none focus:border-blue-400 cursor-pointer">
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 flex gap-2">
              <button onClick={() => { clearFilters(); setShowMobileFilters(false); }}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-500 hover:bg-gray-50">
                Clear
              </button>
              <button onClick={() => setShowMobileFilters(false)}
                className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors">
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
