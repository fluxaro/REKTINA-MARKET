import React from 'react';
import { FiChevronDown } from 'react-icons/fi';

const Select = React.forwardRef(({ label, options = [], className = '', ...props }, ref) => (
  <div className="w-full">
    {label && <label className="text-xs font-medium text-gray-600 block mb-1.5">{label}</label>}
    <div className="relative">
      <select
        ref={ref}
        className={`input-base appearance-none pr-9 cursor-pointer ${className}`}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>{opt.label ?? opt}</option>
        ))}
      </select>
      <FiChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  </div>
));

Select.displayName = 'Select';
export default Select;
