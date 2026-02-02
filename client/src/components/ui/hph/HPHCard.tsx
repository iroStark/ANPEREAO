import React from 'react';
import { cn } from '@/lib/utils';

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
      className={cn(
        "bg-card text-card-foreground rounded-2xl border border-border shadow-sm overflow-hidden transition-all duration-300",
        hover && "hover:shadow-md hover:border-primary/30 active:scale-[0.99]",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
};

export const HPHCardHeader: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => {
  return (
    <div className={cn("p-6 border-b border-border flex justify-between items-center", className)}>
      {children}
    </div>
  );
};

export const HPHCardContent: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => {
  return (
    <div className={cn("p-6", className)}>
      {children}
    </div>
  );
};
export const HPHCardTitle: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => {
  return (
    <h3 className={cn("text-xl font-bold text-foreground", className)}>
      {children}
    </h3>
  );
};

export const HPHCardDescription: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => {
  return (
    <p className={cn("text-sm text-muted-foreground", className)}>
      {children}
    </p>
  );
};
