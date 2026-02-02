import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Cancel01Icon } from 'hugeicons-react';
import { cn } from '@/lib/utils';

interface HPHModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    maxWidth?: string;
    zIndex?: number;
    icon?: React.ReactNode;
    description?: string;
}

export const HPHModal: React.FC<HPHModalProps> = ({ 
    isOpen, 
    onClose, 
    title, 
    children, 
    footer,
    maxWidth = 'max-w-2xl',
    zIndex = 50,
    icon,
    description
}) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!mounted || !isOpen) return null;

    return createPortal(
        <div 
            className={cn("fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200")}
            style={{ zIndex }}
        >
            <div 
                className={cn(
                    "bg-background text-foreground rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] relative animate-in zoom-in-95 duration-200",
                    "w-full",
                    maxWidth
                )}
            >
                {/* Header */}
                <div className="p-6 border-b border-border flex justify-between items-start bg-background sticky top-0 z-10">
                    <div className="flex items-start gap-3">
                        {icon && (
                            <div className="p-2 bg-primary/10 rounded-xl text-primary mt-0.5">
                                {icon}
                            </div>
                        )}
                        <div>
                             <h2 className="text-xl font-bold text-foreground leading-tight">{title}</h2>
                             {description && (
                                <p className="text-sm text-muted-foreground mt-1 font-medium">{description}</p>
                             )}
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-2 rounded-full hover:bg-accent hover:text-accent-foreground text-muted-foreground transition-colors"
                    >
                        <Cancel01Icon className="w-5 h-5" />
                    </button>
                </div>
                
                {/* Body */}
                <div className="p-6 overflow-y-auto bg-muted/20 flex-1">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="p-4 border-t border-border flex justify-end gap-3 bg-background sticky bottom-0 z-10">
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};
