import { FiCheckCircle, FiXCircle, FiInfo, FiX } from 'react-icons/fi';
import { useApp } from '../../context/AppContext';

const icons = {
  success: <FiCheckCircle size={18} className="text-blue-600" />,
  error:   <FiXCircle size={18} className="text-red-500" />,
  info:    <FiInfo size={18} className="text-blue-400" />,
};

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className="animate-slide-in pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg min-w-[280px] max-w-sm bg-white border border-gray-100"
        >
          {icons[t.type] || icons.success}
          <span className="text-sm flex-1 text-gray-800">{t.message}</span>
          <button onClick={() => removeToast(t.id)} className="text-gray-300 hover:text-gray-500 transition-colors">
            <FiX size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
