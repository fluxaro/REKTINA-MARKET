const variants = {
  green:  'bg-green-50 text-green-600 border-green-100',
  red:    'bg-red-50 text-red-500 border-red-100',
  yellow: 'bg-yellow-50 text-yellow-600 border-yellow-100',
  blue:   'bg-blue-50 text-blue-600 border-blue-100',
  gray:   'bg-gray-100 text-gray-500 border-gray-200',
};

export default function Badge({ children, variant = 'gray', className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
