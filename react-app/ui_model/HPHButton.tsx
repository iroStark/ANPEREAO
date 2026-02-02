import React from 'react';
import { Slot } from '@radix-ui/react-slot';

type HPHButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'outline' | 'teal';
type HPHButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface HPHButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: HPHButtonVariant;
  size?: HPHButtonSize;
  children: React.ReactNode;
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
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-bold transition-all outline-none active:scale-95 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/20 hover:scale-[1.02] transform transition-all active:scale-95',
    secondary: 'bg-white dark:bg-[#151525] border border-gray-200 dark:border-[#252540] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1A1A2E] hover:border-gray-300 dark:hover:border-[#353550]',
    success: 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transform transition-all active:scale-95',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 hover:scale-[1.02] transform transition-all active:scale-95',
    ghost: 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#1A1A2E]',
    outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10',
    teal: 'bg-[#4F98A7] hover:bg-[#3d7a87] text-white shadow-lg shadow-[#4F98A7]/40 hover:shadow-[#4F98A7]/50 hover:scale-[1.02] transform transition-all active:scale-95'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-lg',
    md: 'px-4 py-2.5 text-sm rounded-xl',
    lg: 'px-6 py-3.5 text-base rounded-2xl',
    icon: 'p-2.5 rounded-xl'
  };

  if (asChild) {
    return (
      <Component 
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </Component>
    );
  }

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : icon}
      {children}
    </button>
  );
};
