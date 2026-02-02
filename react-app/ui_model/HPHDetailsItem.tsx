import React from 'react';

interface HPHDetailsItemProps {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  valueClassName?: string;
}

export const HPHDetailsItem: React.FC<HPHDetailsItemProps> = ({ 
  label, 
  value, 
  icon,
  className = '',
  valueClassName = 'text-gray-900 dark:text-white'
}) => {
  return (
    <div className={`flex justify-between py-2 border-b border-gray-50 dark:border-[#1A1A2E] last:border-0 ${className}`}>
        <span className="text-gray-500 font-medium text-sm flex items-center gap-2">
            {icon && <span className="text-gray-400">{icon}</span>}
            {label}
        </span>
        <span className={`font-bold text-sm text-right ${valueClassName}`}>
            {value}
        </span>
    </div>
  );
};
