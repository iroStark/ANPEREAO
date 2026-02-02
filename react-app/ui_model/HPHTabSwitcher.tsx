import React from 'react';

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
    <div className={`flex gap-1 bg-white dark:bg-[#10101E] p-1.5 rounded-xl border border-gray-200 dark:border-[#252540] w-fit shadow-sm ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200
              ${isActive 
                ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20 active:scale-95' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1A1A2E] hover:text-gray-900 dark:hover:text-white'
              }
            `}
          >
            {Icon && <Icon className="w-4 h-4" />}
            {tab.label}
            {tab.count !== undefined && (
              <span className={`
                px-1.5 py-0.5 rounded text-[10px] ml-1
                ${isActive 
                  ? 'bg-white/20 text-white' 
                  : 'bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400'
                }
              `}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
