import React from 'react';

interface HPHInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  containerClassName?: string;
  error?: string;
}

export const HPHInput: React.FC<HPHInputProps> = ({ 
  label, 
  icon, 
  containerClassName = '', 
  className = '', 
  error,
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
          <div className="absolute left-4 text-gray-400">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full bg-white dark:bg-[#151525] border border-gray-200 dark:border-[#252540] 
            rounded-xl py-3 text-sm text-gray-900 dark:text-white 
            focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none 
            transition-all shadow-sm
            ${icon ? 'pl-11' : 'px-4'}
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};
