import React, { forwardRef } from 'react';

interface HPHFormTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  icon?: React.ReactNode;
  error?: string;
  className?: string;
  required?: boolean;
}

export const HPHFormTextArea = forwardRef<HTMLTextAreaElement, HPHFormTextAreaProps>(({
  label,
  icon,
  error,
  className = '',
  required,
  ...props
}, ref) => {
  return (
    <div className={className}>
      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-3 w-5 h-5 text-gray-400 pointer-events-none">
            {icon}
          </div>
        )}
        <textarea 
          ref={ref}
          className={`w-full bg-white dark:bg-[#151525] border ${
           error ? 'border-red-500' : 'border-gray-200 dark:border-[#252540]'
          } rounded-xl ${icon ? 'pl-11' : 'pl-4'} pr-4 py-3 text-sm text-gray-900 dark:text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all shadow-sm resize-none disabled:opacity-50`} 
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
});

HPHFormTextArea.displayName = 'HPHFormTextArea';
