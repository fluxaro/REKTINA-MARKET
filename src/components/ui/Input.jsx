import React from 'react';

const Input = React.forwardRef(({
  label, error, icon: Icon, className = '', ...props
}, ref) => (
  <div className="w-full">
    {label && <label className="text-xs font-medium text-gray-600 block mb-1.5">{label}</label>}
    <div className="relative">
      {Icon && <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />}
      <input
        ref={ref}
        className={`input-base ${Icon ? 'pl-10' : ''} ${error ? 'border-red-400 focus:border-red-500' : ''} ${className}`}
        {...props}
      />
    </div>
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
));

Input.displayName = 'Input';
export default Input;
