import { Link } from 'react-router-dom';
import Button from './Button';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
  className = '',
}) {
  return (
    <div className={`text-center py-16 px-6 ${className}`}>
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-5">
          <Icon size={28} className="text-gray-400" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed mb-6">{description}</p>
      )}
      {actionLabel && actionTo && (
        <Link to={actionTo}>
          <Button>{actionLabel}</Button>
        </Link>
      )}
      {actionLabel && onAction && !actionTo && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}
