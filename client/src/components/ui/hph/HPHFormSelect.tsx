import React, { forwardRef } from 'react';
import { ArrowDown01Icon } from 'hugeicons-react';
import { cn } from '@/lib/utils';

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
      <label className="block text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wide">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <div className="relative">
        <select 
          ref={ref}
          className={cn(
            "w-full bg-background border rounded-xl py-3 text-sm text-foreground appearance-none font-bold",
            "placeholder:text-muted-foreground",
            "focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm disabled:opacity-50",
            icon ? 'pl-11 pr-10' : 'pl-4 pr-10',
            error ? 'border-destructive' : 'border-input',
            props.disabled && "cursor-not-allowed opacity-50"
          )}
          {...props}
        >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
        <div className="absolute right-4 top-3 w-5 h-5 text-muted-foreground pointer-events-none">
          <ArrowDown01Icon />
        </div>
      </div>
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
});

HPHFormSelect.displayName = 'HPHFormSelect';
