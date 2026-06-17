export const colors = {
  primary: {
    50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd',
    400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8',
    800: '#1e40af', 900: '#1e3a8a',
  },
  success: { 50: '#f0fdf4', 100: '#dcfce7', 500: '#22c55e', 600: '#16a34a' },
  error: { 50: '#fef2f2', 100: '#fee2e2', 500: '#ef4444', 600: '#dc2626' },
  warning: { 50: '#fffbeb', 100: '#fef3c7', 500: '#eab308', 600: '#ca8a04' },
  neutral: {
    0: '#ffffff', 50: '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb',
    300: '#d1d5db', 400: '#9ca3af', 500: '#6b7280', 600: '#4b5563',
    700: '#374151', 800: '#1f2937', 900: '#111827',
  },
};

export const componentStyles = {
  button: {
    base: 'inline-flex items-center justify-center font-medium transition-colors duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
    sizes: {
      xs: 'px-2.5 py-1.5 text-xs rounded-lg',
      sm: 'px-3 py-2 text-sm rounded-lg',
      md: 'px-4 py-2.5 text-sm rounded-xl',
      lg: 'px-5 py-3 text-base rounded-xl',
    },
    variants: {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
      secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
      outline: 'border border-gray-200 text-gray-700 hover:bg-gray-50',
      ghost: 'text-gray-700 hover:bg-gray-100',
      danger: 'bg-red-600 text-white hover:bg-red-700',
      success: 'bg-emerald-600 text-white hover:bg-emerald-700',
    },
  },
};
