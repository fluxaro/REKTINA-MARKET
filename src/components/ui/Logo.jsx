import { Link } from 'react-router-dom';
import { FiTrendingUp } from 'react-icons/fi';

export default function Logo({ to = '/', size = 'md', variant = 'default', className = '' }) {
  const sizes = {
    sm: { box: 'w-7 h-7', icon: 14, text: 'text-sm' },
    md: { box: 'w-8 h-8', icon: 16, text: 'text-base' },
    lg: { box: 'w-9 h-9', icon: 18, text: 'text-lg' },
  };
  const s = sizes[size] || sizes.md;

  const isLight = variant === 'light';

  const content = (
    <>
      <div className={`${s.box} rounded-xl bg-blue-600 flex items-center justify-center shadow-sm shrink-0`}>
        <FiTrendingUp size={s.icon} className="text-white" />
      </div>
      <div className={`${s.text} tracking-tight leading-none`}>
        <span className={`font-bold ${isLight ? 'text-white' : 'text-gray-900'}`}>REKTINA</span>
        <span className={`font-bold ${isLight ? 'text-blue-300' : 'text-blue-600'}`}> MARKET</span>
      </div>
    </>
  );

  const cls = `flex items-center gap-2.5 ${className}`;

  if (to) {
    return (
      <Link to={to} className={cls}>
        {content}
      </Link>
    );
  }

  return <div className={cls}>{content}</div>;
}
