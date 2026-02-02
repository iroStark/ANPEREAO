import React, { forwardRef } from 'react';
import { ArrowDown01Icon } from 'hugeicons-react';

interface HPHFormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  icon?: React.ReactNode;
  error?: string;
  className?: string;
  required?: boolean;
  options: { label: string; value: string | number }[];
  placeholder?: string;
}

export const HPHFormSelect = forwardRef<HTMLSelectElement, HPHFormSelectProps>(({
  label,
  icon,
  error,
  className = '',
  required,
  options,
  placeholder = 'Selecione...',
  ...props
}, ref) => {
  return (
    <div className={className}>
      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <select 
          ref={ref}
          className={`w-full bg-white dark:bg-[#151525] border ${
            error ? 'border-red-500' : 'border-gray-200 dark:border-[#252540]'
          } rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all shadow-sm appearance-none font-bold placeholder:text-gray-400 disabled:opacity-50`}
          {...props}
        >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
        <ArrowDown01Icon className="absolute right-4 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
});

HPHFormSelect.displayName = 'HPHFormSelect';
