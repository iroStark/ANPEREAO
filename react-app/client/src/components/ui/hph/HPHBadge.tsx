import React from 'react';
import { cn } from '@/lib/utils';

type HPHBadgeVariant = 'blue' | 'primary' | 'orange' | 'green' | 'red' | 'gray' | 'teal';

interface HPHBadgeProps {
  children: React.ReactNode;
  variant?: HPHBadgeVariant;
  className?: string;
}

export const HPHBadge: React.FC<HPHBadgeProps> = ({ children, variant = 'gray', className = '' }) => {
  const variants: Record<HPHBadgeVariant, string> = {
    // Mapping colors to system-aware values where possible, or keeping generic tailwind colors but ensuring dark mode compatibility via opacity
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
    primary: 'bg-primary/10 text-primary',
    teal: 'bg-teal-100 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400',
    orange: 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400',
    green: 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400',
    red: 'bg-destructive/10 text-destructive',
    gray: 'bg-muted text-muted-foreground',
  };

  return (
    <span className={cn(
      "px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
};
