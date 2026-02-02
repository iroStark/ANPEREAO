import React from 'react';
import { ArrowDown01Icon } from 'hugeicons-react';

interface HPHSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  icon?: React.ReactNode;
  containerClassName?: string;
  error?: string;
  options: Array<{ value: string | number; label: string }>;
}

export const HPHSelect: React.FC<HPHSelectProps> = ({ 
  label, 
  icon, 
  containerClassName = '', 
  className = '', 
  error,
  options,
  ...props 
}) => {
  return (
    <div className={`space-y-2 ${containerClassName}`}>
      {label && (
        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-4 text-gray-400 pointer-events-none">
            {icon}
          </div>
        )}
        <select
          className={`
            w-full bg-white dark:bg-[#151525] border border-gray-200 dark:border-[#252540] 
            rounded-xl py-3 px-4 text-sm text-gray-900 dark:text-white 
            focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none 
            transition-all shadow-sm appearance-none font-medium
            ${icon ? 'pl-11 pr-10' : 'pr-10'}
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 text-gray-400 pointer-events-none">
          <ArrowDown01Icon className="w-5 h-5" />
        </div>
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};
