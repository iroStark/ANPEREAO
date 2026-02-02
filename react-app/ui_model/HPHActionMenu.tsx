import React, { useState, useRef, useEffect } from 'react';
import { MoreVerticalIcon } from 'hugeicons-react';

interface HPHActionMenuProps {
  actions: {
    label: string,
    icon: React.ReactNode,
    onClick: () => void,
    variant?: 'default' | 'danger'
  }[];
}

export const HPHActionMenu: React.FC<HPHActionMenuProps> = ({ actions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#1A1A2E] rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all"
      >
        <MoreVerticalIcon className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#151525] border border-gray-100 dark:border-[#252540] rounded-xl shadow-2xl z-50 py-1.5 animate-in fade-in zoom-in-95 duration-100">
          {actions.map((action, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                action.onClick();
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold transition-all hover:bg-gray-50 dark:hover:bg-[#1A1A2E] ${
                action.variant === 'danger' 
                  ? 'text-red-500 hover:text-red-600' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span className="w-4 h-4">{action.icon}</span>
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
