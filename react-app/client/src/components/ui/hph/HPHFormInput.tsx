import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface HPHFormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  error?: string;
  className?: string;
  required?: boolean;
}

export const HPHFormInput = forwardRef<HTMLInputElement, HPHFormInputProps>(({
  label,
  icon,
  error,
  className = '',
  required,
  ...props
}, ref) => {
  return (
    <div className={className}>
      <label className="block text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wide">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-3 w-5 h-5 text-muted-foreground pointer-events-none">
            {icon}
          </div>
        )}
        <input 
          ref={ref}
          className={cn(
            "w-full bg-background border rounded-xl py-3 text-sm text-foreground",
            "placeholder:text-muted-foreground",
            "focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm disabled:opacity-50",
            icon ? 'pl-11 pr-4' : 'px-4',
            error ? 'border-destructive' : 'border-input',
            props.disabled && "cursor-not-allowed opacity-50"
          )} 
          {...props}
        />
      </div>
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
});

HPHFormInput.displayName = 'HPHFormInput';
