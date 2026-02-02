import React, { useState, useRef, useEffect } from 'react';
import { MoreVerticalIcon } from 'hugeicons-react';
import { cn } from '@/lib/utils';

interface HPHActionMenuProps {
  actions: {
    label: string,
    icon: React.ReactNode,
    onClick: () => void,
    variant?: 'default' | 'danger'
  }[];
  className?: string;
}

export const HPHActionMenu: React.FC<HPHActionMenuProps> = ({ actions, className }) => {
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
    <div className={cn("relative", className)} ref={menuRef}>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-all"
      >
        < MoreVerticalIcon className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-xl shadow-2xl z-50 py-1.5 animate-in fade-in zoom-in-95 duration-100">
          {actions.map((action, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                action.onClick();
                setIsOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold transition-all hover:bg-muted",
                action.variant === 'danger' 
                  ? 'text-destructive hover:text-destructive/90' 
                  : 'text-muted-foreground hover:text-foreground'
              )}
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
