import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FiShoppingCart, FiMessageCircle, FiShield, FiTruck, FiArrowLeft,
  FiPlus, FiMinus, FiHeart, FiShare2, FiCheckCircle, FiStar,
  FiPackage, FiRefreshCw,
} from 'react-icons/fi';
import { FaHeart, FaStar } from 'react-icons/fa';
import { useApp } from '../context/AppContext';
import { apiGetProduct, apiGetReviews, apiAddReview } from '../api/mockApi';
import StarRating from '../components/ui/StarRating';
import { Skeleton } from '../components/ui/Skeleton';
import { PRODUCTS } from '../data/mockData';
import ProductCard from '../components/products/ProductCard';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart, user, addToast } = useApp();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('description');
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [wished, setWished] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([apiGetProduct(id), apiGetReviews(id)]).then(([p, r]) => {
      setProduct(p); setReviews(r);
      setSelectedColor(p.variants?.colors?.[0] || '');
      setSelectedSize(p.variants?.sizes?.[0] || '');
    }).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    const variant = [selectedColor, selectedSize].filter(Boolean).join(' / ') || null;
    setAdding(true);
    addToCart(product, variant, qty);
    setTimeout(() => setAdding(false), 800);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) { addToast('Please sign in to leave a review', 'error'); return; }
    setSubmitting(true);
    try {
      const r = await apiAddReview({ ...reviewForm, productId: Number(id), userId: user.id, userName: user.name, verified: true });
      setReviews(prev => [r, ...prev]);
      setReviewForm({ rating: 5, comment: '' });
      addToast('Review submitted!');
    } finally { setSubmitting(false); }
  };

  const related = PRODUCTS.filter(p => p.category === product?.category && p.id !== product?.id).slice(0, 4);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        <Skeleton className="h-96 w-full rounded-2xl" />
        <div className="space-y-4">
          {[80, 40, 60, 100, 40].map((w, i) => <Skeleton key={i} className="h-6 rounded-xl" style={{ width: `${w}%` }} />)}
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <FiPackage size={28} className="text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Product not found</h2>
        <Link to="/products" className="text-blue-600 hover:underline text-sm">Back to products</Link>
      </div>
    </div>
  );

  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-blue-600 transition-colors">Products</Link>
          <span>/</span>
          <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-blue-600 transition-colors">{product.category}</Link>
          <span>/</span>
          <span className="text-gray-700 font-medium line-clamp-1">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Images */}
          <div className="space-y-3">
            <div className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm aspect-square">
              <img src={product.images[selectedImg]} alt={product.name} className="w-full h-full object-cover" />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImg(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${i === selectedImg ? 'border-blue-600 shadow-md' : 'border-transparent hover:border-gray-300'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Link to={`/products?category=${encodeURIComponent(product.category)}`}
                  className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-100 transition-colors">
                  {product.category}
                </Link>
                <Link to={`/products?seller=${product.sellerId}`}
                  className="text-xs text-gray-400 hover:text-blue-600 transition-colors">
                  by {product.sellerName}
                </Link>
              </div>
              <h1 className="text-2xl font-black text-gray-900 leading-snug">{product.name}</h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => <FaStar key={i} size={15} className={i <= Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-200'} />)}
              </div>
              <span className="text-sm font-semibold text-gray-700">{product.rating}</span>
              <span className="text-sm text-gray-400">({product.reviewCount} reviews)</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${product.stock > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 py-3 border-y border-gray-100">
              <span className="text-4xl font-black text-blue-600">₦{product.price.toFixed(2)}</span>
              {discount > 0 && (
                <>
                  <span className="text-lg text-gray-400 line-through">₦{product.originalPrice.toFixed(2)}</span>
                  <span className="px-2.5 py-1 rounded-xl bg-red-50 text-red-500 text-sm font-bold">Save {discount}%</span>
                </>
              )}
            </div>

            {/* Colors */}
            {product.variants?.colors?.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Color: <span className="text-blue-600 font-bold">{selectedColor}</span></p>
                <div className="flex gap-2 flex-wrap">
                  {product.variants.colors.map(c => (
                    <button key={c} onClick={() => setSelectedColor(c)}
                      className={`px-4 py-2 rounded-xl text-sm border-2 transition-all font-medium ${selectedColor === c ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.variants?.sizes?.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Size: <span className="text-blue-600 font-bold">{selectedSize}</span></p>
                <div className="flex gap-2 flex-wrap">
                  {product.variants.sizes.map(s => (
                    <button key={s} onClick={() => setSelectedSize(s)}
                      className={`px-4 py-2 rounded-xl text-sm border-2 transition-all font-medium ${selectedSize === s ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <p className="text-sm font-semibold text-gray-700">Quantity:</p>
              <div className="flex items-center rounded-xl border-2 border-gray-200 overflow-hidden bg-white">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3.5 py-2.5 hover:bg-gray-50 transition-colors text-gray-600 font-bold"><FiMinus size={14} /></button>
                <span className="px-5 py-2.5 text-sm font-black min-w-[3rem] text-center border-x border-gray-200">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="px-3.5 py-2.5 hover:bg-gray-50 transition-colors text-gray-600 font-bold"><FiPlus size={14} /></button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button onClick={handleAddToCart} disabled={product.stock === 0}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all ${adding ? 'bg-blue-100 text-blue-600' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-blue-200 hover:scale-[1.02] active:scale-[0.98]'} disabled:opacity-50`}>
                <FiShoppingCart size={18} /> {adding ? 'Added to Cart!' : 'Add to Cart'}
              </button>
              <button onClick={() => setWished(w => !w)}
                className={`px-4 py-3.5 rounded-xl border-2 transition-all ${wished ? 'border-red-200 bg-red-50 text-red-500' : 'border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-400'}`}>
                {wished ? <FaHeart size={18} /> : <FiHeart size={18} />}
              </button>
              <button onClick={() => { navigator.clipboard?.writeText(window.location.href); addToast('Link copied!', 'info'); }}
                className="px-4 py-3.5 rounded-xl border-2 border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600 transition-all">
                <FiShare2 size={18} />
              </button>
            </div>

            {/* Chat with seller */}
            <Link to="/messages"
              className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 font-semibold text-sm transition-all">
              <FiMessageCircle size={16} /> Chat with Seller
            </Link>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              {[[FiShield, 'Secure Payment'], [FiTruck, 'Fast Delivery'], [FiRefreshCw, '30-Day Returns']].map(([Icon, text]) => (
                <div key={text} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-gray-50 border border-gray-100 text-center">
                  <Icon size={16} className="text-blue-600" />
                  <span className="text-xs text-gray-500 font-medium leading-tight">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden mb-12">
          <div className="flex border-b border-gray-100">
            {['description', 'reviews'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-6 py-4 text-sm font-semibold capitalize transition-colors ${tab === t ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-400 hover:text-gray-700'}`}>
                {t} {t === 'reviews' && `(${reviews.length})`}
              </button>
            ))}
          </div>
          <div className="p-6">
            {tab === 'description' ? (
              <div>
                <p className="text-sm leading-relaxed text-gray-600 mb-6">{product.description}</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[['Category', product.category], ['Seller', product.sellerName], ['Stock', `${product.stock} units`], ['Rating', `${product.rating}/5 (${product.reviewCount} reviews)`]].map(([k, v]) => (
                    <div key={k} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                      <span className="text-xs font-semibold text-gray-400 w-20 shrink-0">{k}</span>
                      <span className="text-sm text-gray-700 font-medium">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <form onSubmit={handleReviewSubmit} className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4">Write a Review</h3>
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">Your Rating</p>
                    <StarRating rating={reviewForm.rating} interactive onChange={r => setReviewForm(f => ({ ...f, rating: r }))} size={24} />
                  </div>
                  <textarea value={reviewForm.comment} onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                    placeholder="Share your experience with this product..." rows={3}
                    className="w-full px-4 py-3 rounded-xl text-sm border border-gray-200 bg-white outline-none resize-none focus:border-blue-400 transition-colors" />
                  <button type="submit" disabled={submitting || !reviewForm.comment}
                    className="mt-3 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm disabled:opacity-50 transition-colors">
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>

                {reviews.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-8">No reviews yet. Be the first to review!</p>
                ) : reviews.map(r => (
                  <div key={r.id} className="p-5 rounded-2xl border border-gray-100 bg-white">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                          {r.userName[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-gray-900">{r.userName}</span>
                            {r.verified && <span className="flex items-center gap-1 text-xs text-blue-600 font-medium"><FiCheckCircle size={11} /> Verified</span>}
                          </div>
                          <div className="flex gap-0.5 mt-0.5">
                            {[1,2,3,4,5].map(i => <FaStar key={i} size={11} className={i <= r.rating ? 'text-yellow-400' : 'text-gray-200'} />)}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">{r.date}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-gray-900">Related Products</h2>
              <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="text-sm text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
