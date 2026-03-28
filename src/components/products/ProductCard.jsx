import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiEye } from 'react-icons/fi';
import { FaHeart, FaStar } from 'react-icons/fa';
import { useApp } from '../../context/AppContext';

export default function ProductCard({ product, view = 'grid' }) {
  const { addToCart } = useApp();
  const [wished, setWished] = useState(false);
  const [adding, setAdding] = useState(false);

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const handleAdd = async (e) => {
    e.preventDefault();
    setAdding(true);
    addToCart(product);
    setTimeout(() => setAdding(false), 800);
  };

  if (view === 'list') {
    return (
      <div className="flex gap-4 p-4 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md hover:border-blue-100 transition-all animate-fade-in group">
        <Link to={`/products/${product.id}`} className="shrink-0 relative">
          <img src={product.images[0]} alt={product.name} className="w-28 h-28 object-cover rounded-xl" loading="lazy" />
          {discount > 0 && (
            <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-red-500 text-white text-[10px] font-bold">-{discount}%</span>
          )}
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400 mb-0.5">{product.sellerName}</p>
          <Link to={`/products/${product.id}`}>
            <h3 className="font-semibold text-sm text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 leading-snug">{product.name}</h3>
          </Link>
          <div className="flex items-center gap-1 mt-1.5">
            {[1,2,3,4,5].map(i => <FaStar key={i} size={10} className={i <= Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-200'} />)}
            <span className="text-xs text-gray-400 ml-1">({product.reviewCount})</span>
          </div>
          <p className="text-xs text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">{product.description}</p>
        </div>
        <div className="flex flex-col items-end justify-between shrink-0">
          <div className="text-right">
            <p className="font-black text-blue-600 text-base">₦{product.price.toFixed(2)}</p>
            {discount > 0 && <p className="text-xs text-gray-400 line-through">₦{product.originalPrice.toFixed(2)}</p>}
          </div>
          <button onClick={handleAdd}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${adding ? 'bg-blue-100 text-blue-600' : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105'}`}>
            <FiShoppingCart size={13} /> {adding ? 'Added!' : 'Add to Cart'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 animate-fade-in flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-50" style={{ aspectRatio: '1/1' }}>
        <Link to={`/products/${product.id}`}>
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="px-2 py-0.5 rounded-lg bg-red-500 text-white text-[10px] font-black shadow-sm">
              -{discount}%
            </span>
          )}
          {product.stock < 10 && product.stock > 0 && (
            <span className="px-2 py-0.5 rounded-lg bg-orange-500 text-white text-[10px] font-bold shadow-sm">
              Low Stock
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={() => setWished(w => !w)}
          className="absolute top-3 right-3 w-8 h-8 rounded-xl bg-white shadow-md flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          aria-label="Wishlist"
        >
          {wished
            ? <FaHeart size={14} className="text-red-500" />
            : <FiHeart size={14} className="text-gray-400" />
          }
        </button>

        {/* Quick view overlay */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <Link to={`/products/${product.id}`}
            className="flex items-center justify-center gap-2 py-2.5 bg-gray-900/90 text-white text-xs font-semibold backdrop-blur-sm hover:bg-gray-900 transition-colors">
            <FiEye size={13} /> Quick View
          </Link>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-gray-400 mb-1 truncate">{product.sellerName}</p>
        <Link to={`/products/${product.id}`}>
          <h3 className="font-semibold text-sm text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 leading-snug mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Stars */}
        <div className="flex items-center gap-1 mb-3">
          {[1,2,3,4,5].map(i => (
            <FaStar key={i} size={11} className={i <= Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-200'} />
          ))}
          <span className="text-xs text-gray-400 ml-1">({product.reviewCount})</span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto gap-2">
          <div>
            <p className="font-black text-blue-600 text-base leading-none">₦{product.price.toFixed(2)}</p>
            {discount > 0 && (
              <p className="text-xs text-gray-400 line-through mt-0.5">₦{product.originalPrice.toFixed(2)}</p>
            )}
          </div>
          <button
            onClick={handleAdd}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${adding ? 'bg-blue-100 text-blue-600 scale-95' : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 active:scale-95 shadow-sm'}`}
          >
            <FiShoppingCart size={13} />
            {adding ? 'Added!' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
