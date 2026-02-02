import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

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
      <label className="block text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wide">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-3 w-5 h-5 text-muted-foreground pointer-events-none">
            {icon}
          </div>
        )}
        <textarea 
          ref={ref}
          className={cn(
            "w-full bg-background border rounded-xl py-3 text-sm text-foreground resize-none",
            "placeholder:text-muted-foreground",
            "focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm disabled:opacity-50",
            icon ? 'pl-11 pr-4' : 'pl-4 pr-4',
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

HPHFormTextArea.displayName = 'HPHFormTextArea';
