import React from 'react';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
  icon?: React.ElementType;
  count?: number;
}

interface HPHTabSwitcherProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  className?: string;
}

export const HPHTabSwitcher: React.FC<HPHTabSwitcherProps> = ({ 
  tabs, 
  activeTab, 
  onTabChange,
  className = '' 
}) => {
  return (
    <div className={cn("flex gap-1 bg-card p-1.5 rounded-xl border border-border w-fit shadow-sm", className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200",
              isActive 
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 active:scale-95" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {Icon && <Icon className="w-4 h-4" />}
            {tab.label}
            {tab.count !== undefined && (
              <span className={cn(
                "px-1.5 py-0.5 rounded text-[10px] ml-1",
                isActive 
                  ? "bg-primary-foreground/20 text-primary-foreground" 
                  : "bg-muted text-muted-foreground"
              )}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
