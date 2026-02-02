import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

type HPHButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'outline' | 'teal';
type HPHButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface HPHButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: HPHButtonVariant;
  size?: HPHButtonSize;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  loading?: boolean;
  asChild?: boolean;
}

export const HPHButton: React.FC<HPHButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  icon,
  className = '',
  loading = false,
  asChild = false,
  disabled,
  ...props 
}) => {
  const Component = asChild ? Slot : 'button';
  
  const variants: Record<HPHButtonVariant, string> = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95',
    secondary: 'bg-background border border-input text-foreground hover:bg-accent hover:text-accent-foreground hover:border-accent',
    success: 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-600/20 hover:scale-[1.02] active:scale-95', 
    danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg shadow-destructive/20 hover:scale-[1.02] active:scale-95',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    outline: 'border-2 border-primary text-primary hover:bg-primary/10',
    teal: 'bg-teal-600 text-white hover:bg-teal-700 shadow-lg shadow-teal-600/20 hover:scale-[1.02] active:scale-95'
  };

  const sizes: Record<HPHButtonSize, string> = {
    sm: 'px-3 py-1.5 text-xs rounded-lg',
    md: 'px-4 py-2.5 text-sm rounded-xl',
    lg: 'px-6 py-3.5 text-base rounded-2xl',
    icon: 'p-2.5 rounded-xl'
  };

  const baseStyles = cn(
    'inline-flex items-center justify-center gap-2 font-bold transition-all outline-none disabled:opacity-50 disabled:pointer-events-none ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    variants[variant],
    sizes[size],
    className
  );

  if (asChild) {
    return (
      <Component 
        className={baseStyles}
        {...props}
      >
        {children}
      </Component>
    );
  }

  return (
    <button 
      className={baseStyles}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon}
      {children}
    </button>
  );
};
