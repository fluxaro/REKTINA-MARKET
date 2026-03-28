import { FaStar } from 'react-icons/fa';

export default function StarRating({ rating, interactive = false, onChange, size = 16 }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type={interactive ? 'button' : undefined}
          onClick={interactive && onChange ? () => onChange(i) : undefined}
          className={interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}
          style={{ fontSize: size }}
          aria-label={interactive ? `Rate ${i} star${i > 1 ? 's' : ''}` : undefined}
        >
          <FaStar
            size={size}
            className={i <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-200'}
          />
        </button>
      ))}
    </div>
  );
}
