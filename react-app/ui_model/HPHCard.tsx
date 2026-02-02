import React from 'react';

interface HPHCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const HPHCard: React.FC<HPHCardProps> = ({ children, className = '', hover = false, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white dark:bg-[#10101E] rounded-2xl border border-gray-200 dark:border-[#252540] shadow-sm overflow-hidden transition-all duration-300 ${hover ? 'hover:shadow-md hover:border-primary-500/30 active:scale-[0.99]' : ''} ${onClick ? 'cursor-pointer' : ''} ${className}`}>
      {children}
    </div>
  );
};

export const HPHCardHeader: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => {
  return (
    <div className={`p-6 border-b border-gray-100 dark:border-[#252540] flex justify-between items-center ${className}`}>
      {children}
    </div>
  );
};

export const HPHCardContent: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
};
