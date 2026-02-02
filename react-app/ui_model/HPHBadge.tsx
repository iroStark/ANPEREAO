import React from 'react';

type HPHBadgeVariant = 'blue' | 'primary' | 'orange' | 'green' | 'red' | 'gray' | 'teal';

interface HPHBadgeProps {
  children: React.ReactNode;
  variant?: HPHBadgeVariant;
  className?: string;
}

export const HPHBadge: React.FC<HPHBadgeProps> = ({ children, variant = 'gray', className = '' }) => {
  const variants = {
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
    primary: 'bg-primary-100 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400',
    teal: 'bg-[#4F98A7]/10 text-[#4F98A7] dark:bg-[#4F98A7]/20 dark:text-[#4F98A7]',
    orange: 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400',
    green: 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-500',
    red: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400',
    gray: 'bg-gray-100 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400',
  };

  return (
    <span className={`px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
