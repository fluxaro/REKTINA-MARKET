export default function StatCard({ icon: Icon, label, value, change, up = true, accent = 'blue' }) {
  const accents = {
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        {Icon && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accents[accent] || accents.blue}`}>
            <Icon size={18} />
          </div>
        )}
        {change && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${up ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
            {change}
          </span>
        )}
      </div>
      <p className="text-2xl font-semibold text-gray-900 tracking-tight">{value}</p>
      <p className="text-xs text-gray-500 mt-1 font-medium">{label}</p>
    </div>
  );
}
