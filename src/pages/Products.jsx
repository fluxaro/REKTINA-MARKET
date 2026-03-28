import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiSliders, FiGrid, FiList, FiX, FiChevronDown, FiSearch, FiFilter } from 'react-icons/fi';
import { apiGetProducts } from '../api/mockApi';
import { CATEGORIES } from '../data/mockData';
import ProductCard from '../components/products/ProductCard';
import { ProductCardSkeleton } from '../components/ui/Skeleton';
import CategoryIcon from '../components/ui/CategoryIcon';

const SORT_OPTIONS = [
  { value: 'newest',    label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc',label: 'Price: High → Low' },
  { value: 'rating',    label: 'Top Rated' },
];

const PRICE_RANGES = [
  { label: 'Under ₦50',    min: '', max: '50' },
  { label: '₦50 – ₦100',  min: '50', max: '100' },
  { label: '₦100 – ₦250', min: '100', max: '250' },
  { label: 'Over ₦250',   min: '250', max: '' },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('grid');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    inStock: false,
    sort: searchParams.get('sort') || 'newest',
  });
  const [searchInput, setSearchInput] = useState(filters.search);

  useEffect(() => {
    const t = setTimeout(() => setFilters(f => ({ ...f, search: searchInput })), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    const cat = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';
    setFilters(f => ({ ...f, category: cat, search }));
    setSearchInput(search);
  }, [searchParams]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiGetProducts(filters);
      setProducts(data);
    } finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const updateFilter = (key, val) => setFilters(f => ({ ...f, [key]: val }));
  const clearFilters = () => {
    setFilters({ search: '', category: '', minPrice: '', maxPrice: '', minRating: '', inStock: false, sort: 'newest' });
    setSearchInput('');
    setSearchParams({});
  };

  const activeFilterCount = [filters.category, filters.minPrice, filters.maxPrice, filters.minRating, filters.inStock].filter(Boolean).length;

  const FilterPanel = () => (
    <div className="space-y-7">
      {/* Categories */}
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Category</p>
        <div className="space-y-0.5">
          <button onClick={() => updateFilter('category', '')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors ${!filters.category ? 'bg-blue-600 text-white font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}>
            <FiGrid size={14} /> All Categories
            {!filters.category && <span className="ml-auto text-blue-200 text-xs">{products.length}</span>}
          </button>
          {CATEGORIES.map(c => (
            <button key={c.id} onClick={() => updateFilter('category', c.name)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors ${filters.category === c.name ? 'bg-blue-600 text-white font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}>
              <CategoryIcon name={c.iconName} size={14} />
              {c.name}
              <span className={`ml-auto text-xs ${filters.category === c.name ? 'text-blue-200' : 'text-gray-400'}`}>{c.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price ranges */}
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Price Range</p>
        <div className="space-y-1.5">
          {PRICE_RANGES.map(r => {
            const active = filters.minPrice === r.min && filters.maxPrice === r.max;
            return (
              <button key={r.label} onClick={() => { updateFilter('minPrice', active ? '' : r.min); updateFilter('maxPrice', active ? '' : r.max); }}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${active ? 'bg-blue-50 text-blue-600 font-semibold border border-blue-200' : 'text-gray-600 hover:bg-gray-100'}`}>
                {r.label}
              </button>
            );
          })}
        </div>
        <div className="flex gap-2 mt-3">
          <input type="number" placeholder="Min ₦" value={filters.minPrice} onChange={e => updateFilter('minPrice', e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-sm border border-gray-200 bg-white outline-none focus:border-blue-400 transition-colors" />
          <input type="number" placeholder="Max ₦" value={filters.maxPrice} onChange={e => updateFilter('maxPrice', e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-sm border border-gray-200 bg-white outline-none focus:border-blue-400 transition-colors" />
        </div>
      </div>

      {/* Rating */}
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Min Rating</p>
        <div className="flex gap-2 flex-wrap">
          {[4, 3, 2].map(r => (
            <button key={r} onClick={() => updateFilter('minRating', filters.minRating == r ? '' : r)}
              className={`px-3 py-1.5 rounded-xl text-sm border transition-colors ${filters.minRating == r ? 'border-blue-600 bg-blue-50 text-blue-600 font-semibold' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
              {r}★ & up
            </button>
          ))}
        </div>
      </div>

      {/* In Stock */}
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Availability</p>
        <label className="flex items-center gap-3 cursor-pointer group">
          <div onClick={() => updateFilter('inStock', !filters.inStock)}
            className={`w-11 h-6 rounded-full transition-colors relative ${filters.inStock ? 'bg-blue-600' : 'bg-gray-200'}`}>
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${filters.inStock ? 'translate-x-6' : 'translate-x-1'}`} />
          </div>
          <span className="text-sm text-gray-700 group-hover:text-gray-900">In Stock Only</span>
        </label>
      </div>

      {activeFilterCount > 0 && (
        <button onClick={clearFilters}
          className="w-full py-2.5 rounded-xl border border-red-200 text-red-500 text-sm font-semibold hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
          <FiX size={14} /> Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <nav className="flex items-center gap-2 text-xs text-gray-400 mb-3">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-700 font-medium">Products</span>
            {filters.category && <><span>/</span><span className="text-blue-600 font-medium">{filters.category}</span></>}
          </nav>
          <h1 className="text-2xl font-black text-gray-900">
            {filters.category || 'All Products'}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {loading ? 'Loading...' : `${products.length} product${products.length !== 1 ? 's' : ''} available`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6">

          {/* Sidebar desktop */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <p className="font-bold text-sm text-gray-900">Filters</p>
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">{activeFilterCount}</span>
                )}
              </div>
              <FilterPanel />
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center gap-2 mb-5 flex-wrap">
              <div className="relative flex-1 min-w-[180px]">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input type="text" value={searchInput} onChange={e => setSearchInput(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-gray-200 bg-white outline-none focus:border-blue-400 transition-colors shadow-sm" />
              </div>

              <button onClick={() => setSidebarOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:border-blue-300 shadow-sm transition-colors">
                <FiFilter size={14} /> Filters
                {activeFilterCount > 0 && <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">{activeFilterCount}</span>}
              </button>

              <div className="relative">
                <select value={filters.sort} onChange={e => updateFilter('sort', e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 outline-none focus:border-blue-400 cursor-pointer shadow-sm">
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={13} />
              </div>

              <div className="flex rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm">
                <button onClick={() => setView('grid')} className={`p-2.5 transition-colors ${view === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-50'}`}><FiGrid size={16} /></button>
                <button onClick={() => setView('list')} className={`p-2.5 transition-colors ${view === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-50'}`}><FiList size={16} /></button>
              </div>
            </div>

            {/* Active filter chips */}
            {(filters.category || filters.search || filters.minPrice || filters.maxPrice) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {filters.category && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold border border-blue-100">
                    <CategoryIcon name={CATEGORIES.find(c => c.name === filters.category)?.iconName || 'FiTag'} size={11} />
                    {filters.category}
                    <button onClick={() => updateFilter('category', '')} className="hover:text-blue-800"><FiX size={11} /></button>
                  </span>
                )}
                {filters.search && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold border border-blue-100">
                    "{filters.search}"
                    <button onClick={() => { setSearchInput(''); updateFilter('search', ''); }}><FiX size={11} /></button>
                  </span>
                )}
                {(filters.minPrice || filters.maxPrice) && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold border border-blue-100">
                    ₦{filters.minPrice || '0'} – ₦{filters.maxPrice || '∞'}
                    <button onClick={() => { updateFilter('minPrice', ''); updateFilter('maxPrice', ''); }}><FiX size={11} /></button>
                  </span>
                )}
              </div>
            )}

            {/* Products grid/list */}
            {loading ? (
              <div className={view === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-3'}>
                {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <FiSearch size={24} className="text-gray-400" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-400 text-sm mb-5">Try adjusting your filters or search term</p>
                <button onClick={clearFilters} className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className={view === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-3'}>
                {products.map(p => <ProductCard key={p.id} product={p} view={view} />)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl p-5 overflow-y-auto animate-slide-in">
            <div className="flex items-center justify-between mb-6">
              <p className="font-bold text-gray-900">Filters</p>
              <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"><FiX size={18} /></button>
            </div>
            <FilterPanel />
          </div>
        </div>
      )}
    </div>
  );
}
