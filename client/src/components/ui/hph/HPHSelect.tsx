import React from 'react';
import { ArrowDown01Icon } from 'hugeicons-react';
import { cn } from '@/lib/utils';

interface HPHSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  icon?: React.ReactNode;
  containerClassName?: string;
  error?: string;
  options: Array<{ value: string | number; label: string }>;
  placeholder?: string;
}

export const HPHSelect = React.forwardRef<HTMLSelectElement, HPHSelectProps>(({ 
  label, 
  icon, 
  containerClassName = '', 
  className = '', 
  error,
  options,
  placeholder,
  ...props 
}, ref) => {
  return (
    <div className={cn("space-y-2", containerClassName)}>
      {label && (
        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wide">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-4 text-muted-foreground pointer-events-none">
            {icon}
          </div>
        )}
        <select
          ref={ref}
          className={cn(
            "w-full bg-background border border-input rounded-xl py-3 px-4 text-sm text-foreground",
            "focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm appearance-none font-medium",
            icon ? 'pl-11 pr-10' : 'pr-10',
            error && 'border-destructive focus:border-destructive focus:ring-destructive',
            className
          )}
          {...props}
        >
          {placeholder && <option value="" disabled hidden selected={!props.value && !props.defaultValue}>{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 text-muted-foreground pointer-events-none">
          <ArrowDown01Icon className="w-5 h-5" />
        </div>
      </div>
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
});

HPHSelect.displayName = 'HPHSelect';
