import React from 'react';
import { cn } from '@/lib/utils';

interface HPHInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  containerClassName?: string;
  error?: string;
}

export const HPHInput = React.forwardRef<HTMLInputElement, HPHInputProps>(({ 
  label, 
  icon, 
  containerClassName = '', 
  className = '', 
  error,
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
        <input
          ref={ref}
          className={cn(
            "w-full bg-background border border-input rounded-xl py-3 text-sm text-foreground",
            "placeholder:text-muted-foreground",
            "focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm",
            icon ? 'pl-11' : 'px-4',
            error && 'border-destructive focus:border-destructive focus:ring-destructive',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
});

HPHInput.displayName = 'HPHInput';
